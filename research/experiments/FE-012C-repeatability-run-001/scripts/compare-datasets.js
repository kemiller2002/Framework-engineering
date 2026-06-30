import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const experimentDir = path.resolve(__dirname, "..");
const datasetADir = path.resolve(experimentDir, "../FE-012C-manual-replication/responses");
const datasetBDir = path.resolve(experimentDir, "responses");
const outputDir = path.resolve(experimentDir, "comparison/generated");

const providers = ["gpt", "claude", "gemini"];
const packetIds = Array.from({ length: 15 }, (_, index) =>
  `FE-012C-P${String(index + 1).padStart(3, "0")}`,
);
const elaborationPrimitives = new Set([
  "Compare",
  "Verify",
  "Reflect",
  "Interpret",
  "Communicate",
]);
const comparedFields = [
  "recognized_artifact",
  "primitive_sequence",
  "transitions",
  "entry_primitive",
  "exit_primitive",
  "loops",
  "branches",
  "dominant_primitive",
  "reasoning_shape",
  "candidate_missing_primitives",
  "ambiguities",
  "confidence",
];
const backboneFields = [
  "entry_primitive",
  "exit_primitive",
  "dominant_primitive",
  "reasoning_shape",
];

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  await mkdir(outputDir, { recursive: true });

  const datasetA = await loadDataset("A", datasetADir);
  const datasetB = await loadDataset("B", datasetBDir);
  const comparisons = compareDatasets(datasetA, datasetB);
  const aggregates = buildAggregates(datasetA, datasetB, comparisons);

  const rawComparison = {
    metadata: {
      generated_at: new Date().toISOString(),
      dataset_a: datasetADir,
      dataset_b: datasetBDir,
      expected_packets: packetIds.length,
      expected_models: providers.length,
      expected_observations_per_dataset: packetIds.length * providers.length,
      compared_fields: comparedFields,
      backbone_fields: backboneFields,
      elaboration_primitives: [...elaborationPrimitives],
    },
    dataset_a_summary: datasetA.summary,
    dataset_b_summary: datasetB.summary,
    aggregate_counts: aggregates.aggregateCounts,
    primitive_counts: aggregates.primitiveCounts,
    transition_counts: aggregates.transitionCounts,
    model_signatures: aggregates.modelSignatures,
    packet_summaries: aggregates.packetSummaries,
    per_packet_comparisons: comparisons,
    missing_file_records: [
      ...datasetA.summary.missingRecords,
      ...datasetB.summary.missingRecords,
    ],
    malformed_file_records: [
      ...datasetA.summary.malformedRecords,
      ...datasetB.summary.malformedRecords,
    ],
  };

  await Promise.all([
    writeFile(
      path.join(outputDir, "FE-012C-raw-comparison.json"),
      `${JSON.stringify(rawComparison, null, 2)}\n`,
    ),
    writeFile(
      path.join(outputDir, "FE-012C-dataset-comparison.md"),
      buildDatasetComparisonReport(datasetA, datasetB, aggregates),
    ),
    writeFile(
      path.join(outputDir, "FE-012C-stability-matrix.md"),
      buildStabilityMatrixReport(aggregates),
    ),
    writeFile(
      path.join(outputDir, "FE-012C-drift-analysis.md"),
      buildDriftAnalysisReport(aggregates),
    ),
    writeFile(
      path.join(outputDir, "FE-012C-model-signatures.md"),
      buildModelSignaturesReport(aggregates),
    ),
    writeFile(
      path.join(outputDir, "FE-012C-transition-comparison.md"),
      buildTransitionComparisonReport(aggregates),
    ),
  ]);
}

