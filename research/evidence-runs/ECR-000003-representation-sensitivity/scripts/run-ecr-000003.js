import path from "node:path";
import { parseArgs, createPipelineContext, createLogger, ensureDir, loadPacketMetadata, inventoryResponses, expectedCanonicalPath, PROVIDERS, writeText, snapshotRawResponseHashes, COMPARATOR_VERSION, modeLabel } from "./utilities.js";
import { verifyEnvironment } from "./verify-environment.js";
import { runResponseNormalization } from "./run-response-normalization.js";
import { runExperimentComparison } from "./run-experiment-comparison.js";
import { collectExperimentResults } from "./collect-experiment-results.js";
import { generateEcrSummary } from "./generate-ecr-summary.js";
import { generateHypothesisUpdateInput } from "./generate-hypothesis-update-input.js";
import { generateEdrIndex } from "./generate-edr-index.js";
import { writePipelineManifest } from "./write-pipeline-manifest.js";

const options = parseArgs(process.argv.slice(2));
const context = createPipelineContext(process.cwd(), options);
const logger = createLogger(context);

main().catch(async (error) => {
  logger.log(`fatal error: ${error.stack || error}`);
  const logPath = await logger.flush();
  console.error(error);
  console.error(`pipeline log: ${logPath}`);
  process.exitCode = 1;
});

async function main() {
  await ensureDir(context.pipelineGeneratedDir);
  const startedAt = new Date().toISOString();
  const rawBefore = await snapshotRawResponseHashes(context);
  const manifest = {
    pipeline_id: startedAt.replace(/[:.]/g, "-"),
    ecr_id: "ECR-000003",
    pipeline_version: "1.0.0",
    comparator_version: COMPARATOR_VERSION,
    started_at: startedAt,
    completed_at: "",
    mode: modeLabel(context.options),
    normalization: {},
    dataset: {},
    experiments: {},
    reports: [],
    edr_drafts: [],
    warnings: [],
    blocking_errors: [],
    status: "blocked"
  };

  const env = await verifyEnvironment(context, logger);
  if (env.blockingFailure) {
    manifest.blocking_errors.push("Environment verification failed.");
    await finalize(manifest, rawBefore);
    return;
  }

  if (context.options.verifyOnly) {
    manifest.status = "complete_with_warnings";
    await finalize(manifest, rawBefore);
    return;
  }

  if (context.options.normalize || context.options.all) {
    manifest.normalization = await runResponseNormalization(context, logger);
  }

  const datasetInfo = await calculateDatasetCompleteness(context, logger);
  manifest.dataset = datasetInfo;
  if (datasetInfo.overallStatus === "NOT_READY") {
    manifest.blocking_errors.push("Dataset completeness not ready for full comparison.");
  }

  const compareRequested = context.options.compareAll || context.options.all;
  if (compareRequested && manifest.blocking_errors.length === 0) {
    const selected = context.options.experiment
      ? context.experiments.filter((experiment) => experiment.id === context.options.experiment)
      : context.experiments;
    for (const experiment of selected) {
      manifest.experiments[experiment.id] = await runExperimentComparison(context, experiment, datasetInfo, logger);
    }
  } else if (compareRequested) {
    for (const experiment of context.experiments) {
      manifest.experiments[experiment.id] = { experiment: experiment.id, status: "blocked", reason: "Blocking dataset failure." };
    }
  }

  const experimentResults = await collectExperimentResults(context, logger);
  await generateEcrSummary(context, experimentResults, datasetInfo, logger);
  await generateHypothesisUpdateInput(context, experimentResults, logger);
  await generateEdrIndex(context, experimentResults, logger);
  await writeSupplementalReports(context, datasetInfo, experimentResults);

  manifest.reports = [
    "pipeline/generated/environment-verification.md",
    "pipeline/generated/dataset-completeness.md",
    "pipeline/generated/ecr-000003-comparison-summary.md",
    "pipeline/generated/ecr-000003-observation-ledger.md",
    "pipeline/generated/hypothesis-matrix-update-input.md",
    "pipeline/generated/scientific-claims-review-input.md",
    "pipeline/generated/threats-to-validity-update-input.md",
    "pipeline/generated/edr-draft-index.md",
    "pipeline/generated/ecr-000003-human-review-dashboard.md",
    "pipeline/generated/ecr-000003-final-readiness-report.md"
  ];
  manifest.edr_drafts = [
    "edr/EDR-ECR-000003-EXP001.md",
    "edr/EDR-ECR-000003-EXP002.md",
    "edr/EDR-ECR-000003-EXP003.md",
    "edr/EDR-ECR-000003-SUMMARY.md"
  ];
  manifest.status = manifest.blocking_errors.length > 0 ? "blocked" : (manifest.warnings.length > 0 ? "complete_with_warnings" : "complete");
  await finalize(manifest, rawBefore);
}

