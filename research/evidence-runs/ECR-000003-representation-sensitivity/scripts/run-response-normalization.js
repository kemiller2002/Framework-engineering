import path from "node:path";
import { spawnSync } from "node:child_process";
import { copyIfExists, ensureDir, writeText } from "./utilities.js";

export async function runResponseNormalization(context, logger) {
  const generatedDir = path.join(context.pipelineGeneratedDir, "response-normalization");
  await ensureDir(generatedDir);
  const normalizerScript = path.join(context.ecrRoot, "../../tools/response-file-normalizer/src/normalize-response-files.js");
  const args = [normalizerScript, "--ecr-root", context.ecrRoot];
  if (context.options.apply) args.push("--apply");
  else args.push("--dry-run");

  logger.log(`normalizer command: node ${args.join(" ")}`);
  const result = spawnSync("node", args, { cwd: context.ecrRoot, encoding: "utf8" });
  const copied = [];
  for (const name of [
    "response-file-inventory.md",
    "response-filename-normalization-log.md",
    "response-dataset-readiness.md",
    "response-filename-verification-report.md"
  ]) {
    if (await copyIfExists(path.join(context.ecrRoot, name), path.join(generatedDir, name))) copied.push(name);
  }
  await writeText(
    path.join(generatedDir, "index.md"),
    [
      "# Response Normalization Index",
      "",
      `- command status: ${result.status === 0 ? "success" : "failed"}`,
      "",
      ...copied.map((name) => `- [${name}](../response-normalization/${name})`)
    ].join("\n")
  );
  return {
    command: ["node", ...args].join(" "),
    status: result.status === 0 ? "success" : "failed",
    exitCode: result.status ?? 1,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    reports: copied
  };
}
