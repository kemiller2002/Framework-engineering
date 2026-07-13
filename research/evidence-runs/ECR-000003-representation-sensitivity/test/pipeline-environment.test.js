import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { createPipelineContext } from "../scripts/utilities.js";

const ecrRoot = process.cwd();

test("pipeline context exposes all three experiments", () => {
  const context = createPipelineContext(ecrRoot, { all: false });
  assert.equal(context.experiments.length, 3);
  assert.deepEqual(
    context.experiments.map((item) => item.id),
    ["EXP-001", "EXP-002", "EXP-003"]
  );
});

test("experiment output roots target generated-v3.1 only", () => {
  const context = createPipelineContext(ecrRoot, { all: false });
  for (const experiment of context.experiments) {
    assert.match(experiment.outputRoot, /comparison\/generated-v3\.1$/);
  }
});
