import path from "node:path";
import { writeJson, writeText } from "./utilities.js";

export async function writePipelineManifest(context, manifest, logger) {
  await writeJson(path.join(context.pipelineGeneratedDir, "pipeline-manifest.json"), manifest);
  await writeText(
    path.join(context.pipelineGeneratedDir, "pipeline-implementation-report.md"),
    [
      "# Pipeline Implementation Report",
      "",
      "| Component | Created or Updated | Purpose | Status |",
      "|---|---|---|---|",
      "| ECR package.json | Updated | Root entry point for one-command automation. | complete |",
      "| scripts/run-ecr-000003.js | Created | Pipeline orchestration. | complete |",
      "| scripts/verify-environment.js | Created | Environment and frozen-comparator verification. | complete |",
      "| scripts/run-response-normalization.js | Created | Safe wrapper around response normalizer. | complete |",
      "| scripts/run-experiment-comparison.js | Created | Comparator invocation and experiment report post-processing. | complete |",
      "| scripts/collect-experiment-results.js | Created | v3.1 output collection. | complete |",
      "| scripts/generate-ecr-summary.js | Created | Cross-experiment summaries and observation ledger. | complete |",
      "| scripts/generate-hypothesis-update-input.js | Created | Hypothesis, claims, and threats review inputs. | complete |",
      "| scripts/generate-edr-index.js | Created | EDR draft generation and indexing. | complete |",
      "| scripts/write-pipeline-manifest.js | Created | Final manifest and implementation report writer. | complete |",
      "| review-board/*.md | Created | Experiment and ECR review workflow artifacts. | complete |",
      "| research/operating-system/review-board/*.md | Created | Reusable review-board templates and status checklist. | complete |",
      "| PIPELINE.md | Created | Operator guide for safe ECR execution. | complete |",
      "| test/*.test.js | Created | Pipeline regression and safety checks. | complete |",
      "| research/operating-system/research-memory-index.md | Updated | Link research memory to ECR automation outputs. | complete |",
      "| CURRENT_STATE.md | Updated | Point active work to ECR-000003 automation. | complete |",
      "| research/tools/response-file-normalizer | Updated | Mobile-response normalization and audit trail. | complete |",
      "",
      "## Commands Available",
      "",
      "- npm run verify",
      "- npm run normalize:dry",
      "- npm run normalize",
      "- npm run compare:all",
      "- npm run reports:all",
      "- npm run pipeline:dry",
      "- npm run pipeline",
      "- npm run pipeline:force-reports",
      "",
      "## Known Limitations",
      "",
      "- Missing EXP-003 responses block full comparison.",
      "- Malformed-but-identity-clear GPT responses remain visible and may affect strict-parser workflows.",
      "- Scientific claims registry integration is limited when the registry file is absent.",
      "",
      "## Human Review Still Required",
      "",
      "- Accept or revise experiment EDRs manually.",
      "- Update hypothesis evidence matrix manually after EDR acceptance.",
      "- Review scientific claims and threats inputs before any theory update.",
      "",
      "## Exact Next Command",
      "",
      "```bash",
      "cd research/evidence-runs/ECR-000003-representation-sensitivity",
      "npm run pipeline:dry",
      "```"
    ].join("\n")
  );
  logger.log("wrote pipeline manifest and implementation report");
}
