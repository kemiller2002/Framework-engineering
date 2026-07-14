import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { buildExpectedDataset } from "../src/build-expected-dataset.js";

test("expected dataset is derived dynamically for EXP-003", async () => {
  const ecrRoot = path.resolve("../../evidence-runs/ECR-000003-representation-sensitivity");
  const result = await buildExpectedDataset(ecrRoot, "EXP-003");
  assert.equal(result.experiments.length, 1);
  assert.equal(result.experiments[0].packets.length, 3);
  assert.equal(result.experiments[0].expected_tasks.length, 9);
});
