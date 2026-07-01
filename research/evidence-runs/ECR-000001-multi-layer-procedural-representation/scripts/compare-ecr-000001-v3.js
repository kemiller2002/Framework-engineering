import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const experimentDir = path.resolve(__dirname, "..");
const responsesDir = path.join(experimentDir, "responses");
const outputDir = path.join(experimentDir, "comparison", "generated-v3");
const v2OntologyPath = path.join(
  experimentDir,
  "comparison",
  "ontology",
  "procedural-concept-ontology.json",
);
const v3Dir = path.join(experimentDir, "comparison", "ontology-v3");
const validationV3Path = path.join(
  experimentDir,
  "comparison",
  "normalizer-validation",
  "generated-v3",
  "raw-validation-output-v3.json",
);

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
const fieldSpecs = [
  ["structural_layer.entry_conditions", "Entry Conditions"],
  ["structural_layer.exit_conditions", "Exit Conditions"],
  ["structural_layer.required_steps", "Required Steps"],
  ["structural_layer.optional_steps", "Optional Steps"],
  ["structural_layer.loops", "Loops"],
  ["structural_layer.branches", "Branches"],
  ["structural_layer.termination_conditions", "Termination Conditions"],
  ["constraint_layer.invariants", "Invariants"],
  ["constraint_layer.preconditions", "Preconditions"],
  ["constraint_layer.postconditions", "Postconditions"],
  ["constraint_layer.stopping_criteria", "Stopping Criteria"],
  ["constraint_layer.validity_conditions", "Validity Conditions"],
  ["representation_layer.natural_language_summary", "Natural Language Summary"],
  ["representation_layer.canonical_summary", "Canonical Summary"],
  ["representation_layer.ambiguities", "Ambiguities"],
  ["product_relevance_layer.clarity_relevance_observations", "Clarity Relevance Observations"],
  ["product_relevance_layer.edf_relevance_observations", "EDF Relevance Observations"],
  ["product_relevance_layer.research_only_observations", "Research-Only Observations"],
];
const textKeys = new Set([
  "value",
  "description",
  "source_text",
  "condition",
  "label",
  "summary",
  "notes",
  "ambiguity",
]);
const ignoredRawTexts = new Set(["explicit", "strongly_implied", "inferred", "none", "none."]);
const rolePriority = [
  "terminate",
  "decide",
  "verify",
  "prioritize",
  "compare",
  "evaluate",
  "observe",
  "generate",
  "identify",
  "bound",
  "classify",
  "interpret",
  "explain",
  "act",
  "reflect",
  "reassess",
  "communicate",
  "allocate",
  "coordinate",
  "schedule",
  "sequence",
];

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  await mkdir(outputDir, { recursive: true });
  const [v2Ontology, roleTaxonomy, objectTaxonomy, purposeTaxonomy, stageTaxonomy, controlFlowTaxonomy] =
    await Promise.all([
      loadJson(v2OntologyPath),
      loadJson(path.join(v3Dir, "procedural-role-taxonomy.json")),
      loadJson(path.join(v3Dir, "procedural-object-taxonomy.json")),
      loadJson(path.join(v3Dir, "procedural-purpose-taxonomy.json")),
      loadJson(path.join(v3Dir, "procedural-stage-taxonomy.json")),
      loadJson(path.join(v3Dir, "control-flow-taxonomy.json")),
    ]);

  const taxonomies = {
    role: roleTaxonomy,
    object: objectTaxonomy,
    purpose: purposeTaxonomy,
    stage: stageTaxonomy,
    control_flow: controlFlowTaxonomy,
  };

  const records = await loadAllRecords();
  const comparisons = buildComparisons(records, v2Ontology, taxonomies);
  const aggregate = buildAggregate(comparisons);
  const validationSummary = await loadOptionalValidationSummary();

  await Promise.all([
    writeFile(
      path.join(outputDir, "raw-dimensional-normalized-table-v3.json"),
      `${JSON.stringify(buildRawTable(comparisons), null, 2)}\n`,
    ),
    writeFile(
      path.join(outputDir, "ecr-000001-comparator-v3-report.md"),
      buildComparatorReport(aggregate, validationSummary),
    ),
    writeFile(
      path.join(outputDir, "literal-vs-dimensional-agreement.md"),
      buildLiteralVsDimensional(comparisons),
    ),
    writeFile(
      path.join(outputDir, "dimensional-normalization-audit.md"),
      buildDimensionalAudit(comparisons),
    ),
    writeFile(
      path.join(outputDir, "unresolved-dimensional-matches.md"),
      buildUnresolvedReport(comparisons),
    ),
    writeFile(
      path.join(outputDir, "hypothesis-review-input-v3.md"),
      buildHypothesisReviewV3(aggregate, validationSummary),
    ),
  ]);
}

