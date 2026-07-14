import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { discoverFiles } from "./discover-files.js";
import { extractMetadata } from "./extract-metadata.js";
import { detectProvider } from "./detect-provider.js";
import { detectDuplicates } from "./detect-duplicates.js";
import { hashFile } from "./hash-file.js";
import { canonicalResponsePath, comparisonConfigPath, normalizationDir } from "./canonical-path.js";
import { buildExpectedDataset } from "./build-expected-dataset.js";
import { validatePacketIdentity } from "./validate-packet-identity.js";
import { validatePacketVersion } from "./validate-packet-version.js";
import { buildDatasetManifest } from "./build-dataset-manifest.js";
import { buildNormalizationCertificate } from "./build-normalization-certificate.js";
import { verifyNormalizationCertificate } from "./verify-normalization-certificate.js";
import { safeMove } from "./safe-move.js";
import { loadJson, sha256Text } from "../../comparison-engine/src/utilities.js";

const NORMALIZER_VERSION = "1.0.0";

const args = parseArgs(process.argv.slice(2));

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  const ecrRoot = path.resolve(args.ecrRoot);
  const runId = new Date().toISOString().replace(/[:.]/g, "-");
  const expected = await buildExpectedDataset(ecrRoot, args.experiment);
  const allCandidates = await discoverCandidates(ecrRoot, expected.experiments, args);
  const logsDir = path.join(ecrRoot, "normalization", "logs");
  await mkdir(logsDir, { recursive: true });
  const auditPath = path.join(logsDir, `${runId}.jsonl`);
  const experimentResults = [];

  for (const experimentInfo of expected.experiments) {
    const classified = await classifyExperimentCandidates(ecrRoot, experimentInfo, allCandidates, args, auditPath);
    const manifest = await buildDatasetManifest(experimentInfo, classified, NORMALIZER_VERSION);
    const certificate = buildNormalizationCertificate(experimentInfo, manifest, { invalidated: args.invalidateCertificates });
    const report = buildNormalizationReport(experimentInfo, manifest, certificate, classified);
    experimentResults.push({ experimentInfo, classified, manifest, certificate, report });
    if (!args.dryRun || args.certificateOnly || args.verifyOnly || args.forceRecertificate) {
      await writeExperimentArtifacts(experimentInfo, manifest, certificate, report);
    }
  }

  await writeIndexAndSummary(ecrRoot, experimentResults);
  await writeLegacyRootReports(ecrRoot, experimentResults, allCandidates);
  await writeImplementationReport(ecrRoot, experimentResults, allCandidates.length);

  if (args.verifyOnly) {
    for (const result of experimentResults) {
      const verification = await verifyNormalizationCertificate({
        ecrRoot,
        experimentId: result.experimentInfo.experiment_id,
        normalizerVersion: NORMALIZER_VERSION,
      });
      await appendAuditLine(auditPath, {
        action: "verify_certificate",
        experiment: result.experimentInfo.experiment_id,
        status: verification.status,
        result: verification.ok ? "verified" : "failed",
      });
    }
  }
}

function parseArgs(argv) {
  const args = {
    ecrRoot: "",
    experiment: "",
    allExperiments: false,
    dryRun: true,
    apply: false,
    verifyOnly: false,
    certificateOnly: false,
    invalidateCertificates: false,
    incomingOnly: false,
    forceRecertificate: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--ecr-root") args.ecrRoot = argv[++index] || "";
    else if (value === "--experiment") args.experiment = argv[++index] || "";
    else if (value === "--all-experiments") args.allExperiments = true;
    else if (value === "--dry-run") args.dryRun = true;
    else if (value === "--apply") {
      args.apply = true;
      args.dryRun = false;
    } else if (value === "--verify-only") args.verifyOnly = true;
    else if (value === "--certificate-only") args.certificateOnly = true;
    else if (value === "--invalidate-certificates") args.invalidateCertificates = true;
    else if (value === "--incoming-only") args.incomingOnly = true;
    else if (value === "--force-recertificate") args.forceRecertificate = true;
  }
  if (!args.ecrRoot) throw new Error("--ecr-root is required");
  return args;
}

