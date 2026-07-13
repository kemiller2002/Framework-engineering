import path from "node:path";
import { writeText } from "./utilities.js";

export async function generateEcrSummary(context, experimentResults, datasetInfo, logger) {
  const summary = [
    "# ECR-000003 Comparison Summary",
    "",
    "## Run Status",
    "",
    "- Comparator version: 3.1.0",
    `- Dataset status: ${datasetInfo.overallStatus}`,
    "",
    "## Dataset Completeness",
    "",
    ...datasetInfo.experiments.map((row) => `- ${row.experiment}: expected ${row.expected}, present ${row.present}, malformed ${row.malformed}, status ${row.status}.`),
    "",
    "## Comparator Version",
    "",
    "- Comparator v3.1.0 remains frozen for ECR-000003.",
    "",
    "## EXP-001 Topology Perturbation",
    "",
    ...sectionForExperiment(experimentResults.experiments["EXP-001"]),
    "",
    "## EXP-002 Cross-Representation Stability",
    "",
    ...sectionForExperiment(experimentResults.experiments["EXP-002"]),
    "",
    "## EXP-003 Procedural Isomorphism",
    "",
    ...sectionForExperiment(experimentResults.experiments["EXP-003"]),
    "",
    "## Recognition Across Experiments",
    "",
    ...recognitionLines(experimentResults),
    "",
    "## Structural Backbone Across Experiments",
    "",
    ...backboneLines(experimentResults),
    "",
    "## Primitive Stability Across Experiments",
    "",
    ...primitiveLines(experimentResults),
    "",
    "## Constraint Findings",
    "",
    ...constraintLines(experimentResults),
    "",
    "## Representation Compliance",
    "",
    ...representationLines(experimentResults),
    "",
    "## Provider-Specific Patterns",
    "",
    "- Provider-specific patterns remain experiment-local and require human review before interpretation.",
    "",
    "## Domain Leakage",
    "",
    ...leakageLines(experimentResults),
    "",
    "## Instrument Limitations",
    "",
    "- Tolerant parsing events remain visible and may affect strict-parser workflows.",
    "- Missing EXP-003 responses block full ECR completion.",
    "- Comparator approval does not validate any theory or product claim.",
    "",
    "## Observations Ready For EDR Review",
    "",
    "- Use the experiment EDR drafts and the ECR summary EDR for human review.",
    "",
    "## What This ECR Does Not Establish",
    "",
    "- Does not validate Framework Engineering.",
    "- Does not validate Clarity.",
    "- Does not validate EDF.",
    "- Does not prove a universal procedural grammar.",
    "- Does not establish human equivalence.",
    "- Does not establish model independence.",
    "- Does not justify product claims."
  ];
  await writeText(path.join(context.pipelineGeneratedDir, "ecr-000003-comparison-summary.md"), summary.join("\n"));

  const ledger = [
    "# ECR-000003 Observation Ledger",
    "",
    "| Observation ID | Experiment | Observation | Evidence Source | Observation Confidence | Instrument Limitation |",
    "|---|---|---|---|---|---|",
    ...buildObservationLedger(experimentResults)
  ];
  await writeText(path.join(context.pipelineGeneratedDir, "ecr-000003-observation-ledger.md"), ledger.join("\n"));
  logger.log("wrote ECR summary and observation ledger");
}

function sectionForExperiment(result) {
  if (!result || result.status !== "available") {
    return ["- Outputs not available."];
  }
  return [
    `- run_id: ${result.run_id}`,
    `- included_records: ${result.included_records}`,
    `- malformed_records: ${result.malformed_records}`,
    `- tolerant_parsing_events: ${result.tolerant_parsing_events}`,
    `- structural_backbone_result: ${result.structural_backbone_result}`
  ];
}

function recognitionLines(results) {
  return Object.entries(results.experiments).flatMap(([experiment, result]) =>
    result.status === "available"
      ? result.recognition_results.slice(0, 6).map((row) => `- ${experiment} ${row.packet_id} ${row.provider}: ${row.recognition_value}`)
      : [`- ${experiment}: unavailable`]
  );
}

function backboneLines(results) {
  return Object.entries(results.experiments).map(([experiment, result]) => `- ${experiment}: ${result.structural_backbone_result || "unavailable"}`);
}

function primitiveLines(results) {
  return Object.entries(results.experiments).map(([experiment, result]) => `- ${experiment}: ${result.primitive_headline || "unavailable"}`);
}

function constraintLines(results) {
  return Object.entries(results.experiments).map(([experiment, result]) => `- ${experiment}: ${result.constraint_concept_result || "unavailable"}`);
}

function representationLines(results) {
  return Object.entries(results.experiments).map(([experiment, result]) => `- ${experiment}: ${result.representation_compliance || "unavailable"}`);
}

function leakageLines(results) {
  return Object.entries(results.experiments).map(([experiment, result]) => `- ${experiment}: ${result.leakage_findings ?? "unavailable"} leakage findings`);
}

function buildObservationLedger(results) {
  let counter = 1;
  const rows = [];
  for (const [experiment, result] of Object.entries(results.experiments)) {
    if (result.status !== "available") {
      rows.push(`| OBS-${String(counter).padStart(3, "0")} | ${experiment} | Outputs not available. | experiment-results.json | low | missing_experiment_outputs |`);
      counter += 1;
      continue;
    }
    rows.push(`| OBS-${String(counter).padStart(3, "0")} | ${experiment} | Structural backbone result recorded as ${result.structural_backbone_result}. | experiment-results.json | medium | comparator_output_only |`);
    counter += 1;
    rows.push(`| OBS-${String(counter).padStart(3, "0")} | ${experiment} | ${result.tolerant_parsing_events} tolerant parsing or warning events recorded. | experiment-results.json | medium | parsing_visibility |`);
    counter += 1;
  }
  return rows;
}
