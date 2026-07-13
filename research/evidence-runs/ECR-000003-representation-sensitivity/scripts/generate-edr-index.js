import path from "node:path";
import { writeText } from "./utilities.js";

export async function generateEdrIndex(context, experimentResults, logger) {
  const edrDir = path.join(context.ecrRoot, "edr");
  const drafts = [
    { id: "EDR-ECR-000003-EXP001", experiment: "EXP-001", path: path.join(edrDir, "EDR-ECR-000003-EXP001.md") },
    { id: "EDR-ECR-000003-EXP002", experiment: "EXP-002", path: path.join(edrDir, "EDR-ECR-000003-EXP002.md") },
    { id: "EDR-ECR-000003-EXP003", experiment: "EXP-003", path: path.join(edrDir, "EDR-ECR-000003-EXP003.md") },
    { id: "EDR-ECR-000003-SUMMARY", experiment: "SUMMARY", path: path.join(edrDir, "EDR-ECR-000003-SUMMARY.md") }
  ];

  for (const draft of drafts) {
    await writeText(draft.path, buildEdrContent(draft, experimentResults.experiments[draft.experiment]));
  }

  await writeText(
    path.join(edrDir, "edr-review-status.md"),
    [
      "# ECR-000003 EDR Review Status",
      "",
      "| EDR | Human Review Status | Blocking Issues |",
      "|---|---|---|",
      ...drafts.map((draft) => `| ${draft.id} | pending | ${blockingForDraft(draft, experimentResults)} |`)
    ].join("\n")
  );

  await writeText(
    path.join(context.pipelineGeneratedDir, "edr-draft-index.md"),
    [
      "# EDR Draft Index",
      "",
      "| EDR | Experiment | Data Ready | Human Review Status | Blocking Issues | Path |",
      "|---|---|---|---|---|---|",
      ...drafts.map((draft) => `| ${draft.id} | ${draft.experiment} | ${dataReady(draft, experimentResults)} | pending | ${blockingForDraft(draft, experimentResults)} | ${path.relative(context.ecrRoot, draft.path).replaceAll(path.sep, "/")} |`)
    ].join("\n")
  );
  logger.log("wrote EDR draft index and status");
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
    ...(result && result.status === "available"
      ? [
          `- run_id: ${result.run_id}`,
          `- comparator_version: ${result.comparator_version}`,
          `- included_records: ${result.included_records}`,
          `- malformed_records: ${result.malformed_records}`,
          `- tolerant_parsing_events: ${result.tolerant_parsing_events}`,
          `- structural_backbone_result: ${result.structural_backbone_result}`
        ]
      : ["- Data not ready. Complete comparison before filling factual observations."]),
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
  if (draft.experiment === "SUMMARY") return "partial";
  return experimentResults[draft.experiment]?.status === "available" ? "yes" : "no";
}

function blockingForDraft(draft, experimentResults) {
  if (draft.experiment === "SUMMARY") {
    return Object.entries(experimentResults)
      .filter(([, result]) => result.status !== "available")
      .map(([experiment]) => `${experiment} outputs unavailable`)
      .join("; ") || "None";
  }
  return experimentResults[draft.experiment]?.status === "available" ? "None" : "Comparison outputs unavailable";
}
