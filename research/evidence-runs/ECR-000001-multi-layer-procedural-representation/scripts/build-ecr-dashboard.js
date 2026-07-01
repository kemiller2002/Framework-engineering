import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const experimentDir = path.resolve(__dirname, "..");
const dashboardDir = path.join(experimentDir, "dashboard");
const generatedDir = path.join(dashboardDir, "generated");

const paths = {
  instrumentMetrics: path.join(experimentDir, "comparison", "generated", "instrument-metrics.md"),
  comparatorV1: path.join(experimentDir, "comparison", "generated", "ecr-000001-comparator-report.md"),
  structural: path.join(experimentDir, "comparison", "generated", "structural-agreement.md"),
  primitive: path.join(experimentDir, "comparison", "generated", "primitive-agreement.md"),
  constraint: path.join(experimentDir, "comparison", "generated", "constraint-agreement.md"),
  representation: path.join(experimentDir, "comparison", "generated", "representation-agreement.md"),
  product: path.join(experimentDir, "comparison", "generated", "product-relevance-observations.md"),
  comparatorV2: path.join(experimentDir, "comparison", "generated-v2", "ecr-000001-comparator-v2-report.md"),
  comparatorV3: path.join(experimentDir, "comparison", "generated-v3", "ecr-000001-comparator-v3-report.md"),
  validationV2: path.join(experimentDir, "comparison", "normalizer-validation", "generated", "normalizer-validation-report.md"),
  validationV3: path.join(experimentDir, "comparison", "normalizer-validation", "generated-v3", "normalizer-v3-validation-report.md"),
  validationV3Raw: path.join(experimentDir, "comparison", "normalizer-validation", "generated-v3", "raw-validation-output-v3.json"),
  unresolvedV2: path.join(experimentDir, "comparison", "generated-v2", "unresolved-semantic-matches.md"),
  unresolvedV3: path.join(experimentDir, "comparison", "generated-v3", "unresolved-dimensional-matches.md"),
  packetVerification: path.join(experimentDir, "packet-verification-report.md"),
  packetRefinementVerification: path.join(experimentDir, "packet-refinement-verification.md"),
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  await mkdir(generatedDir, { recursive: true });

  const [
    instrumentMetricsText,
    comparatorV1Text,
    structuralText,
    primitiveText,
    constraintText,
    representationText,
    productText,
    comparatorV2Text,
    comparatorV3Text,
    validationV2Text,
    validationV3Text,
    validationV3RawText,
    unresolvedV2Text,
    unresolvedV3Text,
    packetVerificationText,
    packetRefinementVerificationText,
  ] = await Promise.all(
    Object.values(paths).map((filePath) => readOptional(filePath)),
  );

  const instrument = parseInstrumentMetrics(instrumentMetricsText);
  const v1 = parseV1Comparator(comparatorV1Text);
  const v2 = parseV2Comparator(comparatorV2Text, unresolvedV2Text);
  const v3 = parseV3Comparator(comparatorV3Text, unresolvedV3Text);
  if (v1.distribution === "unavailable") {
    v1.distribution =
      parseInlineDistribution(
        comparatorV3Text,
        "v1 literal full/partial/disagreement/unclear:",
      ) || "unavailable";
  }
  if (!v2.semantic_distribution) {
    v2.semantic_distribution =
      parseInlineDistribution(
        comparatorV3Text,
        "v2 flat semantic full/partial/disagreement/unclear:",
      ) || "unavailable";
  }
  const validationV2 = parseValidationReport(validationV2Text);
  const validationV3 = parseValidationReport(validationV3Text);
  const validationV3Raw = parseJsonOptional(validationV3RawText);
  const layerStability = {
    structural: parseLayerAgreement(structuralText),
    primitive: parseLayerAgreement(primitiveText),
    constraint: parseLayerAgreement(constraintText),
    representation: parseLayerAgreement(representationText),
    product_relevance: parseLayerAgreement(productText),
  };
  const instructionAdherence = assessInstructionAdherence(
    packetVerificationText,
    packetRefinementVerificationText,
    productText,
  );

  const ontologyStatus = {
    ontology_version: validationV3.ontology_version || validationV2.ontology_version || "unavailable",
    validation_recommendation: validationV3.recommendation || validationV2.recommendation || "unavailable",
    false_positives: validationV3.false_positive_candidates ?? validationV2.false_positive_candidates ?? "unavailable",
    false_negatives: validationV3.false_negative_candidates ?? validationV2.false_negative_candidates ?? "unavailable",
    unresolved_cases: validationV3.unresolved_cases ?? validationV2.ontology_gaps ?? "unavailable",
    unresolved_dimensional_matches: v3.unresolved_items ?? "unavailable",
  };

  const recommendedNextAction = decideNextAction(ontologyStatus, instrument, validationV3Raw);
  const hypothesisReadiness = buildHypothesisReadiness({
    instrument,
    ontologyStatus,
    layerStability,
    v1,
    v2,
    v3,
  });
  const warnings = buildWarnings({ instrument, ontologyStatus, v1, v2, v3, validationV3Raw, recommendedNextAction });

  const data = {
    ecr_id: "ECR-000001",
    instrument_status: instrument.status,
    comparator_versions: {
      v1_literal: v1.distribution,
      v2_semantic: v2.semantic_distribution || "unavailable",
      v3_dimensional: v3.distribution,
    },
    ontology_status: ontologyStatus,
    hypothesis_readiness: hypothesisReadiness,
    recommended_next_action: recommendedNextAction,
    warnings,
  };

  await Promise.all([
    writeFile(path.join(generatedDir, "dashboard-data.json"), `${JSON.stringify(data, null, 2)}\n`),
    writeFile(path.join(generatedDir, "dashboard-summary.md"), buildSummary({
      instrument,
      v1,
      v2,
      v3,
      ontologyStatus,
      hypothesisReadiness,
      recommendedNextAction,
      warnings,
      instructionAdherence,
      layerStability,
    })),
  ]);
}