async function loadOptionalValidationSummary() {
  try {
    const raw = await readFile(validationV3Path, "utf8");
    const parsed = JSON.parse(raw);
    return parsed.summary ?? null;
  } catch {
    return null;
  }
}

async function loadJson(filePath) {
  const raw = await readFile(filePath, "utf8");
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

  let raw;
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
      return {
        provider,
        packetId,
        packetLabel: packetLabels[packetId],
        sourcePath: null,
        sourceKind: "missing",
        status: "missing",
        data: null,
      };
    }
  }

  const parsed = parseResponseFile(raw);
  if (!parsed.ok) {
    return {
      provider,
      packetId,
      packetLabel: packetLabels[packetId],
      sourcePath: relativeToExperiment(sourcePath),
      sourceKind,
      status: "malformed",
      data: null,
    };
  }

  return {
    provider,
    packetId,
    packetLabel: packetLabels[packetId],
    sourcePath: relativeToExperiment(sourcePath),
    sourceKind,
    status: "ok",
    data: parsed.data,
  };
}

function buildComparisons(records, v2Ontology, taxonomies) {
  const comparisons = [];
  for (const packetId of packetIds) {
    const packetRecords = records.filter((record) => record.packetId === packetId);
    for (const [fieldPath, fieldLabel] of fieldSpecs) {
      const providerEntries = packetRecords.map((record) =>
        buildProviderFieldEntry(record, fieldPath, fieldLabel, v2Ontology, taxonomies),
      );
      const literalAgreement = compareLiteralEntries(providerEntries);
      const flatSemanticAgreement = compareFlatEntries(providerEntries);
      const dimensionalAgreement = compareDimensionalEntries(providerEntries);

      comparisons.push({
        packetId,
        packetLabel: packetLabels[packetId],
        field: fieldPath,
        fieldLabel,
        providerEntries,
        literalAgreement,
        flatSemanticAgreement,
        dimensionalAgreement,
        sharedRoles: sharedDimension(providerEntries, "role"),
        sharedObjects: sharedDimension(providerEntries, "object"),
        sharedPurposes: sharedDimension(providerEntries, "purpose"),
        unresolvedDimensions: providerEntries.flatMap((entry) =>
          entry.dimensionalItems.flatMap((item) =>
            item.unresolvedDimensions.map((dimension) => ({
              provider: entry.provider,
              raw: item.raw,
              dimension,
            })),
          ),
        ),
      });
    }
  }
  return comparisons;
}

function buildProviderFieldEntry(record, fieldPath, fieldLabel, v2Ontology, taxonomies) {
  if (record.status !== "ok" || !record.data) {
    return {
      provider: record.provider,
      packetId: record.packetId,
      field: fieldPath,
      fieldLabel,
      status: record.status,
      rawItems: [],
      literalItems: [],
      flatConcepts: [],
      dimensionalItems: [],
    };
  }

  const rawItems = extractTextItems(getPath(record.data, fieldPath));
  const dimensionalItems = rawItems.map((raw) => normalizeDimensional(raw, taxonomies));
  const flatConcepts = unique(
    rawItems.flatMap((raw) => matchFlatOntology(raw, v2Ontology).map((match) => match.conceptId)),
  );

  return {
    provider: record.provider,
    packetId: record.packetId,
    field: fieldPath,
    fieldLabel,
    status: "ok",
    rawItems,
    literalItems: unique(rawItems.map((item) => normalizeText(item)).filter(Boolean)),
    flatConcepts,
    dimensionalItems,
  };
}

