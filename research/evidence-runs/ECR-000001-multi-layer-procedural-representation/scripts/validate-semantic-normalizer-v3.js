import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const experimentDir = path.resolve(__dirname, "..");
const v3Dir = path.join(experimentDir, "comparison", "ontology-v3");
const casesPath = path.join(
  experimentDir,
  "comparison",
  "normalizer-validation",
  "adversarial-test-cases.json",
);
const outputDir = path.join(
  experimentDir,
  "comparison",
  "normalizer-validation",
  "generated-v3",
);
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
  const [roles, objects, purposes, stages, controlFlow, versionText, cases] = await Promise.all([
    loadJson(path.join(v3Dir, "procedural-role-taxonomy.json")),
    loadJson(path.join(v3Dir, "procedural-object-taxonomy.json")),
    loadJson(path.join(v3Dir, "procedural-purpose-taxonomy.json")),
    loadJson(path.join(v3Dir, "procedural-stage-taxonomy.json")),
    loadJson(path.join(v3Dir, "control-flow-taxonomy.json")),
    readFile(path.join(v3Dir, "ontology-v3-version.md"), "utf8"),
    loadJson(casesPath),
  ]);
  const taxonomies = {
    role: roles,
    object: objects,
    purpose: purposes,
    stage: stages,
    control_flow: controlFlow,
  };

  const results = cases.map((testCase) => evaluateCase(testCase, taxonomies));
  const summary = summarize(results, versionText);

  await Promise.all([
    writeFile(
      path.join(outputDir, "raw-validation-output-v3.json"),
      `${JSON.stringify({ summary, results }, null, 2)}\n`,
    ),
    writeFile(
      path.join(outputDir, "normalizer-v3-validation-report.md"),
      buildReport(summary),
    ),
    writeFile(
      path.join(outputDir, "adversarial-test-results-v3.md"),
      buildAdversarialTable(results),
    ),
    writeFile(
      path.join(outputDir, "ontology-v3-rule-audit.md"),
      buildOntologyAudit(results),
    ),
    writeFile(
      path.join(outputDir, "false-positive-candidates-v3.md"),
      buildFlagReport(results, "false_positive_candidate", "False Positive Candidates v3"),
    ),
    writeFile(
      path.join(outputDir, "false-negative-candidates-v3.md"),
      buildFlagReport(results, "false_negative_candidate", "False Negative Candidates v3"),
    ),
    writeFile(
      path.join(outputDir, "recommended-ontology-v3-changes.md"),
      buildRecommendations(results),
    ),
  ]);
}

async function loadJson(filePath) {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw);
}

function evaluateCase(testCase, taxonomies) {
  const phraseA = normalizePhrase(testCase.phrase_a, taxonomies);
  const phraseB = normalizePhrase(testCase.phrase_b, taxonomies);
  const comparison = compareDimensionalObjects(phraseA, phraseB);
  const verdict = classifyExpected(testCase.expected_relationship, phraseA, phraseB, comparison);
  return {
    case_id: testCase.case_id,
    expected_relationship: testCase.expected_relationship,
    phrase_a: phraseA,
    phrase_b: phraseB,
    comparison,
    result: verdict.result,
    flag: verdict.flag,
    notes: verdict.notes,
  };
}

function normalizePhrase(raw, taxonomies) {
  return {
    raw_phrase: raw,
    role: chooseBestMatch(raw, taxonomies.role, "role"),
    object: chooseBestMatch(raw, taxonomies.object, "object"),
    purpose: chooseBestMatch(raw, taxonomies.purpose, "purpose"),
    stage: chooseBestMatch(raw, taxonomies.stage, "stage"),
    control_flow: chooseBestMatch(raw, taxonomies.control_flow, "control_flow"),
  };
}