async function readOptional(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

function parseInstrumentMetrics(text) {
  if (!text) {
    return {
      status: "unavailable",
      valid_json: "unavailable",
      schema_compliance: "unavailable",
      malformed_files: "unavailable",
      missing_files: "unavailable",
      recognition_rate: "unavailable",
      ambiguity_count: "unavailable",
      observation_only_adherence: "pending",
    };
  }

  const rows = extractMarkdownTableRows(text).filter((row) => row.length >= 9 && row[0].startsWith("ECR-000001"));
  const total = rows.length;
  const okCount = rows.filter((row) => row[2] === "ok").length;
  const malformedCount = rows.filter((row) => row[2] === "malformed").length;
  const missingCount = rows.filter((row) => row[2] === "missing").length;
  const completeCount = rows.filter((row) => row[4] === "complete").length;
  const recognitionCount = rows.filter((row) => row[5] === "yes").length;
  const ambiguityCount = rows.reduce((sum, row) => sum + (Number.parseInt(row[6], 10) || 0), 0);

  return {
    status: malformedCount > 0 ? "conditionally_ready" : "ready",
    valid_json: `${okCount}/${total}`,
    schema_compliance: `${completeCount}/${total}`,
    malformed_files: malformedCount,
    missing_files: missingCount,
    recognition_rate: `${recognitionCount}/${okCount || 0}`,
    ambiguity_count: ambiguityCount,
  };
}

function parseV1Comparator(text) {
  return {
    readiness: matchLine(text, "Instrument readiness recommendation:") || "unavailable",
    distribution: "unavailable",
    recognition: matchLine(text, "Recognition present:") || "unavailable",
  };
}

function parseV2Comparator(text, unresolvedText) {
  return {
    semantic_distribution: parseDistribution(text, "## Semantic Agreement Summary", "## Cases Where Semantic Agreement Improved Over Literal Agreement"),
    unresolved_items: countBulletLines(unresolvedText),
  };
}

function parseV3Comparator(text, unresolvedText) {
  const distribution = parseInlineDistribution(text, "v3 dimensional full/partial/disagreement/unclear:");
  return {
    distribution: distribution || "unavailable",
    unresolved_items: countBulletLines(unresolvedText),
    validation_recommendation: matchLine(text, "v3 validation recommendation:") || "unavailable",
  };
}

function parseValidationReport(text) {
  if (!text) {
    return {};
  }
  return {
    ontology_version: matchDashValue(text, "ontology version") || matchDashValue(text, "Ontology Version") || "",
    recommendation: matchDashValue(text, "recommendation") || matchLine(text, "Recommendation:") || "",
    false_positive_candidates: toNumber(matchDashValue(text, "false-positive candidates")) ?? toNumber(matchLine(text, "False-positive candidates:")),
    false_negative_candidates: toNumber(matchDashValue(text, "false-negative candidates")) ?? toNumber(matchLine(text, "False-negative candidates:")),
    unresolved_cases: toNumber(matchDashValue(text, "unresolved cases")),
    ontology_gaps: toNumber(matchLine(text, "Ontology gaps:")),
  };
}

function parseLayerAgreement(text) {
  if (!text) {
    return { status: "pending" };
  }
  const matches = [...text.matchAll(/:\s*(full_agreement|partial_agreement|disagreement|unclear)\./g)].map((match) => match[1]);
  if (matches.length === 0) {
    return { status: "pending" };
  }
  const counts = tally(matches);
  return {
    status: summarizeCounts(counts),
    counts,
  };
}

function assessInstructionAdherence(packetVerificationText, packetRefinementVerificationText, productText) {
  const verificationPass =
    packetVerificationText.includes("PASS") || packetRefinementVerificationText.includes("PASS");
  const validationWarningCount = countMatches(productText, /validation-like wording:/g) - countMatches(productText, /- None detected\./g);
  if (verificationPass && validationWarningCount <= 0) {
    return "supported_by_packet_checks";
  }
  if (verificationPass && validationWarningCount > 0) {
    return "mixed_one_warning";
  }
  return "pending";
}

function buildHypothesisReadiness({ instrument, ontologyStatus, layerStability, v1, v2, v3 }) {
  const malformedBlocking = Number(instrument.malformed_files || 0) > 0;
  const unresolvedHigh = typeof ontologyStatus.unresolved_dimensional_matches === "number"
    ? ontologyStatus.unresolved_dimensional_matches > 500
    : false;
  const v3Safe = ontologyStatus.validation_recommendation === "safe_for_limited_calibration_use";
  const zeroFalsePositives = ontologyStatus.false_positives === 0;

  return [
    row("H003 Multi-Model Convergence", yesLimited(v3Safe), evidence("v1/v2/v3 comparators, v3 validation"), blocking(malformedBlocking ? "Malformed GPT P001 response." : "None critical.")),
    row("H012 Vocabulary Bias", yesLimited(v3Safe && zeroFalsePositives), evidence("v2 flat semantic, v3 dimensional reduction"), blocking(unresolvedHigh ? "High unresolved dimensional item count." : "None critical.")),
    row("H013 Recognition Bias", "No", evidence("v1 recognition rate 6/8, recognition threat flagged"), blocking("Recognition remains high and unresolved.")),
    row("H015 Measurement Instrument Reliability", yesLimited(v3Safe), evidence("instrument metrics, comparator readiness, v3 validation"), blocking(malformedBlocking ? "Malformed GPT P001 response." : "None critical.")),
    row("H005 Procedural Grammar", "No", evidence("comparator and v3 dimensional outputs exist"), blocking("Layer disagreement and unresolved dimensional items remain high.")),
    row("H006 Control Flow", "No", evidence("structural agreement report"), blocking("Control-flow shape remains disagreement-heavy.")),
    row("H007 Constraint Preservation", yesLimited(v3Safe), evidence("constraint agreement and v3 dimensional comparison"), blocking("Constraint overlap is mixed and still needs manual review.")),
    row("H008 Procedural AST Recovery", yesLimited(v3Safe), evidence("representation agreement, AST presence"), blocking("AST presence is stable, but canonical summary disagreement remains.")),
    row("H009 Clarity Relevance", "No", evidence("product relevance observations"), blocking("Product relevance remains speculative and should not drive review.")),
    row("H010 EDF Relevance", "No", evidence("product relevance observations"), blocking("Product relevance remains speculative and should not drive review.")),
  ];
}

function decideNextAction(ontologyStatus, instrument, validationV3Raw) {
  const safe = ontologyStatus.validation_recommendation === "safe_for_limited_calibration_use";
  const zeroFalsePositives = ontologyStatus.false_positives === 0;
  if (safe && zeroFalsePositives) {
    return "proceed_to_limited_hypothesis_review";
  }
  if (typeof ontologyStatus.unresolved_dimensional_matches === "number" && ontologyStatus.unresolved_dimensional_matches > 500) {
    return "sample_unresolved_items_first";
  }
  if (ontologyStatus.validation_recommendation === "needs_revision") {
    return "revise_ontology_before_review";
  }
  if (Number(instrument.malformed_files || 0) > 0) {
    return "pause_for_manual_review";
  }
  return "rerun_calibration";
}

function buildWarnings({ instrument, ontologyStatus, v1, v2, v3, validationV3Raw, recommendedNextAction }) {
  const warnings = [];
  if (Number(instrument.malformed_files || 0) > 0) {
    warnings.push("One malformed response file remains in the calibration set.");
  }
  if (instrument.recognition_rate === "6/8") {
    warnings.push("Recognition remains high and may still distort extraction behavior.");
  }
  if (typeof ontologyStatus.unresolved_dimensional_matches === "number" && ontologyStatus.unresolved_dimensional_matches > 500) {
    warnings.push("Unresolved dimensional matches are very high; sample unresolved items before ECR-000002.");
  }
  if (recommendedNextAction === "proceed_to_limited_hypothesis_review") {
    warnings.push("Proceed only with limited review and without confidence updates.");
  }
  return warnings;
}

function buildSummary({ instrument, v1, v2, v3, ontologyStatus, hypothesisReadiness, recommendedNextAction, warnings, instructionAdherence, layerStability }) {
  const ready = hypothesisReadiness.filter((row) => row.ready_for_review.startsWith("Yes"));
  const notReady = hypothesisReadiness.filter((row) => !row.ready_for_review.startsWith("Yes"));
  return [
    "# ECR-000001 Research Dashboard Summary",
    "",
    "## Current Status",
    "",
    `- Instrument status: ${instrument.status}.`,
    `- v1 literal agreement: ${v1.distribution}.`,
    `- v2 flat semantic agreement: ${v2.semantic_distribution || "unavailable"}.`,
    `- v3 dimensional agreement: ${v3.distribution}.`,
    `- Ontology recommendation: ${ontologyStatus.validation_recommendation}.`,
    `- Observation-only adherence evidence: ${instructionAdherence}.`,
    "",
    "## What Is Ready",
    "",
    ...(ready.length > 0 ? ready.map((item) => `- ${item.hypothesis}`) : ["- None."]),
    "",
    "## What Is Not Ready",
    "",
    ...(notReady.length > 0 ? notReady.map((item) => `- ${item.hypothesis}: ${item.blocking_issues}`) : ["- None."]),
    "",
    "## Main Risks",
    "",
    ...warnings.map((warning) => `- ${warning}`),
    `- Structural layer status: ${layerStability.structural.status ?? "pending"}.`,
    `- Primitive layer status: ${layerStability.primitive.status ?? "pending"}.`,
    `- Constraint layer status: ${layerStability.constraint.status ?? "pending"}.`,
    `- Representation layer status: ${layerStability.representation.status ?? "pending"}.`,
    `- Product relevance layer status: ${layerStability.product_relevance.status ?? "pending"}.`,
    "",
    "## Recommended Next Action",
    "",
    `- ${recommendedNextAction}`,
    "",
    "## Do Not Overclaim",
    "",
    "- The dashboard summarizes readiness; it does not validate the instrument or the theory.",
    "- Comparator improvements do not remove literal disagreement.",
    "- No hypothesis confidence should be updated from this dashboard.",
    "",
  ].join("\n");
}

function parseInlineDistribution(text, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(new RegExp(`${escaped}\\s*([0-9]+\\/[0-9]+\\/[0-9]+\\/[0-9]+)`));
  return match ? match[1] : "";
}

function parseDistribution(text, startHeading, endHeading) {
  if (!text) return "";
  const startIndex = text.indexOf(startHeading);
  if (startIndex < 0) return "";
  const endIndex = endHeading ? text.indexOf(endHeading, startIndex) : text.length;
  const slice = text.slice(startIndex, endIndex > -1 ? endIndex : text.length);
  const full = toNumber(matchDashValue(slice, "full_agreement")) ?? 0;
  const partial = toNumber(matchDashValue(slice, "partial_agreement")) ?? 0;
  const disagreement = toNumber(matchDashValue(slice, "disagreement")) ?? 0;
  const unclear = toNumber(matchDashValue(slice, "unclear")) ?? 0;
  return `${full}/${partial}/${disagreement}/${unclear}`;
}

function parseJsonOptional(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function extractMarkdownTableRows(text) {
  return text
    .split("\n")
    .filter((line) => /^\|/.test(line))
    .filter((line) => !/^\|\s*-/.test(line))
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));
}

