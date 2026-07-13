import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { discoverFiles } from "./discover-files.js";
import { extractMetadata } from "./extract-metadata.js";
import { detectProvider } from "./detect-provider.js";
import { detectDuplicates } from "./detect-duplicates.js";
import { hashBuffer, hashFile } from "./hash-file.js";
import { writeReports } from "./write-reports.js";

const args = parseArgs(process.argv.slice(2));

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  const ecrRoot = path.resolve(args.ecrRoot);
  const timestamp = new Date().toISOString();
  const packetMap = await loadPacketMap(ecrRoot);
  const configPresence = await loadConfigPresence(ecrRoot);
  const discoveredPaths = await discoverFiles(ecrRoot);
  const discoveredRows = [];
  const responseCandidates = [];
  const zipArtifacts = [];

  for (const filePath of discoveredPaths) {
    const relativePath = path.relative(ecrRoot, filePath).replaceAll(path.sep, "/");
    const kind = classifyPath(relativePath);
    if (kind === "zip") {
      zipArtifacts.push({ filePath, relativePath });
      discoveredRows.push({
        currentPath: relativePath,
        experiment: experimentLabelFromPath(relativePath),
        packetId: "",
        variantId: "",
        provider: "",
        parseStatus: "zip",
        canonicalTarget: "",
        action: "archive",
      });
      continue;
    }
    if (kind === "non_response") {
      discoveredRows.push({
        currentPath: relativePath,
        experiment: experimentLabelFromPath(relativePath),
        packetId: "",
        variantId: "",
        provider: "",
        parseStatus: "n/a",
        canonicalTarget: "",
        action: "not_a_response",
      });
      continue;
    }
    const candidate = await inspectResponseCandidate(ecrRoot, filePath, relativePath, packetMap);
    responseCandidates.push(candidate);
    discoveredRows.push({
      currentPath: relativePath,
      experiment: candidate.experiment,
      packetId: candidate.packetId,
      variantId: candidate.variantId,
      provider: candidate.provider,
      parseStatus: candidate.parseStatus,
      canonicalTarget: candidate.canonicalTarget ? path.relative(ecrRoot, candidate.canonicalTarget).replaceAll(path.sep, "/") : "",
      action: candidate.action,
    });
  }

  const duplicates = detectDuplicates(responseCandidates);
  applyDuplicateStatuses(responseCandidates, duplicates);
  const zipAudit = await inspectZipArtifacts(ecrRoot, zipArtifacts, responseCandidates);
  const logRows = [];

  if (args.apply) {
    for (const candidate of responseCandidates) {
      if (
        candidate.action === "rename"
        || candidate.action === "move_and_rename"
        || (candidate.action === "malformed_but_identity_clear" && candidate.canonicalTarget && path.resolve(candidate.filePath) !== path.resolve(candidate.canonicalTarget))
      ) {
        const row = await applyMove(candidate, ecrRoot, timestamp);
        logRows.push(row);
      } else if (candidate.action === "already_canonical" || candidate.action === "exclude" || candidate.action === "ambiguous" || candidate.action === "duplicate_candidate" || candidate.action === "malformed_but_identity_clear") {
        logRows.push(baseLogRow(candidate, ecrRoot, timestamp, candidate.action, candidate.action === "ambiguous" ? "needs_review" : "recorded"));
      }
    }
    for (const zip of zipAudit) {
      const row = await archiveZip(ecrRoot, zip, timestamp);
      logRows.push(row);
    }
    await ensureIncomingStructure(ecrRoot);
    await ensureZipReadme(ecrRoot, zipAudit);
  } else {
    for (const candidate of responseCandidates) {
      logRows.push(baseLogRow(candidate, ecrRoot, timestamp, candidate.action, "dry_run"));
    }
    for (const zip of zipAudit) {
      logRows.push({
        timestamp,
        originalPath: zip.relativePath,
        canonicalPath: "archive/mobile-response-zips/" + path.basename(zip.relativePath),
        experiment: zip.experiment,
        packet: "",
        provider: "",
        hashBefore: zip.sha256,
        hashAfter: "",
        action: "archive",
        status: "dry_run",
      });
    }
  }

  const refreshedCandidates = args.apply
    ? await refreshCandidates(ecrRoot, packetMap)
    : responseCandidates;

  const readiness = buildReadiness(ecrRoot, refreshedCandidates, packetMap, zipAudit);
  const summaryRows = buildSummaryRows(readiness, refreshedCandidates, duplicates);
  const verification = buildVerification(ecrRoot, readiness, refreshedCandidates, duplicates, zipAudit, configPresence, args, logRows);

  await writeReports(ecrRoot, {
    summaryRows,
    discoveredRows,
    logRows,
    readiness,
    verification,
  });
}

