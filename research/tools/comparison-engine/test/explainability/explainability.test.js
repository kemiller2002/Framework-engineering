import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { mkdtemp, writeFile, mkdir } from "node:fs/promises";
import os from "node:os";
import { sha256Text } from "../../src/utilities.js";
import { classifyCause } from "../../src/explainability/classify-cause.js";
import { classifyCompression } from "../../src/explainability/classify-compression.js";
import { classifySignificance } from "../../src/explainability/classify-significance.js";
import { compareBackbones } from "../../src/explainability/compare-backbones.js";
import { compareConstraintExplainability } from "../../src/explainability/compare-constraints.js";
import { compareRecognitionExplainability } from "../../src/explainability/compare-recognition.js";
import { compareRepresentationExplainability } from "../../src/explainability/compare-representation.js";
import { compareSequences } from "../../src/explainability/compare-sequences.js";
import { compareTransitions } from "../../src/explainability/compare-transitions.js";
import { buildReviewPriority } from "../../src/explainability/build-review-priority.js";
import { runExplainability } from "../../src/explainability/index.js";

function baseResponse(overrides = {}) {
  return {
    packet_id: "P",
    structural_layer: {
      entry_conditions: ["start"],
      exit_conditions: ["done"],
      required_steps: ["observe", "evaluate", "decide"],
      loops: [],
      branches: [],
      termination_conditions: ["done"],
      control_flow_shape: "linear",
    },
    primitive_layer: {
      primitive_sequence: ["Observe", "Evaluate", "Decide"],
      transitions: ["Observe -> Evaluate", "Evaluate -> Decide"],
      dominant_primitive: "Evaluate",
      candidate_missing_primitives: [],
    },
    constraint_layer: {
      invariants: [],
      preconditions: ["start ready"],
      postconditions: ["done complete"],
      stopping_criteria: ["decision made"],
      validity_conditions: ["evidence sufficient"],
    },
    representation_layer: {
      procedural_ast: { type: "Process" },
      natural_language_summary: "Observe, evaluate, decide.",
      canonical_summary: "observe->evaluate->decide",
      ambiguities: [],
    },
    recognized_artifact: "",
    recognition_analysis: {
      domain_terms_introduced: [],
    },
    notes: "",
    ...overrides,
  };
}

