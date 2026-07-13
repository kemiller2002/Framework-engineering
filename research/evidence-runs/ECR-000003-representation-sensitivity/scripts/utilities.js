import { mkdir, readFile, stat, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { discoverFiles } from "../../../tools/response-file-normalizer/src/discover-files.js";
import { extractMetadata } from "../../../tools/response-file-normalizer/src/extract-metadata.js";
import { detectProvider } from "../../../tools/response-file-normalizer/src/detect-provider.js";

export const PIPELINE_VERSION = "1.0.0";
export const COMPARATOR_VERSION = "3.1.0";
export const PROVIDERS = ["gpt", "claude", "gemini"];

export function parseArgs(argv) {
  const options = {
    verifyOnly: false,
    normalize: false,
    compareAll: false,
    reportsAll: false,
    all: false,
    dryRun: false,
    apply: false,
    forceReports: false,
    experiment: "",
    continueOnWarning: true,
    continueOnError: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--verify-only") options.verifyOnly = true;
    else if (value === "--normalize") options.normalize = true;
    else if (value === "--compare-all") options.compareAll = true;
    else if (value === "--reports-all") options.reportsAll = true;
    else if (value === "--all") options.all = true;
    else if (value === "--dry-run") options.dryRun = true;
    else if (value === "--apply") options.apply = true;
    else if (value === "--force-reports") options.forceReports = true;
    else if (value === "--experiment") {
      options.experiment = argv[index + 1] || "";
      index += 1;
    } else if (value === "--continue-on-warning") options.continueOnWarning = true;
    else if (value === "--continue-on-error") options.continueOnError = true;
  }
  if (options.all) {
    options.normalize = true;
    options.compareAll = true;
    options.reportsAll = true;
  }
  if ((options.normalize || options.all) && !options.apply && !options.dryRun) {
    options.dryRun = true;
  }
  return options;
}

export function createPipelineContext(rootDir, options) {
  const ecrRoot = path.resolve(rootDir);
  const pipelineRoot = path.join(ecrRoot, "pipeline");
  return {
    options,
    ecrRoot,
    pipelineRoot,
    pipelineGeneratedDir: path.join(pipelineRoot, "generated"),
    pipelineLogDir: path.join(pipelineRoot, "logs"),
    experiments: [
      {
        id: "EXP-001",
        key: "EXP001",
        title: "Topology Perturbation",
        dirName: "EXP-001-topology-perturbation",
        summaryName: "exp-001-comparison-summary.md",
        requiredReports: [
          "run-manifest.json",
          "exp-001-comparison-summary.md",
          "data-quality-report.md",
          "recognition-persistence-report.md",
          "structural-backbone-report.md",
          "structural-field-variance-report.md",
          "primitive-stability-report.md",
          "constraint-concept-report.md",
          "representation-compliance-report.md",
          "representation-review-fields.md",
          "domain-leakage-report.md",
          "observation-ledger.md",
          "raw-comparison-data.json",
          "edr-draft.md"
        ]
      },
      {
        id: "EXP-002",
        key: "EXP002",
        title: "Cross Representation Stability",
        dirName: "EXP-002-cross-representation-stability",
        summaryName: "exp-002-comparison-summary.md",
        requiredReports: [
          "run-manifest.json",
          "exp-002-comparison-summary.md",
          "data-quality-report.md",
          "recognition-persistence-report.md",
          "cross-representation-backbone-report.md",
          "representation-format-effects.md",
          "primitive-stability-report.md",
          "constraint-concept-report.md",
          "representation-compliance-report.md",
          "provider-behavior-report.md",
          "domain-leakage-report.md",
          "observation-ledger.md",
          "raw-comparison-data.json",
          "edr-draft.md"
        ]
      },
      {
        id: "EXP-003",
        key: "EXP003",
        title: "Isomorphic Procedures",
        dirName: "EXP-003-isomorphic-procedures",
        summaryName: "exp-003-comparison-summary.md",
        requiredReports: [
          "run-manifest.json",
          "exp-003-comparison-summary.md",
          "data-quality-report.md",
          "isomorphic-backbone-report.md",
          "domain-effect-report.md",
          "recognition-by-domain-report.md",
          "primitive-stability-report.md",
          "constraint-concept-report.md",
          "representation-compliance-report.md",
          "provider-behavior-report.md",
          "domain-leakage-report.md",
          "observation-ledger.md",
          "raw-comparison-data.json",
          "edr-draft.md"
        ]
      }
    ].map((experiment) => ({
      ...experiment,
      root: path.join(ecrRoot, "experiments", experiment.dirName),
      packetRoot: path.join(ecrRoot, "experiments", experiment.dirName, "packets"),
      responseRoot: path.join(ecrRoot, "experiments", experiment.dirName, "responses"),
      outputRoot: path.join(ecrRoot, "experiments", experiment.dirName, "comparison", "generated-v3.1"),
      configPath: path.join(ecrRoot, "experiments", experiment.dirName, "comparison-config.json"),
      legacyConfigPath: path.join(ecrRoot, "experiments", experiment.dirName, "comparison-engine.config.json"),
      packagePath: path.join(ecrRoot, "experiments", experiment.dirName, "package.json")
    }))
  };
}

export async function ensureDir(dirPath) {
  await mkdir(dirPath, { recursive: true });
}

export async function writeText(filePath, text) {
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, `${text}\n`, "utf8");
}