function compareDimensionalObjects(left, right) {
  const sameRole = left.role.key && left.role.key === right.role.key;
  const objectCompatible =
    left.object.key &&
    right.object.key &&
    areObjectsCompatible(left.object.key, right.object.key);
  const purposeCompatible =
    left.purpose.key &&
    right.purpose.key &&
    left.purpose.key === right.purpose.key;
  const contradiction = hasContradiction(left, right);
  return {
    same_role: sameRole,
    object_compatible: objectCompatible,
    purpose_compatible: purposeCompatible,
    contradiction,
    shared_roles: sharedValue(left.role.key, right.role.key),
    shared_objects: sharedObjectValues(left.object.key, right.object.key),
    shared_purposes: sharedValue(left.purpose.key, right.purpose.key),
  };
}

function classifyExpected(expected, left, right, comparison) {
  if (["NV-002", "NV-009"].includes(left.raw_phrase) || false) {
    // no-op marker to keep branching explicit
  }

  if (expected === "equivalent") {
    if (comparison.same_role && (comparison.object_compatible || comparison.purpose_compatible) && !comparison.contradiction) {
      return { result: "expected_pass", flag: null, notes: "Equivalent pair stayed aligned dimensionally." };
    }
    return { result: "false_negative_candidate", flag: "false_negative_candidate", notes: "Equivalent pair failed dimensional equivalence." };
  }

  if (expected === "related_but_distinct") {
    if (comparison.same_role && comparison.object_compatible && !comparison.contradiction) {
      return { result: "false_positive_candidate", flag: "false_positive_candidate", notes: "Distinct pair collapsed into dimensional equivalence." };
    }
    if (!left.role.key || !right.role.key) {
      return { result: "ontology_gap", flag: "ontology_gap", notes: "At least one role remained unresolved." };
    }
    return { result: "expected_pass", flag: null, notes: "Pair remained related but distinct." };
  }

  if (expected === "opposite") {
    if (comparison.same_role && !comparison.contradiction) {
      return { result: "false_positive_candidate", flag: "false_positive_candidate", notes: "Opposite pair shared a non-contradicted dimensional reading." };
    }
    return { result: "expected_pass", flag: null, notes: "Opposite pair remained distinct or contradictory." };
  }

  if (expected === "unrelated") {
    if (
      comparison.same_role ||
      comparison.object_compatible ||
      comparison.purpose_compatible
    ) {
      return { result: "false_positive_candidate", flag: "false_positive_candidate", notes: "Unrelated pair shares dimensional overlap." };
    }
    return { result: "expected_pass", flag: null, notes: "Unrelated pair remained distinct." };
  }

  return { result: "needs_human_review", flag: "needs_human_review", notes: "Manual review required." };
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
      const patternNorm = normalizeText(pattern);
      const patternTokens = patternNorm.split(" ").filter(Boolean);
      const exact = raw.toLowerCase().includes(pattern.toLowerCase());
      const covered = patternTokens.length > 0 && patternTokens.every((token) => tokens.has(token));
      if (exact || covered) {
        matches.push({
          key,
          pattern,
          score: scorePattern(key, patternNorm, exact, covered, dimension),
          match_type: raw.toLowerCase().includes(pattern.toLowerCase()) ? "exact_pattern" : "procedural_equivalent",
          match_confidence: raw.toLowerCase().includes(pattern.toLowerCase()) ? "High" : "Moderate",
        });
      }
    }
  }

  if (matches.length === 0) {
    return { key: "", patterns: [], match_type: "unresolved", match_confidence: "Reject" };
  }

  matches.sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score;
    if (dimension === "role") return rolePriority.indexOf(left.key) - rolePriority.indexOf(right.key);
    return left.key.localeCompare(right.key);
  });
  const best = matches[0];
  return {
    key: best.key,
    patterns: unique(matches.filter((match) => match.key === best.key).map((match) => match.pattern)),
    match_type: best.match_type,
    match_confidence: best.match_confidence,
  };
}

function scorePattern(key, pattern, exact, covered, dimension) {
  let score = 0;
  if (exact) score += 3;
  if (covered) score += 2;
  score += pattern.split(" ").length;
  if (dimension === "role" && ["prioritize", "terminate", "decide", "verify", "compare", "evaluate"].includes(key)) {
    score += 1;
  }
  if (
    dimension === "role" &&
    key === "identify" &&
    ["unresolved", "question", "problem", "uncertainty", "recognized", "identified"].some((token) =>
      pattern.includes(token),
    )
  ) {
    score += 2;
  }
  return score;
}

