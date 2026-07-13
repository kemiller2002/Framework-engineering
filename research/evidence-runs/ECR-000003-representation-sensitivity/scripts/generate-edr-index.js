import path from "node:path";
import { ensureDir, writeText } from "./utilities.js";

export async function generateEdrIndex(context, experimentResults, logger) {
  const edrDir = path.join(context.ecrRoot, "edr");
  const reviewBoardDir = path.join(context.ecrRoot, "review-board");
  const experiments = experimentResults.experiments || experimentResults;
  const drafts = [
    { id: "EDR-ECR-000003-EXP001", experiment: "EXP-001", path: path.join(edrDir, "EDR-ECR-000003-EXP001.md") },
    { id: "EDR-ECR-000003-EXP002", experiment: "EXP-002", path: path.join(edrDir, "EDR-ECR-000003-EXP002.md") },
    { id: "EDR-ECR-000003-EXP003", experiment: "EXP-003", path: path.join(edrDir, "EDR-ECR-000003-EXP003.md") },
    { id: "EDR-ECR-000003-SUMMARY", experiment: "SUMMARY", path: path.join(edrDir, "EDR-ECR-000003-SUMMARY.md") }
  ];
  const reviewDrafts = [
    { id: "EXP001-review", experiment: "EXP-001", path: path.join(reviewBoardDir, "EXP001-review.md") },
    { id: "EXP002-review", experiment: "EXP-002", path: path.join(reviewBoardDir, "EXP002-review.md") },
    { id: "EXP003-review", experiment: "EXP-003", path: path.join(reviewBoardDir, "EXP003-review.md") },
    { id: "ECR-000003-summary-review", experiment: "SUMMARY", path: path.join(reviewBoardDir, "ECR-000003-summary-review.md") }
  ];

  await ensureDir(reviewBoardDir);

  for (const draft of drafts) {
    await writeText(draft.path, buildEdrContent(draft, experimentResults.experiments[draft.experiment]));
  }
  for (const draft of reviewDrafts) {
    await writeText(draft.path, buildReviewContent(draft, experimentResults.experiments[draft.experiment], experimentResults));
  }

  await writeText(
    path.join(edrDir, "edr-review-status.md"),
    [
      "# ECR-000003 EDR Review Status",
      "",
      "| EDR | Human Review Status | Blocking Issues |",
      "|---|---|---|",
      ...drafts.map((draft) => `| ${draft.id} | pending | ${blockingForDraft(draft, experiments)} |`)
    ].join("\n")
  );

  await writeText(
    path.join(reviewBoardDir, "REVIEW-STATUS.md"),
    [
      "# ECR-000003 Review Status",
      "",
      "| Artifact | Draft | Reviewed | Accepted | Reviewer | Date |",
      "|---|---|---|---|---|---|",
      ...reviewDrafts.map((draft) => {
        const status = reviewStatusForDraft(draft, experiments);
        return `| ${draft.id} | yes | ${status === "Under Review" ? "yes" : "no"} | ${status === "Accepted" ? "yes" : "no"} |  |  |`;
      })
    ].join("\n")
  );

  await writeText(
    path.join(reviewBoardDir, "REVIEW-CHECKLIST.md"),
    [
      "# ECR-000003 Review Checklist",
      "",
      "- Raw responses preserved",
      "- Comparator version verified",
      "- Dataset completeness verified",
      "- Direct observations evidence-backed",
      "- Interpretation separated from observation",
      "- Hypothesis updates justified",
      "- Remaining uncertainty documented",
      "- Follow-up experiments identified"
    ].join("\n")
  );

  await writeText(
    path.join(context.pipelineGeneratedDir, "edr-draft-index.md"),
    [
      "# EDR Draft Index",
      "",
      "| EDR | Experiment | Data Ready | Human Review Status | Blocking Issues | Path |",
      "|---|---|---|---|---|---|",
      ...drafts.map((draft) => `| ${draft.id} | ${draft.experiment} | ${dataReady(draft, experiments)} | ${reviewStatusForDraft({ experiment: draft.experiment }, experiments)} | ${blockingForDraft(draft, experiments)} | ${path.relative(context.ecrRoot, draft.path).replaceAll(path.sep, "/")} |`)
    ].join("\n")
  );
  logger.log("wrote EDR draft index, status, and review-board drafts");
}

