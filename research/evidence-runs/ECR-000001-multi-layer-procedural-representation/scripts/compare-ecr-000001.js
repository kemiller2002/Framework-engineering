import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const experimentDir = path.resolve(__dirname, "..");
const responsesDir = path.join(experimentDir, "responses");
const comparisonDir = path.join(experimentDir, "comparison", "generated");
const responseSchemaPath = path.join(experimentDir, "response-schema.json");

const providers = ["gpt", "claude", "gemini"];
const packetIds = ["ECR-000001-P001", "ECR-000001-P002", "ECR-000001-P003"];
const packetLegacyIds = {
  "ECR-000001-P001": "001",
  "ECR-000001-P002": "002",
  "ECR-000001-P003": "003",
};
const packetLabels = {
  "ECR-000001-P001": "Scientific Method",
  "ECR-000001-P002": "Scrum Workflow",
  "ECR-000001-P003": "Bloom Taxonomy",
};
const confidenceKeys = [
  "structural_layer",
  "primitive_layer",
  "constraint_layer",
  "representation_layer",
  "product_relevance_layer",
  "overall",
];
const expectedFieldPaths = [
  "packet_id",
  "blinded_artifact_id",
  "recognized_artifact",
  "structural_layer.entry_conditions",
  "structural_layer.exit_conditions",
  "structural_layer.required_steps",
  "structural_layer.optional_steps",
  "structural_layer.loops",
  "structural_layer.branches",
  "structural_layer.termination_conditions",
  "structural_layer.control_flow_shape",
  "primitive_layer.primitive_sequence",
  "primitive_layer.transitions",
  "primitive_layer.dominant_primitive",
  "primitive_layer.candidate_missing_primitives",
  "constraint_layer.invariants",
  "constraint_layer.preconditions",
  "constraint_layer.postconditions",
  "constraint_layer.stopping_criteria",
  "constraint_layer.validity_conditions",
  "representation_layer.procedural_ast",
  "representation_layer.natural_language_summary",
  "representation_layer.canonical_summary",
  "representation_layer.ambiguities",
  "product_relevance_layer.clarity_relevance_observations",
  "product_relevance_layer.edf_relevance_observations",
  "product_relevance_layer.research_only_observations",
  "confidence.structural_layer",
  "confidence.primitive_layer",
  "confidence.constraint_layer",
  "confidence.representation_layer",
  "confidence.product_relevance_layer",
  "confidence.overall",
  "notes",
];
const productPromotionPattern =
  /\b(validat(?:e|ed|ion)|prove[sd]?|supports?\s+framework engineering|demonstrates?\s+framework engineering|confirms?)\b/i;

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  await mkdir(comparisonDir, { recursive: true });
  const schema = await loadSchema();
  const records = await loadAllRecords();
  const byPacket = buildPacketComparisons(records);
  const aggregate = buildAggregateSummary(records, byPacket, schema);
  const rawNormalized = buildRawNormalizedTable(records);

  await Promise.all([
    writeFile(
      path.join(comparisonDir, "raw-normalized-table.json"),
      `${JSON.stringify(rawNormalized, null, 2)}\n`,
    ),
    writeFile(
      path.join(comparisonDir, "ecr-000001-comparator-report.md"),
      buildComparatorReport(records, byPacket, aggregate),
    ),
    writeFile(
      path.join(comparisonDir, "instrument-metrics.md"),
      buildInstrumentMetricsReport(records, aggregate, schema),
    ),
    writeFile(
      path.join(comparisonDir, "structural-agreement.md"),
      buildStructuralReport(byPacket),
    ),
    writeFile(
      path.join(comparisonDir, "primitive-agreement.md"),
      buildPrimitiveReport(byPacket),
    ),
    writeFile(
      path.join(comparisonDir, "constraint-agreement.md"),
      buildConstraintReport(byPacket),
    ),
    writeFile(
      path.join(comparisonDir, "representation-agreement.md"),
      buildRepresentationReport(byPacket),
    ),
    writeFile(
      path.join(comparisonDir, "product-relevance-observations.md"),
      buildProductReport(byPacket, aggregate),
    ),
    writeFile(
      path.join(comparisonDir, "hypothesis-review-input.md"),
      buildHypothesisReviewInput(aggregate, byPacket),
    ),
  ]);
}

async function loadSchema() {
  const raw = await readFile(responseSchemaPath, "utf8");
  return JSON.parse(raw);
}

async function loadAllRecords() {
  const records = [];

  for (const provider of providers) {
    for (const packetId of packetIds) {
      records.push(await loadRecord(provider, packetId));
    }
  }

  return records;
}

