import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { extractMetadata } from "../src/extract-metadata.js";

test("extracts strict metadata from canonical response", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "normalizer-test-"));
  const filePath = path.join(tempDir, "P001A.json");
  await writeFile(filePath, JSON.stringify({
    packet_id: "ECR-000003-EXP002-P001A",
    experiment_id: "EXP-002",
    variant_id: "P001A",
    artifact_family_id: "P001",
  }), "utf8");

  const extracted = await extractMetadata(filePath);
  assert.equal(extracted.parseStatus, "strict");
  assert.equal(extracted.metadata.packet_id, "ECR-000003-EXP002-P001A");
});