async function loadDataset(label, rootDir) {
  const records = new Map();
  const files = [];
  const malformedRecords = [];

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
      files.push(relativeExperimentPath(filePath));
      const loaded = await loadObservationFile(filePath, provider);
      if (!loaded.ok) {
        malformedRecords.push({
          dataset: label,
          provider,
          file: relativeExperimentPath(filePath),
          reason: loaded.reason,
        });
        continue;
      }

      const packetId =
        loaded.data.packet_id ||
        inferPacketIdFromFilename(entry.name) ||
        inferPacketIdFromFilename(path.basename(filePath));
      if (!packetId) {
        malformedRecords.push({
          dataset: label,
          provider,
          file: relativeExperimentPath(filePath),
          reason: "packet_id missing and could not be inferred from filename",
        });
        continue;
      }

      const key = `${provider}:${packetId}`;
      records.set(key, {
        dataset: label,
        provider,
        packetId,
        file: relativeExperimentPath(filePath),
        data: loaded.data,
        parseMode: loaded.parseMode,
      });
    }
  }

  const missingRecords = [];
  for (const provider of providers) {
    for (const packetId of packetIds) {
      const key = `${provider}:${packetId}`;
      if (!records.has(key)) {
        missingRecords.push({
          dataset: label,
          provider,
          packet_id: packetId,
        });
      }
    }
  }

  return {
    label,
    rootDir,
    records,
    summary: {
      expectedPackets: packetIds.length,
      expectedModels: providers.length,
      expectedObservations: packetIds.length * providers.length,
      observedFiles: files.length,
      parsedObservations: records.size,
      missingCount: missingRecords.length,
      malformedCount: malformedRecords.length,
      missingRecords,
      malformedRecords,
      parsedWithNormalization: [...records.values()].filter(
        (record) => record.parseMode !== "direct",
      ).length,
      files,
    },
  };
}

async function loadObservationFile(filePath, provider) {
  const raw = await readFile(filePath, "utf8");
  const candidates = [
    { mode: "direct", text: stripBom(raw) },
    { mode: "normalized_quotes", text: normalizeJsonLikeText(raw) },
  ];

  for (const candidate of candidates) {
    try {
      const data = JSON.parse(candidate.text);
      return {
        ok: true,
        parseMode: candidate.mode,
        data: normalizeObservation(data, provider),
      };
    } catch {
      continue;
    }
  }

  return {
    ok: false,
    reason: "JSON parse failed even after quote normalization",
  };
}

function normalizeObservation(data, provider) {
  return {
    ...data,
    packet_id: asString(data.packet_id),
    blinded_artifact_id: asString(data.blinded_artifact_id),
    recognized_artifact: asString(data.recognized_artifact),
    primitive_sequence: asStringArray(data.primitive_sequence),
    transitions: normalizeTransitions(data.transitions),
    entry_primitive: asString(data.entry_primitive),
    exit_primitive: asString(data.exit_primitive),
    loops: normalizeArrayField(data.loops),
    branches: normalizeArrayField(data.branches),
    dominant_primitive: asString(data.dominant_primitive),
    reasoning_shape: asString(data.reasoning_shape),
    candidate_missing_primitives: asStringArray(data.candidate_missing_primitives),
    ambiguities: asStringArray(data.ambiguities),
    confidence: normalizeConfidence(data.confidence),
    _provider: provider,
  };
}

function compareDatasets(datasetA, datasetB) {
  const comparisons = [];

  for (const provider of providers) {
    for (const packetId of packetIds) {
      const key = `${provider}:${packetId}`;
      const prior = datasetA.records.get(key) ?? null;
      const repeat = datasetB.records.get(key) ?? null;
      comparisons.push(comparePair(packetId, provider, prior, repeat));
    }
  }

  return comparisons;
}

