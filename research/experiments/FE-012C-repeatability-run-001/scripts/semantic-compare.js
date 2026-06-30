import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const experimentDir = path.resolve(__dirname, "..");
const datasetADir = path.resolve(experimentDir, "../FE-012C-manual-replication/responses");
const datasetBDir = path.resolve(experimentDir, "responses");
const comparisonDir = path.resolve(experimentDir, "comparison");
const literalGeneratedDir = path.resolve(comparisonDir, "generated");

const providers = ["gpt", "claude", "gemini"];
const packetIds = Array.from({ length: 15 }, (_, index) =>
  `FE-012C-P${String(index + 1).padStart(3, "0")}`,
);
const elaborationPrimitives = new Set([
  "Interpret",
  "Compare",
  "Verify",
  "Reflect",
  "Communicate",
]);
const semanticRules = [
  {
    id: "SEQ-001",
    description:
      "Observe -> Evaluate is backbone-equivalent to Observe -> Interpret -> Evaluate.",
  },
  {
    id: "SEQ-002",
    description:
      "Evaluate -> Decide is backbone-equivalent to Evaluate -> Verify -> Decide.",
  },
  {
    id: "FLOW-001",
    description:
      "Evaluate -> Reassess -> Observe is loop-equivalent to Evaluate -> Observe.",
  },
  {
    id: "SEQ-003",
    description:
      "Generate -> Observe -> Evaluate remains backbone-equivalent when Compare is inserted before Decide or Verify.",
  },
];

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  await mkdir(comparisonDir, { recursive: true });

  const [datasetA, datasetB, literalRaw] = await Promise.all([
    loadDataset("A", datasetADir),
    loadDataset("B", datasetBDir),
    loadLiteralRawComparison(),
  ]);

  const comparisons = [];
  for (const provider of providers) {
    for (const packetId of packetIds) {
      const key = `${provider}:${packetId}`;
      comparisons.push(
        compareSemanticPair(
          packetId,
          provider,
          datasetA.records.get(key) ?? null,
          datasetB.records.get(key) ?? null,
        ),
      );
    }
  }

  const aggregates = buildAggregates(comparisons, literalRaw);

  await Promise.all([
    writeFile(
      path.join(comparisonDir, "semantic-repeatability-report.md"),
      buildSemanticRepeatabilityReport(aggregates),
    ),
    writeFile(
      path.join(comparisonDir, "backbone-agreement.md"),
      buildBackboneAgreementReport(comparisons, aggregates),
    ),
    writeFile(
      path.join(comparisonDir, "elaboration-drift.md"),
      buildElaborationDriftReport(aggregates),
    ),
    writeFile(
      path.join(comparisonDir, "control-flow-agreement.md"),
      buildControlFlowAgreementReport(comparisons, aggregates),
    ),
    writeFile(
      path.join(comparisonDir, "semantic-equivalence-rules.md"),
      buildSemanticEquivalenceRules(),
    ),
  ]);
}

async function loadLiteralRawComparison() {
  const filePath = path.join(literalGeneratedDir, "FE-012C-raw-comparison.json");
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function loadDataset(label, rootDir) {
  const records = new Map();

  for (const provider of providers) {
    const providerDir = path.join(rootDir, provider);
    let entries = [];
    try {
      entries = await readdir(providerDir, { withFileTypes: true });
    } catch {
      entries = [];
    }

    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".json")) {
        continue;
      }
      const filePath = path.join(providerDir, entry.name);
      const loaded = await loadObservationFile(filePath, provider);
      if (!loaded.ok) {
        continue;
      }
      const packetId =
        loaded.data.packet_id ||
        inferPacketIdFromFilename(entry.name) ||
        inferPacketIdFromFilename(path.basename(filePath));
      if (!packetId) {
        continue;
      }
      records.set(`${provider}:${packetId}`, {
        dataset: label,
        provider,
        packetId,
        file: relativeExperimentPath(filePath),
        data: loaded.data,
      });
    }
  }

  return { label, rootDir, records };
}

