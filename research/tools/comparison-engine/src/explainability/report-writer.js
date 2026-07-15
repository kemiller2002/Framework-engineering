import path from "node:path";
import { ensureDir, writeText } from "../utilities.js";

export async function writeExplainabilityOutputs(config, results) {
  await ensureDir(results.output_root);
  const outputs = {
    "explainability-run-manifest.json": `${JSON.stringify(results.run_manifest, null, 2)}\n`,
    "pairwise-differences.json": `${JSON.stringify(results.pairwise_records, null, 2)}\n`,
    "difference-summary.md": buildDifferenceSummary(results),
    "primitive-difference-explanations.md": buildLayerReport("Primitive Difference Explanations", results, "primitive"),
    "transition-difference-explanations.md": buildFieldReport("Transition Difference Explanations", results, "primitive_layer.transitions"),
    "structural-difference-explanations.md": buildLayerReport("Structural Difference Explanations", results, "structural"),
    "constraint-difference-explanations.md": buildLayerReport("Constraint Difference Explanations", results, "constraint"),
    "recognition-difference-explanations.md": buildLayerReport("Recognition Difference Explanations", results, "recognition"),
    "domain-leakage-impact.md": buildLeakageImpact(results),
    "compression-elaboration-report.md": buildCompressionReport(results),
    "human-review-priority.md": buildReviewPriorityReport(results),
    "explainability-observation-ledger.md": buildObservationLedger(results),
    "edr-explainability-input.md": buildEdrInput(results),
  };

  const experimentSpecificName = config.experiment_id === "EXP-001"
    ? "topology-perturbation-explainability.md"
    : config.experiment_id === "EXP-002"
      ? "cross-representation-explainability.md"
      : "isomorphic-procedure-explainability.md";
  outputs[experimentSpecificName] = buildExperimentSpecific(results);

  await Promise.all(Object.entries(outputs).map(([name, content]) => writeText(path.join(results.output_root, name), content)));
}

function flattenDifferences(results, predicate = () => true) {
  return results.pairwise_records.flatMap((record) =>
    record.difference_records
      .filter(predicate)
      .map((difference) => ({ record, difference })));
}

function buildDifferenceSummary(results) {
  return [
    "# Difference Summary",
    "",
    `Explainability Version: ${results.run_manifest.explainability_version}`,
    `Official Comparator Version: ${results.run_manifest.official_comparator_version}`,
    `Source Run ID: ${results.run_manifest.source_run_id}`,
    "",
    `- Pairwise comparisons: ${results.run_manifest.pairwise_comparison_count}`,
    `- Difference count: ${results.run_manifest.difference_count}`,
    `- High-priority items: ${results.run_manifest.high_priority_count}`,
    `- Blocking items: ${results.run_manifest.blocking_count}`,
    "",
    "## Main Findings",
    "",
    ...results.summary_points.map((line) => `- ${line}`),
    "",
  ].join("\n");
}

function buildLayerReport(title, results, layer) {
  const rows = flattenDifferences(results, (difference) => difference.layer === layer)
    .map(({ record, difference }) =>
      `| ${record.scope} | ${difference.field} | ${difference.difference_type} | ${difference.significance} | ${difference.backbone_impact} | ${difference.explanation} |`)
    .join("\n");
  return [
    `# ${title}`,
    "",
    "| Scope | Field | Difference Type | Significance | Backbone Impact | Explanation |",
    "|---|---|---|---|---|---|",
    rows || "| none | none | none | none | none | No differences of this layer were recorded. |",
    "",
  ].join("\n");
}

function buildFieldReport(title, results, field) {
  const rows = flattenDifferences(results, (difference) => difference.field === field)
    .map(({ record, difference }) =>
      `| ${record.scope} | ${difference.difference_type} | ${difference.significance} | ${difference.explanation} |`)
    .join("\n");
  return [
    `# ${title}`,
    "",
    "| Scope | Difference Type | Significance | Explanation |",
    "|---|---|---|---|",
    rows || "| none | none | none | No field-specific differences were recorded. |",
    "",
  ].join("\n");
}

function buildLeakageImpact(results) {
  const rows = flattenDifferences(results, (difference) => difference.difference_type.includes("recognition") || difference.difference_type.includes("terminology"))
    .map(({ record, difference }) => {
      const impact = difference.backbone_impact === "none" ? "no_observed_structural_import" : difference.backbone_impact === "material" ? "likely_structural_import" : "possible_structural_import";
      return `| ${record.scope} | ${difference.difference_type} | ${impact} | ${difference.explanation} |`;
    }).join("\n");
  return [
    "# Domain Leakage Impact",
    "",
    "| Scope | Difference Type | Impact | Notes |",
    "|---|---|---|---|",
    rows || "| none | none | no_observed_structural_import | No explainability-level leakage differences were recorded. |",
    "",
    "Term presence alone does not establish structural import.",
    "",
  ].join("\n");
}

function buildCompressionReport(results) {
  const rows = flattenDifferences(results, (difference) => difference.compression_state && difference.compression_state !== "equivalent_same_granularity")
    .map(({ record, difference }) =>
      `| ${record.scope} | ${difference.field} | ${difference.compression_state} | ${difference.explanation} |`)
    .join("\n");
  return [
    "# Compression And Elaboration Report",
    "",
    "| Scope | Field | Relationship | Explanation |",
    "|---|---|---|---|",
    rows || "| none | none | equivalent_same_granularity | No compression or elaboration differences required explanation. |",
    "",
  ].join("\n");
}

function buildReviewPriorityReport(results) {
  const rows = results.pairwise_records
    .map((record) => `| ${record.scope} | ${record.human_review_priority} | ${record.summary.maximum_significance} | ${record.summary.difference_count} |`)
    .join("\n");
  return [
    "# Human Review Priority",
    "",
    "| Scope | Priority | Maximum Significance | Difference Count |",
    "|---|---|---|---:|",
    rows,
    "",
  ].join("\n");
}

function buildObservationLedger(results) {
  const rows = results.summary_points.map((line, index) => `| EXPL-${String(index + 1).padStart(3, "0")} | ${line} | explainability | medium |`).join("\n");
  return [
    "# Explainability Observation Ledger",
    "",
    "| Observation ID | Observation | Source | Confidence |",
    "|---|---|---|---|",
    rows,
    "",
  ].join("\n");
}

function buildEdrInput(results) {
  const highest = results.pairwise_records.filter((record) => ["high", "blocking"].includes(record.human_review_priority));
  return [
    "# EDR Explainability Input",
    "",
    "## Highest-Priority Differences",
    "",
    ...(highest.length
      ? highest.map((record) => `- ${record.scope}: ${record.summary.maximum_significance} significance; ${record.summary.difference_count} differences.`)
      : ["- None recorded."]),
    "",
    "## Low-Significance Differences",
    "",
    ...results.pairwise_records.filter((record) => record.human_review_priority === "low").map((record) => `- ${record.scope}`),
    "",
    "## Recognition / Structure Relationship",
    "",
    ...flattenDifferences(results, (difference) => difference.layer === "recognition").map(({ record, difference }) => `- ${record.scope}: ${difference.explanation}`),
    "",
  ].join("\n");
}

function buildExperimentSpecific(results) {
  return [
    `# ${results.experiment_title} Explainability`,
    "",
    ...results.summary_points.map((line) => `- ${line}`),
    "",
    "## What This Does Not Establish",
    "",
    "- It does not change Comparator v3.1 scoring.",
    "- It does not validate any hypothesis.",
    "- It does not replace human review.",
    "",
  ].join("\n");
}