function normalizeDimensional(raw, taxonomies) {
  const role = chooseBestMatch(raw, taxonomies.role, "role");
  const object = chooseBestMatch(raw, taxonomies.object, "object");
  const purpose = chooseBestMatch(raw, taxonomies.purpose, "purpose");
  const stage = chooseBestMatch(raw, taxonomies.stage, "stage");
  const controlFlow = chooseBestMatch(raw, taxonomies.control_flow, "control_flow");

  const unresolvedDimensions = [
    role.key ? null : "role",
    object.key ? null : "object",
    purpose.key ? null : "purpose",
    stage.key ? null : "stage",
    controlFlow.key ? null : "control_flow",
  ].filter(Boolean);

  return {
    raw,
    role: role.key || "unresolved",
    object: object.key || "unresolved",
    purpose: purpose.key || "unresolved",
    stage: stage.key || "unclear",
    control_flow: controlFlow.key || "none",
    matched_patterns: {
      role: role.patterns,
      object: object.patterns,
      purpose: purpose.patterns,
      stage: stage.patterns,
      control_flow: controlFlow.patterns,
    },
    unresolvedDimensions,
  };
}

function chooseBestMatch(raw, taxonomy, dimension) {
  const normalized = normalizeText(raw);
  const tokens = new Set(normalized.split(" ").filter(Boolean));
  const matches = [];

  for (const [key, entry] of Object.entries(taxonomy)) {
    if ((dimension === "stage" && key === "unclear") || (dimension === "control_flow" && key === "none") || (dimension === "control_flow" && key === "unclear")) {
      continue;
    }
    for (const pattern of entry.patterns) {
      const normalizedPattern = normalizeText(pattern);
      const patternTokens = normalizedPattern.split(" ").filter(Boolean);
      const exact = raw.toLowerCase().includes(pattern.toLowerCase());
      const covered = patternTokens.length > 0 && patternTokens.every((token) => tokens.has(token));
      if (exact || covered) {
        matches.push({
          key,
          pattern,
          score: scorePattern(key, normalizedPattern, exact, covered, dimension),
        });
      }
    }
  }

  if (matches.length === 0) {
    return { key: "", patterns: [] };
  }

  matches.sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }
    if (dimension === "role") {
      return rolePriority.indexOf(left.key) - rolePriority.indexOf(right.key);
    }
    return left.key.localeCompare(right.key);
  });

  const bestKey = matches[0].key;
  return {
    key: bestKey,
    patterns: unique(matches.filter((match) => match.key === bestKey).map((match) => match.pattern)),
  };
}

function scorePattern(key, normalizedPattern, exact, covered, dimension) {
  let score = 0;
  if (exact) score += 3;
  if (covered) score += 2;
  score += normalizedPattern.split(" ").length;
  if (dimension === "role" && ["prioritize", "terminate", "decide", "verify", "compare", "evaluate"].includes(key)) {
    score += 1;
  }
  if (
    dimension === "role" &&
    key === "identify" &&
    ["unresolved", "question", "problem", "uncertainty", "recognized", "identified"].some((token) =>
      normalizedPattern.includes(token),
    )
  ) {
    score += 2;
  }
  return score;
}