async function discoverCandidates(ecrRoot, experiments, args) {
  const files = await discoverFiles(ecrRoot);
  const candidates = [];
  for (const filePath of files) {
    const relativePath = path.relative(ecrRoot, filePath).replaceAll(path.sep, "/");
    if (!isCandidateResponsePath(relativePath, args)) continue;
    const provider = detectProvider(relativePath);
    if (!provider) continue;
    const ext = path.extname(filePath).toLowerCase();
    if (![".json", ".md", ".txt"].includes(ext)) continue;
    const extracted = await extractMetadata(filePath);
    const packetId = normalizePacketId(extracted.metadata.packet_id);
    const experimentId = normalizeExperimentId(packetId, extracted.metadata.experiment_id);
    const variantId = normalizeVariantId(extracted.metadata.variant_id, packetId);
    const experimentInfo = experiments.find((item) => item.experiment_id === experimentId) || findExperimentFromPath(experiments, relativePath);
    candidates.push({
      filePath,
      relativePath,
      provider,
      metadata: {
        ...extracted.metadata,
        packet_id: packetId,
        experiment_id: experimentId,
        variant_id: variantId,
      },
      parseStatus: extracted.parseStatus,
      parseSeverity: extracted.parseSeverity,
      repairs: extracted.repairs || [],
      parsedJson: extracted.parsed,
      sha256: await hashFile(filePath),
      experimentInfo,
    });
  }
  return candidates;
}

function isCandidateResponsePath(relativePath, args) {
  const lower = relativePath.toLowerCase();
  if (lower.includes("/packets/") || lower.includes("/comparison/") || lower.includes("/generated") || lower.includes("/fixtures/") || lower.includes("/edr/")) return false;
  if (lower.includes("__macosx") || lower.endsWith(".gitkeep") || lower.endsWith("collection-status.json")) return false;
  if (lower.includes("/responses/pre-fix/")) return true;
  if (lower.endsWith(".zip")) return false;
  if (args.incomingOnly) {
    return lower.includes("/incoming-responses/") || lower.includes("/incoming/");
  }
  return (
    lower.includes("/incoming-responses/")
    || lower.includes("/collection-dashboard/")
    || lower.includes("/responses/")
    || lower.includes("/incoming/")
    || lower.includes("/downloads/")
    || lower.includes("/archive/mobile-response-zips/")
  );
}