async function loadObservationFile(filePath, provider) {
  const raw = await readFile(filePath, "utf8");
  const candidates = [
    stripBom(raw),
    normalizeJsonLikeText(raw),
  ];
  for (const candidate of candidates) {
    try {
      const data = JSON.parse(candidate);
      return {
        ok: true,
        data: normalizeObservation(data, provider),
      };
    } catch {
      continue;
    }
  }
  return { ok: false };
}

function normalizeObservation(data, provider) {
  return {
    ...data,
    packet_id: asString(data.packet_id),
    recognized_artifact: asString(data.recognized_artifact),
    primitive_sequence: asStringArray(data.primitive_sequence),
    transitions: normalizeTransitions(data.transitions),
    entry_primitive: asString(data.entry_primitive),
    exit_primitive: asString(data.exit_primitive),
    loops: Array.isArray(data.loops) ? data.loops : [],
    branches: Array.isArray(data.branches) ? data.branches : [],
    dominant_primitive: asString(data.dominant_primitive),
    reasoning_shape: asString(data.reasoning_shape),
    candidate_missing_primitives: asStringArray(data.candidate_missing_primitives),
    ambiguities: asStringArray(data.ambiguities),
    confidence: data.confidence && typeof data.confidence === "object" ? data.confidence : {},
    _provider: provider,
  };
}

function compareSemanticPair(packetId, provider, priorRecord, repeatRecord) {
  if (!priorRecord || !repeatRecord) {
    return {
      packet_id: packetId,
      provider,
      classification: "unclear",
      literal_classification: "missing_or_invalid",
      prior_file: priorRecord?.file ?? null,
      repeat_file: repeatRecord?.file ?? null,
      backbone: null,
      elaboration: null,
      control_flow: null,
      equivalence_rules_triggered: [],
      semantic_shift: "missing_or_invalid",
      note: "One or both observations are unavailable for semantic comparison.",
    };
  }

  const prior = priorRecord.data;
  const repeat = repeatRecord.data;

  const priorMajorPath = canonicalizeMajorPath(prior.primitive_sequence);
  const repeatMajorPath = canonicalizeMajorPath(repeat.primitive_sequence);

  const priorControlFlow = analyzeControlFlow(prior);
  const repeatControlFlow = analyzeControlFlow(repeat);

  const backbone = {
    entry_match: normalizeText(prior.entry_primitive) === normalizeText(repeat.entry_primitive),
    exit_match: normalizeText(prior.exit_primitive) === normalizeText(repeat.exit_primitive),
    dominant_match:
      normalizeText(prior.dominant_primitive) === normalizeText(repeat.dominant_primitive),
    shape_match:
      normalizeText(prior.reasoning_shape) === normalizeText(repeat.reasoning_shape),
    major_path_match: arraysEqual(priorMajorPath, repeatMajorPath),
    prior_major_path: priorMajorPath,
    repeat_major_path: repeatMajorPath,
  };

  const elaboration = {
    prior_only: difference(
      prior.primitive_sequence.filter((primitive) => elaborationPrimitives.has(primitive)),
      repeat.primitive_sequence.filter((primitive) => elaborationPrimitives.has(primitive)),
    ),
    repeat_only: difference(
      repeat.primitive_sequence.filter((primitive) => elaborationPrimitives.has(primitive)),
      prior.primitive_sequence.filter((primitive) => elaborationPrimitives.has(primitive)),
    ),
  };
  elaboration.changed =
    elaboration.prior_only.length > 0 || elaboration.repeat_only.length > 0;

  const controlFlow = {
    loops_match: priorControlFlow.loops_present === repeatControlFlow.loops_present,
    branches_match: priorControlFlow.branches_present === repeatControlFlow.branches_present,
    reassessment_match:
      priorControlFlow.reassessment_present === repeatControlFlow.reassessment_present,
    shape_family_match:
      priorControlFlow.shape_family === repeatControlFlow.shape_family,
    prior: priorControlFlow,
    repeat: repeatControlFlow,
  };

  const ruleMatches = collectRuleMatches(prior, repeat);
  const fullyStableBackbone =
    backbone.entry_match &&
    backbone.exit_match &&
    backbone.shape_match &&
    backbone.dominant_match &&
    backbone.major_path_match;
  const stableControlFlow =
    controlFlow.loops_match &&
    controlFlow.branches_match &&
    controlFlow.reassessment_match &&
    controlFlow.shape_family_match;

  let classification = "stable";
  let semanticShift = "literal_drift_disappears";

  if (!fullyStableBackbone || !stableControlFlow) {
    classification = "structural_drift";
    semanticShift = "semantic_drift_remains";
  } else if (elaboration.changed || ruleMatches.length > 0) {
    classification = "elaboration_drift";
    semanticShift = "literal_drift_disappears";
  }

  if (
    classification !== "structural_drift" &&
    hasUnclearSignal(prior, repeat, backbone, controlFlow)
  ) {
    classification = "unclear";
    semanticShift = "needs_human_review";
  }

  return {
    packet_id: packetId,
    provider,
    classification,
    literal_classification: "unknown",
    prior_file: priorRecord.file,
    repeat_file: repeatRecord.file,
    backbone,
    elaboration,
    control_flow: controlFlow,
    equivalence_rules_triggered: ruleMatches,
    semantic_shift: semanticShift,
    note: buildSemanticNote(classification, ruleMatches, elaboration, controlFlow),
  };
}