function parseArgs(argv) {
  const args = {
    ecrRoot: "",
    apply: false,
    dryRun: true,
    experiment: "",
    incomingOnly: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--ecr-root") {
      args.ecrRoot = argv[index + 1];
      index += 1;
    } else if (value === "--apply") {
      args.apply = true;
      args.dryRun = false;
    } else if (value === "--dry-run") {
      args.dryRun = true;
    } else if (value === "--experiment") {
      args.experiment = normalizeExperiment(argv[index + 1]);
      index += 1;
    } else if (value === "--incoming-only") {
      args.incomingOnly = true;
    }
  }
  if (!args.ecrRoot) {
    throw new Error("--ecr-root is required");
  }
  return args;
}

function normalizeExperiment(value) {
  return String(value || "").replaceAll("-", "").toUpperCase();
}

async function loadPacketMap(ecrRoot) {
  const experimentsRoot = path.join(ecrRoot, "experiments");
  const map = new Map();
  for (const experimentName of ["EXP-001-topology-perturbation", "EXP-002-cross-representation-stability", "EXP-003-isomorphic-procedures"]) {
    const experimentDir = path.join(experimentsRoot, experimentName);
    let files = [];
    try {
      files = (await discoverFiles(path.join(experimentDir, "packets"))).filter((file) => file.endsWith(".md"));
    } catch {
      files = [];
    }
    for (const filePath of files) {
      const fileName = path.basename(filePath, ".md");
      const packetId = fileName.split("-").slice(0, 4).join("-");
      const tail = fileName.slice(packetId.length + 1);
      map.set(packetId, {
        packetId,
        experiment: packetId.match(/EXP(\d{3})/)?.[0] || "",
        experimentDir,
        filePath,
        label: tail,
        packetVersion: await readPacketVersion(filePath),
      });
    }
  }
  return map;
}

async function readPacketVersion(filePath) {
  const text = await readFile(filePath, "utf8");
  const match = text.match(/packet_version:\s*([^\n]+)/i);
  return match ? match[1].trim() : "not_stated";
}

async function loadConfigPresence(ecrRoot) {
  const result = new Map();
  for (const dir of [
    "experiments/EXP-001-topology-perturbation",
    "experiments/EXP-002-cross-representation-stability",
    "experiments/EXP-003-isomorphic-procedures",
  ]) {
    const full = path.join(ecrRoot, dir, "comparison-engine.config.json");
    try {
      await stat(full);
      result.set(dir, true);
    } catch {
      result.set(dir, false);
    }
  }
  return result;
}

function classifyPath(relativePath) {
  const lower = relativePath.toLowerCase();
  if (lower.endsWith(".zip")) {
    return "zip";
  }
  if (!lower.endsWith(".json")) {
    return "non_response";
  }
  if (lower.includes("/packets/") || lower.includes("/comparison/") || lower.includes("/generated") || lower.includes("/calibration/")) {
    return "non_response";
  }
  if (lower.endsWith("comparison-engine.config.json") || lower.endsWith("package.json") || lower.endsWith("shared-response-schema.json")) {
    return "non_response";
  }
  if (lower.includes("/responses/") || lower.includes("/incoming-responses/")) {
    return "response";
  }
  return "non_response";
}

