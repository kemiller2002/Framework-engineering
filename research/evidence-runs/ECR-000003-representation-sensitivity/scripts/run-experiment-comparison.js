import path from "node:path";
import { spawnSync } from "node:child_process";
import { exists, latestInputTimestamp, mtimeMs, readJson, writeJson, writeText, relativeFrom } from "./utilities.js";

export async function runExperimentComparison(context, experiment, datasetInfo, logger) {
  const matching = datasetInfo.experiments.find((item) => item.experiment === experiment.id);
  if (!matching || matching.status === "BLOCKED") {
    return {
      experiment: experiment.id,
      status: "blocked",
      reason: "Dataset not ready for comparison.",
      generated: [],
      evidenceReady: false
    };
  }

  if (context.options.dryRun) {
    return {
      experiment: experiment.id,
      status: "skipped",
      reason: "Dry run only.",
      generated: [],
      evidenceReady: false
    };
  }

  const command = "npm run compare:v3.1";
  const startedAt = new Date().toISOString();
  logger.log(`comparator command: ${command}`);
  logger.log(`comparator cwd: ${experiment.root}`);
  const result = spawnSync("npm", ["run", "compare:v3.1"], {
    cwd: experiment.root,
    encoding: "utf8",
  });
  const completedAt = new Date().toISOString();
  logger.log(`comparator exit code: ${result.status ?? 1}`);
  if (result.stdout) logger.log(`comparator stdout: ${truncate(result.stdout)}`);
  if (result.stderr) logger.log(`comparator stderr: ${truncate(result.stderr)}`);
  if (result.status !== 0) {
    return {
      experiment: experiment.id,
      status: "failed",
      reason: "Comparator subprocess failed.",
      generated: [],
      evidenceReady: false,
      command,
      cwd: experiment.root,
      exitCode: result.status ?? 1,
      startedAt,
      completedAt
    };
  }

  await generateAdapterReports(experiment);
  const verification = await verifyComparatorOutputs(context, experiment);
  const generated = verification.generated;
  logger.log(`generated reports: ${generated.join(", ") || "none"}`);
  return {
    experiment: experiment.id,
    status: verification.ok ? "generated" : "failed",
    reason: verification.ok ? "" : verification.issues.join("; "),
    generated,
    evidenceReady: verification.ok,
    runId: verification.runId,
    command,
    cwd: experiment.root,
    exitCode: result.status ?? 0,
    startedAt,
    completedAt,
    issues: verification.issues
  };
}

async function generateAdapterReports(experiment) {
  const outputDir = experiment.outputRoot;
  const rawPath = path.join(outputDir, "raw-comparison-data.json");
  if (!(await exists(rawPath))) {
    return;
  }
  const raw = await readJson(rawPath);
  const runState = raw.run_state || {};
  if (experiment.id === "EXP-001") {
    await writeText(path.join(outputDir, "exp-001-comparison-summary.md"), buildComparisonSummary(experiment, raw));
    await writeText(path.join(outputDir, "structural-backbone-report.md"), buildBackboneReport(experiment, raw));
    await writeText(path.join(outputDir, "structural-field-variance-report.md"), buildStructuralVarianceReport(raw));
    await writeText(path.join(outputDir, "constraint-concept-report.md"), buildConstraintConceptReport(raw));
    await writeText(path.join(outputDir, "representation-compliance-report.md"), buildRepresentationComplianceReport(raw));
    await writeText(path.join(outputDir, "representation-review-fields.md"), buildRepresentationReviewFields(runState));
  } else if (experiment.id === "EXP-002") {
    await writeText(path.join(outputDir, "exp-002-comparison-summary.md"), buildComparisonSummary(experiment, raw));
    await writeText(path.join(outputDir, "cross-representation-backbone-report.md"), buildBackboneReport(experiment, raw));
    await writeText(path.join(outputDir, "representation-format-effects.md"), buildRepresentationEffectsReport(raw));
    await writeText(path.join(outputDir, "constraint-concept-report.md"), buildConstraintConceptReport(raw));
    await writeText(path.join(outputDir, "representation-compliance-report.md"), buildRepresentationComplianceReport(raw));
    await writeText(path.join(outputDir, "provider-behavior-report.md"), buildProviderBehaviorReport(raw));
  } else if (experiment.id === "EXP-003") {
    await writeText(path.join(outputDir, "exp-003-comparison-summary.md"), buildComparisonSummary(experiment, raw));
    await writeText(path.join(outputDir, "isomorphic-backbone-report.md"), buildBackboneReport(experiment, raw));
    await writeText(path.join(outputDir, "domain-effect-report.md"), buildDomainEffectReport(raw));
    await writeText(path.join(outputDir, "recognition-by-domain-report.md"), buildRecognitionByDomain(raw));
    await writeText(path.join(outputDir, "constraint-concept-report.md"), buildConstraintConceptReport(raw));
    await writeText(path.join(outputDir, "representation-compliance-report.md"), buildRepresentationComplianceReport(raw));
    await writeText(path.join(outputDir, "provider-behavior-report.md"), buildProviderBehaviorReport(raw));
  }
}