function buildAggregates(comparisons, literalRaw) {
  const literalCounts = literalRaw.aggregate_counts;
  const semanticCounts = {
    stable: 0,
    elaboration_drift: 0,
    structural_drift: 0,
    unclear: 0,
  };
  const byProvider = new Map();
  const byPacket = new Map();
  const ruleUsage = new Map();
  const controlFlowCounts = {
    loops_match: 0,
    branches_match: 0,
    reassessment_match: 0,
    shape_family_match: 0,
  };
  const literalDisappears = [];
  const semanticRemains = [];
  const unclearCases = [];
  const elaborationPrimitiveAdds = new Map();
  const elaborationPrimitiveRemovals = new Map();

  for (const provider of providers) {
    byProvider.set(provider, {
      provider,
      stable: 0,
      elaboration_drift: 0,
      structural_drift: 0,
      unclear: 0,
    });
  }

  const literalMap = new Map(
    (literalRaw.per_packet_comparisons || []).map((item) => [
      `${item.provider}:${item.packet_id}`,
      item,
    ]),
  );

  for (const comparison of comparisons) {
    const literal = literalMap.get(`${comparison.provider}:${comparison.packet_id}`);
    comparison.literal_classification = literal?.classification ?? "unknown";
    semanticCounts[comparison.classification] += 1;
    byProvider.get(comparison.provider)[comparison.classification] += 1;

    if (comparison.control_flow?.loops_match) {
      controlFlowCounts.loops_match += 1;
    }
    if (comparison.control_flow?.branches_match) {
      controlFlowCounts.branches_match += 1;
    }
    if (comparison.control_flow?.reassessment_match) {
      controlFlowCounts.reassessment_match += 1;
    }
    if (comparison.control_flow?.shape_family_match) {
      controlFlowCounts.shape_family_match += 1;
    }

    for (const ruleId of comparison.equivalence_rules_triggered) {
      incrementCount(ruleUsage, ruleId);
    }
    for (const primitive of comparison.elaboration?.repeat_only ?? []) {
      incrementCount(elaborationPrimitiveAdds, primitive);
    }
    for (const primitive of comparison.elaboration?.prior_only ?? []) {
      incrementCount(elaborationPrimitiveRemovals, primitive);
    }

    if (
      comparison.literal_classification !== "stable" &&
      comparison.literal_classification !== "missing_or_invalid" &&
      comparison.classification !== "structural_drift"
    ) {
      literalDisappears.push(comparison);
    }
    if (comparison.classification === "structural_drift") {
      semanticRemains.push(comparison);
    }
    if (comparison.classification === "unclear") {
      unclearCases.push(comparison);
    }

    const packetSummary =
      byPacket.get(comparison.packet_id) ?? {
        packet_id: comparison.packet_id,
        stable: 0,
        elaboration_drift: 0,
        structural_drift: 0,
        unclear: 0,
        providers: [],
      };
    packetSummary[comparison.classification] += 1;
    packetSummary.providers.push(
      `${comparison.provider}:${comparison.classification}`,
    );
    byPacket.set(comparison.packet_id, packetSummary);
  }

  return {
    literalCounts,
    semanticCounts,
    byProvider: [...byProvider.values()],
    byPacket: [...byPacket.values()],
    ruleUsage: toSortedEntries(ruleUsage),
    controlFlowCounts,
    literalDisappears,
    semanticRemains,
    unclearCases,
    elaborationPrimitiveAdds: toSortedEntries(elaborationPrimitiveAdds),
    elaborationPrimitiveRemovals: toSortedEntries(elaborationPrimitiveRemovals),
    comparisons,
  };
}