function matchFlatOntology(raw, ontology) {
  const normalized = normalizeText(raw);
  const tokens = new Set(normalized.split(" ").filter(Boolean));
  const matches = [];
  for (const [conceptId, concept] of Object.entries(ontology)) {
    for (const pattern of concept.patterns) {
      const patternNorm = normalizeText(pattern);
      const patternTokens = patternNorm.split(" ").filter(Boolean);
      const exact = raw.toLowerCase().includes(pattern.toLowerCase());
      const covered = patternTokens.length > 0 && patternTokens.every((token) => tokens.has(token));
      if (exact || covered) {
        matches.push({ conceptId, pattern });
      }
    }
  }
  return dedupeBy(matches, (item) => `${item.conceptId}:${item.pattern}`);
}

function compareLiteralEntries(entries) {
  const populated = entries.filter((entry) => entry.status === "ok" && entry.literalItems.length > 0);
  if (populated.length < 2) {
    return result("unclear", "Fewer than two valid populated literal outputs.");
  }
  const sets = populated.map((entry) => new Set(entry.literalItems));
  if (sets.every((set, index) => (index === 0 ? true : setsEqual(set, sets[0])))) {
    return result("full_agreement", "All populated literal item sets are identical.");
  }
  if (pairwiseIntersections(sets).some((shared) => shared.size > 0)) {
    return result("partial_agreement", "At least two literal item sets overlap.");
  }
  return result("disagreement", "No shared literal items were detected.");
}

function compareFlatEntries(entries) {
  const populated = entries.filter((entry) => entry.status === "ok" && entry.flatConcepts.length > 0);
  if (populated.length < 2) {
    return result("unclear", "Flat semantic comparison lacks two populated outputs.");
  }
  const sets = populated.map((entry) => new Set(entry.flatConcepts));
  if (intersectionOfSets(sets).size > 0) {
    return result("full_agreement", "All providers share at least one flat semantic concept.");
  }
  if (pairwiseIntersections(sets).some((shared) => shared.size > 0)) {
    return result("partial_agreement", "At least two providers share flat semantic concepts.");
  }
  return result("disagreement", "No shared flat semantic concepts were detected.");
}

function compareDimensionalEntries(entries) {
  const populated = entries.filter((entry) => entry.status === "ok" && entry.dimensionalItems.length > 0);
  if (populated.length < 2) {
    return result("unclear", "Dimensional comparison lacks two populated outputs.");
  }

  const sharedRoles = intersectionOfSets(populated.map((entry) => new Set(entry.dimensionalItems.map((item) => item.role).filter((item) => item !== "unresolved"))));
  const sharedObjects = intersectionOfSets(populated.map((entry) => new Set(expandCompatibleObjects(entry.dimensionalItems.map((item) => item.object)).filter((item) => item !== "unresolved"))));
  const sharedPurposes = intersectionOfSets(populated.map((entry) => new Set(entry.dimensionalItems.map((item) => item.purpose).filter((item) => item !== "unresolved"))));

  if (sharedRoles.size > 0 && (sharedObjects.size > 0 || sharedPurposes.size > 0)) {
    return result("full_agreement", "Shared roles align with compatible objects or purposes.");
  }
  if (sharedRoles.size > 0 || sharedObjects.size > 0 || sharedPurposes.size > 0) {
    return result("partial_agreement", "Some dimensional overlap exists, but equivalence is incomplete.");
  }
  return result("disagreement", "No safe dimensional overlap was detected.");
}

function buildAggregate(comparisons) {
  const literal = tally(comparisons.map((item) => item.literalAgreement.category));
  const flat = tally(comparisons.map((item) => item.flatSemanticAgreement.category));
  const dimensional = tally(comparisons.map((item) => item.dimensionalAgreement.category));
  const unresolved = comparisons.flatMap((item) => item.unresolvedDimensions);
  return {
    literal,
    flat,
    dimensional,
    unresolved,
    potentialFalsePositiveReductions: comparisons.filter(
      (item) =>
        item.flatSemanticAgreement.category === "full_agreement" &&
        item.dimensionalAgreement.category !== "full_agreement",
    ).length,
  };
}

