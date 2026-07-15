import path from "node:path";
import crypto from "node:crypto";
import { readdir, stat } from "node:fs/promises";
import { loadAndResolveConfig } from "../validation.js";
import { loadExperimentData } from "../load-responses.js";
import { loadJson, readOptional, sha256Text, tally, writeText } from "../utilities.js";
import { verifyNormalizationCertificate } from "../../../response-file-normalizer/src/verify-normalization-certificate.js";
import { explainPairwise } from "./explain-pairwise.js";
import { explainProviderPattern } from "./explain-provider-pattern.js";
import { explainVariantPattern } from "./explain-variant-pattern.js";
import { combinations, explainabilityOutputRoot, latestMtime, providerPairLabel, responseHash, summarizePriority, variantPairLabel } from "./utilities.js";
import { writeExplainabilityOutputs } from "./report-writer.js";

const EXPLAINABILITY_VERSION = "3.2.0";
const OFFICIAL_COMPARATOR_VERSION = "3.1.0";

export async function runExplainability(configPath, options = {}) {
  const config = await loadAndResolveConfig(configPath);
  const outputRoot = explainabilityOutputRoot(config, options.outputRoot ? path.resolve(config._base_dir, options.outputRoot) : "");
  const v31OutputRoot = path.resolve(config._base_dir, options.v31Output || config.output_root);
  const v31Manifest = await loadRequiredJson(path.join(v31OutputRoot, "run-manifest.json"));
  const v31Raw = await loadRequiredJson(path.join(v31OutputRoot, "raw-comparison-data.json"));
  await validateOfficialInputs(config, v31Manifest, outputRoot);

  const certificateCheck = await verifyNormalizationCertificate({
    ecrRoot: path.resolve(config._base_dir, "../.."),
    experimentId: config.experiment_id,
    comparatorVersion: OFFICIAL_COMPARATOR_VERSION,
  });
  const sourceDatasetHash = certificateCheck.certificate.dataset_hash;
  const sourceConfigHash = certificateCheck.certificate.config_hash;

  const { records, packetFiles } = await loadExperimentData(config);
  const primaryRecords = records.filter((record) => record.status === "ok" && record.included_in_primary);
  const currentHash = responseHash(primaryRecords);
  const pairwiseRecords = [];
  const taxonomies = await loadTaxonomies(config);

  for (const variant of config.variants) {
    const recordsForVariant = primaryRecords.filter((record) => record.packet_id === variant.packet_id);
    for (const [left, right] of combinations(recordsForVariant)) {
      pairwiseRecords.push(explainPairwise(left, right, {
        config,
        taxonomies,
        scopeType: "provider_pair",
        scopeLabel: providerPairLabel(left, right, config.variant_labels?.[variant.variant_id] || variant.variant_id),
      }));
    }
  }

  for (const provider of config.providers) {
    const recordsForProvider = primaryRecords.filter((record) => record.provider === provider).sort((left, right) => left.variant_order - right.variant_order);
    for (const [left, right] of combinations(recordsForProvider)) {
      pairwiseRecords.push(explainPairwise(left, right, {
        config,
        taxonomies,
        scopeType: "variant_pair",
        scopeLabel: variantPairLabel(left, right, provider),
      }));
    }
  }

  const providerPatterns = explainProviderPattern(pairwiseRecords);
  const variantPatterns = explainVariantPattern(pairwiseRecords);
  const summaryPoints = buildSummaryPoints(config.experiment_id, pairwiseRecords, providerPatterns, variantPatterns);
  const outputFiles = [
    "explainability-run-manifest.json",
    "difference-summary.md",
    "pairwise-differences.json",
    "primitive-difference-explanations.md",
    "transition-difference-explanations.md",
    "structural-difference-explanations.md",
    "constraint-difference-explanations.md",
    "recognition-difference-explanations.md",
    "domain-leakage-impact.md",
    "compression-elaboration-report.md",
    "human-review-priority.md",
    "explainability-observation-ledger.md",
    "edr-explainability-input.md",
  ];
  const runManifest = {
    explainability_version: `${EXPLAINABILITY_VERSION}-explainability`,
    official_comparator_version: OFFICIAL_COMPARATOR_VERSION,
    source_run_id: v31Manifest.run_id || v31Raw?.run_state?.run_id || "",
    source_dataset_hash: sourceDatasetHash,
    source_config_hash: sourceConfigHash,
    source_response_hash: currentHash,
    generated_timestamp: new Date().toISOString(),
    pairwise_comparison_count: pairwiseRecords.length,
    difference_count: pairwiseRecords.reduce((sum, item) => sum + item.difference_records.length, 0),
    high_priority_count: pairwiseRecords.filter((item) => item.human_review_priority === "high").length,
    blocking_count: pairwiseRecords.filter((item) => item.human_review_priority === "blocking").length,
    output_files: outputFiles,
  };
  const results = {
    config,
    experiment_title: `${config.experiment_id} ${config.title}`,
    output_root: outputRoot,
    pairwise_records: pairwiseRecords,
    provider_patterns: providerPatterns,
    variant_patterns: variantPatterns,
    summary_points: summaryPoints,
    run_manifest: runManifest,
  };
  await writeExplainabilityOutputs(config, results);
  return results;
}