function canonicalizeMajorPath(sequence) {
  const stripped = (Array.isArray(sequence) ? sequence : []).filter(
    (primitive) => !elaborationPrimitives.has(primitive),
  );
  const collapsed = [];
  for (const primitive of stripped) {
    if (collapsed[collapsed.length - 1] !== primitive) {
      collapsed.push(primitive);
    }
  }
  return collapsed;
}

function analyzeControlFlow(observation) {
  const loopsPresent = Array.isArray(observation.loops) && observation.loops.length > 0;
  const branchesPresent =
    Array.isArray(observation.branches) && observation.branches.length > 0;
  const reassessmentPresent =
    observation.primitive_sequence.some((primitive) => primitive === "Reassess") ||
    observation.transitions.some((transition) => transition.includes("Reassess"));
  return {
    loops_present: loopsPresent,
    branches_present: branchesPresent,
    reassessment_present: reassessmentPresent,
    shape_family: shapeFamily(observation.reasoning_shape),
  };
}

function collectRuleMatches(prior, repeat) {
  const matches = [];
  if (
    transitionsEquivalent(
      prior.transitions,
      repeat.transitions,
      "Observe -> Evaluate",
      "Observe -> Interpret -> Evaluate",
    )
  ) {
    matches.push("SEQ-001");
  }
  if (
    transitionsEquivalent(
      prior.transitions,
      repeat.transitions,
      "Evaluate -> Decide",
      "Evaluate -> Verify -> Decide",
    )
  ) {
    matches.push("SEQ-002");
  }
  if (
    loopEquivalent(
      prior.transitions,
      repeat.transitions,
      "Evaluate -> Reassess -> Observe",
      "Evaluate -> Observe",
    )
  ) {
    matches.push("FLOW-001");
  }
  if (compareBeforeClosure(prior.primitive_sequence, repeat.primitive_sequence)) {
    matches.push("SEQ-003");
  }
  return matches;
}

function transitionsEquivalent(priorTransitions, repeatTransitions, direct, expanded) {
  const directSequence = parseArrowSequence(direct);
  const expandedSequence = parseArrowSequence(expanded);
  return (
    hasPath(priorTransitions, directSequence) && hasPath(repeatTransitions, expandedSequence)
  ) || (
    hasPath(repeatTransitions, directSequence) && hasPath(priorTransitions, expandedSequence)
  );
}

function loopEquivalent(priorTransitions, repeatTransitions, loopPath, directPath) {
  const loopSequence = parseArrowSequence(loopPath);
  const directSequence = parseArrowSequence(directPath);
  return (
    hasPath(priorTransitions, loopSequence) && hasPath(repeatTransitions, directSequence)
  ) || (
    hasPath(repeatTransitions, loopSequence) && hasPath(priorTransitions, directSequence)
  );
}