function buildRawTable(comparisons) {
  return comparisons.flatMap((comparison) =>
    comparison.providerEntries.map((entry) => ({
      packet_id: comparison.packetId,
      provider: entry.provider,
      field: comparison.field,
      raw_items: entry.rawItems,
      literal_items: entry.literalItems,
      flat_semantic_concepts: entry.flatConcepts,
      dimensional_items: entry.dimensionalItems,
      unresolved_dimensions: entry.dimensionalItems.flatMap((item) => item.unresolvedDimensions),
    })),
  );
}

function buildComparatorReport(aggregate, validationSummary) {
  const validationLine = validationSummary
    ? `- v3 validation recommendation: ${validationSummary.recommendation}.`
    : "- v3 validation recommendation: pending validator run.";
  const falsePositiveLine = validationSummary
    ? `- v3 false-positive candidates: ${validationSummary.false_positive_candidates}.`
    : "- v3 false-positive candidates: pending validator run.";

  return [
    "# ECR-000001 Comparator v3 Report",
    "",
    "## Purpose",
    "",
    "Report literal agreement, flat semantic agreement, and role-first dimensional agreement without hiding surface disagreement.",
    "",
    "## Why v3 Exists",
    "",
    "- v2 could over-merge phrases that shared an object noun but differed in procedural role.",
    "- v3 separates role, object, purpose, stage, and control flow.",
    "- role is primary, so object overlap alone cannot create equivalence.",
    "",
    "## v1 / v2 / v3 Behavior",
    "",
    `- v1 literal full/partial/disagreement/unclear: ${formatCounts(aggregate.literal)}`,
    `- v2 flat semantic full/partial/disagreement/unclear: ${formatCounts(aggregate.flat)}`,
    `- v3 dimensional full/partial/disagreement/unclear: ${formatCounts(aggregate.dimensional)}`,
    "",
    "## False-Positive Reduction",
    "",
    `- Fields reduced from flat-semantic full agreement to a weaker dimensional result: ${aggregate.potentialFalsePositiveReductions}.`,
    falsePositiveLine,
    validationLine,
    "",
    "## Unresolved Items",
    "",
    `- Unresolved dimensional matches recorded: ${aggregate.unresolved.length}.`,
    "",
    "## Caution",
    "",
    "- v3 is still provisional.",
    "- Literal disagreement remains visible and is not overridden by dimensional matching.",
    "- Dimensional agreement is a measurement aid, not proof of equivalence.",
    "",
  ].join("\n");
}

function buildLiteralVsDimensional(comparisons) {
  const rows = comparisons.map(
    (item) =>
      `| ${item.packetId} | ${item.field} | ${item.literalAgreement.category} | ${item.dimensionalAgreement.category} | ${escapePipes(
        item.sharedRoles.join(", ") || "None",
      )} | ${escapePipes(item.sharedObjects.join(", ") || "None")} | ${escapePipes(
        buildFieldNotes(item),
      )} |`,
  );
  return [
    "# Literal vs Dimensional Agreement",
    "",
    "| Packet | Field | Literal Agreement | Dimensional Agreement | Shared Roles | Shared Objects | Notes |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...rows,
    "",
  ].join("\n");
}

function buildDimensionalAudit(comparisons) {
  const sections = [];
  for (const item of comparisons) {
    sections.push(`## ${item.packetId} ${item.field}`);
    sections.push("");
    for (const entry of item.providerEntries) {
      sections.push(`### ${entry.provider}`);
      sections.push("");
      if (entry.status !== "ok") {
        sections.push(`- Status: ${entry.status}`);
        sections.push("");
        continue;
      }
      for (const normalized of entry.dimensionalItems) {
        sections.push(`- raw text: ${normalized.raw}`);
        sections.push(`- role: ${normalized.role}`);
        sections.push(`- object: ${normalized.object}`);
        sections.push(`- purpose: ${normalized.purpose}`);
        sections.push(`- stage: ${normalized.stage}`);
        sections.push(`- control_flow: ${normalized.control_flow}`);
        sections.push(
          `- matched patterns: role=${normalized.matched_patterns.role.join(", ") || "None"}; object=${normalized.matched_patterns.object.join(", ") || "None"}; purpose=${normalized.matched_patterns.purpose.join(", ") || "None"}; stage=${normalized.matched_patterns.stage.join(", ") || "None"}; control_flow=${normalized.matched_patterns.control_flow.join(", ") || "None"}`,
        );
        sections.push(
          `- unresolved dimensions: ${normalized.unresolvedDimensions.join(", ") || "None"}`,
        );
        sections.push("");
      }
    }
  }
  return ["# Dimensional Normalization Audit", "", ...sections].join("\n");
}