function comparePair(packetId, provider, priorRecord, repeatRecord) {
  if (!priorRecord || !repeatRecord) {
    return {
      packet_id: packetId,
      provider,
      classification: "missing_or_invalid",
      prior_file: priorRecord?.file ?? null,
      repeat_file: repeatRecord?.file ?? null,
      backbone: null,
      field_changes: {},
      transition_summary: emptyTransitionSummary(),
      added_primitives: [],
      removed_primitives: [],
      recognized_changed: false,
      missing_primitive_drift: false,
      notes: "One or both observations are missing or invalid.",
    };
  }

  const prior = priorRecord.data;
  const repeat = repeatRecord.data;
  const schemaMissing = backboneFields.filter((field) =>
    isSchemaMismatchField(field, prior, repeat),
  );
  const priorMajorSequence = stripElaborationPrimitives(prior.primitive_sequence);
  const repeatMajorSequence = stripElaborationPrimitives(repeat.primitive_sequence);

  const fieldChanges = {
    recognized_artifact: compareScalarField(
      prior.recognized_artifact,
      repeat.recognized_artifact,
    ),
    primitive_sequence: compareArrayField(
      prior.primitive_sequence,
      repeat.primitive_sequence,
    ),
    transitions: compareTransitionField(prior.transitions, repeat.transitions),
    entry_primitive: compareScalarField(prior.entry_primitive, repeat.entry_primitive),
    exit_primitive: compareScalarField(prior.exit_primitive, repeat.exit_primitive),
    loops: compareArrayField(prior.loops, repeat.loops),
    branches: compareArrayField(prior.branches, repeat.branches),
    dominant_primitive: compareScalarField(
      prior.dominant_primitive,
      repeat.dominant_primitive,
    ),
    reasoning_shape: compareScalarField(prior.reasoning_shape, repeat.reasoning_shape),
    candidate_missing_primitives: compareArrayField(
      prior.candidate_missing_primitives,
      repeat.candidate_missing_primitives,
    ),
    ambiguities: compareArrayField(prior.ambiguities, repeat.ambiguities),
    confidence: compareObjectField(prior.confidence, repeat.confidence),
    major_primitive_sequence: compareArrayField(priorMajorSequence, repeatMajorSequence),
  };

  const backboneStable =
    fieldChanges.entry_primitive.match &&
    fieldChanges.exit_primitive.match &&
    fieldChanges.dominant_primitive.match &&
    fieldChanges.major_primitive_sequence.match &&
    (schemaMissing.includes("reasoning_shape") || fieldChanges.reasoning_shape.match);

  const transitionSummary = fieldChanges.transitions;
  const nonElaborationSequenceDiff =
    !fieldChanges.major_primitive_sequence.match ||
    hasAddedOrRemovedNonElaborationPrimitive(
      fieldChanges.primitive_sequence.added,
      fieldChanges.primitive_sequence.removed,
    );
  const candidateMissingDrift = !fieldChanges.candidate_missing_primitives.match;

  let classification = "stable";
  if (schemaMissing.length > 0) {
    classification = "schema_incomparable";
  } else if (!backboneStable || nonElaborationSequenceDiff) {
    classification = "structural_drift";
  } else if (
    !fieldChanges.primitive_sequence.match ||
    !transitionSummary.match ||
    !fieldChanges.loops.match ||
    !fieldChanges.branches.match ||
    candidateMissingDrift ||
    !fieldChanges.ambiguities.match ||
    !fieldChanges.confidence.match
  ) {
    classification = "elaboration_drift";
  }

  return {
    packet_id: packetId,
    provider,
    classification,
    prior_file: priorRecord.file,
    repeat_file: repeatRecord.file,
    backbone: {
      prior_entry: prior.entry_primitive,
      repeat_entry: repeat.entry_primitive,
      prior_exit: prior.exit_primitive,
      repeat_exit: repeat.exit_primitive,
      prior_dominant: prior.dominant_primitive,
      repeat_dominant: repeat.dominant_primitive,
      prior_reasoning_shape: prior.reasoning_shape || null,
      repeat_reasoning_shape: repeat.reasoning_shape || null,
      prior_major_sequence: priorMajorSequence,
      repeat_major_sequence: repeatMajorSequence,
      schema_missing_fields: schemaMissing,
      stable: backboneStable,
    },
    field_changes: fieldChanges,
    transition_summary: transitionSummary,
    added_primitives: fieldChanges.primitive_sequence.added,
    removed_primitives: fieldChanges.primitive_sequence.removed,
    recognized_changed: !fieldChanges.recognized_artifact.match,
    missing_primitive_drift: candidateMissingDrift,
    notes: buildPairNote(classification, schemaMissing, transitionSummary),
  };
}

