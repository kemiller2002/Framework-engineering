import path from "node:path";
import { csvEscape, ensureDir, percent, readOptional, writeText } from "./utilities.js";

export async function writeOutputs(config, results) {
  await ensureDir(config.output_root);

  const outputs = config.output_files || {};
  const summaryName = outputs.summary || "comparison-summary.md";

  await Promise.all([
    writeText(path.join(config.output_root, "raw-comparison-data.json"), `${JSON.stringify(results.machine, null, 2)}\n`),
    writeText(path.join(config.output_root, outputs.recognition_csv || "recognition-persistence-results.csv"), buildRecognitionCsv(results.recognitionRows)),
    writeText(path.join(config.output_root, outputs.recognition_report || "recognition-persistence-report.md"), buildRecognitionReport(config, results)),
    writeText(path.join(config.output_root, outputs.structural_report || "structural-stability-report.md"), buildLayerReport("Structural Stability", results.structural)),
    writeText(path.join(config.output_root, outputs.primitive_report || "primitive-stability-report.md"), buildPrimitiveReport(results.primitives)),
    writeText(path.join(config.output_root, outputs.constraint_report || "constraint-stability-report.md"), buildConstraintReport(results.constraints)),
    writeText(path.join(config.output_root, outputs.representation_report || "representation-stability-report.md"), buildRepresentationReport(results.representation)),
    writeText(path.join(config.output_root, outputs.leakage_report || "domain-leakage-report.md"), buildLeakageReport(results.leakageRows)),
    writeText(path.join(config.output_root, outputs.data_quality_report || "data-quality-report.md"), buildDataQualityReport(results)),
    writeText(path.join(config.output_root, outputs.observation_ledger || "observation-ledger.md"), buildObservationLedger(results)),
    writeText(path.join(config.output_root, summaryName), buildSummaryReport(config, results)),
  ]);

  if (config.edr_template) {
    const template = await readOptional(config.edr_template);
    if (template) {
      await writeText(path.join(config.output_root, outputs.edr_draft || "edr-draft.md"), buildEdrDraft(template, config, results));
    }
  }
}

function buildRecognitionCsv(rows) {
  const header = [
    "ecr_id",
    "experiment_id",
    "packet_id",
    "provider",
    "variant_id",
    "variant_order",
    "recognition_value",
    "recognized_artifact_raw",
    "domain_terms_introduced",
    "prior_knowledge_leakage_risk",
    "notes",
  ];
  const lines = [header.join(",")];
  for (const row of rows) {
    lines.push([
      row.ecr_id,
      row.experiment_id,
      row.packet_id,
      row.provider,
      row.variant_id,
      row.variant_order,
      row.recognition_value,
      row.recognized_artifact_raw,
      row.domain_terms_introduced.join("; "),
      row.prior_knowledge_leakage_risk,
      row.notes,
    ].map(csvEscape).join(","));
  }
  return `${lines.join("\n")}\n`;
}

function buildRecognitionReport(config, results) {
  const labels = new Map(results.recognitionRows.map((row) => [row.variant_id, row.variant_label]));
  const rows = results.recognitionSummary.map((entry) => {
    const byOrder = new Map(entry.rows.map((row) => [row.variant_order, row.recognition_value]));
    return `| ${entry.provider} | ${byOrder.get(1) || ""} | ${byOrder.get(2) || ""} | ${byOrder.get(3) || ""} | ${byOrder.get(4) || ""} | ${entry.pattern} |`;
  }).join("\n");

  return [
    "# Recognition Persistence Report",
    "",
    `Experiment: ${config.ecr_id} ${config.experiment_id} ${config.title}`,
    "",
    `| Provider | ${labels.get("P001A") || "Baseline"} | ${labels.get("P001B") || "Variant 2"} | ${labels.get("P001C") || "Variant 3"} | ${labels.get("P001D") || "Variant 4"} | Pattern |`,
    "|---|---|---|---|---|---|",
    rows,
    "",
    "Recognition values use the configured four-value scale only.",
    "This report is observational and does not validate any hypothesis.",
    "",
  ].join("\n");
}

function buildLayerReport(title, layer) {
  const rows = layer.providerComparisons
    .map((item) => `| ${item.scope} | ${item.literal} | ${item.dimensional} | ${item.notes} |`)
    .join("\n");
  return [
    `# ${title}`,
    "",
    "| Scope | Literal Agreement | Dimensional Agreement | Notes |",
    "|---|---|---|---|",
    rows,
    "",
    `Overall literal profile: ${layer.literal_profile}`,
    `Overall dimensional profile: ${layer.dimensional_profile}`,
    "",
  ].join("\n");
}

function buildPrimitiveReport(layer) {
  return [
    "# Primitive Stability Report",
    "",
    "| Field | Category |",
    "|---|---|",
    `| primitive_sequence | ${layer.primitive_sequence.category} |`,
    `| transitions | ${layer.transitions.category} |`,
    `| dominant_primitive | ${layer.dominant_primitive.category} |`,
    `| candidate_missing_primitives | ${layer.candidate_missing_primitives.category} |`,
    "",
  ].join("\n");
}

function buildConstraintReport(layer) {
  const rows = layer.field_results.map((item) => `| ${item.field} | ${item.comparison.category} |`).join("\n");
  return [
    "# Constraint Stability Report",
    "",
    "| Field | Category |",
    "|---|---|",
    rows,
    "",
  ].join("\n");
}