function buildEdrContent(draft, result) {
  if (draft.experiment === "SUMMARY") {
    return [
      "# Evidence Decision Record",
      "",
      "EDR ID:",
      "EDR-ECR-000003-SUMMARY",
      "",
      "ECR / Experiment:",
      "ECR-000003 Summary",
      "",
      "Date:",
      "",
      "Reviewer:",
      "",
      "Status:",
      "draft / reviewed / accepted",
      "",
      "## Observation",
      "",
      "- PLACEHOLDER: Comparison evidence is incomplete.",
      "- Reference EDR-ECR-000003-EXP001, EDR-ECR-000003-EXP002, and EDR-ECR-000003-EXP003.",
      "- Do not complete interpretations, hypothesis direction, or final decision automatically."
    ].join("\n");
  }

  return [
    "# Evidence Decision Record",
    "",
    "EDR ID:",
    `EDR-ECR-000003-${draft.experiment.replace("-", "")}`,
    "",
    "ECR / Experiment:",
    `ECR-000003 ${draft.experiment}`,
    "",
    "Date:",
    "",
    "Reviewer:",
    "",
    "Status:",
    "draft / reviewed / accepted",
    "",
    "## Observation",
    "",
    ...(result && result.evidence_ready
      ? [
          `- run_id: ${result.run_id}`,
          `- comparator_version: ${result.comparator_version}`,
          `- included_records: ${result.included_records}`,
          `- malformed_records: ${result.malformed_records}`,
          `- tolerant_parsing_events: ${result.tolerant_parsing_events}`,
          `- structural_backbone_result: ${result.structural_backbone_result}`
        ]
      : [
          "- PLACEHOLDER: Comparison evidence is incomplete.",
          "- Data not ready. Complete comparison before filling factual observations."
        ]),
    "",
    "## Interpretation",
    "",
    "Human review required.",
    "",
    "## Explanations Weakened",
    "",
    "Human review required.",
    "",
    "## Explanations Survived",
    "",
    "Human review required.",
    "",
    "## Hypothesis Direction",
    "",
    "Human review required."
  ].join("\n");
}

function dataReady(draft, experimentResults) {
  const experiments = experimentResults.experiments || experimentResults;
  if (draft.experiment === "SUMMARY") return "partial";
  return experiments[draft.experiment]?.evidence_ready ? "yes" : "no";
}

function blockingForDraft(draft, experimentResults) {
  const experiments = experimentResults.experiments || experimentResults;
  if (draft.experiment === "SUMMARY") {
    return Object.entries(experiments)
      .filter(([, result]) => !result.evidence_ready)
      .map(([experiment]) => `${experiment} outputs unavailable`)
      .join("; ") || "None";
  }
  return experiments[draft.experiment]?.evidence_ready ? "None" : "Comparison outputs unavailable";
}

function reviewStatusForDraft(draft, experimentResults) {
  const experiments = experimentResults.experiments || experimentResults;
  if (draft.experiment === "SUMMARY") {
    const acceptedInputs = ["EXP-001", "EXP-002", "EXP-003"].filter((experiment) => experiments[experiment]?.evidence_ready);
    return acceptedInputs.length > 0 ? "Draft" : "Deferred";
  }
  return experiments[draft.experiment]?.evidence_ready ? "Draft" : "Deferred";
}