async function loadRecord(provider, packetId) {
  const legacyId = packetLegacyIds[packetId];
  const canonicalName = `${packetId}-${provider}.json`;
  const legacyName = `${legacyId}.json`;
  const canonicalPath = path.join(responsesDir, provider, canonicalName);
  const legacyPath = path.join(responsesDir, provider, legacyName);

  let raw = null;
  let sourcePath = canonicalPath;
  let sourceKind = "canonical";
  try {
    raw = await readFile(canonicalPath, "utf8");
  } catch {
    try {
      raw = await readFile(legacyPath, "utf8");
      sourcePath = legacyPath;
      sourceKind = "legacy_fallback";
    } catch {
      return buildMissingRecord(provider, packetId, canonicalPath, legacyPath);
    }
  }

  const parsed = parseResponseFile(raw);
  if (!parsed.ok) {
    return {
      provider,
      packetId,
      packetLabel: packetLabels[packetId],
      expectedCanonicalPath: relativeToExperiment(canonicalPath),
      fallbackPath: relativeToExperiment(legacyPath),
      sourcePath: relativeToExperiment(sourcePath),
      sourceKind,
      status: "malformed",
      validJson: false,
      strictJson: false,
      normalizedParseUsed: false,
      parseError: parsed.error,
      malformed: true,
      missing: false,
      recognizedPresent: false,
      ambiguityCount: 0,
      schemaCompleteness: "incomplete",
      missingFields: [...expectedFieldPaths],
      confidenceValues: {},
      promotionalProductWording: [],
      normalized: null,
    };
  }

  const normalized = normalizeResponse(parsed.data, provider, packetId);
  const missingFields = expectedFieldPaths.filter((fieldPath) => isMissingField(parsed.data, fieldPath));
  const promotionalProductWording = findPromotionalProductWording(normalized);

  return {
    provider,
    packetId,
    packetLabel: packetLabels[packetId],
    expectedCanonicalPath: relativeToExperiment(canonicalPath),
    fallbackPath: relativeToExperiment(legacyPath),
    sourcePath: relativeToExperiment(sourcePath),
    sourceKind,
    status: "ok",
    validJson: true,
    strictJson: parsed.strict,
    normalizedParseUsed: !parsed.strict,
    parseError: null,
    malformed: false,
    missing: false,
    recognizedPresent: normalized.recognizedArtifact.length > 0,
    ambiguityCount: normalized.representation.ambiguities.length,
    schemaCompleteness: missingFields.length === 0 ? "complete" : "incomplete",
    missingFields,
    confidenceValues: normalized.confidence,
    promotionalProductWording,
    normalized,
  };
}

function buildMissingRecord(provider, packetId, canonicalPath, legacyPath) {
  return {
    provider,
    packetId,
    packetLabel: packetLabels[packetId],
    expectedCanonicalPath: relativeToExperiment(canonicalPath),
    fallbackPath: relativeToExperiment(legacyPath),
    sourcePath: null,
    sourceKind: "missing",
    status: "missing",
    validJson: false,
    strictJson: false,
    normalizedParseUsed: false,
    parseError: "File not found.",
    malformed: false,
    missing: true,
    recognizedPresent: false,
    ambiguityCount: 0,
    schemaCompleteness: "missing",
    missingFields: [...expectedFieldPaths],
    confidenceValues: {},
    promotionalProductWording: [],
    normalized: null,
  };
}

function parseResponseFile(raw) {
  const candidates = [
    { text: stripBom(raw), strict: true },
    { text: normalizeJsonLikeText(raw), strict: false },
  ];

  for (const candidate of candidates) {
    try {
      return {
        ok: true,
        data: JSON.parse(candidate.text),
        strict: candidate.strict,
      };
    } catch (error) {
      if (candidate.strict) {
        continue;
      }
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown parse error.",
      };
    }
  }

  return {
    ok: false,
    error: "Unable to parse JSON.",
  };
}

function normalizeResponse(data, provider, packetId) {
  const structural = {
    controlFlowShape: asString(data?.structural_layer?.control_flow_shape),
    entryConditions: normalizeObservationArray(data?.structural_layer?.entry_conditions),
    exitConditions: normalizeObservationArray(data?.structural_layer?.exit_conditions),
    requiredSteps: normalizeObservationArray(data?.structural_layer?.required_steps),
    optionalSteps: normalizeObservationArray(data?.structural_layer?.optional_steps),
    loops: normalizeObservationArray(data?.structural_layer?.loops),
    branches: normalizeObservationArray(data?.structural_layer?.branches),
    terminationConditions: normalizeObservationArray(data?.structural_layer?.termination_conditions),
  };
  const primitive = {
    sequence: normalizePrimitiveArray(data?.primitive_layer?.primitive_sequence),
    transitions: normalizePrimitiveArray(data?.primitive_layer?.transitions),
    dominantPrimitive: asString(data?.primitive_layer?.dominant_primitive),
    candidateMissingPrimitives: normalizePrimitiveArray(
      data?.primitive_layer?.candidate_missing_primitives,
    ),
  };
  const constraint = {
    invariants: normalizeObservationArray(data?.constraint_layer?.invariants),
    preconditions: normalizeObservationArray(data?.constraint_layer?.preconditions),
    postconditions: normalizeObservationArray(data?.constraint_layer?.postconditions),
    stoppingCriteria: normalizeObservationArray(data?.constraint_layer?.stopping_criteria),
    validityConditions: normalizeObservationArray(data?.constraint_layer?.validity_conditions),
  };
  const representation = {
    proceduralAstPresent: hasMeaningfulValue(data?.representation_layer?.procedural_ast),
    proceduralAst: data?.representation_layer?.procedural_ast ?? null,
    naturalLanguageSummary: asString(data?.representation_layer?.natural_language_summary),
    canonicalSummary: asString(data?.representation_layer?.canonical_summary),
    ambiguities: normalizeAmbiguities(data?.representation_layer?.ambiguities),
  };
  const product = {
    clarity: normalizeObservationArray(data?.product_relevance_layer?.clarity_relevance_observations),
    edf: normalizeObservationArray(data?.product_relevance_layer?.edf_relevance_observations),
    researchOnly: normalizeObservationArray(
      data?.product_relevance_layer?.research_only_observations,
    ),
  };

  return {
    provider,
    packetId,
    packetLabel: packetLabels[packetId],
    recognizedArtifact: asString(data?.recognized_artifact),
    structural,
    primitive,
    constraint,
    representation,
    product,
    confidence: normalizeConfidence(data?.confidence),
    notes: asString(data?.notes),
  };
}

