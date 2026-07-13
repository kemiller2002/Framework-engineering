import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { createPipelineContext, createLogger } from "../scripts/utilities.js";
import { collectExperimentResults } from "../scripts/collect-experiment-results.js";

const ecrRoot = process.cwd();

test("cross-experiment collection reads only current v3.1 outputs", async () => {
  const context = createPipelineContext(ecrRoot, {});
  const logger = createLogger(context);
  const results = await collectExperimentResults(context, logger);
  assert.equal(results.comparator_version, "3.1.0");
  assert.equal(results.experiments["EXP-001"].status, "available");
  assert.equal(results.experiments["EXP-001"].comparator_version, "3.1.0");
  assert.equal(results.experiments["EXP-002"].status, "missing_outputs");
  assert.equal(results.experiments["EXP-003"].status, "missing_outputs");
});