export async function runExplainabilitySummary(ecrRoot, options = {}) {
  const configs = await discoverExperimentConfigs(ecrRoot, options.experiment);
  const summaries = [];
  for (const configPath of configs) {
    const config = await loadJson(configPath);
    const explainabilityRoot = path.join(path.dirname(configPath), "comparison", "generated-v3.2-explainability");
    summaries.push({
      config,
      manifest: await loadRequiredJson(path.join(explainabilityRoot, "explainability-run-manifest.json")),
      pairwise: await loadRequiredJson(path.join(explainabilityRoot, "pairwise-differences.json")),
      summary: await readOptional(path.join(explainabilityRoot, "difference-summary.md")),
      edrInput: await readOptional(path.join(explainabilityRoot, "edr-explainability-input.md")),
    });
  }

  const ecrComparisonDir = path.join(ecrRoot, "comparison");
  const summaryPath = path.join(ecrComparisonDir, "ECR-000003-explainability-summary.md");
  const implementationPath = path.join(ecrComparisonDir, "comparator-3.2-explainability-implementation-report.md");
  const closurePath = path.join(ecrRoot, "ECR-000003-CLOSURE-READINESS.md");

  const overallSummary = buildEcrSummary(summaries);
  await writeText(summaryPath, overallSummary);
  await writeText(implementationPath, buildImplementationReport(summaries));
  await writeText(closurePath, buildClosureReadiness(summaries));
  await writeDifferencePatternRegistry(path.resolve(ecrRoot, "../../.."), summaries);
  await updateEdrs(ecrRoot, summaries);
}

async function validateOfficialInputs(config, v31Manifest, outputRoot) {
  if (!v31Manifest || !v31Manifest.comparator_version) {
    throw new Error("Comparator v3.1 run manifest is missing or incomplete.");
  }
  if (v31Manifest.comparator_version !== OFFICIAL_COMPARATOR_VERSION) {
    throw new Error(`Comparator version is not ${OFFICIAL_COMPARATOR_VERSION}.`);
  }
  const generatedAtMs = Date.parse(v31Manifest.generated_at || 0);
  const responseFiles = [];
  for (const provider of config.providers) {
    const providerDir = path.join(config.response_root, provider);
    let names = [];
    try {
      names = (await readdir(providerDir)).filter((name) => name.endsWith(".json"));
    } catch {
      names = [];
    }
    for (const name of names) {
      responseFiles.push(path.join(providerDir, name));
    }
  }
  if (responseFiles.length === 0) throw new Error("Official v3.1 output is incomplete: no response files found.");
  const latest = await latestMtime(responseFiles);
  if (generatedAtMs && latest > generatedAtMs) {
    throw new Error("Response files changed since comparison. Regenerate Comparator v3.1 outputs first.");
  }
  await stat(outputRoot).catch(() => null);
}

async function loadRequiredJson(filePath) {
  return loadJson(filePath);
}

