import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { extractMetadata } from "../src/extract-metadata.js";

test("tolerant parsing captures smart quotes and code fences without rewriting raw text", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "normalizer-meta-"));
  const filePath = path.join(dir, "response.md");
  const raw = "```json\n{“packet_id”:“ECR-000003-EXP003-P001A”,“experiment_id”:“EXP-003”,“variant_id”:“P001A”,“artifact_family_id”:“P001”,}\n```";
  await writeFile(filePath, raw, "utf8");
  const extracted = await extractMetadata(filePath);
  assert.equal(extracted.parseStatus, "tolerant");
  assert.equal(extracted.metadata.packet_id, "ECR-000003-EXP003-P001A");
  assert.equal(extracted.rawText, raw);
});