function buildAggregates(datasetA, datasetB, comparisons) {
  const aggregateCounts = {
    compared_pairs: comparisons.length,
    stable: 0,
    elaboration_drift: 0,
    structural_drift: 0,
    schema_incomparable: 0,
    missing_or_invalid: 0,
    backbone_stable: 0,
    recognition_drift: 0,
    missing_primitive_drift: 0,
    parsed_with_normalization_dataset_b: datasetB.summary.parsedWithNormalization,
  };

  const fieldDriftCounts = {
    entry: 0,
    exit: 0,
    dominant_primitive: 0,
    sequence: 0,
    transitions: 0,
    loops: 0,
    branches: 0,
    reasoning_shape: 0,
  };

  const packetSummaries = new Map();
  const modelSignatures = new Map();
  const primitiveCounts = {
    dataset_a: new Map(),
    dataset_b: new Map(),
  };
  const transitionCounts = {
    stable: new Map(),
    added: new Map(),
    removed: new Map(),
    recurring: new Map(),
  };

  for (const provider of providers) {
    modelSignatures.set(provider, {
      model: provider.toUpperCase(),
      stable_count: 0,
      elaboration_drift_count: 0,
      structural_drift_count: 0,
      schema_incomparable_count: 0,
      missing_or_invalid_count: 0,
      added_primitives: new Map(),
      removed_primitives: new Map(),
      notes: [],
    });
  }

  for (const record of datasetA.records.values()) {
    countOccurrences(record.data.primitive_sequence, primitiveCounts.dataset_a);
  }
  for (const record of datasetB.records.values()) {
    countOccurrences(record.data.primitive_sequence, primitiveCounts.dataset_b);
  }

  for (const comparison of comparisons) {
    aggregateCounts[comparison.classification] += 1;
    if (comparison.backbone?.stable) {
      aggregateCounts.backbone_stable += 1;
    }
    if (comparison.recognized_changed) {
      aggregateCounts.recognition_drift += 1;
    }
    if (comparison.missing_primitive_drift) {
      aggregateCounts.missing_primitive_drift += 1;
    }

    if (!comparison.field_changes.entry_primitive?.match) {
      fieldDriftCounts.entry += 1;
    }
    if (!comparison.field_changes.exit_primitive?.match) {
      fieldDriftCounts.exit += 1;
    }
    if (!comparison.field_changes.dominant_primitive?.match) {
      fieldDriftCounts.dominant_primitive += 1;
    }
    if (!comparison.field_changes.primitive_sequence?.match) {
      fieldDriftCounts.sequence += 1;
    }
    if (!comparison.field_changes.transitions?.match) {
      fieldDriftCounts.transitions += 1;
    }
    if (!comparison.field_changes.loops?.match) {
      fieldDriftCounts.loops += 1;
    }
    if (!comparison.field_changes.branches?.match) {
      fieldDriftCounts.branches += 1;
    }
    if (!comparison.field_changes.reasoning_shape?.match) {
      fieldDriftCounts.reasoning_shape += 1;
    }

    const packetSummary =
      packetSummaries.get(comparison.packet_id) ??
      {
        packet_id: comparison.packet_id,
        classifications: [],
        providers: [],
      };
    packetSummary.classifications.push(comparison.classification);
    packetSummary.providers.push({
      provider: comparison.provider,
      classification: comparison.classification,
      note: comparison.notes,
    });
    packetSummaries.set(comparison.packet_id, packetSummary);

    const modelSignature = modelSignatures.get(comparison.provider);
    modelSignature[`${comparison.classification}_count`] += 1;
    for (const primitive of comparison.added_primitives) {
      incrementCount(modelSignature.added_primitives, primitive);
    }
    for (const primitive of comparison.removed_primitives) {
      incrementCount(modelSignature.removed_primitives, primitive);
    }

    const shared = comparison.transition_summary.shared ?? [];
    const added = comparison.transition_summary.added ?? [];
    const removed = comparison.transition_summary.removed ?? [];
    for (const transition of shared) {
      incrementCount(transitionCounts.stable, transition);
      incrementCount(transitionCounts.recurring, transition);
    }
    for (const transition of added) {
      incrementCount(transitionCounts.added, transition);
    }
    for (const transition of removed) {
      incrementCount(transitionCounts.removed, transition);
    }
  }

  const primitiveMatrix = buildPrimitiveMatrix(primitiveCounts);
  const packetSummaryList = [...packetSummaries.values()].map((packetSummary) => ({
    ...packetSummary,
    dominant_classification: summarizeClassifications(packetSummary.classifications),
  }));

  return {
    aggregateCounts,
    fieldDriftCounts,
    primitiveCounts: primitiveMatrix,
    transitionCounts: {
      stable: toSortedEntries(transitionCounts.stable),
      added: toSortedEntries(transitionCounts.added),
      removed: toSortedEntries(transitionCounts.removed),
      recurring: toSortedEntries(transitionCounts.recurring),
    },
    modelSignatures: [...modelSignatures.values()].map((signature) => ({
      model: signature.model,
      stable_count: signature.stable_count,
      elaboration_drift_count: signature.elaboration_drift_count,
      structural_drift_count: signature.structural_drift_count,
      schema_incomparable_count: signature.schema_incomparable_count,
      missing_or_invalid_count: signature.missing_or_invalid_count,
      common_added_primitives: toSortedEntries(signature.added_primitives).slice(0, 5),
      common_removed_primitives: toSortedEntries(signature.removed_primitives).slice(0, 5),
      notes: signature.notes,
    })),
    packetSummaries: packetSummaryList,
    comparisons,
  };
}

