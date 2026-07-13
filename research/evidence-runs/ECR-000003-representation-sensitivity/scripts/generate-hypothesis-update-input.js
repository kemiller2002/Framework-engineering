import path from "node:path";
import { exists, writeText } from "./utilities.js";
import { readFile } from "node:fs/promises";

const HYPOTHESES = ["H002", "H003", "H013", "H015", "H016", "H017", "H018"];

export async function generateHypothesisUpdateInput(context, experimentResults, logger) {
  const lines = [
    "# Hypothesis Matrix Update Input",
    "",
    "| Hypothesis | Relevant Experiments | Supporting Observations | Challenging Observations | Instrument Caveats | Human Review Required | Suggestion |",
    "|---|---|---|---|---|---|---|"
  ];
  for (const id of HYPOTHESES) {
    const relevant = relevantExperiments(id);
    const supporting = collectSupporting(id, experimentResults);
    const challenging = collectChallenging(id, experimentResults);
    const suggestion = supporting.length > 0 && challenging.length > 0
      ? "mixed_observations"
      : supporting.length > 0
        ? "review_supporting"
        : challenging.length > 0
          ? "review_challenging"
          : "no_relevant_observation";
    lines.push(`| ${id} | ${relevant.join(", ")} | ${supporting.join("; ") || "None"} | ${challenging.join("; ") || "None"} | Frozen comparator v3.1; malformed and missing responses remain visible. | yes | ${suggestion} |`);
  }
  await writeText(path.join(context.pipelineGeneratedDir, "hypothesis-matrix-update-input.md"), lines.join("\n"));

  const registryPath = path.join(context.ecrRoot, "../../operating-system/scientific-claims-registry.md");
  const claimLines = [
    "# Scientific Claims Review Input",
    "",
    "| Claim | Relevant Evidence | Contradicting Evidence | Current ECR Contribution | Ready To Update? | Notes |",
    "|---|---|---|---|---|---|"
  ];
  if (await exists(registryPath)) {
    const registry = await readFile(registryPath, "utf8");
    const bullets = registry.split(/\r?\n/).filter((line) => line.startsWith("|") && !line.includes("---"));
    for (const line of bullets.slice(1)) {
      const claim = line.split("|")[1]?.trim() || "Unlabeled claim";
      claimLines.push(`| ${claim} | ECR-000003 experiment outputs when available. | Missing EXP-003 outputs and malformed-but-visible responses limit conclusions. | Observation-only contribution. | human_review_required | Do not update automatically. |`);
    }
  } else {
    claimLines.push("| scientific-claims-registry.md missing | No registry file present. | None | Pipeline could not map claims automatically. | no | Create or restore the registry before claim review. |");
  }
  await writeText(path.join(context.pipelineGeneratedDir, "scientific-claims-review-input.md"), claimLines.join("\n"));

  const threatLines = [
    "# Threats To Validity Update Input",
    "",
    "- provider-specific response style",
    "- recognition leakage",
    "- schema effects",
    "- model version drift",
    "- domain language effects",
    "- representation-format effects",
    "- comparator adapter issues",
    "- tolerant parsing events",
    "- missing human baseline",
    "- small number of model providers"
  ];
  await writeText(path.join(context.pipelineGeneratedDir, "threats-to-validity-update-input.md"), threatLines.join("\n"));
  logger.log("wrote hypothesis, claims, and threats review inputs");
}

function relevantExperiments(id) {
  if (id === "H016") return ["EXP-001"];
  if (id === "H017") return ["EXP-002"];
  if (id === "H018") return ["EXP-003"];
  return ["EXP-001", "EXP-002", "EXP-003"];
}

function collectSupporting(id, experimentResults) {
  const items = [];
  if (id === "H015" && experimentResults.experiments["EXP-001"]?.status === "available") {
    items.push("EXP-001 produced comparator outputs under frozen Comparator v3.1.0.");
  }
  if (id === "H017" && experimentResults.experiments["EXP-002"]?.status === "available") {
    items.push("EXP-002 outputs available for cross-representation review.");
  }
  return items;
}

function collectChallenging(id, experimentResults) {
  const items = [];
  if (["H002", "H003", "H013", "H015", "H016", "H017", "H018"].includes(id) && experimentResults.experiments["EXP-003"]?.status !== "available") {
    items.push("EXP-003 outputs unavailable, limiting cross-experiment review.");
  }
  return items;
}