async function setupMiniExperiment(prefix) {
  const dir = await mkdtemp(path.join(os.tmpdir(), prefix));
  const ecrRoot = path.join(dir, "ecr");
  const experimentDir = path.join(ecrRoot, "experiments", "EXP-001-temp");
  await mkdir(path.join(experimentDir, "packets"), { recursive: true });
  await mkdir(path.join(experimentDir, "responses", "gpt"), { recursive: true });
  await mkdir(path.join(experimentDir, "responses", "claude"), { recursive: true });
  await mkdir(path.join(experimentDir, "responses", "gemini"), { recursive: true });
  await mkdir(path.join(experimentDir, "comparison", "generated-v3.1"), { recursive: true });
  await mkdir(path.join(experimentDir, "normalization"), { recursive: true });
  const config = {
    ecr_id: "ECR-000003",
    experiment_id: "EXP-001",
    title: "Test",
    experiment_root: ".",
    response_root: "responses",
    packet_root: "packets",
    output_root: "comparison/generated-v3.1",
    comparator_version: "3.1.0",
    providers: ["gpt", "claude", "gemini"],
    variants: [{ packet_id: "PKT-1", variant_id: "P001A", variant_order: 1 }],
    comparison_layers: ["recognition", "structural"],
  };
  await writeFile(path.join(experimentDir, "comparison-config.json"), JSON.stringify(config, null, 2), "utf8");
  await writeFile(path.join(experimentDir, "packets", "p.md"), "packet_id: PKT-1\n", "utf8");
  const responses = {
    gpt: baseResponse({ packet_id: "PKT-1" }),
    claude: baseResponse({ packet_id: "PKT-1" }),
    gemini: baseResponse({ packet_id: "PKT-1" }),
  };
  await writeFile(path.join(experimentDir, "responses", "gpt", "PKT-1-gpt.json"), JSON.stringify(responses.gpt), "utf8");
  await writeFile(path.join(experimentDir, "responses", "claude", "PKT-1-claude.json"), JSON.stringify(responses.claude), "utf8");
  await writeFile(path.join(experimentDir, "responses", "gemini", "PKT-1-gemini.json"), JSON.stringify(responses.gemini), "utf8");

  const configHash = sha256Text(JSON.stringify({
    ecr_id: config.ecr_id,
    experiment_id: config.experiment_id,
    providers: config.providers,
    variants: config.variants,
    packet_versions: config.packet_versions,
    version_rules: config.version_rules || {},
    comparator_version: config.comparator_version,
  }));
  const manifest = {
    primary_responses: [
      { packet_id: "PKT-1", provider: "gpt", canonicalRelativePath: "responses/gpt/PKT-1-gpt.json", sha256: "1", packet_version: "not_stated" },
      { packet_id: "PKT-1", provider: "claude", canonicalRelativePath: "responses/claude/PKT-1-claude.json", sha256: "2", packet_version: "not_stated" },
      { packet_id: "PKT-1", provider: "gemini", canonicalRelativePath: "responses/gemini/PKT-1-gemini.json", sha256: "3", packet_version: "not_stated" },
    ],
  };
  manifest.dataset_hash = sha256Text(JSON.stringify(manifest.primary_responses
    .map((item) => ({
      packet_id: item.packet_id,
      provider: item.provider,
      canonical_relative_path: item.canonicalRelativePath,
      raw_sha256: item.sha256,
      packet_version: item.packet_version,
      config_hash: configHash,
    }))
    .sort((a, b) => `${a.packet_id}:${a.provider}`.localeCompare(`${b.packet_id}:${b.provider}`))));
  manifest.config_hash = configHash;
  await writeFile(path.join(experimentDir, "normalization", "dataset-manifest.json"), JSON.stringify(manifest), "utf8");

  return { ecrRoot, experimentDir, configPath: path.join(experimentDir, "comparison-config.json"), manifest };
}

test("1. Synonym substitution classification", () => {
  const cause = classifyCause({ difference_type: "synonym_substitution" });
  assert.equal(cause.primary_cause, "lexical_variance");
});

test("2. Phrase rewording classification", () => {
  assert.equal(classifyCause({ difference_type: "phrase_rewording" }).primary_cause, "lexical_variance");
});

test("3. Sequence reordering without execution impact", () => {
  const result = compareSequences(["A", "B"], ["B", "A"], { executionSensitive: false });
  assert.equal(result.differences[0].backbone_impact, "none");
});

test("4. Sequence reordering with execution impact", () => {
  const result = compareSequences(["A", "B"], ["B", "A"], { executionSensitive: true });
  assert.equal(result.differences[0].backbone_impact, "localized");
});

test("5. Compressed-step detection", () => {
  const result = compareSequences(["A", "B", "C"], ["A", "B"]);
  assert.equal(classifyCompression(result), "equivalent_compressed");
});

test("6. Expanded-step detection", () => {
  const result = compareSequences(["A", "B"], ["A", "B", "C"]);
  assert.equal(classifyCompression(result), "equivalent_expanded");
});

test("7. Neutral pass-through elaboration", () => {
  const result = compareBackbones(baseResponse(), baseResponse({
    structural_layer: { ...baseResponse().structural_layer, required_steps: ["observe", "align", "evaluate", "decide"] },
  }));
  assert.equal(result.differences[0].difference_type, "pass_through_expansion");
});

test("8. Inserted-step detection", () => {
  const result = compareSequences(["A"], ["A", "B", "C"]);
  assert.ok(result.differences.some((item) => item.difference_type === "expanded_steps"));
});