async function calculateDatasetCompleteness(context, logger) {
  const experiments = [];
  const warnings = [];
  for (const experiment of context.experiments) {
    const packets = await loadPacketMetadata(experiment.packetRoot);
    const responses = await inventoryResponses(experiment);
    let present = 0;
    let malformed = 0;
    let conflicts = 0;
    let missing = 0;
    let unsafeMalformed = 0;
    const nonExcluded = responses.filter((response) => response.status !== "excluded");
    const byCanonical = new Map();
    for (const response of nonExcluded) {
      const packetId = String(response.metadata?.packet_id || "");
      const provider = String(response.provider || "");
      if (!packetId || !provider) {
        if (response.status === "malformed_identity_ambiguous") {
          unsafeMalformed += 1;
        }
        continue;
      }
      const canonical = expectedCanonicalPath(experiment, packetId, provider);
      const bucket = byCanonical.get(canonical) || [];
      bucket.push(response);
      byCanonical.set(canonical, bucket);
    }
    for (const bucket of byCanonical.values()) {
      if (bucket.length > 1) {
        conflicts += 1;
      }
    }
    for (const packet of packets) {
      for (const provider of PROVIDERS) {
        const canonical = expectedCanonicalPath(experiment, packet.packet_id, provider);
        const match = responses.find((response) => response.filePath === canonical && response.status !== "excluded");
        if (match) {
          present += 1;
          if (String(match.status).startsWith("malformed")) {
            malformed += 1;
            if (match.status === "malformed_identity_ambiguous") {
              unsafeMalformed += 1;
            }
          }
        } else {
          missing += 1;
        }
      }
    }
    const status = missing === 0 && conflicts === 0 && unsafeMalformed === 0
      ? (malformed === 0 ? "READY" : "READY_WITH_WARNINGS")
      : "NOT_READY";
    experiments.push({
      experiment: experiment.id,
      packets: packets.length,
      providers: PROVIDERS.length,
      expected: packets.length * PROVIDERS.length,
      present,
      missing,
      malformed,
      conflicts,
      unsafeMalformed,
      status
    });
    if (missing > 0) warnings.push(`${experiment.id} missing ${missing} primary responses.`);
    if (conflicts > 0) warnings.push(`${experiment.id} has ${conflicts} conflicting canonical response group(s).`);
    if (unsafeMalformed > 0) warnings.push(`${experiment.id} has ${unsafeMalformed} unsafe malformed response(s).`);
  }
  const overallStatus = experiments.every((item) => item.status === "READY")
    ? "READY"
    : experiments.every((item) => item.status !== "NOT_READY")
      ? "READY_WITH_WARNINGS"
      : "NOT_READY";
  await writeText(
    path.join(context.pipelineGeneratedDir, "dataset-completeness.md"),
    [
      "# ECR-000003 Dataset Completeness",
      "",
      "## Summary",
      "",
      "| Experiment | Packets | Providers | Expected | Canonical Present | Missing | Malformed | Conflicting | Status |",
      "|---|---:|---:|---:|---:|---:|---:|---:|---|",
      ...experiments.map((item) => `| ${item.experiment} | ${item.packets} | ${item.providers} | ${item.expected} | ${item.present} | ${item.missing} | ${item.malformed} | ${item.conflicts} | ${item.status} |`),
      "",
      "## Missing Responses",
      "",
      ...warnings.map((line) => `- ${line}`),
      "",
      "## Malformed Responses",
      "",
      ...experiments.filter((item) => item.malformed > 0).map((item) => `- ${item.experiment}: ${item.malformed}`),
      "",
      "## Duplicate Responses",
      "",
      ...experiments.some((item) => item.conflicts > 0)
        ? experiments.filter((item) => item.conflicts > 0).map((item) => `- ${item.experiment}: ${item.conflicts} conflicting canonical response group(s).`)
        : ["- No conflicting duplicates detected by current canonical-path grouping."],
      "",
      "## Packet Version Issues",
      "",
      "- EXP-001 P001D requires packet version 1.1 and the pre-fix packet remains excluded.",
      "",
      "## Overall Status",
      "",
      `- ${overallStatus}`,
      "",
      "Comparison may proceed only when all expected primary responses are present, no conflicting duplicates remain, no unsafe malformed response is required for the primary dataset, and packet-version rules pass."
    ].join("\n")
  );
  logger.log("wrote dataset completeness report");
  return { experiments, overallStatus, warnings };
}