function compareBeforeClosure(priorSequence, repeatSequence) {
  const prior = canonicalizeComparisonWindow(priorSequence);
  const repeat = canonicalizeComparisonWindow(repeatSequence);
  return (
    arraysEqual(prior.base, repeat.base) &&
    (prior.hasCompareInsertion !== repeat.hasCompareInsertion ||
      prior.hasVerifyInsertion !== repeat.hasVerifyInsertion)
  );
}

function canonicalizeComparisonWindow(sequence) {
  const values = Array.isArray(sequence) ? sequence : [];
  const base = values.filter((primitive) => primitive !== "Compare" && primitive !== "Verify");
  return {
    base,
    hasCompareInsertion: values.includes("Compare"),
    hasVerifyInsertion: values.includes("Verify"),
  };
}

function hasUnclearSignal(prior, repeat, backbone, controlFlow) {
  const candidateMissing =
    prior.candidate_missing_primitives.length > 0 ||
    repeat.candidate_missing_primitives.length > 0;
  const ambiguityHeavy =
    prior.ambiguities.length >= 3 || repeat.ambiguities.length >= 3;
  const mixedControlFlow =
    backbone.major_path_match &&
    (!controlFlow.loops_match || !controlFlow.branches_match) &&
    ambiguityHeavy;
  return candidateMissing || mixedControlFlow;
}

function buildSemanticNote(classification, ruleMatches, elaboration, controlFlow) {
  if (classification === "structural_drift") {
    return "Backbone or control-flow structure still differs after semantic normalization.";
  }
  if (classification === "elaboration_drift") {
    return `Backbone aligned semantically; elaboration difference remains. Rules triggered: ${ruleMatches.join(", ") || "none"}.`;
  }
  if (classification === "unclear") {
    return "Semantic normalization reduces some drift, but ambiguity or candidate missing primitives still warrant human review.";
  }
  return `Semantically stable. Rules triggered: ${ruleMatches.join(", ") || "none"}.`;
}

function buildSemanticRepeatabilityReport(aggregates) {
  const literal = aggregates.literalCounts;
  const semantic = aggregates.semanticCounts;
  const total = literal.compared_pairs;

  const disappearedRows = aggregates.literalDisappears
    .slice(0, 20)
    .map(
      (item) =>
        `| ${item.packet_id} | ${item.provider} | ${item.literal_classification} | ${item.classification} | ${item.equivalence_rules_triggered.join(", ") || "none"} | ${item.note} |`,
    )
    .join("\n");
  const remainedRows = aggregates.semanticRemains
    .slice(0, 20)
    .map(
      (item) =>
        `| ${item.packet_id} | ${item.provider} | ${item.literal_classification} | ${item.classification} | ${item.note} |`,
    )
    .join("\n");
  const unclearRows = aggregates.unclearCases
    .map(
      (item) =>
        `| ${item.packet_id} | ${item.provider} | ${item.literal_classification} | ${item.note} |`,
    )
    .join("\n");

  return `# FE-012C Semantic Repeatability Report

## Purpose

Add a layered semantic grammar comparison beside the existing literal comparator.

This report does not replace syntactic comparison.

## Literal Drift Summary

- Stable: ${literal.stable}/${total}
- Elaboration drift: ${literal.elaboration_drift}/${total}
- Structural drift: ${literal.structural_drift}/${total}
- Missing or invalid: ${literal.missing_or_invalid}/${total}

## Semantic Drift Summary

- Stable: ${semantic.stable}/${total}
- Elaboration drift: ${semantic.elaboration_drift}/${total}
- Structural drift: ${semantic.structural_drift}/${total}
- Unclear: ${semantic.unclear}/${total}

## Cases Where Literal Drift Disappears Under Semantic Comparison

| Packet ID | Provider | Literal | Semantic | Rules Triggered | Notes |
| --- | --- | --- | --- | --- | --- |
${disappearedRows || "| None | - | - | - | - | - |"}

## Cases Where Semantic Drift Remains Real

| Packet ID | Provider | Literal | Semantic | Notes |
| --- | --- | --- | --- | --- |
${remainedRows || "| None | - | - | - | - |"}

## Uncertain Cases Needing Human Review

| Packet ID | Provider | Literal | Notes |
| --- | --- | --- | --- |
${unclearRows || "| None | - | - | - |"}

## Interpretation

- Semantic comparison is provisional tooling, not a proven equivalence theory.
- Literal differences remain part of the record even when semantic drift decreases.
- Backbone agreement, elaboration drift, and control-flow agreement should be interpreted together rather than in isolation.
`;
}