function buildRepresentationReport(layer) {
  return [
    "# Representation Stability Report",
    "",
    "| Field | Category |",
    "|---|---|",
    `| procedural_ast_presence | ${layer.procedural_ast_presence.category} |`,
    `| natural_language_summary | ${layer.natural_language_summary.category} |`,
    `| canonical_summary | ${layer.canonical_summary.category} |`,
    `| ambiguities | ${layer.ambiguities.category} |`,
    `| notes | ${layer.notes.category} |`,
    "",
  ].join("\n");
}

function buildLeakageReport(rows) {
  const body = rows.map((row) =>
    `| ${row.packet_id} | ${row.provider} | ${row.domain_terms.join("; ") || "none"} | ${row.classification} | ${row.notes} |`,
  ).join("\n");
  return [
    "# Domain Leakage Report",
    "",
    "| Packet | Provider | Introduced Terms | Classification | Notes |",
    "|---|---|---|---|---|",
    body,
    "",
    "Leakage classifications are observational and may still reflect structural inference rather than memorized framework recall.",
    "",
  ].join("\n");
}

function buildDataQualityReport(results) {
  const rows = results.dataQuality.map((item) =>
    `| ${item.packet_id} | ${item.provider} | ${item.status} | ${item.notes} |`,
  ).join("\n");
  return [
    "# Data Quality Report",
    "",
    "| Packet | Provider | Status | Notes |",
    "|---|---|---|---|",
    rows || "|  |  | no_issues_recorded |  |",
    "",
    `Dataset completeness: ${results.primaryRecords.length}/${results.records.length} primary records included.`,
    "",
  ].join("\n");
}

function buildObservationLedger(results) {
  const rows = results.observations.map((item) =>
    `| ${item.id} | ${item.observation} | ${item.source} | ${item.confidence} |`,
  ).join("\n");
  return [
    "# Observation Ledger",
    "",
    "| Observation ID | Observation | Evidence Source | Observation Confidence |",
    "|---|---|---|---|",
    rows,
    "",
  ].join("\n");
}

function buildSummaryReport(config, results) {
  const unresolvedLines = results.dataQuality.length > 0
    ? results.dataQuality.map((item) => `${item.packet_id || "dataset"} ${item.provider || ""}: ${item.status} (${item.notes})`.trim())
    : results.unresolved;
  return [
    `# ${config.experiment_id.toLowerCase()}-comparison-summary`.replace(/^# /, "# ").replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()),
    "",
    `Experiment: ${config.ecr_id} ${config.experiment_id} ${config.title}`,
    "",
    "## Dataset Completeness",
    "",
    `- Total records discovered: ${results.records.length}`,
    `- Included in primary comparison: ${results.primaryRecords.length}`,
    `- Missing or malformed: ${results.dataQuality.filter((item) => ["missing", "malformed"].includes(item.status)).length}`,
    "",
    "## Packet Versions",
    "",
    ...results.packetVersions.map((item) => `- ${item.packet_id}: ${item.packet_version || "not stated"}`),
    "",
    "## Response Validity",
    "",
    `- Valid primary records: ${results.primaryRecords.length}/${results.records.length}`,
    `- Data-quality issues: ${results.dataQuality.length}`,
    "",
    "## Recognition Persistence Summary",
    "",
    ...results.recognitionSummary.map((item) => `- ${item.provider}: ${item.pattern}`),
    "",
    "## Structural Stability Summary",
    "",
    `- Literal profile: ${results.structural.literal_profile}`,
    `- Dimensional profile: ${results.structural.dimensional_profile}`,
    "",
    "## Provider-Specific Differences",
    "",
    ...results.providerNotes.map((note) => `- ${note}`),
    "",
    "## Largest Disagreements",
    "",
    ...results.largestDisagreements.map((note) => `- ${note}`),
    "",
    "## Domain Leakage Findings",
    "",
    ...results.leakageSummary.map((note) => `- ${note}`),
    "",
    "## Unresolved Issues",
    "",
    ...unresolvedLines.map((note) => `- ${note}`),
    "",
    "## Readiness For EDR Review",
    "",
    `- ${results.edrReadiness}`,
    "",
  ].join("\n");
}

function buildEdrDraft(template, config, results) {
  const observationLines = results.observations.map((item) => `- ${item.observation}`);
  const remaining = results.unresolved.map((item) => `- ${item}`);
  const evidenceInputs = results.primaryRecords.map((item) => `- ${item.source_path}`);

  return template
    .replace("Date:\n", `Date:\n${new Date().toISOString().slice(0, 10)}\n`)
    .replace("## Observation\n\n- \n", `## Observation\n\n${observationLines.join("\n")}\n\n## Evidence Inputs\n\n${evidenceInputs.join("\n")}\n`)
    .replace("## Remaining Uncertainty\n\n- \n", `## Remaining Uncertainty\n\n${remaining.join("\n") || "- None recorded."}\n`)
    .replace("## Efficiency Notes\n\n- \n", `## Efficiency Notes\n\n- Primary records included: ${results.primaryRecords.length}/${results.records.length}\n- Data-quality issues recorded: ${results.dataQuality.length}\n`);
}

export function buildMigrationDifferences(sharedResults, previousReportPath) {
  return [
    "# Migration Differences",
    "",
    `Previous comparator reference: ${previousReportPath}`,
    "",
    "- Shared engine output is expected to be directionally similar rather than byte-identical.",
    `- Shared engine primary records: ${sharedResults.primaryRecords.length}/${sharedResults.records.length}.`,
    `- Shared engine structural profile: literal=${sharedResults.structural.literal_profile}, dimensional=${sharedResults.structural.dimensional_profile}.`,
    `- Shared engine recognition rows: ${sharedResults.recognitionRows.length}.`,
    "- Review the old Comparator v3 report and the shared-engine summary side by side before using migration output for research decisions.",
    "",
  ].join("\n");
}