async function inspectResponseCandidate(ecrRoot, filePath, relativePath, packetMap) {
  const extracted = await extractMetadata(filePath);
  const provider = detectProvider(relativePath);
  const packetId = normalizePacketId(extracted.metadata.packet_id);
  const experiment = normalizeExperimentId(packetId, extracted.metadata.experiment_id);
  const variantId = normalizeVariantId(extracted.metadata.variant_id, packetId);
  const isPreFix = relativePath.includes("/responses/pre-fix/");
  const packetRecord = packetMap.get(packetId);
  const canonicalTarget = packetId && provider && packetRecord
    ? path.join(packetRecord.experimentDir, "responses", provider, `${packetId}-${provider}.json`)
    : "";
  const parseStatus = extracted.parseStatus === "strict"
    ? "strict"
    : packetId && experiment && variantId ? "malformed" : "malformed_identity_ambiguous";
  let action = "ambiguous";
  let primaryEligible = true;

  if (isPreFix) {
    action = "exclude";
    primaryEligible = false;
  } else if (!packetId || !experiment || !variantId || !provider || !canonicalTarget) {
    action = "ambiguous";
    primaryEligible = false;
  } else if (path.resolve(filePath) === path.resolve(canonicalTarget)) {
    action = extracted.parseStatus === "strict" ? "already_canonical" : "malformed_but_identity_clear";
  } else if (path.dirname(filePath) === path.dirname(canonicalTarget)) {
    action = extracted.parseStatus === "strict" ? "rename" : "malformed_but_identity_clear";
  } else {
    action = extracted.parseStatus === "strict" ? "move_and_rename" : "malformed_but_identity_clear";
  }

  return {
    filePath,
    relativePath,
    provider,
    packetId,
    experiment,
    variantId,
    packetVersion: extracted.metadata.packet_version || packetRecord?.packetVersion || "not_stated",
    parseStatus,
    action,
    canonicalTarget,
    primaryEligible,
    parsedJson: extracted.parsed,
    sha256: await hashFile(filePath),
  };
}

function normalizePacketId(value) {
  if (!value) {
    return "";
  }
  const normalized = value.replace(/\s+/g, "").toUpperCase();
  const match = normalized.match(/ECR-000003-EXP0?0?(\d{2,3})-P0*([0-9]{3}[A-Z])/);
  if (!match) {
    return normalized;
  }
  return `ECR-000003-EXP${match[1].padStart(3, "0")}-P${match[2]}`;
}

function normalizeExperimentId(packetId, experimentId) {
  const fromPacket = packetId.match(/EXP(\d{3})/)?.[0];
  if (fromPacket) {
    return fromPacket;
  }
  const clean = String(experimentId || "").toUpperCase().replaceAll("-", "");
  const match = clean.match(/EXP0?0?(\d{2,3})/);
  return match ? `EXP${match[1].padStart(3, "0")}` : "";
}

function normalizeVariantId(variantId, packetId) {
  if (variantId) {
    const clean = variantId.toUpperCase().replace(/\s+/g, "");
    const match = clean.match(/P0*([0-9]{3}[A-Z])/);
    if (match) {
      return `P${match[1]}`;
    }
    return clean;
  }
  const packetMatch = packetId.match(/-P([0-9]{3}[A-Z])$/);
  return packetMatch ? `P${packetMatch[1]}` : "";
}

function applyDuplicateStatuses(candidates, duplicates) {
  for (const duplicate of duplicates) {
    for (const candidate of duplicate.items) {
      candidate.duplicateClassification = duplicate.classification;
      candidate.action = "duplicate_candidate";
      candidate.primaryEligible = false;
    }
  }
}

