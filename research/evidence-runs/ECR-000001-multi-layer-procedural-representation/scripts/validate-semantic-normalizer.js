import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const experimentDir = path.resolve(__dirname, "..");
const ontologyPath = path.join(
  experimentDir,
  "comparison",
  "ontology",
  "procedural-concept-ontology.json",
);
const ontologyVersionPath = path.join(
  experimentDir,
  "comparison",
  "ontology",
  "ontology-version.md",
);
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
  "generated",
);

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  await mkdir(outputDir, { recursive: true });
  const [ontology, ontologyVersion, testCases] = await Promise.all([
    loadJson(ontologyPath),
    readFile(ontologyVersionPath, "utf8"),
    loadJson(casesPath),
  ]);

  const results = testCases.map((testCase) => evaluateCase(testCase, ontology));
  const summary = summarizeResults(results, ontologyVersion);

  await Promise.all([
    writeFile(
      path.join(outputDir, "raw-validation-output.json"),
      `${JSON.stringify({ summary, results }, null, 2)}\n`,
    ),
    writeFile(
      path.join(outputDir, "normalizer-validation-report.md"),
      buildValidationReport(summary),
    ),
    writeFile(
      path.join(outputDir, "adversarial-test-results.md"),
      buildAdversarialResults(results),
    ),
    writeFile(
      path.join(outputDir, "ontology-rule-audit.md"),
      buildOntologyAudit(results, ontology),
    ),
    writeFile(
      path.join(outputDir, "false-positive-candidates.md"),
      buildFlagReport(results, "false_positive_candidate", "False Positive Candidates"),
    ),
    writeFile(
      path.join(outputDir, "false-negative-candidates.md"),
      buildFlagReport(results, "false_negative_candidate", "False Negative Candidates"),
    ),
    writeFile(
      path.join(outputDir, "recommended-ontology-changes.md"),
      buildRecommendations(results),
    ),
  ]);

  await appendValidationNote();
}

async function loadJson(filePath) {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw);
}

function evaluateCase(testCase, ontology) {
  const phraseA = normalizePhrase(testCase.phrase_a, ontology);
  const phraseB = normalizePhrase(testCase.phrase_b, ontology);
  const shared = intersection(phraseA.concepts, phraseB.concepts);
  const evaluation = classifyRelationship(testCase.expected_relationship, phraseA, phraseB, shared);

  return {
    case_id: testCase.case_id,
    phrase_a: phraseA,
    phrase_b: phraseB,
    expected_relationship: testCase.expected_relationship,
    rationale: testCase.rationale,
    actual_shared_concepts: [...shared],
    result: evaluation.result,
    flag: evaluation.flag,
    notes: evaluation.notes,
  };
}

function normalizePhrase(rawPhrase, ontology) {
  const normalized = normalizeText(rawPhrase);
  const haystackTokens = new Set(normalized.split(" ").filter(Boolean));
  const matches = [];

  for (const [conceptId, concept] of Object.entries(ontology)) {
    for (const pattern of concept.patterns) {
      const normalizedPattern = normalizeText(pattern);
      const patternTokens = normalizedPattern.split(" ").filter(Boolean);
      const exactSubstring = rawPhrase.toLowerCase().includes(pattern.toLowerCase());
      const tokenCoverage =
        patternTokens.length > 0 && patternTokens.every((token) => haystackTokens.has(token));

      if (exactSubstring || tokenCoverage) {
        const matchType = determineMatchType(normalized, normalizedPattern, exactSubstring, tokenCoverage);
        matches.push({
          raw_text: rawPhrase,
          matched_concept: conceptId,
          matched_label: concept.label,
          pattern_triggered: pattern,
          match_confidence: determineMatchConfidence(matchType),
          match_type: matchType,
        });
      }
    }
  }

  const deduped = dedupeMatches(matches);
  return {
    raw_phrase: rawPhrase,
    matched_concepts: deduped,
    concepts: unique(deduped.map((match) => match.matched_concept)),
    unresolved: deduped.length === 0,
  };
}