async function verifyComparatorOutputs(context, experiment) {
  const outputDir = experiment.outputRoot;
  const rawPath = path.join(outputDir, "raw-comparison-data.json");
  const issues = [];
  const generated = [];
  const required = experiment.requiredReports.map((name) => path.join(outputDir, name));
  for (const filePath of required) {
    if (!(await exists(filePath))) {
      issues.push(`missing output ${path.basename(filePath)}`);
    } else {
      generated.push(relativeFrom(context.ecrRoot, filePath));
    }
  }
  if (!(await exists(rawPath))) {
    return { ok: false, issues, generated, runId: "" };
  }
  const raw = await readJson(rawPath);
  const runManifestPath = path.join(outputDir, "run-manifest.json");
  const runManifest = {
    experiment: experiment.id,
    run_id: raw.run_state?.run_id || "",
    comparator_version: raw.run_state?.comparator_version || "",
    ontology_version: "research/tools/comparison-engine/ontology",
    generated_at: raw.run_state?.generated_at || "",
    primary_record_count: raw.primary_record_count || raw.recognition_rows?.length || 0,
    data_quality_count: raw.data_quality?.length || 0
  };
  await writeJson(runManifestPath, runManifest);
  if (!generated.includes(relativeFrom(context.ecrRoot, runManifestPath))) {
    generated.unshift(relativeFrom(context.ecrRoot, runManifestPath));
  }
  if (runManifest.comparator_version !== "3.1.0") {
    issues.push(`unexpected comparator version ${runManifest.comparator_version}`);
  }
  const latestInput = await latestInputTimestamp(experiment);
  const outputTimestamp = await mtimeMs(rawPath);
  if (outputTimestamp < latestInput) {
    issues.push("stale comparator output");
  }
  return { ok: issues.length === 0, issues, generated, runId: runManifest.run_id };
}

function truncate(text) {
  return text.length > 2000 ? `${text.slice(0, 2000)}...[truncated]` : text;
}

function buildComparisonSummary(experiment, raw) {
  return [
    `# ${experiment.id} Comparison Summary`,
    "",
    `Run ID: ${raw.run_state?.run_id || ""}`,
    `Comparator Version: ${raw.run_state?.comparator_version || ""}`,
    "",
    `Primary record count: ${raw.primary_record_count || 0}`,
    `Structural backbone: ${raw.structural?.backbone_profile || "unavailable"}`,
    `Primitive stability: ${raw.primitives?.primitive_sequence?.category || "unavailable"}`,
    `Constraint concept result: ${raw.constraints?.conceptual?.category || "unavailable"}`,
    `Representation compliance: ${raw.representation?.procedural_ast_presence?.category || "unavailable"}`
  ].join("\n");
}

