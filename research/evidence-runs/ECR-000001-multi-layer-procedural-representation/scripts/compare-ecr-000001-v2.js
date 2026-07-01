import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const experimentDir = path.resolve(__dirname, "..");
const responsesDir = path.join(experimentDir, "responses");
const outputDir = path.join(experimentDir, "comparison", "generated-v2");
const ontologyPath = path.join(
  experimentDir,
  "comparison",
  "ontology",
  "procedural-concept-ontology.json",
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

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  await mkdir(outputDir, { recursive: true });
  const ontology = await loadOntology();
  const records = await loadAllRecords();
  const comparisons = buildFieldComparisons(records, ontology);
  const aggregate = buildAggregate(records, comparisons, ontology);
  const rawNormalized = buildRawNormalizedTable(comparisons);

  await Promise.all([
    writeFile(
      path.join(outputDir, "raw-normalized-table-v2.json"),
      `${JSON.stringify(rawNormalized, null, 2)}\n`,
    ),
    writeFile(
      path.join(outputDir, "ecr-000001-comparator-v2-report.md"),
      buildV2Report(records, comparisons, aggregate),
    ),
    writeFile(
      path.join(outputDir, "literal-vs-semantic-agreement.md"),
      buildLiteralVsSemanticReport(comparisons),
    ),
    writeFile(
      path.join(outputDir, "semantic-normalization-audit.md"),
      buildSemanticAudit(comparisons, ontology),
    ),
    writeFile(
      path.join(outputDir, "unresolved-semantic-matches.md"),
      buildUnresolvedMatchesReport(comparisons),
    ),
    writeFile(
      path.join(outputDir, "hypothesis-review-input-v2.md"),
      buildHypothesisReviewV2(aggregate, comparisons),
    ),
  ]);
}