async function writeSupplementalReports(context, datasetInfo, experimentResults) {
  await writeText(
    path.join(context.pipelineGeneratedDir, "ecr-000003-human-review-dashboard.md"),
    [
      "# ECR-000003 Human Review Dashboard",
      "",
      "## Overall Status",
      "",
      `- ${datasetInfo.overallStatus === "NOT_READY" ? "BLOCKED" : "READY_WITH_WARNINGS"}`,
      "",
      "## Dataset Readiness",
      "",
      ...datasetInfo.experiments.map((item) => `- ${item.experiment}: ${item.status}`),
      "",
      "## Experiment Comparisons",
      "",
      "| Experiment | Comparison Complete | EDR Draft Ready | Data Issues | Human Review |",
      "|---|---|---|---|---|",
      ...context.experiments.map((experiment) => {
        const result = experimentResults.experiments[experiment.id];
        const item = datasetInfo.experiments.find((row) => row.experiment === experiment.id);
        return `| ${experiment.id} | ${result?.status === "available" ? "yes" : "no"} | yes | missing=${item?.missing ?? 0}; malformed=${item?.malformed ?? 0} | required |`;
      }),
      "",
      "## Comparator Status",
      "",
      `- Comparator v${COMPARATOR_VERSION} frozen for ECR-000003.`,
      "",
      "## EDR Review Order",
      "",
      "1. EXP-001",
      "2. EXP-002",
      "3. EXP-003",
      "4. ECR-000003 Summary",
      "",
      "## Hypothesis Review Inputs",
      "",
      `- ${path.relative(context.ecrRoot, path.join(context.pipelineGeneratedDir, "hypothesis-matrix-update-input.md")).replaceAll(path.sep, "/")}`,
      "",
      "## Claims Review Inputs",
      "",
      `- ${path.relative(context.ecrRoot, path.join(context.pipelineGeneratedDir, "scientific-claims-review-input.md")).replaceAll(path.sep, "/")}`,
      "",
      "## Threats Review Inputs",
      "",
      `- ${path.relative(context.ecrRoot, path.join(context.pipelineGeneratedDir, "threats-to-validity-update-input.md")).replaceAll(path.sep, "/")}`,
      "",
      "## Blocking Issues",
      "",
      ...datasetInfo.warnings.map((warning) => `- ${warning}`),
      "",
      "## Exact Next Human Actions",
      "",
      "- Review EXP-001 EDR: `edr/EDR-ECR-000003-EXP001.md`",
      "- Review EXP-002 EDR: `edr/EDR-ECR-000003-EXP002.md`",
      "- Review EXP-003 EDR: `edr/EDR-ECR-000003-EXP003.md`",
      "- Review ECR summary EDR: `edr/EDR-ECR-000003-SUMMARY.md`",
      "- Review hypothesis matrix input: `pipeline/generated/hypothesis-matrix-update-input.md`",
      "- Review scientific claims input: `pipeline/generated/scientific-claims-review-input.md`"
    ].join("\n")
  );

  await writeText(
    path.join(context.pipelineGeneratedDir, "ecr-000003-final-readiness-report.md"),
    [
      "# ECR-000003 Final Readiness Report",
      "",
      "## Overall Status",
      "",
      `- ${datasetInfo.overallStatus === "NOT_READY" ? "BLOCKED" : datasetInfo.experiments.some((item) => item.malformed > 0) ? "READY_WITH_WARNINGS" : "READY_FOR_HUMAN_REVIEW"}`,
      "",
      "## Response Dataset",
      "",
      "| Experiment | Expected | Present | Malformed | Excluded | Status |",
      "|---|---:|---:|---:|---:|---|",
      ...datasetInfo.experiments.map((item) => `| ${item.experiment} | ${item.expected} | ${item.present} | ${item.malformed} | 0 | ${item.status} |`),
      "",
      "## Comparison Outputs",
      "",
      "| Experiment | Run ID | Comparator | Reports Complete | Status |",
      "|---|---|---|---|---|",
      ...context.experiments.map((experiment) => {
        const result = experimentResults.experiments[experiment.id];
        const ready = result?.status === "available" ? "yes" : "no";
        return `| ${experiment.id} | ${result?.run_id || ""} | ${result?.comparator_version || COMPARATOR_VERSION} | ${ready} | ${result?.status || "unavailable"} |`;
      }),
      "",
      "## EDR Drafts",
      "",
      "- `edr/EDR-ECR-000003-EXP001.md`",
      "- `edr/EDR-ECR-000003-EXP002.md`",
      "- `edr/EDR-ECR-000003-EXP003.md`",
      "- `edr/EDR-ECR-000003-SUMMARY.md`",
      "",
      "## Hypothesis Review Preparation",
      "",
      "- `pipeline/generated/hypothesis-matrix-update-input.md`",
      "",
      "## Claims Review Preparation",
      "",
      "- `pipeline/generated/scientific-claims-review-input.md`",
      "",
      "## Threats Review Preparation",
      "",
      "- `pipeline/generated/threats-to-validity-update-input.md`",
      "",
      "## Remaining Human Decisions",
      "",
      "- Accept or revise experiment EDRs.",
      "- Complete the ECR summary EDR.",
      "- Update the hypothesis evidence matrix manually after accepted EDR review.",
      "",
      "## Exact Next Step",
      "",
      "Review and accept the three experiment EDRs, then complete the ECR-000003 summary EDR and hypothesis evidence matrix update."
    ].join("\n")
  );
}

async function finalize(manifest, rawBefore) {
  const rawAfter = await snapshotRawResponseHashes(context);
  if (JSON.stringify(rawBefore) !== JSON.stringify(rawAfter)) {
    manifest.warnings.push("Raw response hash snapshot changed during pipeline execution.");
  }
  manifest.completed_at = new Date().toISOString();
  if (manifest.status !== "blocked" && manifest.status !== "failed") {
    manifest.status = manifest.blocking_errors.length > 0 ? "blocked" : (manifest.warnings.length > 0 ? "complete_with_warnings" : "complete");
  }
  await writePipelineManifest(context, manifest, logger);
  const logPath = await logger.flush();
  console.log(`pipeline log: ${logPath}`);
}