async function classifyExperimentCandidates(ecrRoot, experimentInfo, allCandidates, args, auditPath) {
  const packetMap = new Map(experimentInfo.packets.map((packet) => [packet.packet_id, packet]));
  const expectedKeys = new Set(experimentInfo.expected_tasks.map((task) => `${task.packet_id}:${task.provider}`));
  const candidates = allCandidates.filter((item) => {
    if (item.experimentInfo?.experiment_id === experimentInfo.experiment_id) return true;
    return item.metadata.packet_id && packetMap.has(item.metadata.packet_id);
  });

  const classified = [];
  for (const candidate of candidates) {
    const expectedPacket = packetMap.get(candidate.metadata.packet_id);
    const identity = expectedPacket ? validatePacketIdentity(candidate, expectedPacket) : { status: "ambiguous", warnings: [], mismatches: ["unknown packet_id"] };
    const version = expectedPacket ? validatePacketVersion(candidate, experimentInfo, expectedPacket) : { status: "version_unclear", packet_version: "", warning: "unknown packet version", blocking: true };
    const canonicalTarget = expectedPacket ? canonicalResponsePath(experimentInfo.experiment_dir, candidate.provider, expectedPacket.packet_id) : "";
    let primaryDatasetStatus = "ambiguous";
    let blockingIssues = [];
    let warnings = [...identity.warnings];
    if (identity.status === "mismatch") {
      primaryDatasetStatus = "mismatch";
      blockingIssues = identity.mismatches;
    } else if (identity.status === "ambiguous" || identity.status === "not_parseable") {
      primaryDatasetStatus = candidate.parseSeverity === "unsafe" ? "malformed" : "ambiguous";
      blockingIssues = identity.mismatches;
    } else if (version.blocking) {
      primaryDatasetStatus = "excluded";
      blockingIssues = version.warning ? [version.warning] : [];
    } else if (candidate.parseSeverity === "unsafe") {
      primaryDatasetStatus = "malformed";
      blockingIssues = ["unsafe malformed response"];
    } else {
      primaryDatasetStatus = "primary";
      if (candidate.parseStatus === "tolerant") warnings.push(`tolerant parse: ${candidate.repairs.join(", ")}`);
    }
    const entry = {
      experiment_id: experimentInfo.experiment_id,
      packet_id: candidate.metadata.packet_id || "",
      provider: candidate.provider,
      sourcePath: candidate.filePath,
      sourceRelativePath: candidate.relativePath,
      canonicalTarget,
      canonicalRelativePath: canonicalTarget ? path.relative(experimentInfo.experiment_dir, canonicalTarget).replaceAll(path.sep, "/") : "",
      parse_mode: candidate.parseStatus,
      parse_severity: candidate.parseSeverity,
      repairs: candidate.repairs,
      packet_version: version.packet_version,
      version_status: version.status,
      metadata_status: identity.status,
      primaryDatasetStatus,
      duplicate_classification: "",
      sha256: candidate.sha256,
      byte_size: (await stat(candidate.filePath)).size,
      warnings,
      blockingIssues,
      original_file_name: path.basename(candidate.filePath),
    };
    classified.push(entry);
  }

  const existingPrimary = await discoverExistingCanonical(experimentInfo);
  classified.push(...existingPrimary.filter((entry) => !classified.some((item) => item.sourcePath === entry.sourcePath)));

  const duplicates = detectDuplicates(classified.map((item) => ({
    canonicalTarget: item.canonicalTarget,
    primaryEligible: item.primaryDatasetStatus === "primary",
    sha256: item.sha256,
    parsedJson: null,
    ...item,
  })));
  for (const duplicate of duplicates) {
    for (const item of duplicate.items.slice(1)) {
      item.duplicate_classification = duplicate.classification;
      item.primaryDatasetStatus = duplicate.classification === "conflicting_duplicate" ? "duplicate_conflicting" : "duplicate";
      item.blockingIssues.push(`duplicate detected: ${duplicate.classification}`);
    }
  }

  for (const item of classified) {
    if (!item.sourcePath || !item.canonicalTarget) continue;
    if (args.apply && item.primaryDatasetStatus === "primary" && path.resolve(item.sourcePath) !== path.resolve(item.canonicalTarget)) {
      const move = await safeMove(item.sourcePath, item.canonicalTarget);
      item.sha256 = move.hashAfter;
      item.sourcePath = item.canonicalTarget;
      item.sourceRelativePath = path.relative(ecrRoot, item.canonicalTarget).replaceAll(path.sep, "/");
      await appendAuditLine(auditPath, {
        action: "safe_move",
        experiment: experimentInfo.experiment_id,
        packet: item.packet_id,
        provider: item.provider,
        source_path: item.sourceRelativePath,
        target_path: item.canonicalRelativePath,
        hash_before: move.hashBefore,
        hash_after: move.hashAfter,
        result: "moved",
      });
    }
  }

  for (const expectedTask of experimentInfo.expected_tasks) {
    const key = `${expectedTask.packet_id}:${expectedTask.provider}`;
    if (!expectedKeys.has(key)) continue;
    const hasPrimary = classified.some((item) => item.packet_id === expectedTask.packet_id && item.provider === expectedTask.provider && item.primaryDatasetStatus === "primary");
    if (!hasPrimary) {
      classified.push({
        experiment_id: experimentInfo.experiment_id,
        packet_id: expectedTask.packet_id,
        provider: expectedTask.provider,
        sourcePath: "",
        sourceRelativePath: "",
        canonicalTarget: canonicalResponsePath(experimentInfo.experiment_dir, expectedTask.provider, expectedTask.packet_id),
        canonicalRelativePath: path.relative(experimentInfo.experiment_dir, canonicalResponsePath(experimentInfo.experiment_dir, expectedTask.provider, expectedTask.packet_id)).replaceAll(path.sep, "/"),
        parse_mode: "missing",
        parse_severity: "unsafe",
        repairs: [],
        packet_version: expectedTask.packet_version,
        version_status: "missing",
        metadata_status: "missing",
        primaryDatasetStatus: "missing",
        duplicate_classification: "",
        sha256: "",
        byte_size: 0,
        warnings: [],
        blockingIssues: ["required response missing"],
        original_file_name: "",
      });
    }
  }

  return classified.sort((a, b) => `${a.packet_id}:${a.provider}:${a.sourceRelativePath}`.localeCompare(`${b.packet_id}:${b.provider}:${b.sourceRelativePath}`));
}