async function inspectZipArtifacts(ecrRoot, zipArtifacts, candidates) {
  const primaryByTarget = new Map(candidates.filter((candidate) => candidate.canonicalTarget).map((candidate) => [candidate.canonicalTarget, candidate]));
  const results = [];
  for (const zip of zipArtifacts) {
    const list = spawnSync("unzip", ["-Z1", zip.filePath], { encoding: "utf8" });
    const entries = list.status === 0
      ? list.stdout.split(/\r?\n/).filter(Boolean).filter((name) => !name.endsWith("/"))
      : [];
    const entryAudit = [];
    for (const entry of entries) {
      if (!entry.toLowerCase().endsWith(".json")) {
        continue;
      }
      const content = spawnSync("unzip", ["-p", zip.filePath, entry], { encoding: "buffer" }).stdout;
      const text = content.toString("utf8");
      const packetMatch = text.match(/[“"]packet_id[”"]\s*:\s*[“"]([^"”]+)[”"]/i);
      const packetId = normalizePacketId(packetMatch?.[1] || "");
      const provider = detectProvider(entry);
      const target = packetId && provider
        ? path.join(ecrRoot, "experiments", "EXP-001-topology-perturbation", "responses", provider, `${packetId}-${provider}.json`)
        : "";
      const archiveHash = hashBuffer(content);
      const duplicateOf = target && primaryByTarget.get(target)?.sha256 === archiveHash ? target : "";
      entryAudit.push({ entry, packetId, provider, duplicateOf, sha256: archiveHash });
    }
    results.push({
      ...zip,
      experiment: experimentLabelFromPath(zip.relativePath),
      sha256: await hashFile(zip.filePath),
      entries: entryAudit,
    });
  }
  return results;
}

async function applyMove(candidate, ecrRoot, timestamp) {
  const before = await hashFile(candidate.filePath);
  await mkdir(path.dirname(candidate.canonicalTarget), { recursive: true });
  await rename(candidate.filePath, candidate.canonicalTarget);
  const after = await hashFile(candidate.canonicalTarget);
  return {
    timestamp,
    originalPath: candidate.relativePath,
    canonicalPath: path.relative(ecrRoot, candidate.canonicalTarget).replaceAll(path.sep, "/"),
    experiment: candidate.experiment,
    packet: candidate.packetId,
    provider: candidate.provider,
    hashBefore: before,
    hashAfter: after,
    action: candidate.action,
    status: before === after ? "success" : "hash_mismatch",
  };
}

function baseLogRow(candidate, ecrRoot, timestamp, action, status) {
  return {
    timestamp,
    originalPath: candidate.relativePath,
    canonicalPath: candidate.canonicalTarget ? path.relative(ecrRoot, candidate.canonicalTarget).replaceAll(path.sep, "/") : "",
    experiment: candidate.experiment,
    packet: candidate.packetId,
    provider: candidate.provider,
    hashBefore: candidate.sha256,
    hashAfter: candidate.action === "already_canonical" ? candidate.sha256 : "",
    action,
    status,
  };
}

async function archiveZip(ecrRoot, zip, timestamp) {
  const archiveDir = path.join(ecrRoot, "archive", "mobile-response-zips");
  await mkdir(archiveDir, { recursive: true });
  const target = path.join(archiveDir, path.basename(zip.filePath));
  await rename(zip.filePath, target);
  return {
    timestamp,
    originalPath: zip.relativePath,
    canonicalPath: path.relative(ecrRoot, target).replaceAll(path.sep, "/"),
    experiment: zip.experiment,
    packet: "",
    provider: "",
    hashBefore: zip.sha256,
    hashAfter: await hashFile(target),
    action: "archive",
    status: "success",
  };
}

async function ensureIncomingStructure(ecrRoot) {
  for (const relativeDir of [
    "incoming-responses/gpt",
    "incoming-responses/claude",
    "incoming-responses/gemini",
  ]) {
    const fullDir = path.join(ecrRoot, relativeDir);
    await mkdir(fullDir, { recursive: true });
    await writeFile(path.join(fullDir, ".gitkeep"), "", "utf8");
  }
}

async function ensureZipReadme(ecrRoot, zipAudit) {
  const archiveDir = path.join(ecrRoot, "archive", "mobile-response-zips");
  await mkdir(archiveDir, { recursive: true });
  const lines = [
    "# Mobile Response ZIP Archive",
    "",
    "- ZIP files came from mobile response collection.",
    "- Canonical extracted responses live in experiment response directories.",
    "- ZIPs are retained for auditability.",
    "- ZIP contents are not used directly by comparators.",
    "",
    "## Archived Files",
    "",
    ...zipAudit.flatMap((zip) => [
      `- ${path.basename(zip.filePath)}: ${zip.entries.length} JSON response entries inspected.`,
    ]),
  ];
  await writeFile(path.join(archiveDir, "README.md"), `${lines.join("\n")}\n`, "utf8");
}

async function refreshCandidates(ecrRoot, packetMap) {
  const paths = await discoverFiles(ecrRoot);
  const candidates = [];
  for (const filePath of paths) {
    const relativePath = path.relative(ecrRoot, filePath).replaceAll(path.sep, "/");
    if (classifyPath(relativePath) === "response") {
      candidates.push(await inspectResponseCandidate(ecrRoot, filePath, relativePath, packetMap));
    }
  }
  return candidates;
}

function buildReadiness(ecrRoot, candidates, packetMap, zipAudit) {
  const canonical = candidates.filter((candidate) =>
    candidate.canonicalTarget
    && path.resolve(candidate.filePath) === path.resolve(candidate.canonicalTarget)
    && (candidate.action === "already_canonical" || candidate.action === "malformed_but_identity_clear"),
  );
  const byKey = new Map(canonical.map((candidate) => [`${candidate.packetId}:${candidate.provider}`, candidate]));
  const exp1Rows = [];
  const exp2Rows = [];
  const exp3Rows = [];

  for (const [packetId, record] of [...packetMap.entries()].sort()) {
    if (record.experiment === "EXP001") {
      exp1Rows.push({
        packet: packetId,
        gpt: byKey.has(`${packetId}:gpt`) ? "present" : "missing",
        claude: byKey.has(`${packetId}:claude`) ? "present" : "missing",
        gemini: byKey.has(`${packetId}:gemini`) ? "present" : "missing",
        packetVersion: packetId.endsWith("P001D") ? record.packetVersion : "not_stated",
        status: providerStatus(packetId, byKey),
      });
    } else if (record.experiment === "EXP002") {
      exp2Rows.push({
        packet: packetId,
        condition: record.label,
        gpt: byKey.has(`${packetId}:gpt`) ? "present" : "missing",
        claude: byKey.has(`${packetId}:claude`) ? "present" : "missing",
        gemini: byKey.has(`${packetId}:gemini`) ? "present" : "missing",
        status: providerStatus(packetId, byKey),
      });
    } else if (record.experiment === "EXP003") {
      exp3Rows.push({
        packet: packetId,
        domain: record.label,
        gpt: byKey.has(`${packetId}:gpt`) ? "present" : "missing",
        claude: byKey.has(`${packetId}:claude`) ? "present" : "missing",
        gemini: byKey.has(`${packetId}:gemini`) ? "present" : "missing",
        status: providerStatus(packetId, byKey),
      });
    }
  }

  const malformed = candidates.filter((candidate) => candidate.parseStatus.startsWith("malformed")).length;
  const duplicates = candidates.filter((candidate) => candidate.action === "duplicate_candidate");
  const ambiguous = candidates.filter((candidate) => candidate.action === "ambiguous");
  const missing = [...exp1Rows, ...exp2Rows, ...exp3Rows].filter((row) => row.status !== "ready").length;
  const overallStatus = exp1Rows.every((row) => row.status === "ready")
    && exp2Rows.every((row) => row.status === "ready")
    && exp3Rows.every((row) => row.status === "ready")
    && malformed === 0
    && ambiguous.length === 0
    ? "READY"
    : exp1Rows.every((row) => row.status === "ready") && exp2Rows.every((row) => row.status === "ready") && malformed === 0
      ? "READY_WITH_WARNINGS"
      : "NOT_READY";

  return {
    exp1: { rows: exp1Rows },
    exp2: { rows: exp2Rows },
    exp3: { rows: exp3Rows },
    overall: {
      status: overallStatus,
      metrics: {
        "Expected primary responses": exp1Rows.length * 3 + exp2Rows.length * 3 + exp3Rows.length * 3,
        "Present canonical responses": canonical.length,
        "Missing responses": countMissing([...exp1Rows, ...exp2Rows, ...exp3Rows]),
        "Malformed responses": malformed,
        "Exact duplicates": duplicates.filter((item) => item.duplicateClassification === "exact_duplicate").length,
        "Semantic duplicates": duplicates.filter((item) => item.duplicateClassification === "semantic_duplicate").length,
        "Conflicting duplicates": duplicates.filter((item) => item.duplicateClassification === "conflicting_duplicate").length,
        "Ambiguous provider files": ambiguous.length,
        "Archived ZIP files": zipAudit.length,
      },
    },
  };
}

function providerStatus(packetId, byKey) {
  const providers = ["gpt", "claude", "gemini"];
  return providers.every((provider) => byKey.has(`${packetId}:${provider}`)) ? "ready" : "missing";
}

function countMissing(rows) {
  return rows.reduce((count, row) => count + ["gpt", "claude", "gemini"].filter((provider) => row[provider] === "missing").length, 0);
}

function buildSummaryRows(readiness, candidates, duplicates) {
  const malformedByExperiment = (experiment) => candidates.filter((candidate) => candidate.experiment === experiment && candidate.parseStatus.startsWith("malformed")).length;
  const foundByExperiment = (experiment) => candidates.filter((candidate) => candidate.experiment === experiment).length;
  const canonicalByExperiment = (experiment) => candidates.filter((candidate) =>
    candidate.experiment === experiment
    && candidate.canonicalTarget
    && path.resolve(candidate.filePath) === path.resolve(candidate.canonicalTarget)
    && (candidate.action === "already_canonical" || candidate.action === "malformed_but_identity_clear"),
  ).length;
  const missingByRows = (rows) => rows.reduce((count, row) => count + ["gpt", "claude", "gemini"].filter((provider) => row[provider] === "missing").length, 0);
  const duplicateByExperiment = (experiment) => duplicates.filter((duplicate) => duplicate.items.some((item) => item.experiment === experiment)).length;

  return [
    {
      experiment: "EXP-001",
      expected: 12,
      found: foundByExperiment("EXP001"),
      canonical: canonicalByExperiment("EXP001"),
      missing: missingByRows(readiness.exp1.rows),
      duplicates: duplicateByExperiment("EXP001"),
      malformed: malformedByExperiment("EXP001"),
    },
    {
      experiment: "EXP-002",
      expected: 12,
      found: foundByExperiment("EXP002"),
      canonical: canonicalByExperiment("EXP002"),
      missing: missingByRows(readiness.exp2.rows),
      duplicates: duplicateByExperiment("EXP002"),
      malformed: malformedByExperiment("EXP002"),
    },
    {
      experiment: "EXP-003",
      expected: 9,
      found: foundByExperiment("EXP003"),
      canonical: canonicalByExperiment("EXP003"),
      missing: missingByRows(readiness.exp3.rows),
      duplicates: duplicateByExperiment("EXP003"),
      malformed: malformedByExperiment("EXP003"),
    },
  ];
}

function buildVerification(ecrRoot, readiness, candidates, duplicates, zipAudit, configPresence, args, logRows) {
  const renamedFiles = logRows
    .filter((row) => ["rename", "malformed_but_identity_clear"].includes(row.action) && row.originalPath !== row.canonicalPath && row.status !== "dry_run")
    .map((row) => `${row.originalPath} -> ${row.canonicalPath}`);
  const movedFiles = logRows
    .filter((row) => row.action === "move_and_rename" && row.status !== "dry_run")
    .map((row) => `${row.originalPath} -> ${row.canonicalPath}`);
  const ambiguousFiles = candidates
    .filter((candidate) => candidate.action === "ambiguous")
    .map((candidate) => `${candidate.relativePath} (${candidate.action})`);
  const duplicateFiles = duplicates.map((duplicate) => `${path.relative(ecrRoot, duplicate.canonicalTarget).replaceAll(path.sep, "/")} => ${duplicate.classification}`);
  const archivedZips = logRows
    .filter((row) => row.action === "archive")
    .map((row) => `${row.originalPath} -> ${row.canonicalPath}`);
  const packetVersionIssues = [
    "EXP-001 P001D primary responses correspond to packet version 1.1; pre-fix response remains excluded under responses/pre-fix/p001d/00001D.json.",
  ];
  const experiments = [
    experimentRow("EXP-001", 12, readiness.exp1.rows, candidates),
    experimentRow("EXP-002", 12, readiness.exp2.rows, candidates),
    experimentRow("EXP-003", 9, readiness.exp3.rows, candidates),
  ];
  const comparatorDiscovery = [
    comparatorRow("EXP-001", configPresence.get("experiments/EXP-001-topology-perturbation"), readiness.exp1.rows),
    comparatorRow("EXP-002", configPresence.get("experiments/EXP-002-cross-representation-stability"), readiness.exp2.rows),
    comparatorRow("EXP-003", configPresence.get("experiments/EXP-003-isomorphic-procedures"), readiness.exp3.rows),
  ];

  return {
    overallStatus: readiness.overall.status,
    experiments,
    renamedFiles,
    movedFiles,
    duplicateFiles,
    ambiguousFiles,
    archivedZips,
    packetVersionIssues,
    comparatorDiscovery,
    remainingHumanActions: [
      readiness.exp3.rows.some((row) => row.status !== "ready")
        ? "Collect missing EXP-003 responses before comparison."
        : "EXP-003 is complete.",
      candidates.some((candidate) => candidate.parseStatus.startsWith("malformed"))
        ? "Review malformed-but-identity-clear responses before strict-parser-dependent workflows."
        : "No malformed primary responses remain.",
      ambiguousFiles.length > 0
        ? "Resolve ambiguous files before promoting them into a primary dataset."
        : "No ambiguous primary candidates remain.",
      "Review response-filename-verification-report.md before running any new comparator pass.",
    ],
    commands: [
      "cd /Users/kevinmiller/dev/Framework-engineering/research/evidence-runs/ECR-000003-representation-sensitivity",
      "npm run responses:verify -- --ecr-root . --dry-run",
      "npm run responses:normalize -- --ecr-root . --apply",
      "cd experiments/EXP-001-topology-perturbation && npm run compare",
      "node --input-type=module -e \"import { runComparisonEngine } from '../../../../tools/comparison-engine/src/index.js'; await runComparisonEngine('comparison-engine.config.json');\" # from EXP-002-cross-representation-stability",
      "node --input-type=module -e \"import { runComparisonEngine } from '../../../../tools/comparison-engine/src/index.js'; await runComparisonEngine('comparison-engine.config.json');\" # from EXP-003-isomorphic-procedures",
    ],
  };
}

function experimentRow(experiment, expected, rows, candidates) {
  const canonical = candidates.filter((candidate) =>
    candidate.experiment === experiment.replace("-", "")
    && candidate.canonicalTarget
    && path.resolve(candidate.filePath) === path.resolve(candidate.canonicalTarget)
    && (candidate.action === "already_canonical" || candidate.action === "malformed_but_identity_clear"),
  ).length;
  const malformed = candidates.filter((candidate) => candidate.experiment === experiment.replace("-", "") && candidate.parseStatus.startsWith("malformed")).length;
  const conflicts = candidates.filter((candidate) => candidate.experiment === experiment.replace("-", "") && candidate.duplicateClassification === "conflicting_duplicate").length;
  const missing = countMissing(rows);
  return {
    experiment,
    expected,
    canonical,
    missing,
    malformed,
    conflicts,
    status: missing === 0 && conflicts === 0
      ? (malformed === 0 ? "READY" : "READY_WITH_WARNINGS")
      : "NOT_READY",
  };
}

function comparatorRow(experiment, present, rows) {
  return {
    experiment,
    configPresent: present ? "yes" : "no",
    discovered: rows.reduce((count, row) => count + ["gpt", "claude", "gemini"].filter((provider) => row[provider] === "present").length, 0),
    missing: countMissing(rows),
    status: present && rows.every((row) => row.status === "ready") ? "ready" : "incomplete",
  };
}

function experimentLabelFromPath(relativePath) {
  const match = relativePath.match(/EXP-\d{3}[^/]*/);
  return match ? match[0].slice(0, 7) : "";
}