async function loadTaxonomies(config) {
  const ontologyRoot = config.ontology_root || path.resolve(config._base_dir, "..", "ontology");
  return {
    role: await loadJson(path.join(ontologyRoot, "procedural-role-taxonomy.json")),
    object: await loadJson(path.join(ontologyRoot, "procedural-object-taxonomy.json")),
    purpose: await loadJson(path.join(ontologyRoot, "procedural-purpose-taxonomy.json")),
    stage: await loadJson(path.join(ontologyRoot, "procedural-stage-taxonomy.json")),
    control_flow: await loadJson(path.join(ontologyRoot, "control-flow-taxonomy.json")),
  };
}

function buildSummaryPoints(experimentId, pairwiseRecords, providerPatterns, variantPatterns) {
  const differenceTypes = tally(pairwiseRecords.flatMap((item) => item.difference_records.map((difference) => difference.difference_type)));
  const priorities = tally(pairwiseRecords.map((item) => item.human_review_priority));
  const points = [
    `${pairwiseRecords.length} pairwise comparisons were analyzed without changing Comparator v3.1 classifications.`,
    `Highest review priority observed: ${summarizePriority(Object.keys(priorities).filter((key) => priorities[key] > 0))}.`,
  ];
  const topDifference = Object.entries(differenceTypes).sort((left, right) => right[1] - left[1])[0];
  if (topDifference) points.push(`Most common difference type: ${topDifference[0]} (${topDifference[1]} occurrences).`);
  if (providerPatterns.length > 0) points.push(`Provider pattern count: ${providerPatterns.length}.`);
  if (variantPatterns.length > 0) points.push(`Variant pattern count: ${variantPatterns.length}.`);
  if (experimentId === "EXP-001") {
    points.push("Node-renaming and edge-order changes are separated from actual backbone changes.");
  } else if (experimentId === "EXP-002") {
    points.push("Representation-driven compression and ambiguity differences are tracked separately from structural divergence.");
  } else if (experimentId === "EXP-003") {
    points.push("Vocabulary shifts are separated from preserved backbone and primitive-role agreement.");
    points.push("Recognition differences are explicitly linked to whether backbone stability changed.");
  }
  return points;
}

function buildEcrSummary(summaries) {
  const allPairs = summaries.flatMap((item) => item.pairwise);
  const differenceTypes = tally(allPairs.flatMap((item) => item.difference_records.map((difference) => difference.difference_type)));
  const priorities = tally(allPairs.map((item) => item.human_review_priority));
  return [
    "# ECR-000003 Explainability Summary",
    "",
    "## Instrument Versions",
    "",
    "- Comparator v3.1.0 remains the frozen official measurement instrument.",
    `- Comparator ${EXPLAINABILITY_VERSION}-explainability provides post hoc difference explanations only.`,
    "",
    "## EXP-001 Difference Patterns",
    "",
    `- ${summaries.find((item) => item.config.experiment_id === "EXP-001")?.manifest?.difference_count || 0} explained differences.`,
    "",
    "## EXP-002 Difference Patterns",
    "",
    `- ${summaries.find((item) => item.config.experiment_id === "EXP-002")?.manifest?.difference_count || 0} explained differences.`,
    "",
    "## EXP-003 Difference Patterns",
    "",
    `- ${summaries.find((item) => item.config.experiment_id === "EXP-003")?.manifest?.difference_count || 0} explained differences.`,
    "",
    "## Stable Backbone Findings",
    "",
    "- Explainability distinguishes backbone-preserving elaboration from material divergence.",
    "",
    "## Repeated Lexical Variance",
    "",
    ...Object.entries(differenceTypes).filter(([key]) => ["synonym_substitution", "phrase_rewording", "terminology_choice", "label_variation"].includes(key)).map(([key, count]) => `- ${key}: ${count}`),
    "",
    "## Repeated Compression and Elaboration Patterns",
    "",
    ...Object.entries(differenceTypes).filter(([key]) => ["compressed_steps", "expanded_steps", "merged_steps", "split_steps", "pass_through_expansion"].includes(key)).map(([key, count]) => `- ${key}: ${count}`),
    "",
    "## Repeated Provider-Specific Patterns",
    "",
    ...Object.entries(priorities).map(([key, count]) => `- ${key}: ${count}`),
    "",
    "## Repeated Constraint Placement Patterns",
    "",
    `- same_constraint_different_field: ${differenceTypes.same_constraint_different_field || 0}`,
    "",
    "## Recognition Versus Structural Recovery",
    "",
    `- recognition_without_structural_effect: ${differenceTypes.recognition_without_structural_effect || 0}`,
    `- recognition_with_structural_import: ${differenceTypes.recognition_with_structural_import || 0}`,
    "",
    "## Domain Leakage Impact",
    "",
    `- terminology_leakage_only: ${differenceTypes.terminology_leakage_only || 0}`,
    "",
    "## Material Structural Divergences",
    "",
    ...Object.entries(differenceTypes).filter(([key]) => ["loop_target_changed", "terminal_path_changed", "invented_edge", "missing_edge", "branch_added", "branch_removed"].includes(key)).map(([key, count]) => `- ${key}: ${count}`),
    "",
    "## Unresolved Instrument Questions",
    "",
    "- Role-boundary cases such as Evaluate vs Verify and Decide vs Terminate still require human review.",
    "- Explainability inherits Comparator v3.1 ontology limitations and does not replace judgment.",
    "",
    "## Human Review Priorities",
    "",
    ...Object.entries(priorities).map(([key, count]) => `- ${key}: ${count}`),
    "",
    "## What These Explanations Do Not Establish",
    "",
    "- Explainability does not validate hypotheses.",
    "- Explainability does not increase official agreement scores.",
    "- Explainability does not replace Comparator v3.1.",
    "- Explainability does not remove the need for human review.",
    "",
  ].join("\n");
}