function buildUnresolvedReport(comparisons) {
  const items = comparisons.flatMap((item) =>
    item.providerEntries.flatMap((entry) =>
      entry.dimensionalItems.flatMap((normalized) =>
        normalized.unresolvedDimensions.map((dimension) => ({
          packetId: item.packetId,
          field: item.field,
          provider: entry.provider,
          raw: normalized.raw,
          dimension,
        })),
      ),
    ),
  );
  return [
    "# Unresolved Dimensional Matches",
    "",
    ...(items.length > 0
      ? items.map(
          (item) =>
            `- ${item.packetId} ${item.provider} ${item.field}: ${item.dimension} unresolved for "${item.raw}"`,
        )
      : ["- None."]),
    "",
  ].join("\n");
}

function buildHypothesisReviewV3(aggregate, validationSummary) {
  const validatorRecommendation = validationSummary?.recommendation ?? "pending";
  const rows = [
    buildRow(
      "H003 Multi-model convergence",
      `v3 dimensional distribution=${formatCounts(aggregate.dimensional)}`,
      "unclear",
      "Dimensional agreement is more conservative than flat semantic agreement and should be interpreted only after validation review.",
    ),
    buildRow(
      "H012 Vocabulary bias",
      `v2-to-v3 false-positive reduction candidates=${aggregate.potentialFalsePositiveReductions}`,
      aggregate.potentialFalsePositiveReductions > 0 ? "possible_weaken" : "unclear",
      "If v3 reduces matches created by shared nouns alone, some apparent v2 agreement may have been inflated by flat concepts.",
    ),
    buildRow(
      "H013 Recognition bias",
      `validator recommendation=${validatorRecommendation}`,
      "unclear",
      "Recognition effects remain unresolved by dimensional normalization alone.",
    ),
    buildRow(
      "H015 Measurement instrument reliability",
      `unresolved dimensional items=${aggregate.unresolved.length}; validator=${validatorRecommendation}`,
      validatorRecommendation === "safe_for_limited_calibration_use" ? "possible_strengthen" : "unclear",
      "Reliability should not be strengthened unless dimensional validation supports limited use.",
    ),
  ];

  return [
    "# Hypothesis Review Input v3",
    "",
    "| Hypothesis | Evidence From Comparator v3 | Possible Direction | Notes | Reviewer Decision Needed |",
    "| --- | --- | --- | --- | --- |",
    ...rows,
    "",
    "Do not update confidence from this file.",
    "",
  ].join("\n");
}

function loadStageAliases() {
  return null;
}

function buildFieldNotes(item) {
  if (item.flatSemanticAgreement.category === "full_agreement" && item.dimensionalAgreement.category !== "full_agreement") {
    return "Dimensional normalization reduced a flat-semantic merge.";
  }
  if (item.dimensionalAgreement.category === "full_agreement") {
    return "Shared role and compatible object or purpose were found.";
  }
  return "Literal differences remain visible and dimensional overlap is limited.";
}

function sharedDimension(entries, dimension) {
  const sets = entries
    .filter((entry) => entry.status === "ok")
    .map((entry) => {
      const rawValues = entry.dimensionalItems
        .map((item) => item[dimension])
        .filter((value) => value !== "unresolved" && value !== "unclear" && value !== "none");
      return new Set(dimension === "object" ? expandCompatibleObjects(rawValues) : rawValues);
    })
    .filter((set) => set.size > 0);
  if (sets.length < 2) {
    return [];
  }
  return [...intersectionOfSets(sets)].sort();
}