function buildPacketComparisons(records) {
  return packetIds.map((packetId) => {
    const packetRecords = records.filter((record) => record.packetId === packetId);
    const validRecords = packetRecords.filter((record) => record.normalized);
    const normalizedRecords = validRecords.map((record) => record.normalized);

    const structural = {
      controlFlowShapeAgreement: compareScalarField(
        validRecords,
        (record) => record.normalized.structural.controlFlowShape,
      ),
      entryConditionsSimilarity: compareObservationArrayField(
        validRecords,
        (record) => record.normalized.structural.entryConditions,
      ),
      exitConditionsSimilarity: compareObservationArrayField(
        validRecords,
        (record) => record.normalized.structural.exitConditions,
      ),
      loopPresenceAgreement: compareBooleanPresence(
        validRecords,
        (record) => record.normalized.structural.loops.length > 0,
      ),
      branchPresenceAgreement: compareBooleanPresence(
        validRecords,
        (record) => record.normalized.structural.branches.length > 0,
      ),
      terminationConditionAgreement: compareObservationArrayField(
        validRecords,
        (record) => record.normalized.structural.terminationConditions,
      ),
    };

    const primitive = {
      primitiveSequenceOverlap: comparePrimitiveArrayField(
        validRecords,
        (record) => record.normalized.primitive.sequence,
      ),
      transitionOverlap: comparePrimitiveArrayField(
        validRecords,
        (record) => record.normalized.primitive.transitions,
      ),
      dominantPrimitiveAgreement: compareScalarField(
        validRecords,
        (record) => record.normalized.primitive.dominantPrimitive,
      ),
      candidateMissingPrimitives: comparePrimitiveArrayField(
        validRecords,
        (record) => record.normalized.primitive.candidateMissingPrimitives,
      ),
    };

    const constraint = {
      invariantCount: compareCountField(validRecords, (record) => record.normalized.constraint.invariants),
      preconditionCount: compareCountField(
        validRecords,
        (record) => record.normalized.constraint.preconditions,
      ),
      postconditionCount: compareCountField(
        validRecords,
        (record) => record.normalized.constraint.postconditions,
      ),
      stoppingCriteriaCount: compareCountField(
        validRecords,
        (record) => record.normalized.constraint.stoppingCriteria,
      ),
      validityConditionCount: compareCountField(
        validRecords,
        (record) => record.normalized.constraint.validityConditions,
      ),
      qualitativeOverlap: compareObservationArrayField(
        validRecords,
        (record) => [
          ...record.normalized.constraint.invariants,
          ...record.normalized.constraint.preconditions,
          ...record.normalized.constraint.postconditions,
          ...record.normalized.constraint.stoppingCriteria,
          ...record.normalized.constraint.validityConditions,
        ],
      ),
    };

    const representation = {
      proceduralAstPresent: compareBooleanPresence(
        validRecords,
        (record) => record.normalized.representation.proceduralAstPresent,
      ),
      naturalLanguageSummaryPresent: compareBooleanPresence(
        validRecords,
        (record) => record.normalized.representation.naturalLanguageSummary.length > 0,
      ),
      canonicalSummaryPresent: compareBooleanPresence(
        validRecords,
        (record) => record.normalized.representation.canonicalSummary.length > 0,
      ),
      ambiguityCount: compareCountField(
        validRecords,
        (record) => record.normalized.representation.ambiguities,
      ),
      canonicalSummaryComparison: compareScalarField(
        validRecords,
        (record) => record.normalized.representation.canonicalSummary,
      ),
    };

    const product = {
      clarityObservationCount: compareCountField(validRecords, (record) => record.normalized.product.clarity),
      edfObservationCount: compareCountField(validRecords, (record) => record.normalized.product.edf),
      researchOnlyObservationCount: compareCountField(
        validRecords,
        (record) => record.normalized.product.researchOnly,
      ),
      promotionalWording: packetRecords.flatMap((record) =>
        record.promotionalProductWording.map((warning) => `${record.provider}: ${warning}`),
      ),
    };

    return {
      packetId,
      packetLabel: packetLabels[packetId],
      records: packetRecords,
      validRecords,
      normalizedRecords,
      structural,
      primitive,
      constraint,
      representation,
      product,
    };
  });
}

function buildAggregateSummary(records, byPacket, schema) {
  const validRecords = records.filter((record) => record.status === "ok");
  const malformedRecords = records.filter((record) => record.status === "malformed");
  const missingRecords = records.filter((record) => record.status === "missing");
  const recognitionCount = validRecords.filter((record) => record.recognizedPresent).length;
  const recognitionRate = `${recognitionCount}/${validRecords.length || 0}`;
  const totalAmbiguities = sum(validRecords.map((record) => record.ambiguityCount));
  const structuralAgreements = byPacket.flatMap((packet) =>
    Object.values(packet.structural).map((metric) => metric.category),
  );
  const primitiveAgreements = byPacket.flatMap((packet) =>
    Object.values(packet.primitive).map((metric) => metric.category),
  );

  return {
    schemaKeys: Object.keys(schema),
    totalExpectedFiles: providers.length * packetIds.length,
    validRecordCount: validRecords.length,
    malformedRecordCount: malformedRecords.length,
    missingRecordCount: missingRecords.length,
    recognitionCount,
    recognitionRate,
    totalAmbiguities,
    structuralAgreementDistribution: categoryCounts(structuralAgreements),
    primitiveAgreementDistribution: categoryCounts(primitiveAgreements),
    productPromotionWarnings: records.flatMap((record) =>
      record.promotionalProductWording.map((warning) => ({
        packetId: record.packetId,
        provider: record.provider,
        warning,
      })),
    ),
    interpretationFlags: buildInterpretationFlags(records, byPacket),
  };
}