function buildPrimitiveMatrix(primitiveCounts) {
  const primitives = new Set([
    ...primitiveCounts.dataset_a.keys(),
    ...primitiveCounts.dataset_b.keys(),
  ]);
  return [...primitives]
    .sort()
    .map((primitive) => {
      const countA = primitiveCounts.dataset_a.get(primitive) ?? 0;
      const countB = primitiveCounts.dataset_b.get(primitive) ?? 0;
      const change = countB - countA;
      let driftPattern = "stable";
      if (change > 0) {
        driftPattern = elaborationPrimitives.has(primitive)
          ? "elaboration_increase"
          : "increase";
      } else if (change < 0) {
        driftPattern = elaborationPrimitives.has(primitive)
          ? "elaboration_decrease"
          : "decrease";
      }
      const notes = elaborationPrimitives.has(primitive)
        ? "Listed as potentially elaboration-sensitive."
        : "";
      return {
        primitive,
        dataset_a_count: countA,
        dataset_b_count: countB,
        change,
        drift_pattern: driftPattern,
        notes,
      };
    });
}

function buildDatasetComparisonReport(datasetA, datasetB, aggregates) {
  const counts = aggregates.aggregateCounts;
  const stablePct = percent(counts.stable, counts.compared_pairs);
  const backbonePct = percent(counts.backbone_stable, counts.compared_pairs);
  const elaborationPct = percent(counts.elaboration_drift, counts.compared_pairs);
  const structuralPct = percent(counts.structural_drift, counts.compared_pairs);

  return `# FE-012C Dataset Comparison Report

## Purpose

Compare the original FE-012C manual replication dataset against FE-012C repeatability run 001 using the same packet instrument and provider grouping.

## Dataset A Description

Dataset A is the original FE-012C manual replication dataset stored under \`research/experiments/FE-012C-manual-replication/responses/\`.

- Parsed observations: ${datasetA.summary.parsedObservations}
- Expected observations: ${datasetA.summary.expectedObservations}
- Missing records: ${datasetA.summary.missingCount}
- Malformed records: ${datasetA.summary.malformedCount}

## Dataset B Description

Dataset B is FE-012C repeatability run 001 stored under \`research/experiments/FE-012C-repeatability-run-001/responses/\`.

- Parsed observations: ${datasetB.summary.parsedObservations}
- Expected observations: ${datasetB.summary.expectedObservations}
- Missing records: ${datasetB.summary.missingCount}
- Malformed records: ${datasetB.summary.malformedCount}
- Parsed with quote normalization: ${datasetB.summary.parsedWithNormalization}

## Data Validity Summary

- Expected packets: ${datasetA.summary.expectedPackets}
- Expected models: ${datasetA.summary.expectedModels}
- Expected observations per dataset: ${datasetA.summary.expectedObservations}
- Expected observations total: ${datasetA.summary.expectedObservations + datasetB.summary.expectedObservations}
- Parsed observations total: ${datasetA.summary.parsedObservations + datasetB.summary.parsedObservations}

## Overall Stability Summary

- Stable pairs: ${counts.stable}/${counts.compared_pairs} (${stablePct})
- Elaboration drift pairs: ${counts.elaboration_drift}/${counts.compared_pairs} (${elaborationPct})
- Structural drift pairs: ${counts.structural_drift}/${counts.compared_pairs} (${structuralPct})
- Schema incomparable pairs: ${counts.schema_incomparable}/${counts.compared_pairs}
- Missing or invalid pairs: ${counts.missing_or_invalid}/${counts.compared_pairs}

## Backbone Stability

- Backbone-stable pairs: ${counts.backbone_stable}/${counts.compared_pairs} (${backbonePct})
- Entry drift pairs: ${aggregates.fieldDriftCounts.entry}
- Exit drift pairs: ${aggregates.fieldDriftCounts.exit}
- Dominant primitive drift pairs: ${aggregates.fieldDriftCounts.dominant_primitive}
- Reasoning shape drift pairs: ${aggregates.fieldDriftCounts.reasoning_shape}

## Elaboration Drift

Elaboration drift is used when backbone fields remain stable but optional elaboration primitives, transitions, loops, branches, ambiguities, or confidence details change.

- Sequence drift pairs: ${aggregates.fieldDriftCounts.sequence}
- Transition drift pairs: ${aggregates.fieldDriftCounts.transitions}
- Loops drift pairs: ${aggregates.fieldDriftCounts.loops}
- Branches drift pairs: ${aggregates.fieldDriftCounts.branches}

## Structural Drift

Structural drift is used when entry, exit, dominant primitive, reasoning shape, or major sequence changes materially.

- Structural drift pairs: ${counts.structural_drift}

## Recognition Drift

- Recognized artifact changed in ${counts.recognition_drift}/${counts.compared_pairs} pairs.

Recognition drift should not be treated as proof of semantic change. It may reflect naming variation, broader artifact recall, or model-specific pattern completion.

## Missing Primitive Drift

- Candidate missing primitive drift occurred in ${counts.missing_primitive_drift}/${counts.compared_pairs} pairs.

## Interpretation Constraints

- This is a measurement analysis task, not a validation of theory.
- Stable agreement does not prove the primitive model.
- Drift does not by itself falsify the instrument.
- Some Dataset B files required quote normalization before parsing, which should be treated as a storage-format issue rather than a reasoning result.
- Repeatability conclusions remain sensitive to the constrained primitive vocabulary and to artifact recognition effects.

## Next Recommended Analysis

- Inspect per-packet drift in \`FE-012C-drift-analysis.md\`.
- Inspect primitive frequency changes in \`FE-012C-stability-matrix.md\`.
- Inspect per-model tendencies in \`FE-012C-model-signatures.md\`.
- Inspect transition changes in \`FE-012C-transition-comparison.md\`.
`;
}