function areObjectsCompatible(left, right) {
  if (left === right) return true;
  const groups = [
    ["evidence", "information", "data", "observation"],
    ["work", "outcome", "artifact"],
    ["alternative", "option"],
    ["hypothesis", "explanation"],
    ["problem", "question", "uncertainty"],
  ];
  return groups.some((group) => group.includes(left) && group.includes(right));
}

function hasContradiction(left, right) {
  const leftRole = left.role.key;
  const rightRole = right.role.key;
  if ((leftRole === "terminate" && rightRole === "decide") || (leftRole === "decide" && rightRole === "terminate")) {
    return true;
  }
  if ((leftRole === "evaluate" && rightRole === "verify") || (leftRole === "verify" && rightRole === "evaluate")) {
    return false;
  }
  if (left.control_flow.key === "termination" && right.control_flow.key === "continuation") return true;
  if (left.control_flow.key === "continuation" && right.control_flow.key === "termination") return true;
  if (
    (normalizeText(left.raw_phrase).includes("forever") && normalizeText(right.raw_phrase).includes("until")) ||
    (normalizeText(right.raw_phrase).includes("forever") && normalizeText(left.raw_phrase).includes("until"))
  ) {
    return true;
  }
  return false;
}

function summarize(results, versionText) {
  const counts = tally(results.map((result) => result.result));
  const falsePositiveCases = results.filter((result) => result.flag === "false_positive_candidate");
  const falseNegativeCases = results.filter((result) => result.flag === "false_negative_candidate");
  const unresolvedCases = results.filter((result) => result.flag === "ontology_gap" || result.flag === "needs_human_review");
  const blocking = hasBlockingFailure(results);
  return {
    ontology_version: extractVersion(versionText),
    test_cases: results.length,
    expected_passes: counts.expected_pass ?? 0,
    false_positive_candidates: falsePositiveCases.length,
    false_negative_candidates: falseNegativeCases.length,
    unresolved_cases: unresolvedCases.length,
    blocking,
    recommendation: blocking
      ? "not_safe_for_hypothesis_review"
      : falsePositiveCases.length > 0 || falseNegativeCases.length > 1
        ? "needs_revision"
        : "safe_for_limited_calibration_use",
  };
}

function hasBlockingFailure(results) {
  const blockingIds = new Set(["NV-002", "NV-009"]);
  const criticalRolePairs = [
    ["terminate", "decide"],
    ["decide", "terminate"],
    ["evaluate", "verify"],
    ["verify", "evaluate"],
  ];
  for (const result of results) {
    if (blockingIds.has(result.case_id) && result.flag === "false_positive_candidate") {
      return true;
    }
    const leftRole = result.phrase_a.role.key;
    const rightRole = result.phrase_b.role.key;
    if (
      result.flag === "false_positive_candidate" &&
      criticalRolePairs.some(([a, b]) => a === leftRole && b === rightRole)
    ) {
      return true;
    }
  }
  return false;
}

function buildReport(summary) {
  return [
    "# Normalizer v3 Validation Report",
    "",
    `- ontology version: ${summary.ontology_version}`,
    `- test cases: ${summary.test_cases}`,
    `- expected passes: ${summary.expected_passes}`,
    `- false-positive candidates: ${summary.false_positive_candidates}`,
    `- false-negative candidates: ${summary.false_negative_candidates}`,
    `- unresolved cases: ${summary.unresolved_cases}`,
    `- recommendation: ${summary.recommendation}`,
    "",
    "This report is skeptical by design. Dimensional normalization remains a measurement tool, not proof of equivalence.",
    "",
  ].join("\n");
}

function buildAdversarialTable(results) {
  const rows = results.map(
    (result) =>
      `| ${result.case_id} | ${escapePipes(result.phrase_a.raw_phrase)} | ${escapePipes(result.phrase_b.raw_phrase)} | ${result.expected_relationship} | ${escapePipes(
        [
          ...result.comparison.shared_roles,
          ...result.comparison.shared_objects,
          ...result.comparison.shared_purposes,
        ].join(", ") || "None",
      )} | ${result.result} | ${escapePipes(result.notes)} |`,
  );
  return [
    "# Adversarial Test Results v3",
    "",
    "| Case | Phrase A | Phrase B | Expected | Actual Shared Concepts | Result | Notes |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...rows,
    "",
  ].join("\n");
}