function buildBackboneAgreementReport(comparisons, aggregates) {
  const rows = comparisons
    .map((item) => {
      const backbone = item.backbone;
      return `| ${item.packet_id} | ${item.provider} | ${backbone?.entry_match ? "yes" : "no"} | ${backbone?.exit_match ? "yes" : "no"} | ${backbone?.dominant_match ? "yes" : "no"} | ${backbone?.shape_match ? "yes" : "no"} | ${backbone?.major_path_match ? "yes" : "no"} | ${item.classification} |`;
    })
    .join("\n");

  return `# FE-012C Backbone Agreement

Backbone comparison covers:

- entry_primitive
- exit_primitive
- dominant_primitive
- reasoning_shape
- major primitive path after removing elaboration primitives

| Packet ID | Provider | Entry | Exit | Dominant | Shape | Major Path | Semantic Category |
| --- | --- | --- | --- | --- | --- | --- | --- |
${rows}

## Summary

- Stable: ${aggregates.semanticCounts.stable}
- Elaboration drift: ${aggregates.semanticCounts.elaboration_drift}
- Structural drift: ${aggregates.semanticCounts.structural_drift}
- Unclear: ${aggregates.semanticCounts.unclear}
`;
}

function buildElaborationDriftReport(aggregates) {
  const providerRows = aggregates.byProvider
    .map(
      (item) =>
        `| ${item.provider.toUpperCase()} | ${item.stable} | ${item.elaboration_drift} | ${item.structural_drift} | ${item.unclear} |`,
    )
    .join("\n");

  const added = formatCountList(aggregates.elaborationPrimitiveAdds);
  const removed = formatCountList(aggregates.elaborationPrimitiveRemovals);
  const ruleUsage = formatCountList(aggregates.ruleUsage);

  return `# FE-012C Elaboration Drift

Elaboration candidates in this comparator:

- Interpret
- Compare
- Verify
- Reflect
- Communicate

## Per-Provider Summary

| Provider | Stable | Elaboration Drift | Structural Drift | Unclear |
| --- | ---: | ---: | ---: | ---: |
${providerRows}

## Common Added Elaboration Primitives

${added}

## Common Removed Elaboration Primitives

${removed}

## Semantic Rule Usage

${ruleUsage}

## Caution

Elaboration drift does not imply irrelevance.

It only indicates that the backbone remained aligned while optional semantic detail changed.
`;
}

function buildControlFlowAgreementReport(comparisons, aggregates) {
  const rows = comparisons
    .map(
      (item) =>
        `| ${item.packet_id} | ${item.provider} | ${boolWord(item.control_flow?.prior.loops_present)} | ${boolWord(item.control_flow?.repeat.loops_present)} | ${boolWord(item.control_flow?.prior.branches_present)} | ${boolWord(item.control_flow?.repeat.branches_present)} | ${boolWord(item.control_flow?.prior.reassessment_present)} | ${boolWord(item.control_flow?.repeat.reassessment_present)} | ${item.control_flow?.prior.shape_family || ""} | ${item.control_flow?.repeat.shape_family || ""} | ${item.classification} |`,
    )
    .join("\n");

  return `# FE-012C Control Flow Agreement

Control-flow comparison covers:

- loops present / absent
- branches present / absent
- reassessment present / absent
- cyclic vs linear vs static shape

| Packet ID | Provider | Prior Loops | Repeat Loops | Prior Branches | Repeat Branches | Prior Reassessment | Repeat Reassessment | Prior Shape Family | Repeat Shape Family | Semantic Category |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${rows}

## Summary

- Loop agreement pairs: ${aggregates.controlFlowCounts.loops_match}/${comparisons.length}
- Branch agreement pairs: ${aggregates.controlFlowCounts.branches_match}/${comparisons.length}
- Reassessment agreement pairs: ${aggregates.controlFlowCounts.reassessment_match}/${comparisons.length}
- Shape-family agreement pairs: ${aggregates.controlFlowCounts.shape_family_match}/${comparisons.length}
`;
}