function buildStabilityMatrixReport(aggregates) {
  const rows = aggregates.primitiveCounts
    .map(
      (row) =>
        `| ${row.primitive} | ${row.dataset_a_count} | ${row.dataset_b_count} | ${signed(row.change)} | ${row.drift_pattern} | ${row.notes || ""} |`,
    )
    .join("\n");

  const stablePrimitives = aggregates.primitiveCounts
    .filter((row) => row.change === 0)
    .map((row) => row.primitive);
  const driftPronePrimitives = aggregates.primitiveCounts
    .filter((row) => row.change !== 0)
    .map((row) => row.primitive);
  const candidateBackbone = aggregates.primitiveCounts
    .filter((row) => !elaborationPrimitives.has(row.primitive) && row.change === 0)
    .map((row) => row.primitive);
  const candidateElaboration = aggregates.primitiveCounts
    .filter((row) => elaborationPrimitives.has(row.primitive))
    .map((row) => row.primitive);

  return `# FE-012C Stability Matrix

## Primitive Occurrence Comparison

| Primitive | Dataset A Count | Dataset B Count | Change | Drift Pattern | Notes |
| --- | ---: | ---: | ---: | --- | --- |
${rows}

## Stable Primitives

${stablePrimitives.length ? stablePrimitives.join(", ") : "None"}

## Drift-Prone Primitives

${driftPronePrimitives.length ? driftPronePrimitives.join(", ") : "None"}

## Candidate Backbone Primitives

${candidateBackbone.length ? candidateBackbone.join(", ") : "None"}

## Candidate Elaboration Primitives

${candidateElaboration.length ? candidateElaboration.join(", ") : "None"}

## Notes On Schema Limitations

- Primitive counts depend on \`primitive_sequence\` only.
- Missing \`reasoning_shape\` or \`confidence\` fields are handled gracefully and do not count as parse failures.
- Primitive frequency change does not by itself distinguish better extraction from more elaborate extraction.
`;
}

function buildDriftAnalysisReport(aggregates) {
  const packetRows = aggregates.packetSummaries
    .map((packetSummary) => {
      const providerSummary = packetSummary.providers
        .map((provider) => `${provider.provider}:${provider.classification}`)
        .join(", ");
      return `| ${packetSummary.packet_id} | ${packetSummary.dominant_classification} | ${providerSummary} |`;
    })
    .join("\n");

  const modelRows = aggregates.modelSignatures
    .map(
      (signature) =>
        `| ${signature.model} | ${signature.stable_count} | ${signature.elaboration_drift_count} | ${signature.structural_drift_count} | ${signature.schema_incomparable_count} | ${signature.missing_or_invalid_count} |`,
    )
    .join("\n");

  const fieldRows = [
    ["entry", aggregates.fieldDriftCounts.entry],
    ["exit", aggregates.fieldDriftCounts.exit],
    ["dominant primitive", aggregates.fieldDriftCounts.dominant_primitive],
    ["sequence", aggregates.fieldDriftCounts.sequence],
    ["transitions", aggregates.fieldDriftCounts.transitions],
    ["loops", aggregates.fieldDriftCounts.loops],
    ["branches", aggregates.fieldDriftCounts.branches],
    ["reasoning_shape", aggregates.fieldDriftCounts.reasoning_shape],
  ]
    .map(([field, count]) => `| ${field} | ${count} |`)
    .join("\n");

  return `# FE-012C Drift Analysis

## Per-Packet Drift Summary

| Packet ID | Dominant Drift Classification | Provider Breakdown |
| --- | --- | --- |
${packetRows}

## Per-Model Drift Summary

| Model | Stable | Elaboration Drift | Structural Drift | Schema Incomparable | Missing Or Invalid |
| --- | ---: | ---: | ---: | ---: | ---: |
${modelRows}

## Field-Specific Drift

| Field | Drift Count |
| --- | ---: |
${fieldRows}

## Backbone Drift Versus Elaboration Drift

- Backbone drift is counted when entry, exit, dominant primitive, reasoning shape, or major non-elaboration sequence changes materially.
- Elaboration drift is counted when backbone remains stable but elaboration-sensitive primitives, transitions, loops, branches, ambiguities, or confidence details shift.
- Schema incomparable is reserved for missing backbone fields attributable to schema mismatch rather than semantic disagreement.
`;
}