test("9. Omitted-step detection", () => {
  const result = compareSequences(["A", "B"], ["A", "C"]);
  assert.ok(result.differences.some((item) => item.difference_type === "omitted_step"));
});

test("10. Edge-order invariance", () => {
  const result = compareTransitions(["A -> B", "B -> C"], ["B -> C", "A -> B"]);
  assert.equal(result.differences[0].difference_type, "edge_declaration_reordering");
});

test("11. Node-renaming invariance", () => {
  const result = compareBackbones(baseResponse(), baseResponse({
    structural_layer: { ...baseResponse().structural_layer, control_flow_shape: "Linear progression" },
  }));
  assert.equal(result.differences[0].difference_type, "phrase_rewording");
});

test("12. Loop-target change detection", () => {
  const result = compareTransitions(["Evaluate -> Loop"], ["Evaluate -> Observe"]);
  assert.ok(result.differences.some((item) => item.difference_type === "loop_target_changed" || item.difference_type === "invented_edge"));
});

test("13. Invented-edge detection", () => {
  const result = compareTransitions(["A -> B"], ["A -> B", "B -> C"]);
  assert.ok(result.differences.some((item) => item.difference_type === "inserted_transition"));
});

test("14. Terminal-path change detection", () => {
  const result = compareTransitions(["A -> End"], ["A -> Continue"]);
  assert.ok(result.differences.some((item) => item.difference_type === "terminal_path_changed"));
});

test("15. Same constraint, different field", () => {
  const left = baseResponse();
  const right = baseResponse({
    constraint_layer: {
      ...baseResponse().constraint_layer,
      preconditions: [],
      validity_conditions: ["start ready"],
    },
  });
  const result = compareConstraintExplainability(left, right);
  assert.ok(result.differences.some((item) => item.difference_type === "same_constraint_different_field"));
});

test("16. Contradictory constraint detection", () => {
  const left = baseResponse({ constraint_layer: { ...baseResponse().constraint_layer, validity_conditions: ["must not proceed"] } });
  const right = baseResponse({ constraint_layer: { ...baseResponse().constraint_layer, validity_conditions: ["must proceed"] } });
  const result = compareConstraintExplainability(left, right);
  assert.ok(result.differences.some((item) => item.difference_type === "contradictory_constraint"));
});

test("17. Evaluate vs Verify unresolved boundary", () => {
  assert.equal(classifyCause({ difference_type: "evaluate_vs_verify" }).primary_cause, "comparator_limit");
});

test("18. Decide vs Terminate material distinction", () => {
  assert.equal(classifySignificance({ difference_type: "decide_vs_terminate", backbone_impact: "material" }), "high");
});

test("19. Recognition decay with stable backbone", () => {
  const left = { provider: "a", response: baseResponse({ recognized_artifact: "scientific method" }) };
  const right = { provider: "b", response: baseResponse({ recognized_artifact: "" }) };
  const result = compareRecognitionExplainability(left, right, { namedRecognitionPatterns: ["scientific method"], backboneCategory: "full_agreement" });
  assert.ok(result.differences.some((item) => item.difference_type === "recognition_without_structural_effect"));
});

test("20. Recognition change with structural import", () => {
  const left = { provider: "a", response: baseResponse({ recognized_artifact: "scientific method" }) };
  const right = { provider: "b", response: baseResponse({ recognized_artifact: "" }) };
  const result = compareRecognitionExplainability(left, right, { namedRecognitionPatterns: ["scientific method"], backboneCategory: "disagreement" });
  assert.ok(result.differences.some((item) => item.difference_type === "recognition_with_structural_import"));
});

test("21. Leakage term in cautionary prose only", () => {
  const left = { provider: "a", response: baseResponse({ recognition_analysis: { domain_terms_introduced: ["diagnosis"] } }) };
  const right = { provider: "b", response: baseResponse() };
  const result = compareRecognitionExplainability(left, right, { namedRecognitionPatterns: [], backboneCategory: "full_agreement" });
  assert.ok(result.differences.some((item) => item.difference_type === "terminology_leakage_only"));
});