async function loadOntology() {
  const raw = await readFile(ontologyPath, "utf8");
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
        validJson: false,
        strictJson: false,
        normalizedParseUsed: false,
        parseError: "File not found.",
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
      validJson: false,
      strictJson: false,
      normalizedParseUsed: false,
      parseError: parsed.error,
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
    validJson: true,
    strictJson: parsed.strict,
    normalizedParseUsed: !parsed.strict,
    parseError: null,
    data: parsed.data,
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

function buildFieldComparisons(records, ontology) {
  const comparisons = [];
  for (const packetId of packetIds) {
    const packetRecords = records.filter((record) => record.packetId === packetId);
    for (const [fieldPath, fieldLabel] of fieldSpecs) {
      const providerEntries = packetRecords.map((record) =>
        buildProviderFieldEntry(record, fieldPath, fieldLabel, ontology),
      );
      const literalAgreement = compareLiteralEntries(providerEntries);
      const semanticAgreement = compareSemanticEntries(providerEntries);
      comparisons.push({
        packetId,
        packetLabel: packetLabels[packetId],
        field: fieldPath,
        fieldLabel,
        providerEntries,
        literalAgreement,
        semanticAgreement,
        sharedConcepts: sharedSemanticConcepts(providerEntries),
        improvedBySemantic: agreementRank(semanticAgreement.category) > agreementRank(literalAgreement.category),
        semanticDisagreementRemains:
          semanticAgreement.category === "disagreement" || semanticAgreement.category === "unclear",
      });
    }
  }
  return comparisons;
}

function buildProviderFieldEntry(record, fieldPath, fieldLabel, ontology) {
  if (record.status !== "ok" || !record.data) {
    return {
      provider: record.provider,
      packetId: record.packetId,
      field: fieldPath,
      fieldLabel,
      status: record.status,
      sourcePath: record.sourcePath,
      rawItems: [],
      literalItems: [],
      semanticConcepts: [],
      triggeredPatterns: [],
      unresolvedItems: [],
    };
  }

  const fieldValue = getPath(record.data, fieldPath);
  const rawItems = extractTextItems(fieldValue);
  const normalizedItems = rawItems.map((item) => ({
    raw: item,
    literal: normalizeText(item),
    matches: matchOntology(item, ontology),
  }));

  return {
    provider: record.provider,
    packetId: record.packetId,
    field: fieldPath,
    fieldLabel,
    status: "ok",
    sourcePath: record.sourcePath,
    rawItems,
    literalItems: unique(normalizedItems.map((item) => item.literal).filter(Boolean)),
    semanticConcepts: unique(
      normalizedItems.flatMap((item) => item.matches.map((match) => match.conceptId)),
    ),
    triggeredPatterns: normalizedItems.flatMap((item) =>
      item.matches.map((match) => ({
        raw: item.raw,
        conceptId: match.conceptId,
        conceptLabel: match.label,
        pattern: match.pattern,
      })),
    ),
    unresolvedItems: normalizedItems
      .filter((item) => item.matches.length === 0 && item.literal.length > 0)
      .map((item) => item.raw),
  };
}

function buildAggregate(records, comparisons, ontology) {
  const valid = records.filter((record) => record.status === "ok").length;
  const malformed = records.filter((record) => record.status === "malformed").length;
  const missing = records.filter((record) => record.status === "missing").length;
  const literalCategories = comparisons.map((item) => item.literalAgreement.category);
  const semanticCategories = comparisons.map((item) => item.semanticAgreement.category);
  const improvedCases = comparisons.filter((item) => item.improvedBySemantic);
  const unresolvedEntries = comparisons.flatMap((item) =>
    item.providerEntries.flatMap((entry) =>
      entry.unresolvedItems.map((raw) => ({
        packetId: item.packetId,
        field: item.field,
        provider: entry.provider,
        raw,
      })),
    ),
  );

  return {
    ontologyConceptCount: Object.keys(ontology).length,
    validRecords: valid,
    malformedRecords: malformed,
    missingRecords: missing,
    literalDistribution: categoryCounts(literalCategories),
    semanticDistribution: categoryCounts(semanticCategories),
    improvedCases,
    persistentDisagreements: comparisons.filter(
      (item) =>
        item.literalAgreement.category === "disagreement" &&
        item.semanticAgreement.category === "disagreement",
    ),
    unresolvedEntries,
  };
}

function buildRawNormalizedTable(comparisons) {
  return comparisons.flatMap((comparison) =>
    comparison.providerEntries.map((entry) => ({
      packet_id: comparison.packetId,
      provider: entry.provider,
      field: comparison.field,
      raw_items: entry.rawItems,
      literal_items: entry.literalItems,
      semantic_concepts: entry.semanticConcepts,
      unresolved_items: entry.unresolvedItems,
    })),
  );
}

function buildV2Report(records, comparisons, aggregate) {
  const improvedRows = aggregate.improvedCases.map(
    (item) =>
      `- ${item.packetId} ${item.field}: literal=${item.literalAgreement.category}, semantic=${item.semanticAgreement.category}, shared concepts=${item.sharedConcepts.join(", ") || "None"}.`,
  );
  const persistentRows = aggregate.persistentDisagreements.map(
    (item) =>
      `- ${item.packetId} ${item.field}: disagreement remains after semantic normalization.`,
  );

  return [
    "# ECR-000001 Comparator v2 Report",
    "",
    "## Purpose",
    "",
    "Report both literal agreement and semantic-normalized agreement for ECR-000001 without hiding surface disagreement.",
    "",
    "## Data Set Summary",
    "",
    `- Valid files: ${aggregate.validRecords}.`,
    `- Malformed files: ${aggregate.malformedRecords}.`,
    `- Missing files: ${aggregate.missingRecords}.`,
    `- Ontology concepts: ${aggregate.ontologyConceptCount}.`,
    "",
    "## Literal Agreement Summary",
    "",
    ...formatCategoryDistribution(aggregate.literalDistribution),
    "",
    "## Semantic Agreement Summary",
    "",
    ...formatCategoryDistribution(aggregate.semanticDistribution),
    "",
    "## Cases Where Semantic Agreement Improved Over Literal Agreement",
    "",
    ...(improvedRows.length > 0 ? improvedRows : ["- None."]),
    "",
    "## Cases Where Disagreement Remains After Semantic Normalization",
    "",
    ...(persistentRows.length > 0 ? persistentRows : ["- None."]),
    "",
    "## Instrument Readiness Recommendation",
    "",
    determineReadinessV2(records, aggregate),
    "",
    "## Caution",
    "",
    "- Literal disagreement remains real at the surface representation level.",
    "- Semantic agreement indicates possible conceptual overlap, not proven equivalence.",
    "- If semantic agreement increases while literal agreement remains low, the instrument may be collecting equivalent concepts in varied wording.",
    "- If semantic disagreement remains high, either the models differ structurally or the ontology is incomplete.",
    "- If many items are unresolved, the ontology needs revision before strong conclusions.",
    "- Semantic normalization is provisional and is a measurement aid, not theory validation.",
    "",
  ].join("\n");
}

function buildLiteralVsSemanticReport(comparisons) {
  const rows = comparisons.map(
    (item) =>
      `| ${item.packetId} | ${item.field} | ${item.literalAgreement.category} | ${item.semanticAgreement.category} | ${escapePipes(
        item.sharedConcepts.join(", ") || "None",
      )} | ${escapePipes(buildNotes(item))} |`,
  );

  return [
    "# Literal vs Semantic Agreement",
    "",
    "| Packet | Field | Literal Agreement | Semantic Agreement | Shared Concepts | Notes |",
    "| --- | --- | --- | --- | --- | --- |",
    ...rows,
    "",
  ].join("\n");
}

function buildSemanticAudit(comparisons, ontology) {
  const conceptLabels = new Map(
    Object.entries(ontology).map(([conceptId, concept]) => [conceptId, concept.label]),
  );
  const sections = [];

  for (const item of comparisons) {
    sections.push(`## ${item.packetId} ${item.field}`);
    sections.push("");
    for (const entry of item.providerEntries) {
      sections.push(`### ${entry.provider}`);
      sections.push("");
      sections.push(`- Status: ${entry.status}`);
      sections.push(`- Raw text: ${entry.rawItems.join(" || ") || "None"}`);
      sections.push(
        `- Matched concepts: ${
          entry.semanticConcepts
            .map((conceptId) => `${conceptId} (${conceptLabels.get(conceptId)})`)
            .join(", ") || "None"
        }`,
      );
      sections.push(
        `- Patterns triggered: ${
          entry.triggeredPatterns
            .map((match) => `"${match.pattern}" -> ${match.conceptId}`)
            .join("; ") || "None"
        }`,
      );
      sections.push("");
    }
  }

  return [
    "# Semantic Normalization Audit",
    "",
    "Normalization is deterministic, case-insensitive, and preserves raw text alongside matched ontology concepts.",
    "",
    ...sections,
  ].join("\n");
}

function buildUnresolvedMatchesReport(comparisons) {
  const unresolved = comparisons.flatMap((item) =>
    item.providerEntries.flatMap((entry) =>
      entry.unresolvedItems.map((raw) => ({
        packetId: item.packetId,
        field: item.field,
        provider: entry.provider,
        raw,
      })),
    ),
  );

  return [
    "# Unresolved Semantic Matches",
    "",
    ...(unresolved.length > 0
      ? unresolved.map(
          (item) => `- ${item.packetId} ${item.provider} ${item.field}: ${item.raw}`,
        )
      : ["- None."]),
    "",
  ].join("\n");
}

function buildHypothesisReviewV2(aggregate, comparisons) {
  const semanticGainCount = aggregate.improvedCases.length;
  const unresolvedCount = aggregate.unresolvedEntries.length;
  const rows = [
    buildHypothesisRow(
      "H003 Multi-model convergence",
      `Semantic improvement cases=${semanticGainCount}; semantic disagreements=${aggregate.semanticDistribution.disagreement ?? 0}.`,
      "unclear",
      "Semantic normalization increases apparent overlap in some fields, but this remains a measurement aid rather than proof of convergence.",
    ),
    buildHypothesisRow(
      "H012 Vocabulary bias",
      `Literal disagreements=${aggregate.literalDistribution.disagreement ?? 0}; semantic improvements=${semanticGainCount}.`,
      semanticGainCount > 0 ? "possible_strengthen" : "unclear",
      "If semantic overlap rises where literal disagreement remains, wording drift may be inflating apparent disagreement.",
    ),
    buildHypothesisRow(
      "H013 Recognition bias",
      `Comparator v2 does not isolate recognition effects; unresolved items=${unresolvedCount}.`,
      "unclear",
      "Semantic normalization does not remove recognition as a threat and should not be read as evidence against bias.",
    ),
    buildHypothesisRow(
      "H015 Measurement instrument reliability",
      `Valid=${aggregate.validRecords}; malformed=${aggregate.malformedRecords}; unresolved normalized items=${unresolvedCount}.`,
      "unclear",
      "Semantic grouping may clarify wording drift, but unresolved items and malformed data still limit interpretation.",
    ),
  ];

  return [
    "# Hypothesis Review Input v2",
    "",
    "| Hypothesis | Evidence From Comparator v2 | Possible Direction | Notes | Reviewer Decision Needed |",
    "| --- | --- | --- | --- | --- |",
    ...rows,
    "",
    "Do not update confidence from this file. Reviewer judgment is still required.",
    "",
  ].join("\n");
}

function compareLiteralEntries(entries) {
  const populated = entries
    .filter((entry) => entry.status === "ok")
    .map((entry) => ({ provider: entry.provider, set: new Set(entry.literalItems) }))
    .filter((entry) => entry.set.size > 0);

  if (populated.length < 2) {
    return result("unclear", "Fewer than two valid populated literal outputs.");
  }

  const allEqual = populated.every((entry, index) =>
    index === 0 ? true : setsEqual(entry.set, populated[0].set),
  );
  if (allEqual) {
    return result("full_agreement", "All populated literal item sets are the same.");
  }

  const anyOverlap = pairwiseIntersections(populated.map((entry) => entry.set)).some(
    (shared) => shared.size > 0,
  );
  if (anyOverlap) {
    return result("partial_agreement", "At least two literal item sets overlap.");
  }

  return result("disagreement", "No shared literal items were detected.");
}

function compareSemanticEntries(entries) {
  const populated = entries
    .filter((entry) => entry.status === "ok")
    .map((entry) => ({ provider: entry.provider, set: new Set(entry.semanticConcepts) }))
    .filter((entry) => entry.set.size > 0);

  if (populated.length < 2) {
    return result("unclear", "Fewer than two valid non-empty semantic concept sets.");
  }

  const sharedAcrossAll = intersectionOfSets(populated.map((entry) => entry.set));
  if (sharedAcrossAll.size > 0 && populated.every((entry) => entry.set.size > 0)) {
    return result(
      "full_agreement",
      "All available models share at least one semantic concept and none have an empty concept set.",
    );
  }

  const anyPairOverlap = pairwiseIntersections(populated.map((entry) => entry.set)).some(
    (shared) => shared.size > 0,
  );
  if (anyPairOverlap) {
    return result("partial_agreement", "At least two models share one or more semantic concepts.");
  }

  return result("disagreement", "No shared semantic concepts were detected across valid outputs.");
}

function sharedSemanticConcepts(entries) {
  const populated = entries
    .filter((entry) => entry.status === "ok" && entry.semanticConcepts.length > 0)
    .map((entry) => new Set(entry.semanticConcepts));
  if (populated.length < 2) {
    return [];
  }
  const sharedAcrossAll = [...intersectionOfSets(populated)];
  if (sharedAcrossAll.length > 0) {
    return sharedAcrossAll.sort();
  }
  return unique(
    pairwiseIntersections(populated)
      .flatMap((shared) => [...shared])
      .sort(),
  );
}

function buildNotes(item) {
  if (item.improvedBySemantic) {
    return "Semantic normalization increased agreement without hiding literal disagreement.";
  }
  if (item.semanticDisagreementRemains) {
    return "Disagreement remains after normalization or concept sets are empty.";
  }
  return "Literal and semantic views are aligned.";
}

function determineReadinessV2(records, aggregate) {
  if (aggregate.missingRecords > 0) {
    return "Not ready for strong comparison. Missing files remain.";
  }
  if (aggregate.malformedRecords > 0) {
    return "Conditionally ready. Semantic normalization is available, but malformed input remains a tooling threat.";
  }
  if (aggregate.unresolvedEntries.length > 10) {
    return "Conditionally ready. Comparator v2 runs, but the ontology needs revision before strong conclusions.";
  }
  return "Ready for v2 calibration review with explicit caution that semantic normalization is provisional.";
}

function matchOntology(rawText, ontology) {
  const haystack = rawText.toLowerCase();
  const normalizedHaystack = normalizeText(rawText);
  const haystackTokens = new Set(normalizedHaystack.split(" ").filter(Boolean));
  const matches = [];
  for (const [conceptId, concept] of Object.entries(ontology)) {
    for (const pattern of concept.patterns) {
      const normalizedPattern = normalizeText(pattern);
      const patternTokens = normalizedPattern.split(" ").filter(Boolean);
      const exactSubstring = haystack.includes(pattern.toLowerCase());
      const tokenCoverage =
        patternTokens.length > 0 && patternTokens.every((token) => haystackTokens.has(token));
      if (exactSubstring || tokenCoverage) {
        matches.push({
          conceptId,
          label: concept.label,
          pattern,
        });
      }
    }
  }
  return dedupeMatches(matches);
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
    for (const entry of value) {
      walkValue(entry, items);
    }
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

function formatCategoryDistribution(distribution) {
  return [
    `- full_agreement: ${distribution.full_agreement ?? 0}`,
    `- partial_agreement: ${distribution.partial_agreement ?? 0}`,
    `- disagreement: ${distribution.disagreement ?? 0}`,
    `- unclear: ${distribution.unclear ?? 0}`,
  ];
}

function buildHypothesisRow(hypothesis, evidence, direction, notes) {
  return `| ${hypothesis} | ${escapePipes(evidence)} | ${direction} | ${escapePipes(
    notes,
  )} | Yes |`;
}

function result(category, note) {
  return { category, note };
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

function agreementRank(category) {
  return {
    unclear: 0,
    disagreement: 1,
    partial_agreement: 2,
    full_agreement: 3,
  }[category] ?? 0;
}

function pairwiseIntersections(sets) {
  const intersections = [];
  for (let index = 0; index < sets.length; index += 1) {
    for (let inner = index + 1; inner < sets.length; inner += 1) {
      intersections.push(intersectionOfSets([sets[index], sets[inner]]));
    }
  }
  return intersections;
}

function intersectionOfSets(sets) {
  if (sets.length === 0) {
    return new Set();
  }
  const [first, ...rest] = sets;
  const resultSet = new Set(first);
  for (const value of resultSet) {
    if (!rest.every((set) => set.has(value))) {
      resultSet.delete(value);
    }
  }
  return resultSet;
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

function dedupeMatches(matches) {
  const seen = new Set();
  const deduped = [];
  for (const match of matches) {
    const key = `${match.conceptId}:${match.pattern}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduped.push(match);
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

function relativeToExperiment(filePath) {
  return path.relative(experimentDir, filePath).replaceAll(path.sep, "/");
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

function escapePipes(value) {
  return value.replaceAll("|", "\\|");
}