async function discoverExistingCanonical(experimentInfo) {
  const rows = [];
  for (const provider of experimentInfo.providers) {
    const providerDir = path.join(experimentInfo.experiment_dir, "responses", provider);
    let entries = [];
    try {
      entries = await readdir(providerDir);
    } catch {
      entries = [];
    }
    for (const name of entries) {
      if (!name.endsWith(".json")) continue;
      const packetId = name.replace(`-${provider}.json`, "");
      if (!experimentInfo.packets.some((packet) => packet.packet_id === packetId)) continue;
      const filePath = path.join(providerDir, name);
      const extracted = await extractMetadata(filePath);
      rows.push({
        experiment_id: experimentInfo.experiment_id,
        packet_id: packetId,
        provider,
        sourcePath: filePath,
        sourceRelativePath: path.relative(experimentInfo.experiment_dir, filePath).replaceAll(path.sep, "/"),
        canonicalTarget: filePath,
        canonicalRelativePath: path.relative(experimentInfo.experiment_dir, filePath).replaceAll(path.sep, "/"),
        parse_mode: extracted.parseStatus,
        parse_severity: extracted.parseSeverity,
        repairs: extracted.repairs || [],
        packet_version: extracted.metadata.packet_version || experimentInfo.packet_versions?.[packetId] || "not_stated",
        version_status: "ok",
        metadata_status: "exact_match",
        primaryDatasetStatus: extracted.parseSeverity === "unsafe" ? "malformed" : "primary",
        duplicate_classification: "",
        sha256: await hashFile(filePath),
        byte_size: (await stat(filePath)).size,
        warnings: extracted.parseStatus === "tolerant" ? [`tolerant parse: ${(extracted.repairs || []).join(", ")}`] : [],
        blockingIssues: extracted.parseSeverity === "unsafe" ? ["unsafe malformed response"] : [],
        original_file_name: name,
      });
    }
  }
  return rows;
}

async function writeExperimentArtifacts(experimentInfo, manifest, certificate, report) {
  const dir = normalizationDir(experimentInfo.experiment_dir);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "dataset-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  await writeFile(path.join(dir, "normalization-certificate.json"), `${JSON.stringify(certificate, null, 2)}\n`, "utf8");
  await writeFile(path.join(dir, "normalization-report.md"), `${report}\n`, "utf8");
}

async function writeIndexAndSummary(ecrRoot, experimentResults) {
  const dir = path.join(ecrRoot, "normalization");
  await mkdir(dir, { recursive: true });
  const index = [
    "# Certificate Index",
    "",
    "| Experiment | Expected | Canonical | Warnings | Blockers | Dataset Hash | Status | Certificate |",
    "|---|---:|---:|---:|---:|---|---|---|",
    ...experimentResults.map(({ experimentInfo, certificate }) => `| ${experimentInfo.experiment_id} | ${certificate.expected_response_count} | ${certificate.canonical_response_count} | ${certificate.warning_count} | ${certificate.blocking_issues.length} | ${certificate.dataset_hash} | ${certificate.status} | experiments/${path.basename(experimentInfo.experiment_dir)}/normalization/normalization-certificate.json |`)
  ].join("\n");
  await writeFile(path.join(dir, "CERTIFICATE-INDEX.md"), `${index}\n`, "utf8");

  const totalExpected = experimentResults.reduce((sum, item) => sum + item.certificate.expected_response_count, 0);
  const totalCanonical = experimentResults.reduce((sum, item) => sum + item.certificate.canonical_response_count, 0);
  const warnings = experimentResults.reduce((sum, item) => sum + item.certificate.warning_count, 0);
  const blockers = experimentResults.reduce((sum, item) => sum + item.certificate.blocking_issues.length, 0);
  const summary = [
    "# ECR-000003 Normalization Summary",
    "",
    `- Expected responses: ${totalExpected}`,
    `- Canonical responses: ${totalCanonical}`,
    `- Warnings: ${warnings}`,
    `- Blockers: ${blockers}`,
    "",
    "## Experiment Statuses",
    "",
    ...experimentResults.map(({ experimentInfo, certificate }) => `- ${experimentInfo.experiment_id}: ${certificate.status}`),
    "",
    "## Exact Next Commands",
    "",
    "```bash",
    "npm run normalize:dry",
    "npm run normalize",
    "npm run normalize:verify",
    "npm run normalize:certify",
    "npm run pipeline",
    "```"
  ].join("\n");
  await writeFile(path.join(dir, "ECR-000003-normalization-summary.md"), `${summary}\n`, "utf8");
}