function buildBackboneReport(experiment, raw) {
  return [
    `# ${experiment.id} Backbone Report`,
    "",
    `Run ID: ${raw.run_state?.run_id || ""}`,
    `Comparator Version: ${raw.run_state?.comparator_version || ""}`,
    "",
    `Backbone profile: ${raw.structural?.backbone_profile || "unavailable"}`,
    `Literal profile: ${raw.structural?.literal_profile || "unavailable"}`,
    `Conceptual profile: ${raw.structural?.conceptual_profile || "unavailable"}`,
    `Dimensional profile: ${raw.structural?.dimensional_profile || "unavailable"}`,
    "",
    "Provider comparisons:",
    "",
    ...((raw.structural?.providerComparisons || []).map((item) => `- ${item.scope}: backbone=${item.backbone}, literal=${item.literal}, conceptual=${item.conceptual}, dimensional=${item.dimensional}`))
  ].join("\n");
}

function buildStructuralVarianceReport(raw) {
  return [
    "# Structural Field Variance Report",
    "",
    `Run ID: ${raw.run_state?.run_id || ""}`,
    "",
    ...((raw.structural?.providerComparisons || []).map((item) => `- ${item.scope}: literal=${item.literal}; dimensional=${item.dimensional}`))
  ].join("\n");
}

function buildConstraintConceptReport(raw) {
  return [
    "# Constraint Concept Report",
    "",
    `Run ID: ${raw.run_state?.run_id || ""}`,
    "",
    `Conceptual cross-field agreement: ${raw.constraints?.conceptual?.category || "unavailable"}`,
    `Dimensional conceptual agreement: ${raw.constraints?.dimensional?.category || "unavailable"}`,
    `Field-placement sensitivity: ${raw.constraints?.field_placement_sensitivity || "unavailable"}`
  ].join("\n");
}

function buildRepresentationComplianceReport(raw) {
  return [
    "# Representation Compliance Report",
    "",
    `Run ID: ${raw.run_state?.run_id || ""}`,
    "",
    `procedural_ast_presence: ${raw.representation?.procedural_ast_presence?.category || "unavailable"}`,
    `natural_language_summary: ${raw.representation?.natural_language_summary?.category || "unavailable"}`,
    `canonical_summary: ${raw.representation?.canonical_summary?.category || "unavailable"}`,
    `ambiguities: ${raw.representation?.ambiguities?.category || "unavailable"}`,
    `notes: ${raw.representation?.notes?.category || "unavailable"}`
  ].join("\n");
}

function buildRepresentationReviewFields(runState) {
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
    `Run ID: ${runState.run_id || ""}`
  ].join("\n");
}

function buildRepresentationEffectsReport(raw) {
  return [
    "# Representation Format Effects",
    "",
    `Run ID: ${raw.run_state?.run_id || ""}`,
    "",
    ...((raw.structural?.providerComparisons || []).map((item) => `- ${item.scope}: backbone=${item.backbone}; literal=${item.literal}`))
  ].join("\n");
}

function buildProviderBehaviorReport(raw) {
  return [
    "# Provider Behavior Report",
    "",
    `Run ID: ${raw.run_state?.run_id || ""}`,
    "",
    ...((raw.recognition_rows || []).map((row) => `- ${row.provider} ${row.packet_id}: ${row.recognition_value}`))
  ].join("\n");
}

function buildDomainEffectReport(raw) {
  return [
    "# Domain Effect Report",
    "",
    `Run ID: ${raw.run_state?.run_id || ""}`,
    "",
    `Structural backbone profile: ${raw.structural?.backbone_profile || "unavailable"}`,
    `Recognition rows: ${(raw.recognition_rows || []).length}`
  ].join("\n");
}

function buildRecognitionByDomain(raw) {
  return [
    "# Recognition By Domain Report",
    "",
    `Run ID: ${raw.run_state?.run_id || ""}`,
    "",
    ...((raw.recognition_rows || []).map((row) => `- ${row.packet_id} ${row.provider}: ${row.recognition_value}`))
  ].join("\n");
}
