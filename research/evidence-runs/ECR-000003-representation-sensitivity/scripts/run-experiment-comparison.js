import path from "node:path";
import { runComparisonEngine } from "../../../tools/comparison-engine/src/index.js";
import { readJson, writeJson, writeText, relativeFrom } from "./utilities.js";

export async function runExperimentComparison(context, experiment, datasetInfo, logger) {
  const matching = datasetInfo.experiments.find((item) => item.experiment === experiment.id);
  if (!matching || matching.missing > 0 || matching.conflicts > 0 || matching.unsafeMalformed > 0) {
    return {
      experiment: experiment.id,
      status: "blocked",
      reason: "Dataset not ready for comparison.",
      generated: []
    };
  }

  if (context.options.dryRun) {
    return {
      experiment: experiment.id,
      status: "skipped",
      reason: "Dry run only.",
      generated: []
    };
  }

  logger.log(`running comparator for ${experiment.id} using ${relativeFrom(context.ecrRoot, experiment.configPath)}`);
  const results = await runComparisonEngine(experiment.configPath);
  const generated = await postProcessExperimentOutputs(context, experiment, results);
  return {
    experiment: experiment.id,
    status: "generated",
    reason: "",
    generated,
    runId: results.runState.run_id
  };
}

async function postProcessExperimentOutputs(context, experiment, results) {
  const generated = [];
  const outputDir = experiment.outputRoot;
  const rawPath = path.join(outputDir, "raw-comparison-data.json");
  const runManifest = {
    experiment: experiment.id,
    run_id: results.runState.run_id,
    comparator_version: results.runState.comparator_version,
    ontology_version: "research/tools/comparison-engine/ontology",
    generated_at: results.runState.generated_at,
    primary_record_count: results.primaryRecords.length,
    data_quality_count: results.dataQuality.length
  };
  await writeJson(path.join(outputDir, "run-manifest.json"), runManifest);
  generated.push(path.join(outputDir, "run-manifest.json"));
  await readJson(rawPath);

  if (experiment.id === "EXP-001") {
    await writeText(path.join(outputDir, "structural-backbone-report.md"), buildBackboneReport(experiment, results));
    await writeText(path.join(outputDir, "structural-field-variance-report.md"), buildStructuralVarianceReport(results));
    await writeText(path.join(outputDir, "constraint-concept-report.md"), buildConstraintConceptReport(results));
    await writeText(path.join(outputDir, "representation-compliance-report.md"), buildRepresentationComplianceReport(results));
    await writeText(path.join(outputDir, "representation-review-fields.md"), buildRepresentationReviewFields(results));
    generated.push(
      path.join(outputDir, "structural-backbone-report.md"),
      path.join(outputDir, "structural-field-variance-report.md"),
      path.join(outputDir, "constraint-concept-report.md"),
      path.join(outputDir, "representation-compliance-report.md"),
      path.join(outputDir, "representation-review-fields.md")
    );
  } else if (experiment.id === "EXP-002") {
    await writeText(path.join(outputDir, "cross-representation-backbone-report.md"), buildBackboneReport(experiment, results));
    await writeText(path.join(outputDir, "representation-format-effects.md"), buildRepresentationEffectsReport(results));
    await writeText(path.join(outputDir, "constraint-concept-report.md"), buildConstraintConceptReport(results));
    await writeText(path.join(outputDir, "representation-compliance-report.md"), buildRepresentationComplianceReport(results));
    await writeText(path.join(outputDir, "provider-behavior-report.md"), buildProviderBehaviorReport(results));
    generated.push(
      path.join(outputDir, "cross-representation-backbone-report.md"),
      path.join(outputDir, "representation-format-effects.md"),
      path.join(outputDir, "constraint-concept-report.md"),
      path.join(outputDir, "representation-compliance-report.md"),
      path.join(outputDir, "provider-behavior-report.md")
    );
  } else if (experiment.id === "EXP-003") {
    await writeText(path.join(outputDir, "isomorphic-backbone-report.md"), buildBackboneReport(experiment, results));
    await writeText(path.join(outputDir, "domain-effect-report.md"), buildDomainEffectReport(results));
    await writeText(path.join(outputDir, "recognition-by-domain-report.md"), buildRecognitionByDomain(results));
    await writeText(path.join(outputDir, "constraint-concept-report.md"), buildConstraintConceptReport(results));
    await writeText(path.join(outputDir, "representation-compliance-report.md"), buildRepresentationComplianceReport(results));
    await writeText(path.join(outputDir, "provider-behavior-report.md"), buildProviderBehaviorReport(results));
    generated.push(
      path.join(outputDir, "isomorphic-backbone-report.md"),
      path.join(outputDir, "domain-effect-report.md"),
      path.join(outputDir, "recognition-by-domain-report.md"),
      path.join(outputDir, "constraint-concept-report.md"),
      path.join(outputDir, "representation-compliance-report.md"),
      path.join(outputDir, "provider-behavior-report.md")
    );
  }

  return generated.map((filePath) => relativeFrom(context.ecrRoot, filePath));
}

