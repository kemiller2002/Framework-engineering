import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createPipelineContext, snapshotRawResponseHashes } from "../scripts/utilities.js";

const execFileAsync = promisify(execFile);
const ecrRoot = process.cwd();

test("dry-run pipeline does not mutate raw response files", async () => {
  const context = createPipelineContext(ecrRoot, {});
  const before = await snapshotRawResponseHashes(context);
  await execFileAsync("node", ["scripts/run-ecr-000003.js", "--all", "--dry-run"], { cwd: ecrRoot });
  const after = await snapshotRawResponseHashes(context);
  assert.deepEqual(after, before);
});

test("generated EDR drafts do not include automatic hypothesis updates", async () => {
  await execFileAsync("node", ["scripts/run-ecr-000003.js", "--reports-all"], { cwd: ecrRoot });
  const summaryPath = path.join(ecrRoot, "edr/EDR-ECR-000003-SUMMARY.md");
  const exp001Path = path.join(ecrRoot, "edr/EDR-ECR-000003-EXP001.md");
  const [summary, exp001] = await Promise.all([
    import("node:fs/promises").then(({ readFile }) => readFile(summaryPath, "utf8")),
    import("node:fs/promises").then(({ readFile }) => readFile(exp001Path, "utf8"))
  ]);
  assert.match(summary, /Do not complete interpretations, hypothesis direction, or final decision automatically\./);
  assert.match(exp001, /Human review required\./);
});

test("placeholder EDR behavior is explicit when evidence is incomplete", async () => {
  await execFileAsync("node", ["scripts/run-ecr-000003.js", "--reports-all"], { cwd: ecrRoot });
  const exp003Path = path.join(ecrRoot, "edr/EDR-ECR-000003-EXP003.md");
  const text = await import("node:fs/promises").then(({ readFile }) => readFile(exp003Path, "utf8"));
  assert.match(text, /PLACEHOLDER: Comparison evidence is incomplete\./);
});

test("review-board drafts are generated with observation and interpretation separated", async () => {
  await execFileAsync("node", ["scripts/run-ecr-000003.js", "--reports-all"], { cwd: ecrRoot });
  const reviewPath = path.join(ecrRoot, "review-board/EXP001-review.md");
  const text = await import("node:fs/promises").then(({ readFile }) => readFile(reviewPath, "utf8"));
  assert.match(text, /## Direct Observations/);
  assert.match(text, /## Interpretation/);
  assert.match(text, /Supported by evidence:/);
  assert.match(text, /Reviewer inference:/);
});