function classifyRelationship(expected, phraseA, phraseB, shared) {
  if (expected === "equivalent") {
    if (shared.size > 0) {
      return {
        result: "expected_pass",
        flag: null,
        notes: "Equivalent pair shares at least one concept.",
      };
    }
    return {
      result: "false_negative_candidate",
      flag: "false_negative_candidate",
      notes: "Equivalent pair failed to share a concept.",
    };
  }

  if (expected === "related_but_distinct") {
    if (phraseA.unresolved || phraseB.unresolved) {
      return {
        result: "ontology_gap",
        flag: "ontology_gap",
        notes: "At least one phrase remained unresolved; safe non-collapse but ontology coverage is incomplete.",
      };
    }
    if (shared.size === 0) {
      return {
        result: "expected_pass",
        flag: null,
        notes: "Distinct pair did not collapse into a shared concept.",
      };
    }
    return {
      result: "false_positive_candidate",
      flag: "false_positive_candidate",
      notes: "Distinct pair shares one or more concepts and may be over-merged.",
    };
  }

  if (expected === "opposite" || expected === "unrelated") {
    if (shared.size === 0) {
      return {
        result: "expected_pass",
        flag: null,
        notes: "Pair remained separate.",
      };
    }
    return {
      result: "false_positive_candidate",
      flag: "false_positive_candidate",
      notes: "Pair shares concepts despite expected opposition or unrelatedness.",
    };
  }

  if (expected === "hierarchical_parent_child") {
    return {
      result: "needs_human_review",
      flag: "needs_human_review",
      notes: "Hierarchy support is not explicit in ontology v0.1.",
    };
  }

  return {
    result: "needs_human_review",
    flag: "needs_human_review",
    notes: "Relationship type requires manual review.",
  };
}

function summarizeResults(results, ontologyVersion) {
  const counts = tally(results.map((result) => result.result));
  const flags = tally(results.map((result) => result.flag).filter(Boolean));
  const recommendation = decideRecommendation(flags, counts);

  return {
    ontology_version: extractOntologyVersion(ontologyVersion),
    test_case_count: results.length,
    expected_passes: counts.expected_pass ?? 0,
    false_positive_candidates: flags.false_positive_candidate ?? 0,
    false_negative_candidates: flags.false_negative_candidate ?? 0,
    ontology_gaps: flags.ontology_gap ?? 0,
    needs_human_review: flags.needs_human_review ?? 0,
    recommendation,
  };
}

function decideRecommendation(flags, counts) {
  if ((flags.false_positive_candidate ?? 0) >= 3) {
    return "not_safe_for_hypothesis_review";
  }
  if ((flags.false_positive_candidate ?? 0) > 0 || (flags.ontology_gap ?? 0) > 0) {
    return "needs_revision";
  }
  if ((counts.expected_pass ?? 0) > 0) {
    return "safe_for_limited_use";
  }
  return "needs_revision";
}

function buildValidationReport(summary) {
  return [
    "# Normalizer Validation Report",
    "",
    "## Purpose",
    "",
    "Validate whether the semantic normalizer preserves procedural distinctions without over-merging concepts.",
    "",
    "## Ontology Version",
    "",
    `- ${summary.ontology_version}`,
    "",
    "## Summary",
    "",
    `- Number of test cases: ${summary.test_case_count}`,
    `- Expected passes: ${summary.expected_passes}`,
    `- False-positive candidates: ${summary.false_positive_candidates}`,
    `- False-negative candidates: ${summary.false_negative_candidates}`,
    `- Ontology gaps: ${summary.ontology_gaps}`,
    `- Recommendation: ${summary.recommendation}`,
    "",
    "## Interpretation",
    "",
    "- Over-merged concepts are treated as the primary risk.",
    "- Unresolved phrases are acceptable when the ontology lacks a safe match.",
    "- This report does not validate semantic normalization; it only audits immediate failure modes.",
    "",
  ].join("\n");
}

function buildAdversarialResults(results) {
  const rows = results.map(
    (result) =>
      `| ${result.case_id} | ${escapePipes(result.phrase_a.raw_phrase)} | ${escapePipes(
        result.phrase_b.raw_phrase,
      )} | ${result.expected_relationship} | ${escapePipes(
        result.actual_shared_concepts.join(", ") || "None",
      )} | ${result.result} | ${escapePipes(result.notes)} |`,
  );

  return [
    "# Adversarial Test Results",
    "",
    "| Case | Phrase A | Phrase B | Expected | Actual Shared Concepts | Result | Notes |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...rows,
    "",
  ].join("\n");
}