function buildBackboneReport(experiment, results) {
  return [
    `# ${experiment.id} Backbone Report`,
    "",
    `Run ID: ${results.runState.run_id}`,
    `Comparator Version: ${results.runState.comparator_version}`,
    "",
    `Backbone profile: ${results.structural.backbone_profile}`,
    `Literal profile: ${results.structural.literal_profile}`,
    `Conceptual profile: ${results.structural.conceptual_profile}`,
    `Dimensional profile: ${results.structural.dimensional_profile}`,
    "",
    "Provider comparisons:",
    "",
    ...results.structural.providerComparisons.map((item) => `- ${item.scope}: backbone=${item.backbone}, literal=${item.literal}, conceptual=${item.conceptual}, dimensional=${item.dimensional}`)
  ].join("\n");
}

function buildStructuralVarianceReport(results) {
  return [
    "# Structural Field Variance Report",
    "",
    `Run ID: ${results.runState.run_id}`,
    "",
    ...results.largestDisagreements.map((line) => `- ${line}`)
  ].join("\n");
}

function buildConstraintConceptReport(results) {
  return [
    "# Constraint Concept Report",
    "",
    `Run ID: ${results.runState.run_id}`,
    "",
    `Conceptual cross-field agreement: ${results.constraints.conceptual.category}`,
    `Dimensional conceptual agreement: ${results.constraints.dimensional.category}`,
    `Field-placement sensitivity: ${results.constraints.field_placement_sensitivity}`
  ].join("\n");
}

function buildRepresentationComplianceReport(results) {
  return [
    "# Representation Compliance Report",
    "",
    `Run ID: ${results.runState.run_id}`,
    "",
    `procedural_ast_presence: ${results.representation.procedural_ast_presence.category}`,
    `natural_language_summary: ${results.representation.natural_language_summary.category}`,
    `canonical_summary: ${results.representation.canonical_summary.category}`,
    `ambiguities: ${results.representation.ambiguities.category}`,
    `notes: ${results.representation.notes.category}`
  ].join("\n");
}

function buildRepresentationReviewFields(results) {
  return [
    "# Representation Review Fields",
    "",
    "These fields remain informational rather than score-bearing:",
    "",
    "- natural_language_summary",
    "- canonical_summary",
    "- ambiguities",
    "- notes",
    "",
    `Run ID: ${results.runState.run_id}`
  ].join("\n");
}

function buildRepresentationEffectsReport(results) {
  return [
    "# Representation Format Effects",
    "",
    `Run ID: ${results.runState.run_id}`,
    "",
    ...results.providerNotes.map((note) => `- ${note}`),
    ...results.largestDisagreements.map((note) => `- ${note}`)
  ].join("\n");
}

function buildProviderBehaviorReport(results) {
  return [
    "# Provider Behavior Report",
    "",
    `Run ID: ${results.runState.run_id}`,
    "",
    ...results.recognitionSummary.map((entry) => `- ${entry.provider}: ${entry.pattern}`),
    ...results.providerNotes.map((note) => `- ${note}`)
  ].join("\n");
}

function buildDomainEffectReport(results) {
  return [
    "# Domain Effect Report",
    "",
    `Run ID: ${results.runState.run_id}`,
    "",
    ...results.largestDisagreements.map((note) => `- ${note}`)
  ].join("\n");
}

function buildRecognitionByDomain(results) {
  return [
    "# Recognition By Domain Report",
    "",
    `Run ID: ${results.runState.run_id}`,
    "",
    ...results.recognitionRows.map((row) => `- ${row.packet_id} ${row.provider}: ${row.recognition_value}`)
  ].join("\n");
}