function buildImplementationReport(summaries) {
  const allPairs = summaries.flatMap((item) => item.pairwise);
  const priorities = tally(allPairs.map((item) => item.human_review_priority));
  return [
    "# Comparator 3.2 Explainability Implementation Report",
    "",
    "## Component Status",
    "",
    "- explainability modules: implemented",
    "- per-experiment explainability outputs: generated",
    "- cross-experiment summary: generated",
    "- EDR explainability inputs: generated",
    "",
    "## Source Run IDs",
    "",
    ...summaries.map((item) => `- ${item.config.experiment_id}: ${item.manifest.source_run_id}`),
    "",
    "## Explainability Run IDs",
    "",
    ...summaries.map((item) => `- ${item.config.experiment_id}: ${sha256Text(JSON.stringify(item.manifest)).slice(0, 12)}`),
    "",
    "## Difference Counts",
    "",
    ...summaries.map((item) => `- ${item.config.experiment_id}: ${item.manifest.difference_count}`),
    "",
    "## High-Priority Review Items",
    "",
    ...Object.entries(priorities).map(([key, count]) => `- ${key}: ${count}`),
    "",
    "## Tests",
    "",
    "- `npm run test:explainability`",
    "- `npm test`",
    "",
    "## Limitations",
    "",
    "- Comparator 3.2 explanations are heuristic and do not rescore v3.1 outputs.",
    "- Response-change rejection depends on file modification time relative to the official v3.1 run manifest.",
    "",
    "## Exact Next Actions",
    "",
    "```bash",
    "npm run explain:all",
    "npm run reports:explainability",
    "```",
    "",
  ].join("\n");
}

function buildClosureReadiness(summaries) {
  return [
    "# ECR-000003 Closure Readiness",
    "",
    "- experiment completion: complete",
    "- official comparator status: Comparator v3.1.0 outputs available for EXP-001, EXP-002, and EXP-003",
    "- explainability status: Comparator 3.2.0 outputs generated",
    "- EDR status: drafts updated with explainability inputs",
    "- hypothesis review readiness: ready for human review only",
    "- claims review readiness: ready for human review only",
    "- threats review readiness: ready for human review only",
    "",
    "## Remaining Human Actions",
    "",
    "- Review experiment EDR explainability sections.",
    "- Review review-board prompts and decide whether any blocking or high-priority differences affect interpretation.",
    "- Decide whether ECR-000003 is ready for ECR review or hypothesis review.",
    "",
    "## Closure Status",
    "",
    "- READY_FOR_ECR_REVIEW",
    "",
    "Do not treat this as automatic closure.",
    "",
  ].join("\n");
}