function buildOntologyAudit(results, ontology) {
  const sections = [];
  for (const [conceptId, concept] of Object.entries(ontology)) {
    const conceptResults = results.filter(
      (result) =>
        result.phrase_a.concepts.includes(conceptId) || result.phrase_b.concepts.includes(conceptId),
    );
    const suspicious = conceptResults.filter((result) => result.flag === "false_positive_candidate");
    sections.push(`## ${conceptId}`);
    sections.push("");
    sections.push(`- Patterns: ${concept.patterns.join(", ")}`);
    sections.push(`- Number of adversarial matches: ${conceptResults.length}`);
    sections.push(
      `- Suspicious matches: ${suspicious.map((result) => result.case_id).join(", ") || "None"}`,
    );
    sections.push(`- Recommended change: ${recommendChange(conceptId, suspicious.length)}`);
    sections.push("");
  }

  return [
    "# Ontology Rule Audit",
    "",
    ...sections,
  ].join("\n");
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

  const lines = [
    "# Recommended Ontology Changes",
    "",
    "## Split Concepts",
    "",
  ];

  if (falsePositives.length === 0) {
    lines.push("- None identified from adversarial cases.");
  } else {
    for (const result of falsePositives) {
      lines.push(`- Review over-merged concepts in ${result.case_id}.`);
    }
  }

  lines.push("", "## Remove Overly Broad Patterns", "");
  if (falsePositives.length === 0) {
    lines.push("- None identified from current tests.");
  } else {
    lines.push("- Review patterns that trigger on generic verbs such as `evaluate`, `support`, or `continue` when they collapse distinct functions.");
  }

  lines.push("", "## Add Missing Synonyms", "");
  if (falseNegatives.length === 0) {
    lines.push("- None identified from current tests.");
  } else {
    for (const result of falseNegatives) {
      lines.push(`- Add safer synonym coverage for ${result.case_id} only if it does not create new merges.`);
    }
  }

  lines.push("", "## Leave Ambiguous Cases Unresolved", "");
  if (gaps.length === 0) {
    lines.push("- No ontology gaps were flagged by the adversarial set.");
  } else {
    for (const result of gaps) {
      lines.push(`- ${result.case_id}: unresolved is preferable to forced mapping here.`);
    }
  }

  lines.push("");
  return lines.join("\n");
}

async function appendValidationNote() {
  const reportPath = path.join(
    experimentDir,
    "comparison",
    "generated-v2",
    "ecr-000001-comparator-v2-report.md",
  );
  let existing = "";
  try {
    existing = await readFile(reportPath, "utf8");
  } catch {
    return;
  }
  const note = "\n## Validation Note\n\nSemantic normalization requires validation before hypothesis confidence updates.\n";
  if (!existing.includes("Semantic normalization requires validation before hypothesis confidence updates.")) {
    await writeFile(reportPath, `${existing.trimEnd()}${note}`);
  }
}

function determineMatchType(normalizedPhrase, normalizedPattern, exactSubstring, tokenCoverage) {
  if (normalizedPhrase === normalizedPattern) {
    return "synonym";
  }
  if (exactSubstring) {
    return "exact_pattern";
  }
  if (tokenCoverage) {
    return "procedural_equivalent";
  }
  return "unresolved";
}

function determineMatchConfidence(matchType) {
  if (matchType === "exact_pattern" || matchType === "synonym") {
    return "High";
  }
  if (matchType === "procedural_equivalent") {
    return "Moderate";
  }
  if (matchType === "contextual_inference") {
    return "Low";
  }
  return "Reject";
}

function dedupeMatches(matches) {
  const seen = new Set();
  const deduped = [];
  for (const match of matches) {
    const key = `${match.matched_concept}:${match.pattern_triggered}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduped.push(match);
  }
  return deduped;
}

function recommendChange(conceptId, suspiciousCount) {
  if (suspiciousCount > 1) {
    return `Review ${conceptId} for over-broad patterns or concept splitting.`;
  }
  if (suspiciousCount === 1) {
    return `Review ${conceptId} against the flagged case.`;
  }
  return "No immediate change indicated by adversarial cases.";
}

function extractOntologyVersion(markdown) {
  const match = markdown.match(/Version:\s*\n([^\n]+)/i);
  return match ? match[1].trim() : "Unknown";
}

function tally(values) {
  const counts = {};
  for (const value of values) {
    counts[value] = (counts[value] ?? 0) + 1;
  }
  return counts;
}

function intersection(left, right) {
  const result = new Set();
  for (const value of left) {
    if (right.includes(value)) {
      result.add(value);
    }
  }
  return result;
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

function escapePipes(value) {
  return value.replaceAll("|", "\\|");
}