function buildModelSignaturesReport(aggregates) {
  const findSignature = (model) =>
    aggregates.modelSignatures.find((signature) => signature.model === model);
  const gpt = findSignature("GPT");
  const claude = findSignature("CLAUDE");
  const gemini = findSignature("GEMINI");

  return `# FE-012C Model Signatures

## GPT Repeatability Pattern

- Stable count: ${gpt.stable_count}
- Elaboration drift count: ${gpt.elaboration_drift_count}
- Structural drift count: ${gpt.structural_drift_count}
- Common added primitives: ${formatCountList(gpt.common_added_primitives)}
- Common removed primitives: ${formatCountList(gpt.common_removed_primitives)}

## Claude Repeatability Pattern

- Stable count: ${claude.stable_count}
- Elaboration drift count: ${claude.elaboration_drift_count}
- Structural drift count: ${claude.structural_drift_count}
- Common added primitives: ${formatCountList(claude.common_added_primitives)}
- Common removed primitives: ${formatCountList(claude.common_removed_primitives)}

## Gemini Repeatability Pattern

- Stable count: ${gemini.stable_count}
- Elaboration drift count: ${gemini.elaboration_drift_count}
- Structural drift count: ${gemini.structural_drift_count}
- Common added primitives: ${formatCountList(gemini.common_added_primitives)}
- Common removed primitives: ${formatCountList(gemini.common_removed_primitives)}

## Shared Model Behaviors

- All three providers were evaluated with the same packet IDs and packet contents.
- Shared stability should be treated as instrument repeatability evidence, not as independent confirmation of theory.
- Shared drift may reflect packet ambiguity, vocabulary pressure, or common pattern-completion behavior.

## Model-Specific Tendencies

Use the primitive add/remove tables above as descriptive signatures only.

Do not treat these tendencies as stable model personality traits without additional reruns.

## Warnings Against Overinterpreting Model Personality

- The sample size is limited to 15 packets per provider.
- Provider outputs remain sensitive to prompt phrasing, conversation freshness, and latent artifact recognition.
- Same-family or same-provider consistency is not equivalent to human or independent replication.
`;
}

function buildTransitionComparisonReport(aggregates) {
  return `# FE-012C Transition Comparison

## Most Stable Transitions

${formatTransitionList(aggregates.transitionCounts.stable)}

## Most Frequently Added Transitions

${formatTransitionList(aggregates.transitionCounts.added)}

## Most Frequently Removed Transitions

${formatTransitionList(aggregates.transitionCounts.removed)}

## Transitions That Appear In Both Datasets Across Multiple Models

${formatTransitionList(
    aggregates.transitionCounts.recurring.filter(([, count]) => count >= 2),
  )}

## Notes On Transition Grammar Implications

- Transition stability suggests recurring local grammar patterns.
- Transition drift may indicate elaboration differences rather than wholesale structural disagreement.
- Transition counts alone do not establish a final grammar.
`;
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
    .map((item) => (typeof item === "string" ? item.trim() : stableStringify(item)))
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

function normalizeArrayField(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((item) => stableStringify(item));
}

function normalizeConfidence(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(value)
      .map(([key, entry]) => [key, asString(entry)])
      .filter(([, entry]) => entry),
  );
}

function stableStringify(value) {
  return JSON.stringify(sortKeys(value));
}