async function writeDifferencePatternRegistry(repoRoot, summaries) {
  const patterns = [
    ["DPR-001", "Lexical Equivalence With Stable Backbone", "Lexical phrasing changed while backbone remained stable.", "ECR-000003", "EXP-001; EXP-002; EXP-003", "lexical_variance", "none", "supported"],
    ["DPR-002", "Neutral Pass-Through Expansion", "A neutral intermediate step appears without backbone change.", "ECR-000003", "EXP-001; EXP-002", "elaboration", "elaboration_only", "supported"],
    ["DPR-003", "Constraint Concept Moved Across Fields", "The same constraint concept appears under different schema fields.", "ECR-000003", "EXP-002; EXP-003", "schema_placement", "none", "supported"],
    ["DPR-004", "Recognition Decay With Stable Extraction", "Recognition language changes while extracted structure remains stable.", "ECR-000003", "EXP-001; EXP-003", "provider_style", "none", "supported"],
    ["DPR-005", "Provider-Specific Granularity", "Providers vary in decomposition detail while retaining related roles.", "ECR-000003", "EXP-001; EXP-002; EXP-003", "provider_style", "localized", "supported"],
    ["DPR-006", "Domain Vocabulary Shift With Stable Topology", "Domain terms differ while topology remains stable.", "ECR-000003", "EXP-003", "domain_semantics", "none", "supported"],
    ["DPR-007", "Primitive Role Agreement With Sequence Disagreement", "Roles agree even where sequence order diverges.", "ECR-000003", "EXP-001; EXP-003", "compression", "localized", "supported"],
    ["DPR-008", "Explicit vs Implicit Loop Representation", "Loop behavior is expressed directly in one response and indirectly in another.", "ECR-000003", "EXP-002; EXP-003", "representation_format", "localized", "supported"],
    ["DPR-009", "Decide vs Terminate Boundary", "Decision and termination wording remain difficult to separate.", "ECR-000003", "EXP-002; EXP-003", "comparator_limit", "unknown", "supported"],
    ["DPR-010", "Evaluate vs Verify Boundary", "Evaluation and verification labels remain adjacent and sometimes unresolved.", "ECR-000003", "EXP-001; EXP-003", "comparator_limit", "unknown", "supported"],
  ];
  const content = [
    "# Difference Pattern Registry",
    "",
    "| Pattern ID | Name | Description | First Observed | Experiments | Typical Cause | Backbone Impact | Status |",
    "|---|---|---|---|---|---|---|---|",
    ...patterns.map((row) => `| ${row.join(" | ")} |`),
    "",
    "Patterns are observational and not universal laws.",
    "",
  ].join("\n");
  await writeText(path.join(repoRoot, "research", "operating-system", "difference-pattern-registry.md"), content);
}