function buildInterpretationFlags(records, byPacket) {
  const packetMap = new Map(byPacket.map((packet) => [packet.packetId, packet]));
  const p001 = packetMap.get("ECR-000001-P001");
  const p002 = packetMap.get("ECR-000001-P002");
  const p003 = packetMap.get("ECR-000001-P003");

  const p001Richness = averageObservationRichness(p001);
  const p003Richness = averageObservationRichness(p003);
  const bloomBias = p003Richness >= p001Richness;

  const p001Dominant = normalizedValueSet(
    p001?.validRecords.map((record) => record.normalized.primitive.dominantPrimitive) ?? [],
  );
  const p002Dominant = normalizedValueSet(
    p002?.validRecords.map((record) => record.normalized.primitive.dominantPrimitive) ?? [],
  );
  const scrumDistinct = setIntersectionSize(p001Dominant, p002Dominant) === 0 && p002Dominant.size > 0;

  const totalProductObservations = sum(
    records
      .filter((record) => record.normalized)
      .map(
        (record) =>
          record.normalized.product.clarity.length +
          record.normalized.product.edf.length +
          record.normalized.product.researchOnly.length,
      ),
  );
  const totalStructuralObservations = sum(
    records
      .filter((record) => record.normalized)
      .map(
        (record) =>
          record.normalized.structural.entryConditions.length +
          record.normalized.structural.exitConditions.length +
          record.normalized.structural.requiredSteps.length +
          record.normalized.structural.optionalSteps.length +
          record.normalized.structural.loops.length +
          record.normalized.structural.branches.length +
          record.normalized.structural.terminationConditions.length,
      ),
  );
  const productDominance = totalProductObservations > totalStructuralObservations;

  const structuralAgreementWeight = agreementWeight(
    byPacket.flatMap((packet) => Object.values(packet.structural).map((metric) => metric.category)),
  );
  const primitiveAgreementWeight = agreementWeight(
    byPacket.flatMap((packet) => Object.values(packet.primitive).map((metric) => metric.category)),
  );
  const representationStability = structuralAgreementWeight > primitiveAgreementWeight;

  const validRecords = records.filter((record) => record.status === "ok");
  const recognitionRate = validRecords.length === 0
    ? 0
    : validRecords.filter((record) => record.recognizedPresent).length / validRecords.length;
  const recognitionThreat = recognitionRate >= 0.5;

  return {
    bloomBias: {
      active: bloomBias,
      note: bloomBias
        ? "Bloom appears procedurally as rich as or richer than Scientific Method; instrument bias should be reviewed."
        : "Bloom appears less procedurally rich than Scientific Method in this calibration set.",
    },
    scrumDistinct: {
      active: scrumDistinct,
      note: scrumDistinct
        ? "Scrum shows a distinct execution-oriented dominant primitive profile relative to Scientific Method."
        : "Scrum is not cleanly distinct from Scientific Method on dominant primitive phrasing alone.",
    },
    productDominance: {
      active: productDominance,
      note: productDominance
        ? "Product relevance observations outnumber structural observations; schema pressure may be misplaced."
        : "Product relevance observations do not dominate extraction volume.",
    },
    representationStability: {
      active: representationStability,
      note: representationStability
        ? "Structural layer agreement exceeds primitive layer agreement; representation-stability hypothesis is supported as a review question."
        : "Structural layer agreement does not exceed primitive layer agreement in this run.",
    },
    recognitionThreat: {
      active: recognitionThreat,
      note: recognitionThreat
        ? "Recognition is high enough to keep H013 active as a threat."
        : "Recognition is present but below the active-threat threshold used by this comparator.",
    },
  };
}

function buildRawNormalizedTable(records) {
  return records.map((record) => ({
    provider: record.provider,
    packet_id: record.packetId,
    packet_label: record.packetLabel,
    source_path: record.sourcePath,
    source_kind: record.sourceKind,
    status: record.status,
    strict_json: record.strictJson,
    normalized_parse_used: record.normalizedParseUsed,
    valid_json: record.validJson,
    schema_completeness: record.schemaCompleteness,
    missing_fields: record.missingFields,
    recognition_present: record.recognizedPresent,
    recognized_artifact: record.normalized?.recognizedArtifact ?? "",
    ambiguity_count: record.ambiguityCount,
    confidence_values: record.confidenceValues,
    promotional_product_warnings: record.promotionalProductWording,
    normalized: record.normalized,
  }));
}