function buildSemanticEquivalenceRules() {
  const ruleRows = semanticRules
    .map((rule) => `| ${rule.id} | ${rule.description} |`)
    .join("\n");

  return `# FE-012C Semantic Equivalence Rules

These rules are provisional comparison rules for semantic grammar analysis.

They do not prove semantic equivalence.

They only define conservative normalization steps for repeatability analysis.

| Rule ID | Provisional Rule |
| --- | --- |
${ruleRows}

## Comparator Layers

1. Backbone Agreement
2. Elaboration Drift
3. Control Flow Agreement
4. Semantic Equivalence

## Boundaries

- Literal differences must remain visible in the syntactic comparator.
- Semantic comparison must not overwrite or hide raw results.
- Unclear cases should remain unresolved rather than being forced into agreement.
`;
}

function parseArrowSequence(sequence) {
  return sequence.split("->").map((part) => part.trim()).filter(Boolean);
}

function hasPath(transitions, sequence) {
  if (sequence.length < 2) {
    return false;
  }
  const transitionSet = new Set(transitions);
  for (let index = 0; index < sequence.length - 1; index += 1) {
    const edge = `${sequence[index]} -> ${sequence[index + 1]}`;
    if (!transitionSet.has(edge)) {
      return false;
    }
  }
  return true;
}

function shapeFamily(value) {
  const normalized = normalizeText(value);
  if (normalized === "cyclic") {
    return "cyclic";
  }
  if (normalized === "linear") {
    return "linear";
  }
  if (normalized === "branching" || normalized === "network") {
    return "branching";
  }
  return "static";
}

function stripBom(text) {
  return text.replace(/^\uFEFF/, "");
}

function normalizeJsonLikeText(text) {
  return stripBom(text)
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\u00A0/g, " ");
}

function inferPacketIdFromFilename(name) {
  const explicitMatch = name.match(/FE-012C-P\d{3}/i);
  if (explicitMatch) {
    return explicitMatch[0].toUpperCase();
  }
  const shortMatch = name.match(/^(\d{2})\.json$/i);
  if (!shortMatch) {
    return null;
  }
  return `FE-012C-P${shortMatch[1].padStart(3, "0")}`;
}

function asString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function asStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function normalizeTransitions(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((transition) => {
      if (!transition || typeof transition !== "object") {
        return "";
      }
      return `${asString(transition.from)} -> ${asString(transition.to)}`.trim();
    })
    .filter((transition) => transition !== "->");
}

function difference(source, reference) {
  const referenceCounts = new Map();
  for (const value of reference.map(normalizeText)) {
    referenceCounts.set(value, (referenceCounts.get(value) ?? 0) + 1);
  }
  const diff = [];
  for (const value of source) {
    const normalized = normalizeText(value);
    const count = referenceCounts.get(normalized) ?? 0;
    if (count > 0) {
      referenceCounts.set(normalized, count - 1);
    } else {
      diff.push(value);
    }
  }
  return diff;
}

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function arraysEqual(a, b) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function incrementCount(map, key) {
  if (!key) {
    return;
  }
  map.set(key, (map.get(key) ?? 0) + 1);
}

function toSortedEntries(map) {
  return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function formatCountList(entries) {
  if (!entries.length) {
    return "None";
  }
  return entries.map(([name, count]) => `- ${name}: ${count}`).join("\n");
}

function boolWord(value) {
  return value ? "present" : "absent";
}

function relativeExperimentPath(filePath) {
  return path.relative(path.resolve(experimentDir, "..", "..", ".."), filePath);
}