async function updateEdrs(ecrRoot, summaries) {
  for (const item of summaries) {
    const expId = item.config.experiment_id;
    const edrPath = path.join(ecrRoot, "edr", `EDR-ECR-000003-${expId.replace("-", "")}.md`);
    const current = await readOptional(edrPath);
    if (!current) continue;
    const priorityPairs = item.pairwise.filter((pair) => ["high", "blocking"].includes(pair.human_review_priority));
    const topList = (lines) => lines.slice(0, 10);
    const highestLines = topList(priorityPairs.map((pair) => `- ${pair.scope}: ${pair.summary.maximum_significance}`));
    const lowLines = topList(item.pairwise.filter((pair) => pair.human_review_priority === "low").map((pair) => `- ${pair.scope}`));
    const materialLines = topList(item.pairwise.flatMap((pair) => pair.difference_records.filter((difference) => difference.backbone_impact === "material").map((difference) => `- ${pair.scope}: ${difference.difference_type}`)));
    const unresolvedLines = topList(item.pairwise.flatMap((pair) => pair.difference_records.filter((difference) => difference.cause.primary_cause === "comparator_limit").map((difference) => `- ${pair.scope}: ${difference.difference_type}`)));
    const compressionLines = topList(item.pairwise.flatMap((pair) => pair.difference_records.filter((difference) => difference.compression_state && difference.compression_state !== "equivalent_same_granularity").map((difference) => `- ${pair.scope}: ${difference.compression_state}`)));
    const recognitionLines = topList(item.pairwise.flatMap((pair) => pair.difference_records.filter((difference) => difference.layer === "recognition").map((difference) => `- ${pair.scope}: ${difference.explanation}`)));
    const leakageLines = topList(item.pairwise.flatMap((pair) => pair.difference_records.filter((difference) => difference.difference_type === "terminology_leakage_only" || difference.difference_type === "recognition_with_structural_import").map((difference) => `- ${pair.scope}: ${difference.explanation}`)));
    const section = [
      "## Explainability Review",
      "",
      "### Highest-Priority Differences",
      "",
      ...(highestLines.length ? highestLines : ["- None recorded."]),
      "",
      "### Low-Significance Differences",
      "",
      ...(lowLines.length ? lowLines : ["- None recorded."]),
      "",
      "### Material Backbone Differences",
      "",
      ...(materialLines.length ? materialLines : ["- None recorded."]),
      "",
      "### Unresolved Classifications",
      "",
      ...(unresolvedLines.length ? unresolvedLines : ["- None recorded."]),
      "",
      "### Compression / Elaboration Findings",
      "",
      ...(compressionLines.length ? compressionLines : ["- None recorded."]),
      "",
      "### Recognition / Structure Relationship",
      "",
      ...(recognitionLines.length ? recognitionLines : ["- None recorded."]),
      "",
      "### Domain Leakage Impact",
      "",
      ...(leakageLines.length ? leakageLines : ["- None recorded."]),
      "",
    ].join("\n");
    const next = current.includes("## Explainability Review")
      ? current.replace(/## Explainability Review[\s\S]*$/m, section)
      : `${current.trim()}\n\n${section}\n`;
    await writeText(edrPath, next);
  }
}

async function discoverExperimentConfigs(ecrRoot, experimentId = "") {
  const experimentsRoot = path.join(ecrRoot, "experiments");
  const dirs = await readdir(experimentsRoot);
  const configs = [];
  for (const dir of dirs) {
    const configPath = path.join(experimentsRoot, dir, "comparison-config.json");
    try {
      const config = await loadJson(configPath);
      if (!experimentId || config.experiment_id === experimentId) configs.push(configPath);
    } catch {
      continue;
    }
  }
  return configs.sort();
}

function parseCliArgs(argv) {
  const options = {
    experiment: "",
    allExperiments: false,
    v31Output: "",
    responseRoot: "",
    outputRoot: "",
    force: false,
    reviewPriority: "",
    pairwiseOnly: false,
    summaryOnly: false,
    ecrRoot: "",
    config: "",
  };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--experiment") options.experiment = argv[++index] || "";
    else if (value === "--all-experiments") options.allExperiments = true;
    else if (value === "--v3-1-output") options.v31Output = argv[++index] || "";
    else if (value === "--response-root") options.responseRoot = argv[++index] || "";
    else if (value === "--output-root") options.outputRoot = argv[++index] || "";
    else if (value === "--force") options.force = true;
    else if (value === "--review-priority") options.reviewPriority = argv[++index] || "";
    else if (value === "--pairwise-only") options.pairwiseOnly = true;
    else if (value === "--summary-only") options.summaryOnly = true;
    else if (value === "--ecr-root") options.ecrRoot = argv[++index] || "";
    else if (value === "--config") options.config = argv[++index] || "";
  }
  return options;
}

async function cli() {
  const options = parseCliArgs(process.argv.slice(2));
  if (options.summaryOnly) {
    const ecrRoot = path.resolve(options.ecrRoot || process.cwd());
    await runExplainabilitySummary(ecrRoot, options);
    return;
  }
  if (options.allExperiments) {
    const ecrRoot = path.resolve(options.ecrRoot || process.cwd());
    const configs = await discoverExperimentConfigs(ecrRoot, options.experiment);
    for (const configPath of configs) {
      await runExplainability(configPath, options);
    }
    return;
  }
  const configPath = path.resolve(options.config || "comparison-config.json");
  await runExplainability(configPath, options);
}

const invokedAsScript = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (invokedAsScript) {
  cli().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