function buildReviewContent(draft, result, experimentResults) {
  const experiments = experimentResults.experiments || experimentResults;
  if (draft.experiment === "SUMMARY") {
    return [
      "# ECR Review",
      "",
      "Artifact:",
      "ECR-000003 Summary Review",
      "",
      "Source EDRs:",
      "- EDR-ECR-000003-EXP001",
      "- EDR-ECR-000003-EXP002",
      "- EDR-ECR-000003-EXP003",
      "",
      "Review Status:",
      reviewStatusForDraft(draft, experimentResults),
      "",
      "## Accepted Experiment Reviews",
      "",
      `- EXP001: ${experiments["EXP-001"]?.evidence_ready ? "available for review" : "not accepted"}`,
      `- EXP002: ${experiments["EXP-002"]?.evidence_ready ? "available for review" : "not accepted"}`,
      `- EXP003: ${experiments["EXP-003"]?.evidence_ready ? "available for review" : "not accepted"}`,
      "",
      "## Observations That Survived Review",
      "",
      "",
      "## Observations Rejected During Review",
      "",
      "",
      "## Hypotheses With New Evidence",
      "",
      "",
      "## Hypotheses With Reduced Support",
      "",
      "",
      "## Inconclusive Observations",
      "",
      "",
      "## Recommended Next Experiment",
      "",
      "",
      "## Claims Now Supportable",
      "",
      "",
      "## Claims Remaining Unsupported",
      "",
      "",
      "## Review Outcome",
      "",
      ""
    ].join("\n");
  }

  const dataset = result?.evidence_ready
    ? [
        `- Expected responses: ${result.expected_records || result.included_records || 0}`,
        `- Present responses: ${result.included_records || 0}`,
        `- Missing responses: ${countUnresolved(result, "missing")}`,
        `- Malformed responses: ${result.malformed_records || 0}`,
        `- Comparator version: ${result.comparator_version || ""}`,
        `- Run ID: ${result.run_id || ""}`
      ]
    : [
        "- Expected responses:",
        "- Present responses:",
        "- Missing responses:",
        "- Malformed responses:",
        "- Comparator version:",
        "- Run ID:"
      ];
  const directObservations = result?.evidence_ready
    ? [
        `- Structural backbone result: ${result.structural_backbone_result}`,
        `- Primitive headline: ${result.primitive_headline}`,
        `- Constraint concept result: ${result.constraint_concept_result}`,
        `- Representation compliance: ${result.representation_compliance}`,
        `- Tolerant parsing events: ${result.tolerant_parsing_events}`,
        `- Leakage findings: ${result.leakage_findings}`
      ]
    : ["- PLACEHOLDER: Comparison evidence is incomplete."];
  const limitations = result?.evidence_ready
    ? [
        `- parsing issues: ${result.tolerant_parsing_events}`,
        `- comparator limitations: comparator output only; human review still required`,
        `- dataset weaknesses: malformed records ${result.malformed_records}`,
        `- provider-specific concerns: see provider behavior report and raw comparison output`
      ]
    : [
        "- parsing issues:",
        "- comparator limitations:",
        "- dataset weaknesses:",
        "- provider-specific concerns:"
      ];

  return [
    "# Experiment Review",
    "",
    "Artifact:",
    draft.id,
    "",
    "Linked EDR:",
    `EDR-ECR-000003-${draft.experiment.replace("-", "")}`,
    "",
    "Review Status:",
    reviewStatusForDraft(draft, experimentResults),
    "",
    "## Dataset Integrity",
    "",
    ...dataset,
    "",
    "## Direct Observations",
    "",
    ...directObservations,
    "",
    "## Instrument Limitations",
    "",
    ...limitations,
    "",
    "## Interpretation",
    "",
    "Supported by evidence:",
    "",
    "Reviewer inference:",
    "",
    "## Hypothesis Impact",
    "",
    "For each referenced hypothesis include:",
    "- Supporting observations:",
    "- Challenging observations:",
    "- Unknowns:",
    "",
    "## Recommended Follow-up",
    "",
    "",
    "## Review Outcome",
    "",
    ""
  ].join("\n");
}

function countUnresolved(result, prefix) {
  return (result?.unresolved_issues || []).filter((item) => item.startsWith(prefix)).length;
}