async function writeLegacyRootReports(ecrRoot, experimentResults, allCandidates) {
  const inventory = [
    "# ECR-000003 Response File Inventory",
    "",
    "| Experiment | Expected Responses | Found Candidates | Canonical Primary Responses | Missing | Duplicate Candidates | Malformed |",
    "|---|---:|---:|---:|---:|---:|---:|",
    ...experimentResults.map(({ experimentInfo, certificate, manifest }) => {
      const found = allCandidates.filter((item) => item.experimentInfo?.experiment_id === experimentInfo.experiment_id || item.metadata.experiment_id === experimentInfo.experiment_id).length;
      return `| ${experimentInfo.experiment_id} | ${certificate.expected_response_count} | ${found} | ${certificate.canonical_response_count} | ${certificate.missing_count} | ${certificate.duplicate_counts.exact_duplicate + certificate.duplicate_counts.semantic_duplicate + certificate.duplicate_counts.conflicting_duplicate} | ${certificate.unsafe_malformed_count} |`;
    })
  ].join("\n");
  await writeFile(path.join(ecrRoot, "response-file-inventory.md"), `${inventory}\n`, "utf8");

  const log = [
    "# ECR-000003 Response Filename Normalization Log",
    "",
    "See `normalization/logs/` for machine-readable audit lines.",
    "",
    ...experimentResults.flatMap(({ experimentInfo, classified }) =>
      classified
        .filter((item) => item.sourceRelativePath && item.sourceRelativePath !== item.canonicalRelativePath && item.primaryDatasetStatus === "primary")
        .map((item) => `- ${experimentInfo.experiment_id}: ${item.sourceRelativePath} -> ${item.canonicalRelativePath}`))
  ];
  await writeFile(path.join(ecrRoot, "response-filename-normalization-log.md"), `${log.join("\n")}\n`, "utf8");

  const readiness = [
    "# ECR-000003 Response Dataset Readiness",
    "",
    ...experimentResults.flatMap(({ experimentInfo, certificate }) => [
      `## ${experimentInfo.experiment_id}`,
      "",
      `- Expected: ${certificate.expected_response_count}`,
      `- Canonical: ${certificate.canonical_response_count}`,
      `- Missing: ${certificate.missing_count}`,
      `- Status: ${certificate.status}`,
      ""
    ]),
    "## Overall",
    "",
    `- ${experimentResults.every((item) => ["READY", "READY_WITH_WARNINGS"].includes(item.certificate.status)) ? "READY_WITH_WARNINGS" : "BLOCKED"}`
  ].join("\n");
  await writeFile(path.join(ecrRoot, "response-dataset-readiness.md"), `${readiness}\n`, "utf8");

  const verification = [
    "# ECR-000003 Response Filename Verification Report",
    "",
    "## Overall Status",
    "",
    `- ${experimentResults.every((item) => ["READY", "READY_WITH_WARNINGS"].includes(item.certificate.status)) ? "READY_WITH_WARNINGS" : "BLOCKED"}`,
    "",
    "## Experiment Summary",
    "",
    "| Experiment | Expected | Canonical | Missing | Malformed | Conflicts | Status |",
    "|---|---:|---:|---:|---:|---:|---|",
    ...experimentResults.map(({ experimentInfo, certificate }) => `| ${experimentInfo.experiment_id} | ${certificate.expected_response_count} | ${certificate.canonical_response_count} | ${certificate.missing_count} | ${certificate.unsafe_malformed_count} | ${certificate.duplicate_counts.conflicting_duplicate} | ${certificate.status} |`),
    "",
    "## Exact Next Commands",
    "",
    "```bash",
    "npm run normalize:dry",
    "npm run normalize",
    "npm run normalize:verify",
    "npm run normalize:certify",
    "npm run pipeline",
    "```"
  ].join("\n");
  await writeFile(path.join(ecrRoot, "response-filename-verification-report.md"), `${verification}\n`, "utf8");
}

