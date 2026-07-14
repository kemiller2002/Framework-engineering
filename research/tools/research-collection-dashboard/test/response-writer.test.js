import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { writeResponseExact, canonicalResponsePath, conflictingCandidatePath, malformedCandidatePath } from "../src/response-writer.js";

const task = {
  provider: "gpt",
  packet: { packet_id: "ECR-000003-EXP003-P001A" }
};
const experiment = { responsesRoot: "" };

test("raw response bytes are preserved exactly and canonical filenames are stable", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "dashboard-write-"));
  experiment.responsesRoot = root;
  const target = canonicalResponsePath(task, experiment);
  await writeResponseExact(target, "{“raw”:true}");
  const written = await readFile(target, "utf8");
  assert.equal(written, "{“raw”:true}");
  assert.match(target, /ECR-000003-EXP003-P001A-gpt\.json$/);
});

test("candidate paths are separated by purpose", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "dashboard-candidates-"));
  experiment.responsesRoot = root;
  assert.match(conflictingCandidatePath(task, experiment, 1), /conflicting-candidates\/gpt\/ECR-000003-EXP003-P001A-gpt-1\.json$/);
  assert.match(malformedCandidatePath(task, experiment, 2), /malformed-candidates\/gpt\/ECR-000003-EXP003-P001A-gpt-2\.json$/);
});