function expandCompatibleObjects(objects) {
  const expanded = new Set();
  for (const object of objects) {
    expanded.add(object);
    for (const alias of objectCompatibility(object)) {
      expanded.add(alias);
    }
  }
  return [...expanded];
}

function objectCompatibility(object) {
  if (["evidence", "information", "data", "observation"].includes(object)) {
    return ["evidence_family"];
  }
  if (["work", "outcome", "artifact"].includes(object)) {
    return ["delivery_family"];
  }
  if (["alternative", "option", "hypothesis", "explanation"].includes(object)) {
    return ["candidate_family"];
  }
  if (["problem", "question", "uncertainty"].includes(object)) {
    return ["entry_family"];
  }
  return [];
}

function parseResponseFile(raw) {
  const candidates = [
    { text: stripBom(raw), strict: true },
    { text: normalizeJsonLikeText(raw), strict: false },
  ];
  for (const candidate of candidates) {
    try {
      return { ok: true, data: JSON.parse(candidate.text), strict: candidate.strict };
    } catch (error) {
      if (candidate.strict) continue;
      return { ok: false, error: error instanceof Error ? error.message : "Unknown parse error." };
    }
  }
  return { ok: false, error: "Unable to parse JSON." };
}

function extractTextItems(value) {
  const items = [];
  walkValue(value, items);
  return unique(
    items
      .map((item) => item.trim())
      .filter((item) => item.length > 0 && !ignoredRawTexts.has(item.toLowerCase())),
  );
}

function walkValue(value, items) {
  if (typeof value === "string") {
    items.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const entry of value) walkValue(entry, items);
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      if (textKeys.has(key) && typeof entry === "string") {
        items.push(entry);
      } else if (entry && (typeof entry === "object" || Array.isArray(entry))) {
        walkValue(entry, items);
      }
    }
  }
}

function getPath(root, fieldPath) {
  return fieldPath.split(".").reduce((current, segment) => current?.[segment], root);
}

function tally(values) {
  const counts = { full_agreement: 0, partial_agreement: 0, disagreement: 0, unclear: 0 };
  for (const value of values) {
    counts[value] = (counts[value] ?? 0) + 1;
  }
  return counts;
}

function formatCounts(counts) {
  return `${counts.full_agreement ?? 0}/${counts.partial_agreement ?? 0}/${counts.disagreement ?? 0}/${counts.unclear ?? 0}`;
}

function buildRow(hypothesis, evidence, direction, notes) {
  return `| ${hypothesis} | ${escapePipes(evidence)} | ${direction} | ${escapePipes(notes)} | Yes |`;
}

function result(category, note) {
  return { category, note };
}

function pairwiseIntersections(sets) {
  const intersections = [];
  for (let i = 0; i < sets.length; i += 1) {
    for (let j = i + 1; j < sets.length; j += 1) {
      intersections.push(intersectionOfSets([sets[i], sets[j]]));
    }
  }
  return intersections;
}

function intersectionOfSets(sets) {
  if (sets.length === 0) return new Set();
  const resultSet = new Set(sets[0]);
  for (const value of [...resultSet]) {
    if (!sets.slice(1).every((set) => set.has(value))) {
      resultSet.delete(value);
    }
  }
  return resultSet;
}

function setsEqual(left, right) {
  if (left.size !== right.size) return false;
  for (const value of left) if (!right.has(value)) return false;
  return true;
}

function dedupeBy(values, selector) {
  const seen = new Set();
  const deduped = [];
  for (const value of values) {
    const key = selector(value);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(value);
  }
  return deduped;
}

function unique(values) {
  return [...new Set(values)];
}

function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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

function escapePipes(value) {
  return value.replaceAll("|", "\\|");
}