async function writeImplementationReport(ecrRoot, experimentResults, discoveredCandidates) {
  const report = [
    "# Normalization Gate Implementation Report",
    "",
    `- Component status: implemented`,
    `- Discovered candidates: ${discoveredCandidates}`,
    ...experimentResults.flatMap(({ experimentInfo, certificate }) => [
      `- ${experimentInfo.experiment_id} expected: ${certificate.expected_response_count}`,
      `- ${experimentInfo.experiment_id} canonical: ${certificate.canonical_response_count}`,
      `- ${experimentInfo.experiment_id} status: ${certificate.status}`,
    ]),
    "- Comparator gate behavior: official comparison requires READY or READY_WITH_WARNINGS certificate with matching dataset and config hashes.",
    "- Limitations: ZIP introspection is not implemented; archive ZIPs are inventoried but not unpacked.",
    "",
    "## Exact Next Commands",
    "",
    "```bash",
    "npm run normalize:dry",
    "npm run normalize",
    "npm run normalize:verify",
    "npm run normalize:certify",
    "npm run pipeline",
    "```"
  ].join("\n");
  const dir = path.join(ecrRoot, "normalization");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "normalization-gate-implementation-report.md"), `${report}\n`, "utf8");
}

function buildNormalizationReport(experimentInfo, manifest, certificate, classified) {
  const moves = classified.filter((item) => item.sourceRelativePath && item.sourceRelativePath !== item.canonicalRelativePath && item.primaryDatasetStatus === "primary");
  const tolerant = classified.filter((item) => item.parse_mode === "tolerant");
  const blockers = classified.filter((item) => item.blockingIssues.length > 0);
  return [
    `# ${experimentInfo.experiment_id} Normalization Report`,
    "",
    `- Expected responses: ${certificate.expected_response_count}`,
    `- Canonical responses: ${certificate.canonical_response_count}`,
    `- Status: ${certificate.status}`,
    `- Dataset hash: ${certificate.dataset_hash}`,
    "",
    "## Canonical Responses",
    "",
    ...manifest.primary_responses.map((item) => `- ${item.packet_id} ${item.provider}: ${item.canonicalRelativePath}`),
    "",
    "## Moves",
    "",
    ...(moves.length ? moves.map((item) => `- ${item.sourceRelativePath} -> ${item.canonicalRelativePath}`) : ["- None"]),
    "",
    "## Tolerant Parsing Events",
    "",
    ...(tolerant.length ? tolerant.map((item) => `- ${item.packet_id} ${item.provider}: ${item.repairs.join(", ")}`) : ["- None"]),
    "",
    "## Duplicate Handling",
    "",
    ...(manifest.duplicate_responses.length ? manifest.duplicate_responses.map((item) => `- ${item.packet_id} ${item.provider}: ${item.duplicate_classification}`) : ["- None"]),
    "",
    "## Malformed or Ambiguous Files",
    "",
    ...(manifest.malformed_responses.length || manifest.ambiguous_responses.length
      ? [...manifest.malformed_responses, ...manifest.ambiguous_responses].map((item) => `- ${item.packet_id || "(unknown)"} ${item.provider || ""}: ${item.primaryDatasetStatus}`)
      : ["- None"]),
    "",
    "## Packet Version Issues",
    "",
    ...(certificate.packet_version_issues.length ? certificate.packet_version_issues.map((item) => `- ${item}`) : ["- None"]),
    "",
    "## Blockers",
    "",
    ...(blockers.length ? blockers.flatMap((item) => item.blockingIssues.map((issue) => `- ${item.packet_id || "(missing)"} ${item.provider}: ${issue}`)) : ["- None"]),
    "",
    "## Exact Next Command",
    "",
    "```bash",
    certificate.ready_for_comparison ? "npm run pipeline" : "npm run normalize:verify",
    "```"
  ].join("\n");
}

async function appendAuditLine(filePath, row) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify({ timestamp: new Date().toISOString(), ...row })}\n`, { flag: "a" });
}

function findExperimentFromPath(experiments, relativePath) {
  return experiments.find((item) => relativePath.includes(path.basename(item.experiment_dir)));
}

function normalizePacketId(value) {
  if (!value) return "";
  return value.replace(/\s+/g, "").toUpperCase();
}

function normalizeExperimentId(packetId, experimentId) {
  const fromPacket = packetId.match(/EXP-\d{3}/)?.[0];
  if (fromPacket) return fromPacket;
  const match = String(experimentId || "").toUpperCase().match(/EXP-?\d{3}/);
  return match ? match[0].replace("EXP", "EXP-").replace(/EXP--/, "EXP-") : "";
}

function normalizeVariantId(variantId, packetId) {
  if (variantId) return String(variantId).toUpperCase();
  return packetId.match(/P\d{3}[A-Z]$/)?.[0] || "";
}