function sortKeys(value) {
  if (Array.isArray(value)) {
    return value.map(sortKeys);
  }
  if (!value || typeof value !== "object") {
    return value;
  }
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, sortKeys(value[key])]),
  );
}

function compareScalarField(prior, repeat) {
  return {
    prior,
    repeat,
    match: normalizeText(prior) === normalizeText(repeat),
  };
}

function compareArrayField(prior, repeat) {
  const priorValues = Array.isArray(prior) ? prior : [];
  const repeatValues = Array.isArray(repeat) ? repeat : [];
  const priorNormalized = priorValues.map(normalizeText);
  const repeatNormalized = repeatValues.map(normalizeText);
  return {
    prior: priorValues,
    repeat: repeatValues,
    match: arraysEqual(priorNormalized, repeatNormalized),
    added: difference(repeatValues, priorValues),
    removed: difference(priorValues, repeatValues),
  };
}

function compareObjectField(prior, repeat) {
  const priorText = stableStringify(prior || {});
  const repeatText = stableStringify(repeat || {});
  return {
    prior: prior || {},
    repeat: repeat || {},
    match: priorText === repeatText,
  };
}

function compareTransitionField(prior, repeat) {
  const priorValues = Array.isArray(prior) ? prior : [];
  const repeatValues = Array.isArray(repeat) ? repeat : [];
  const priorSet = new Set(priorValues);
  const repeatSet = new Set(repeatValues);
  const shared = [...priorSet].filter((transition) => repeatSet.has(transition)).sort();
  const removed = [...priorSet].filter((transition) => !repeatSet.has(transition)).sort();
  const added = [...repeatSet].filter((transition) => !priorSet.has(transition)).sort();
  return {
    prior: priorValues,
    repeat: repeatValues,
    match: removed.length === 0 && added.length === 0,
    shared,
    unchanged: shared,
    added,
    removed,
  };
}

function arraysEqual(a, b) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
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
  return asString(String(value ?? ""))
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function stripElaborationPrimitives(sequence) {
  return (Array.isArray(sequence) ? sequence : []).filter(
    (primitive) => !elaborationPrimitives.has(primitive),
  );
}

function hasAddedOrRemovedNonElaborationPrimitive(added, removed) {
  return [...added, ...removed].some(
    (primitive) => !elaborationPrimitives.has(primitive),
  );
}

function isSchemaMismatchField(field, prior, repeat) {
  const priorValue = prior[field];
  const repeatValue = repeat[field];
  return Boolean(priorValue) !== Boolean(repeatValue);
}

function buildPairNote(classification, schemaMissing, transitionSummary) {
  if (classification === "missing_or_invalid") {
    return "Missing or invalid observation prevented comparison.";
  }
  if (classification === "schema_incomparable") {
    return `Schema mismatch in ${schemaMissing.join(", ")}.`;
  }
  if (classification === "structural_drift") {
    return "Backbone fields or major non-elaboration sequence changed.";
  }
  if (classification === "elaboration_drift") {
    return `Backbone stable; transition changes added ${transitionSummary.added.length} and removed ${transitionSummary.removed.length}.`;
  }
  return "Backbone and transition structure remained materially stable.";
}

function emptyTransitionSummary() {
  return {
    prior: [],
    repeat: [],
    match: false,
    shared: [],
    unchanged: [],
    added: [],
    removed: [],
  };
}

function countOccurrences(values, counts) {
  for (const value of values) {
    incrementCount(counts, value);
  }
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

function summarizeClassifications(classifications) {
  const counts = new Map();
  for (const classification of classifications) {
    incrementCount(counts, classification);
  }
  return toSortedEntries(counts)[0]?.[0] ?? "unknown";
}

function relativeExperimentPath(filePath) {
  return path.relative(path.resolve(experimentDir, "..", "..", ".."), filePath);
}

function percent(numerator, denominator) {
  if (!denominator) {
    return "0%";
  }
  return `${((numerator / denominator) * 100).toFixed(1)}%`;
}

function signed(value) {
  return value > 0 ? `+${value}` : String(value);
}

function formatCountList(entries) {
  if (!entries.length) {
    return "None";
  }
  return entries.map(([name, count]) => `${name} (${count})`).join(", ");
}

function formatTransitionList(entries) {
  if (!entries.length) {
    return "None";
  }
  return entries
    .slice(0, 10)
    .map(([transition, count]) => `- \`${transition}\`: ${count}`)
    .join("\n");
}