export async function writeJson(filePath, value) {
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function readJson(filePath) {
  const text = await readFile(filePath, "utf8");
  return JSON.parse(text);
}

export async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

export function relativeFrom(root, target) {
  return path.relative(root, target).replaceAll(path.sep, "/");
}

export function createLogger(context) {
  const lines = [];
  return {
    log(message) {
      lines.push(`[${new Date().toISOString()}] ${message}`);
    },
    async flush() {
      await ensureDir(context.pipelineLogDir);
      const filePath = path.join(context.pipelineLogDir, `${new Date().toISOString().replace(/[:.]/g, "-")}.log`);
      await writeFile(filePath, `${lines.join("\n")}\n`, "utf8");
      return filePath;
    },
    lines
  };
}

export async function loadPacketMetadata(packetRoot) {
  const files = (await discoverFiles(packetRoot)).filter((file) => file.endsWith(".md"));
  const packets = [];
  for (const filePath of files) {
    const raw = await readFile(filePath, "utf8");
    const metadata = {};
    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (!match) continue;
      metadata[match[1]] = match[2];
    }
    const packetId = metadata.packet_id || path.basename(filePath, ".md").split("-").slice(0, 4).join("-");
    packets.push({
      packet_id: packetId,
      experiment_id: metadata.experiment_id || packetId.match(/EXP-\d{3}|EXP\d{3}/)?.[0] || "",
      variant_id: metadata.variant_id || packetId.match(/P\d{3}[A-Z]/)?.[0] || "",
      recognition_condition: metadata.recognition_condition || "",
      packet_version: metadata.packet_version || "not_stated",
      file_path: filePath,
      label: path.basename(filePath, ".md").slice(packetId.length + 1)
    });
  }
  return packets.sort((left, right) => left.packet_id.localeCompare(right.packet_id));
}

export async function inventoryResponses(experiment) {
  const files = (await discoverFiles(experiment.responseRoot)).filter((file) => file.endsWith(".json"));
  const candidates = [];
  for (const filePath of files) {
    const relative = relativeFrom(experiment.root, filePath);
    if (relative.includes("/pre-fix/") || relative.includes("/excluded/") || relative.includes("/archive/")) {
      candidates.push({ filePath, relativePath: relative, status: "excluded", provider: detectProvider(relative), metadata: {} });
      continue;
    }
    const extracted = await extractMetadata(filePath);
    candidates.push({
      filePath,
      relativePath: relative,
      status: extracted.parseStatus,
      provider: detectProvider(relative),
      metadata: extracted.metadata,
      parsed: extracted.parsed
    });
  }
  return candidates;
}

export function expectedCanonicalPath(experiment, packetId, provider) {
  return path.join(experiment.responseRoot, provider, `${packetId}-${provider}.json`);
}

export async function hashFile(filePath) {
  const buffer = await readFile(filePath);
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export async function snapshotRawResponseHashes(context) {
  const snapshot = {};
  for (const experiment of context.experiments) {
    if (!(await exists(experiment.responseRoot))) continue;
    const files = (await discoverFiles(experiment.responseRoot)).filter((file) => file.endsWith(".json"));
    for (const filePath of files) {
      snapshot[relativeFrom(context.ecrRoot, filePath)] = await hashFile(filePath);
    }
  }
  return snapshot;
}

export function statusLine(check, status, details, blocking) {
  return `| ${check} | ${status} | ${details} | ${blocking ? "yes" : "no"} |`;
}

export async function copyIfExists(sourcePath, targetPath) {
  if (!(await exists(sourcePath))) return false;
  await ensureDir(path.dirname(targetPath));
  await copyFile(sourcePath, targetPath);
  return true;
}

export function modeLabel(options) {
  if (options.verifyOnly) return "verify-only";
  if (options.all) return options.apply ? "all-apply" : "all-dry-run";
  if (options.compareAll) return "compare-all";
  if (options.reportsAll) return "reports-all";
  if (options.normalize) return options.apply ? "normalize-apply" : "normalize-dry-run";
  return "custom";
}
