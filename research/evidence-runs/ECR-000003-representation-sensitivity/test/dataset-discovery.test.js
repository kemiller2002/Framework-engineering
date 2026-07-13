import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { loadPacketMetadata, inventoryResponses, createPipelineContext } from "../scripts/utilities.js";

const ecrRoot = process.cwd();
const context = createPipelineContext(ecrRoot, {});

test("packet metadata is derived dynamically from packet files", async () => {
  const counts = await Promise.all(context.experiments.map((experiment) => loadPacketMetadata(experiment.packetRoot)));
  assert.equal(counts[0].length, 4);
  assert.equal(counts[1].length, 4);
  assert.equal(counts[2].length, 3);
});

test("pre-fix P001D response remains excluded from primary dataset", async () => {
  const exp001 = context.experiments[0];
  const responses = await inventoryResponses(exp001);
  const excluded = responses.find((item) => item.relativePath.includes("/pre-fix/p001d/00001D.json"));
  assert.ok(excluded);
  assert.equal(excluded.status, "excluded");
});
