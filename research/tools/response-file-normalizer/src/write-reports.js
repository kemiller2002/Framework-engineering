import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";

export async function writeReports(ecrRoot, reportData) {
  await writeMarkdown(path.join(ecrRoot, "response-file-inventory.md"), buildInventory(reportData));
  await writeMarkdown(path.join(ecrRoot, "response-filename-normalization-log.md"), buildNormalizationLog(reportData));
  await writeMarkdown(path.join(ecrRoot, "response-dataset-readiness.md"), buildDatasetReadiness(reportData));
  await writeMarkdown(path.join(ecrRoot, "response-filename-verification-report.md"), buildVerificationReport(reportData));
}

async function writeMarkdown(filePath, text) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${text}\n`, "utf8");
}

function buildInventory({ summaryRows, discoveredRows }) {
  return [
    "# ECR-000003 Response File Inventory",
    "",
    "## Summary",
    "",
    "| Experiment | Expected Responses | Found Candidates | Canonical Primary Responses | Missing | Duplicate Candidates | Malformed |",
    "|---|---:|---:|---:|---:|---:|---:|",
    ...summaryRows.map((row) => `| ${row.experiment} | ${row.expected} | ${row.found} | ${row.canonical} | ${row.missing} | ${row.duplicates} | ${row.malformed} |`),
    "",
    "## Files Discovered",
    "",
    "| Current Path | Experiment | Packet ID | Variant ID | Provider | Parse Status | Canonical Target | Action |",
    "|---|---|---|---|---|---|---|---|",
    ...discoveredRows.map((row) => `| ${escapeCell(row.currentPath)} | ${row.experiment || ""} | ${row.packetId || ""} | ${row.variantId || ""} | ${row.provider || ""} | ${row.parseStatus || ""} | ${escapeCell(row.canonicalTarget || "")} | ${row.action} |`),
  ].join("\n");
}

function buildNormalizationLog({ logRows }) {
  return [
    "# ECR-000003 Response Filename Normalization Log",
    "",
    "| Timestamp | Original Path | Canonical Path | Experiment | Packet | Provider | Hash Before | Hash After | Action | Status |",
    "|---|---|---|---|---|---|---|---|---|---|",
    ...logRows.map((row) => `| ${row.timestamp} | ${escapeCell(row.originalPath)} | ${escapeCell(row.canonicalPath || "")} | ${row.experiment || ""} | ${row.packet || ""} | ${row.provider || ""} | ${row.hashBefore || ""} | ${row.hashAfter || ""} | ${row.action} | ${row.status} |`),
  ].join("\n");
}

function buildDatasetReadiness({ readiness }) {
  return [
    "# ECR-000003 Response Dataset Readiness",
    "",
    "## EXP-001",
    "",
    "| Packet | GPT | Claude | Gemini | Packet Version | Status |",
    "|---|---|---|---|---|---|",
    ...readiness.exp1.rows.map((row) => `| ${row.packet} | ${row.gpt} | ${row.claude} | ${row.gemini} | ${row.packetVersion} | ${row.status} |`),
    "",
    "Expected: 4 packets × 3 providers = 12 primary responses.",
    "",
    "## EXP-002",
    "",
    "| Packet | Condition | GPT | Claude | Gemini | Status |",
    "|---|---|---|---|---|---|",
    ...readiness.exp2.rows.map((row) => `| ${row.packet} | ${row.condition} | ${row.gpt} | ${row.claude} | ${row.gemini} | ${row.status} |`),
    "",
    "## EXP-003",
    "",
    "| Packet | Domain | GPT | Claude | Gemini | Status |",
    "|---|---|---|---|---|---|",
    ...readiness.exp3.rows.map((row) => `| ${row.packet} | ${row.domain} | ${row.gpt} | ${row.claude} | ${row.gemini} | ${row.status} |`),
    "",
    "## Overall",
    "",
    "| Metric | Count |",
    "|---|---:|",
    ...Object.entries(readiness.overall.metrics).map(([key, value]) => `| ${key} | ${value} |`),
    "",
    "Overall status:",
    "",
    `- ${readiness.overall.status}`,
  ].join("\n");
}

function buildVerificationReport({ verification }) {
  return [
    "# ECR-000003 Response Filename Verification Report",
    "",
    "## Overall Status",
    "",
    `- ${verification.overallStatus}`,
    "",
    "## Experiment Summary",
    "",
    "| Experiment | Expected | Canonical | Missing | Malformed | Conflicts | Status |",
    "|---|---:|---:|---:|---:|---:|---|",
    ...verification.experiments.map((row) => `| ${row.experiment} | ${row.expected} | ${row.canonical} | ${row.missing} | ${row.malformed} | ${row.conflicts} | ${row.status} |`),
    "",
    "## Renamed Files",
    "",
    ...toBullets(verification.renamedFiles),
    "",
    "## Moved Files",
    "",
    ...toBullets(verification.movedFiles),
    "",
    "## Duplicate Files",
    "",
    ...toBullets(verification.duplicateFiles),
    "",
    "## Ambiguous Files",
    "",
    ...toBullets(verification.ambiguousFiles),
    "",
    "## Archived ZIP Files",
    "",
    ...toBullets(verification.archivedZips),
    "",
    "## Packet Version Issues",
    "",
    ...toBullets(verification.packetVersionIssues),
    "",
    "## Comparator Discovery Verification",
    "",
    "| Experiment | Config Present | Canonical Files Discovered | Missing | Status |",
    "|---|---|---:|---:|---|",
    ...verification.comparatorDiscovery.map((row) => `| ${row.experiment} | ${row.configPresent} | ${row.discovered} | ${row.missing} | ${row.status} |`),
    "",
    "## Remaining Human Actions",
    "",
    ...toBullets(verification.remainingHumanActions),
    "",
    "## Exact Next Commands",
    "",
    "```bash",
    ...verification.commands,
    "```",
  ].join("\n");
}

function toBullets(items) {
  return items.length > 0 ? items.map((item) => `- ${item}`) : ["- None"];
}

function escapeCell(value) {
  return String(value).replaceAll("|", "\\|");
}
