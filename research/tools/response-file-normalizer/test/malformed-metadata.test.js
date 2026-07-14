import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { extractMetadata } from "../src/extract-metadata.js";

test("extracts metadata from smart-quote json through tolerant parsing without rewriting content", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "normalizer-malformed-"));
  const filePath = path.join(tempDir, "smart.json");
  await writeFile(filePath, '{“packet_id”:“ECR-000003-EXP002-P001B”,“experiment_id”:“EXP-002”,“variant_id”:“P001B”}', "utf8");
  const extracted = await extractMetadata(filePath);
  assert.equal(extracted.parseStatus, "tolerant");
  assert.equal(extracted.metadata.packet_id, "ECR-000003-EXP002-P001B");
});
