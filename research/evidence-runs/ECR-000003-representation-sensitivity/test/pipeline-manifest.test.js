import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const ecrRoot = process.cwd();

test("pipeline dry run records partial readiness when only part of the ECR is runnable", async () => {
  await execFileAsync("node", ["scripts/run-ecr-000003.js", "--all", "--dry-run"], { cwd: ecrRoot });
  const manifestPath = path.join(ecrRoot, "pipeline/generated/pipeline-manifest.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  assert.equal(manifest.ecr_id, "ECR-000003");
  assert.equal(manifest.comparator_version, "3.1.0");
  assert.equal(manifest.status, "complete_with_warnings");
  assert.ok(manifest.warnings.some((item) => item.includes("EXP-003 missing 9 primary responses")));
  assert.ok(manifest.reports.includes("pipeline/generated/ecr-000003-final-readiness-report.md"));
});