function matchLine(text, prefix) {
  if (!text) return "";
  const line = text.split("\n").find((entry) => entry.includes(prefix));
  return line ? line.split(prefix)[1].trim().replace(/\.$/, "") : "";
}

function matchDashValue(text, label) {
  if (!text) return "";
  const match = text.match(new RegExp(`-\\s+${label}:\\s*([^\\n]+)`, "i"));
  return match ? match[1].trim().replace(/\.$/, "") : "";
}

function countBulletLines(text) {
  if (!text) return 0;
  return text
    .split("\n")
    .filter((line) => line.trim().startsWith("- "))
    .filter((line) => !/None\./.test(line))
    .length;
}

function countMatches(text, pattern) {
  return text ? [...text.matchAll(pattern)].length : 0;
}

function tally(values) {
  const counts = {};
  for (const value of values) {
    counts[value] = (counts[value] ?? 0) + 1;
  }
  return counts;
}

function summarizeCounts(counts) {
  const disagreement = counts.disagreement ?? 0;
  const partial = counts.partial_agreement ?? 0;
  const full = counts.full_agreement ?? 0;
  if (disagreement > full + partial) return "disagreement_heavy";
  if (partial + full > disagreement) return "mixed_with_some_stability";
  return "mixed";
}

function toNumber(value) {
  if (value == null || value === "") return null;
  const match = String(value).match(/-?\d+/);
  return match ? Number.parseInt(match[0], 10) : null;
}

function row(hypothesis, ready_for_review, evidence_available, blocking_issues) {
  return { hypothesis, ready_for_review, evidence_available, blocking_issues };
}

function yesLimited(condition) {
  return condition ? "Yes (limited)" : "No";
}

function evidence(value) {
  return value;
}

function blocking(value) {
  return value;
}