function buildComparatorReport(records, byPacket, aggregate) {
  const packetRows = byPacket.map((packet) => {
    const strongest = topMetricCategories(packet, "full_agreement");
    const largest = topMetricCategories(packet, "disagreement");
    return `| ${packet.packetId} | ${packet.packetLabel} | ${packet.validRecords.length}/${packet.records.length} | ${strongest || "None"} | ${largest || "None"} |`;
  });

  const readiness = determineInstrumentReadiness(aggregate, byPacket);

  return [
    "# ECR-000001 Comparator Report",
    "",
    "## Executive Summary",
    "",
    `- Valid records: ${aggregate.validRecordCount} of ${aggregate.totalExpectedFiles}.`,
    `- Malformed records: ${aggregate.malformedRecordCount}.`,
    `- Missing records: ${aggregate.missingRecordCount}.`,
    `- Recognition present: ${aggregate.recognitionRate}.`,
    `- Total extracted ambiguity records: ${aggregate.totalAmbiguities}.`,
    `- Instrument readiness recommendation: ${readiness}.`,
    "- Calibration evidence is not theory validation, and this comparator does not update hypotheses automatically.",
    "",
    "## Packet-Level Comparison",
    "",
    "| Packet | Label | Valid Providers | Strongest Agreements | Largest Disagreements |",
    "| --- | --- | --- | --- | --- |",
    ...packetRows,
    "",
    "## Strongest Agreements",
    "",
    ...describeAgreementHighlights(byPacket, "full_agreement"),
    "",
    "## Largest Disagreements",
    "",
    ...describeAgreementHighlights(byPacket, "disagreement"),
    "",
    "## Interpretation Flags",
    "",
    ...Object.entries(aggregate.interpretationFlags).map(
      ([key, value]) => `- ${key}: ${value.active ? "flagged" : "not flagged"}; ${value.note}`,
    ),
    "",
    "## Instrument Readiness Recommendation",
    "",
    readiness,
    "",
    "## Constraint",
    "",
    "Do not update hypotheses automatically from this report. Use the generated reviewer-input table instead.",
    "",
  ].join("\n");
}

function buildInstrumentMetricsReport(records, aggregate, schema) {
  const rows = records.map(
    (record) =>
      `| ${record.packetId} | ${record.provider} | ${record.status} | ${record.strictJson ? "strict" : record.validJson ? "normalized" : "no"} | ${record.schemaCompleteness} | ${record.recognizedPresent ? "yes" : "no"} | ${record.ambiguityCount} | ${formatConfidenceValues(record.confidenceValues)} | ${record.sourcePath ?? record.expectedCanonicalPath} |`,
  );

  const malformedOrMissing = records
    .filter((record) => record.status !== "ok")
    .map(
      (record) =>
        `- ${record.packetId} ${record.provider}: ${record.status}. Expected ${record.expectedCanonicalPath}; fallback ${record.fallbackPath}. ${record.parseError ?? ""}`.trim(),
    );

  return [
    "# Instrument Metrics",
    "",
    `Schema top-level keys loaded from reference schema: ${aggregate.schemaKeys.join(", ")}.`,
    "",
    "## JSON Validity and Schema Compliance",
    "",
    "| Packet | Provider | Status | Parse Mode | Schema Completeness | Recognition Present | Ambiguity Count | Confidence Values | Source File |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...rows,
    "",
    "## Malformed or Missing Files",
    "",
    ...(malformedOrMissing.length > 0 ? malformedOrMissing : ["- None."]),
    "",
    "## Notes",
    "",
    "- Legacy fallback filenames were accepted when canonical ECP filenames were absent.",
    "- Normalized parse mode indicates non-strict JSON was repaired in memory for analysis only; raw files were not modified.",
    "",
  ].join("\n");
}

function buildStructuralReport(byPacket) {
  const sections = byPacket.map((packet) => [
    `## ${packet.packetId} ${packet.packetLabel}`,
    "",
    metricLine("control_flow_shape comparison", packet.structural.controlFlowShapeAgreement),
    metricLine("entry_conditions similarity", packet.structural.entryConditionsSimilarity),
    metricLine("exit_conditions similarity", packet.structural.exitConditionsSimilarity),
    metricLine("loop presence agreement", packet.structural.loopPresenceAgreement),
    metricLine("branch presence agreement", packet.structural.branchPresenceAgreement),
    metricLine("termination condition agreement", packet.structural.terminationConditionAgreement),
    "",
  ].join("\n"));

  return [
    "# Structural Agreement",
    "",
    "Control-flow shape, entry/exit conditions, loops, branches, and termination conditions are compared across GPT, Claude, and Gemini.",
    "",
    ...sections,
  ].join("\n");
}

function buildPrimitiveReport(byPacket) {
  const sections = byPacket.map((packet) => [
    `## ${packet.packetId} ${packet.packetLabel}`,
    "",
    metricLine("primitive_sequence overlap", packet.primitive.primitiveSequenceOverlap),
    metricLine("transition overlap", packet.primitive.transitionOverlap),
    metricLine("dominant_primitive agreement", packet.primitive.dominantPrimitiveAgreement),
    metricLine("candidate_missing_primitives", packet.primitive.candidateMissingPrimitives),
    "",
  ].join("\n"));

  return [
    "# Primitive Agreement",
    "",
    "Primitive sequence, transitions, dominant primitive, and candidate missing primitives are compared across providers.",
    "",
    ...sections,
  ].join("\n");
}

function buildConstraintReport(byPacket) {
  const sections = byPacket.map((packet) => [
    `## ${packet.packetId} ${packet.packetLabel}`,
    "",
    metricLine("invariant count", packet.constraint.invariantCount),
    metricLine("precondition count", packet.constraint.preconditionCount),
    metricLine("postcondition count", packet.constraint.postconditionCount),
    metricLine("stopping criteria count", packet.constraint.stoppingCriteriaCount),
    metricLine("validity condition count", packet.constraint.validityConditionCount),
    metricLine("qualitative overlap", packet.constraint.qualitativeOverlap),
    "",
  ].join("\n"));

  return [
    "# Constraint Agreement",
    "",
    "Constraint counts are reported directly, with qualitative overlap used only where text permits comparison.",
    "",
    ...sections,
  ].join("\n");
}