function buildOntologyAudit(results) {
  const lines = ["# Ontology v3 Rule Audit", ""];
  const dimensions = ["role", "object", "purpose", "stage", "control_flow"];
  for (const dimension of dimensions) {
    const count = results.filter(
      (result) => result.phrase_a[dimension].key || result.phrase_b[dimension].key,
    ).length;
    const suspicious = results.filter((result) => result.flag === "false_positive_candidate");
    lines.push(`## ${dimension}`);
    lines.push("");
    lines.push(`- adversarial matches: ${count}`);
    lines.push(`- suspicious matches: ${suspicious.map((result) => result.case_id).join(", ") || "None"}`);
    lines.push(`- recommended change: ${suspicious.length > 0 ? "review high-overlap patterns" : "no immediate change indicated"}`);
    lines.push("");
  }
  return lines.join("\n");
}

function buildFlagReport(results, flag, title) {
  const filtered = results.filter((result) => result.flag === flag);
  return [
    `# ${title}`,
    "",
    ...(filtered.length > 0
      ? filtered.map(
          (result) =>
            `- ${result.case_id}: ${result.phrase_a.raw_phrase} / ${result.phrase_b.raw_phrase} (${result.notes})`,
        )
      : ["- None."]),
    "",
  ].join("\n");
}

function buildRecommendations(results) {
  const falsePositives = results.filter((result) => result.flag === "false_positive_candidate");
  const falseNegatives = results.filter((result) => result.flag === "false_negative_candidate");
  const gaps = results.filter((result) => result.flag === "ontology_gap");
  return [
    "# Recommended Ontology v3 Changes",
    "",
    "## Split Concepts",
    "",
    ...(falsePositives.length > 0
      ? falsePositives.map((result) => `- Review dimensional overlap in ${result.case_id}.`)
      : ["- None identified from current adversarial cases."]),
    "",
    "## Remove Overly Broad Patterns",
    "",
    ...(falsePositives.length > 0
      ? ["- Narrow patterns that let noun overlap override role differences."]
      : ["- None identified from current adversarial cases."]),
    "",
    "## Add Missing Synonyms",
    "",
    ...(falseNegatives.length > 0
      ? falseNegatives.map((result) => `- Add safer synonym coverage for ${result.case_id}.`)
      : ["- None identified from current adversarial cases."]),
    "",
    "## Mark Ambiguous Cases Unresolved",
    "",
    ...(gaps.length > 0
      ? gaps.map((result) => `- ${result.case_id}: unresolved is safer than forced equivalence.`)
      : ["- No unresolved ontology gaps flagged."]),
    "",
  ].join("\n");
}

function sharedValue(left, right) {
  return left && right && left === right ? [left] : [];
}

function sharedObjectValues(left, right) {
  return left && right && areObjectsCompatible(left, right)
    ? unique([left, right, ...objectAliases(left), ...objectAliases(right)].filter((value) => !value.endsWith("_family")))
    : [];
}

function objectAliases(object) {
  if (["evidence", "information", "data", "observation"].includes(object)) return ["evidence_family"];
  if (["work", "outcome", "artifact"].includes(object)) return ["delivery_family"];
  if (["alternative", "option"].includes(object)) return ["candidate_family"];
  if (["hypothesis", "explanation"].includes(object)) return ["candidate_family"];
  return [];
}

function tally(values) {
  const counts = {};
  for (const value of values) counts[value] = (counts[value] ?? 0) + 1;
  return counts;
}

function extractVersion(markdown) {
  const match = markdown.match(/Version:\s*\n([^\n]+)/i);
  return match ? match[1].trim() : "Unknown";
}

function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function unique(values) {
  return [...new Set(values)];
}

function escapePipes(value) {
  return value.replaceAll("|", "\\|");
}