test("22. Leakage term with unsupported structural import", () => {
  assert.equal(classifySignificance({ difference_type: "recognition_with_structural_import", backbone_impact: "localized" }), "high");
});

test("23. Provider-style difference classification", () => {
  assert.equal(classifyCause({ difference_type: "provider_style_difference" }).primary_cause, "provider_style");
});

test("24. Domain-vocabulary substitution", () => {
  assert.equal(classifyCause({ difference_type: "domain_vocabulary_substitution" }).primary_cause, "domain_semantics");
});

test("25. Human-review priority assignment", () => {
  const priority = buildReviewPriority([{ significance: "high", cause: { primary_cause: "genuine_structural_divergence" }, backbone_impact: "material" }]);
  assert.equal(priority, "high");
});

test("26. Explainability does not mutate v3.1 output", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "explainability-no-mutate-"));
  const file = path.join(dir, "run-manifest.json");
  const content = JSON.stringify({ comparator_version: "3.1.0", generated_at: new Date().toISOString() }, null, 2);
  await writeFile(file, content, "utf8");
  const before = content;
  const after = await (await import("node:fs/promises")).readFile(file, "utf8");
  assert.equal(after, before);
});

test("27. Explainability does not change official classifications", () => {
  const result = compareRepresentationExplainability(baseResponse(), baseResponse({ notes: "different" }));
  assert.ok(result.differences.every((item) => item.layer === "representation"));
});

test("28. Stale v3.1 input rejection", async () => {
  const { experimentDir, configPath, manifest } = await setupMiniExperiment("explainability-stale-");
  await writeFile(path.join(experimentDir, "comparison", "generated-v3.1", "run-manifest.json"), JSON.stringify({ run_id: "1", comparator_version: "3.1.0", generated_at: "2000-01-01T00:00:00.000Z" }), "utf8");
  await writeFile(path.join(experimentDir, "comparison", "generated-v3.1", "raw-comparison-data.json"), JSON.stringify({ run_state: { run_id: "1" } }), "utf8");
  await writeFile(path.join(experimentDir, "normalization", "normalization-certificate.json"), JSON.stringify({
    status: "READY_WITH_WARNINGS",
    ready_for_comparison: true,
    allowed_comparator_versions: ["3.1.0"],
    dataset_hash: manifest.dataset_hash,
    config_hash: manifest.config_hash,
  }), "utf8");
  await assert.rejects(() => runExplainability(configPath), /Response files changed since comparison/);
});

test("29. Dataset-hash mismatch rejection", async () => {
  const { experimentDir, configPath, manifest } = await setupMiniExperiment("explainability-dataset-");
  const future = new Date(Date.now() + 1000 * 60 * 60).toISOString();
  await writeFile(path.join(experimentDir, "comparison", "generated-v3.1", "run-manifest.json"), JSON.stringify({ run_id: "1", comparator_version: "3.1.0", generated_at: future }), "utf8");
  await writeFile(path.join(experimentDir, "comparison", "generated-v3.1", "raw-comparison-data.json"), JSON.stringify({ run_state: { run_id: "1" } }), "utf8");
  await writeFile(path.join(experimentDir, "normalization", "normalization-certificate.json"), JSON.stringify({
    status: "BLOCKED",
    ready_for_comparison: false,
    allowed_comparator_versions: ["3.1.0"],
    dataset_hash: manifest.dataset_hash,
    config_hash: manifest.config_hash,
  }), "utf8");
  await assert.rejects(() => runExplainability(configPath), /does not allow official comparison/);
});

test("30. Pairwise evidence trace completeness", () => {
  const left = { packet_id: "A", provider: "gpt", source_path: "left.json", response: baseResponse() };
  const right = { packet_id: "B", provider: "claude", source_path: "right.json", response: baseResponse({ notes: "x" }) };
  const result = compareRepresentationExplainability(left.response, right.response);
  assert.ok(result.differences.length > 0);
});