function buildRepresentationReport(byPacket) {
  const sections = byPacket.map((packet) => [
    `## ${packet.packetId} ${packet.packetLabel}`,
    "",
    metricLine("procedural_ast present", packet.representation.proceduralAstPresent),
    metricLine(
      "natural_language_summary present",
      packet.representation.naturalLanguageSummaryPresent,
    ),
    metricLine("canonical_summary present", packet.representation.canonicalSummaryPresent),
    metricLine("canonical_summary comparison", packet.representation.canonicalSummaryComparison),
    metricLine("ambiguity count", packet.representation.ambiguityCount),
    "",
  ].join("\n"));

  return [
    "# Representation Agreement",
    "",
    "AST presence, summary presence, canonical summary agreement, and ambiguity counts are compared here.",
    "",
    ...sections,
  ].join("\n");
}

function buildProductReport(byPacket, aggregate) {
  const sections = byPacket.map((packet) => [
    `## ${packet.packetId} ${packet.packetLabel}`,
    "",
    metricLine("clarity_relevance_observations count", packet.product.clarityObservationCount),
    metricLine("edf_relevance_observations count", packet.product.edfObservationCount),
    metricLine(
      "research_only_observations count",
      packet.product.researchOnlyObservationCount,
    ),
    ...(packet.product.promotionalWording.length > 0
      ? ["", "Promotional or validation-like wording:", ...packet.product.promotionalWording.map((item) => `- ${item}`)]
      : ["", "Promotional or validation-like wording:", "- None detected."]),
    "",
  ].join("\n"));

  return [
    "# Product Relevance Observations",
    "",
    "Product relevance is observational only. Product relevance is not validation.",
    "",
    ...sections,
    "",
    "## Aggregate Warning State",
    "",
    ...(aggregate.productPromotionWarnings.length > 0
      ? aggregate.productPromotionWarnings.map(
          (warning) => `- ${warning.packetId} ${warning.provider}: ${warning.warning}`,
        )
      : ["- No promotional or validation-like wording detected in product relevance fields."]),
    "",
  ].join("\n");
}

function buildHypothesisReviewInput(aggregate, byPacket) {
  const rows = [
    buildHypothesisRow(
      "H003 Multi-model convergence",
      summarizeEvidence(byPacket, (packet) => [
        `structural=${dominantCategory(Object.values(packet.structural).map((metric) => metric.category))}`,
        `primitive=${dominantCategory(Object.values(packet.primitive).map((metric) => metric.category))}`,
      ]),
      "unclear",
      "Structural agreement may exceed primitive agreement in some comparisons, but the packet-level profile remains too disagreement-heavy for directional interpretation.",
    ),
    buildHypothesisRow(
      "H012 Vocabulary bias",
      summarizeEvidence(byPacket, (packet) => [
        `primitive overlap=${packet.primitive.primitiveSequenceOverlap.category}`,
        `dominant primitive=${packet.primitive.dominantPrimitiveAgreement.category}`,
      ]),
      "unclear",
      "Bloom-versus-Scientific-Method richness is a review flag, not a directional update.",
    ),
    buildHypothesisRow(
      "H013 Recognition bias",
      `Recognition present in ${aggregate.recognitionRate} valid responses.`,
      "unclear",
      "High recognition keeps H013 active as a threat, but this comparator does not isolate recognition effects from extraction quality.",
    ),
    buildHypothesisRow(
      "H015 Measurement instrument reliability",
      `Valid=${aggregate.validRecordCount}/${aggregate.totalExpectedFiles}; malformed=${aggregate.malformedRecordCount}; missing=${aggregate.missingRecordCount}.`,
      aggregate.validRecordCount >= 6 && aggregate.malformedRecordCount <= 3
        ? "possible_strengthen"
        : "unclear",
      "Reliability may be improving if most records parse and complete the schema, but fallback parsing and agreement drift still require review.",
    ),
  ];

  return [
    "# Hypothesis Review Input",
    "",
    "| Hypothesis | Evidence From ECR-000001 | Direction | Notes | Reviewer Decision Needed |",
    "| --- | --- | --- | --- | --- |",
    ...rows,
    "",
    "Directions are provisional only. This file does not change hypothesis confidence.",
    "",
  ].join("\n");
}

function determineInstrumentReadiness(aggregate, byPacket) {
  if (aggregate.validRecordCount < 6 || aggregate.missingRecordCount > 0) {
    return "Not ready for broad inference. Generate or repair missing packet responses first.";
  }
  if (aggregate.malformedRecordCount > 0) {
    return "Conditionally ready for calibration review, but malformed or repaired JSON remains a tooling threat";
  }
  const structuralFull = aggregate.structuralAgreementDistribution.full_agreement ?? 0;
  const primitiveDisagreements = aggregate.primitiveAgreementDistribution.disagreement ?? 0;
  if (structuralFull > 0 && primitiveDisagreements > 0) {
    return "Ready for calibration review with caution: structure appears more stable than primitive phrasing.";
  }
  const anyAgreement = byPacket.some((packet) =>
    Object.values(packet.structural).some((metric) => metric.category !== "unclear"),
  );
  return anyAgreement
    ? "Ready for calibration review."
    : "Not ready. Agreement signal is too weak to support calibration interpretation.";
}

function metricLine(label, metric) {
  return `- ${label}: ${metric.category}. ${metric.note}`;
}

function describeAgreementHighlights(byPacket, targetCategory) {
  const items = [];
  for (const packet of byPacket) {
    for (const [label, metric] of Object.entries({
      ...packet.structural,
      ...packet.primitive,
      ...packet.constraint,
      ...packet.representation,
    })) {
      if (metric.category === targetCategory) {
        items.push(`- ${packet.packetId} ${label}: ${metric.note}`);
      }
    }
  }

  return items.length > 0 ? items : ["- None."];
}

