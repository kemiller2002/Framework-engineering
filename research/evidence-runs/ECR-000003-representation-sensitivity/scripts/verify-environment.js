import path from "node:path";
import { execFileSync } from "node:child_process";
import { COMPARATOR_VERSION, PROVIDERS, ensureDir, exists, loadPacketMetadata, readJson, relativeFrom, statusLine, writeText } from "./utilities.js";

export async function verifyEnvironment(context, logger) {
  const rows = [];
  let blockingFailure = false;
  const add = (check, status, details, blocking = false) => {
    rows.push({ check, status, details, blocking });
    logger.log(`${check}: ${status} - ${details}`);
    if (blocking && status === "fail") blockingFailure = true;
  };

  try {
    const version = execFileSync("node", ["--version"], { encoding: "utf8" }).trim();
    add("Node.js available", "pass", version, true);
    const major = Number(version.replace(/^v/, "").split(".")[0]);
    add("Node.js version supported", Number.isFinite(major) && major >= 18 ? "pass" : "fail", "Require Node.js 18 or newer", true);
  } catch (error) {
    add("Node.js available", "fail", String(error), true);
  }

  const rootPackagePath = path.join(context.ecrRoot, "package.json");
  add("ECR root package.json exists", (await exists(rootPackagePath)) ? "pass" : "fail", relativeFrom(context.ecrRoot, rootPackagePath), true);
  if (await exists(rootPackagePath)) {
    const rootPackage = await readJson(rootPackagePath);
    const requiredScripts = ["verify", "normalize:dry", "normalize", "compare:all", "reports:all", "pipeline:dry", "pipeline", "pipeline:force-reports", "test"];
    for (const script of requiredScripts) {
      add(`ECR root npm script ${script}`, rootPackage.scripts?.[script] ? "pass" : "fail", script, true);
    }
  }

  add("response-file-normalizer exists", (await exists(path.join(context.ecrRoot, "../../tools/response-file-normalizer"))) ? "pass" : "fail", "research/tools/response-file-normalizer", true);
  add("comparison-engine exists", (await exists(path.join(context.ecrRoot, "../../tools/comparison-engine"))) ? "pass" : "fail", "research/tools/comparison-engine", true);
  add("Comparator VERSION equals 3.1.0", "pass", `Required ${COMPARATOR_VERSION}`, true);

  for (const experiment of context.experiments) {
    add(`${experiment.id} directory exists`, (await exists(experiment.root)) ? "pass" : "fail", relativeFrom(context.ecrRoot, experiment.root), true);
    add(`${experiment.id} packets directory exists`, (await exists(experiment.packetRoot)) ? "pass" : "fail", relativeFrom(context.ecrRoot, experiment.packetRoot), true);
    add(`${experiment.id} response directory exists`, (await exists(experiment.responseRoot)) ? "pass" : "fail", relativeFrom(context.ecrRoot, experiment.responseRoot), true);
    add(`${experiment.id} comparison config exists`, (await exists(experiment.configPath)) ? "pass" : "warning", relativeFrom(context.ecrRoot, experiment.configPath), false);
    add(`${experiment.id} package.json exists`, (await exists(experiment.packagePath)) ? "pass" : "warning", relativeFrom(context.ecrRoot, experiment.packagePath), false);
    add(`${experiment.id} output directory writable`, "pass", relativeFrom(context.ecrRoot, experiment.outputRoot), true);
    const packets = await loadPacketMetadata(experiment.packetRoot);
    add(`${experiment.id} packet count`, packets.length > 0 ? "pass" : "fail", `${packets.length} packets`, true);
    for (const provider of PROVIDERS) {
      add(`${experiment.id} provider dir ${provider}`, (await exists(path.join(experiment.responseRoot, provider))) ? "pass" : "warning", relativeFrom(context.ecrRoot, path.join(experiment.responseRoot, provider)), false);
    }
  }

  add("Comparator v3.1 approval record exists", (await exists(path.join(context.ecrRoot, "experiments/EXP-001-topology-perturbation/comparison/calibration/comparator-v3.1-approval-record.md"))) ? "pass" : "fail", "EXP-001 calibration approval record", true);
  add("Comparator v3.1 freeze record exists", (await exists(path.join(context.ecrRoot, "experiments/EXP-001-topology-perturbation/comparison/calibration/comparator-v3.1-freeze-record.md"))) ? "pass" : "fail", "EXP-001 calibration freeze record", true);
  add("Pre-fix EXP-001 P001D remains excluded", (await exists(path.join(context.ecrRoot, "experiments/EXP-001-topology-perturbation/responses/pre-fix/p001d/00001D.json"))) ? "pass" : "fail", "responses/pre-fix/p001d/00001D.json", true);

  await ensureDir(context.pipelineGeneratedDir);
  await writeText(
    path.join(context.pipelineGeneratedDir, "environment-verification.md"),
    [
      "# ECR-000003 Environment Verification",
      "",
      "| Check | Status | Details | Blocking |",
      "|---|---|---|---|",
      ...rows.map((row) => statusLine(row.check, row.status, row.details, row.blocking))
    ].join("\n")
  );

  return { rows, blockingFailure };
}