function topMetricCategories(packet, category) {
  const labels = [];
  for (const [label, metric] of Object.entries({
    ...packet.structural,
    ...packet.primitive,
    ...packet.constraint,
    ...packet.representation,
  })) {
    if (metric.category === category) {
      labels.push(label);
    }
  }
  return labels.join(", ");
}

function buildHypothesisRow(hypothesis, evidence, direction, notes) {
  return `| ${hypothesis} | ${escapePipes(evidence)} | ${direction} | ${escapePipes(
    notes,
  )} | Yes |`;
}

function summarizeEvidence(byPacket, formatter) {
  return byPacket
    .map((packet) => `${packet.packetId}: ${formatter(packet).join("; ")}`)
    .join(" / ");
}

function compareScalarField(records, selector) {
  const values = records.map((record) => ({
    provider: record.provider,
    raw: asString(selector(record)),
    normalized: normalizeText(selector(record)),
  }));
  const nonEmpty = values.filter((value) => value.normalized.length > 0);

  if (nonEmpty.length < 2) {
    return metricResult("unclear", "Too few populated values for comparison.", values);
  }

  const unique = new Set(nonEmpty.map((value) => value.normalized));
  if (unique.size === 1) {
    return metricResult("full_agreement", "All populated values normalize to the same text.", values);
  }

  const tokenSets = nonEmpty.map((value) => tokenSet(value.raw));
  const overlap = averagePairwiseOverlap(tokenSets);
  if (overlap > 0.45) {
    return metricResult(
      "partial_agreement",
      "Values differ textually but share material token overlap.",
      values,
    );
  }

  return metricResult("disagreement", "Values describe materially different content.", values);
}

function compareObservationArrayField(records, selector) {
  const valueSets = records.map((record) => ({
    provider: record.provider,
    values: selector(record).map((item) => item.value).filter(Boolean),
  }));
  return compareValueSets(valueSets);
}

function comparePrimitiveArrayField(records, selector) {
  const valueSets = records.map((record) => ({
    provider: record.provider,
    values: selector(record).map((item) => item.value).filter(Boolean),
  }));
  return compareValueSets(valueSets);
}

function compareValueSets(valueSets) {
  const normalizedSets = valueSets.map((entry) => ({
    provider: entry.provider,
    set: normalizedValueSet(entry.values),
    values: entry.values,
  }));
  const nonEmpty = normalizedSets.filter((entry) => entry.set.size > 0);

  if (nonEmpty.length < 2) {
    return metricResult("unclear", "Too few populated arrays for comparison.", normalizedSets);
  }

  const equal = nonEmpty.every((entry, index) =>
    index === 0 ? true : setsEqual(entry.set, nonEmpty[0].set),
  );
  if (equal) {
    return metricResult("full_agreement", "All populated arrays normalize to the same set.", normalizedSets);
  }

  const pairwiseOverlaps = [];
  for (let index = 0; index < nonEmpty.length; index += 1) {
    for (let inner = index + 1; inner < nonEmpty.length; inner += 1) {
      pairwiseOverlaps.push(jaccard(nonEmpty[index].set, nonEmpty[inner].set));
    }
  }
  const maxOverlap = Math.max(...pairwiseOverlaps);

  if (maxOverlap > 0) {
    return metricResult(
      "partial_agreement",
      "Arrays differ, but at least one pair shares normalized overlap.",
      normalizedSets,
    );
  }

  return metricResult("disagreement", "No normalized overlap detected across populated arrays.", normalizedSets);
}

function compareBooleanPresence(records, selector) {
  const values = records.map((record) => ({
    provider: record.provider,
    value: Boolean(selector(record)),
  }));

  if (values.length < 2) {
    return metricResult("unclear", "Too few values for comparison.", values);
  }

  const truthy = values.filter((value) => value.value).length;
  if (truthy === 0 || truthy === values.length) {
    return metricResult("full_agreement", "All providers agree on presence or absence.", values);
  }
  if (truthy > 0) {
    return metricResult("partial_agreement", "Providers split on presence versus absence.", values);
  }
  return metricResult("unclear", "Presence could not be determined.", values);
}

function compareCountField(records, selector) {
  const counts = records.map((record) => ({
    provider: record.provider,
    count: selector(record).length,
  }));

  if (counts.length < 2) {
    return metricResult("unclear", "Too few counts for comparison.", counts);
  }

  const unique = new Set(counts.map((entry) => entry.count));
  if (unique.size === 1) {
    return metricResult("full_agreement", "All providers reported the same count.", counts);
  }

  const values = counts.map((entry) => entry.count);
  const range = Math.max(...values) - Math.min(...values);
  if (range <= 1) {
    return metricResult("partial_agreement", "Counts differ only slightly.", counts);
  }

  return metricResult("disagreement", "Counts differ materially across providers.", counts);
}

function metricResult(category, note, details) {
  return {
    category,
    note,
    details,
  };
}

function normalizeObservationArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => {
      if (typeof item === "string") {
        return {
          value: item.trim(),
          support_level: "",
          source_text: "",
          ambiguity: "",
        };
      }
      if (item && typeof item === "object") {
        return {
          value: asString(item.value),
          support_level: asString(item.support_level),
          source_text: asString(item.source_text),
          ambiguity: asString(item.ambiguity),
        };
      }
      return null;
    })
    .filter((item) => item && item.value.length > 0);
}

function normalizePrimitiveArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => {
      if (typeof item === "string") {
        return { value: item.trim() };
      }
      if (item && typeof item === "object") {
        if ("value" in item) {
          return { value: asString(item.value) };
        }
        const from = asString(item.from);
        const to = asString(item.to);
        if (from || to) {
          return { value: [from, to].filter(Boolean).join(" -> ") };
        }
      }
      return null;
    })
    .filter((item) => item && item.value.length > 0);
}

function normalizeAmbiguities(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => {
      if (typeof item === "string") {
        return {
          location: "",
          description: item.trim(),
          plausible_interpretations: [],
          effect_on_extraction: "",
        };
      }
      if (item && typeof item === "object") {
        return {
          location: asString(item.location),
          description: asString(item.description),
          plausible_interpretations: Array.isArray(item.plausible_interpretations)
            ? item.plausible_interpretations.map((entry) => asString(entry)).filter(Boolean)
            : [],
          effect_on_extraction: asString(item.effect_on_extraction),
        };
      }
      return null;
    })
    .filter((item) => item && (item.description.length > 0 || item.location.length > 0));
}

function normalizeConfidence(value) {
  const normalized = {};
  for (const key of confidenceKeys) {
    normalized[key] = asString(value?.[key]);
  }
  return normalized;
}

function findPromotionalProductWording(normalized) {
  const warnings = [];
  for (const [field, entries] of Object.entries({
    clarity: normalized.product.clarity,
    edf: normalized.product.edf,
    research_only: normalized.product.researchOnly,
  })) {
    for (const entry of entries) {
      if (productPromotionPattern.test(entry.value) || productPromotionPattern.test(entry.source_text)) {
        warnings.push(`${field} contains validation-like wording: ${entry.value || entry.source_text}`);
      }
    }
  }
  return warnings;
}

function isMissingField(root, fieldPath) {
  const segments = fieldPath.split(".");
  let current = root;
  for (const segment of segments) {
    if (current == null || !(segment in current)) {
      return true;
    }
    current = current[segment];
  }
  return false;
}

function stripBom(text) {
  return text.replace(/^\uFEFF/, "");
}

function normalizeJsonLikeText(text) {
  return stripBom(text)
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\u00A0/g, " ")
    .replace(/[\u2013\u2014]/g, "-");
}

function relativeToExperiment(filePath) {
  return path.relative(experimentDir, filePath).replaceAll(path.sep, "/");
}

function asString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function hasMeaningfulValue(value) {
  if (value == null) {
    return false;
  }
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === "object") {
    return Object.keys(value).length > 0;
  }
  return true;
}

function normalizeText(value) {
  return asString(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizedValueSet(values) {
  return new Set(values.map((value) => normalizeText(value)).filter(Boolean));
}

function tokenSet(value) {
  return new Set(normalizeText(value).split(" ").filter(Boolean));
}

function averagePairwiseOverlap(tokenSets) {
  const overlaps = [];
  for (let index = 0; index < tokenSets.length; index += 1) {
    for (let inner = index + 1; inner < tokenSets.length; inner += 1) {
      overlaps.push(jaccard(tokenSets[index], tokenSets[inner]));
    }
  }
  return overlaps.length > 0 ? sum(overlaps) / overlaps.length : 0;
}

function jaccard(left, right) {
  const union = new Set([...left, ...right]);
  if (union.size === 0) {
    return 1;
  }
  let intersection = 0;
  for (const value of left) {
    if (right.has(value)) {
      intersection += 1;
    }
  }
  return intersection / union.size;
}

function setIntersectionSize(left, right) {
  let count = 0;
  for (const value of left) {
    if (right.has(value)) {
      count += 1;
    }
  }
  return count;
}

function setsEqual(left, right) {
  if (left.size !== right.size) {
    return false;
  }
  for (const value of left) {
    if (!right.has(value)) {
      return false;
    }
  }
  return true;
}

function averageObservationRichness(packet) {
  if (!packet || packet.validRecords.length === 0) {
    return 0;
  }
  const totals = packet.validRecords.map((record) => {
    const normalized = record.normalized;
    return (
      normalized.structural.requiredSteps.length +
      normalized.structural.entryConditions.length +
      normalized.structural.exitConditions.length +
      normalized.structural.loops.length +
      normalized.structural.branches.length +
      normalized.structural.terminationConditions.length +
      normalized.constraint.invariants.length +
      normalized.constraint.preconditions.length +
      normalized.constraint.postconditions.length +
      normalized.constraint.stoppingCriteria.length +
      normalized.constraint.validityConditions.length
    );
  });
  return sum(totals) / totals.length;
}

function agreementWeight(categories) {
  const weights = {
    full_agreement: 3,
    partial_agreement: 2,
    unclear: 1,
    disagreement: 0,
  };
  return sum(categories.map((category) => weights[category] ?? 0));
}

function categoryCounts(categories) {
  const counts = {
    full_agreement: 0,
    partial_agreement: 0,
    disagreement: 0,
    unclear: 0,
  };
  for (const category of categories) {
    counts[category] = (counts[category] ?? 0) + 1;
  }
  return counts;
}

function dominantCategory(categories) {
  const counts = categoryCounts(categories);
  return Object.entries(counts).sort((left, right) => right[1] - left[1])[0][0];
}

function formatConfidenceValues(confidence) {
  const parts = confidenceKeys
    .map((key) => `${key}=${confidence[key] || "-"}`)
    .filter(Boolean);
  return parts.join(", ");
}

function escapePipes(value) {
  return value.replaceAll("|", "\\|");
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}
