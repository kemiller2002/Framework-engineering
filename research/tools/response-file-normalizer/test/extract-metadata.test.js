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

test("tolerant parsing recovers from a single extraneous trailing closer without rewriting raw text", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "normalizer-meta-"));
  const filePath = path.join(dir, "response.json");
  const raw = `${JSON.stringify({
    packet_id: "ECR-000003-EXP003-P001C",
    experiment_id: "EXP-003",
    variant_id: "P001C",
    artifact_family_id: "P001",
    recognition_condition: "domain_variant_policy",
  }, null, 2)}\n\n}`;
  await writeFile(filePath, raw, "utf8");
  const extracted = await extractMetadata(filePath);
  assert.equal(extracted.parseStatus, "tolerant");
  assert.equal(extracted.parseSeverity, "cosmetic");
  assert.ok(extracted.repairs.includes("trimmed_extraneous_trailing_closer"));
  assert.equal(extracted.metadata.packet_id, "ECR-000003-EXP003-P001C");
  assert.equal(extracted.rawText, raw);
});

test("tolerant parsing recovers from a mismatched structural closer without rewriting raw text", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "normalizer-meta-"));
  const filePath = path.join(dir, "response.json");
  const raw = `{
  "packet_id": "ECR-000003-EXP003-P001C",
  "experiment_id": "EXP-003",
  "variant_id": "P001C",
  "artifact_family_id": "P001",
  "representation_layer": {
    "procedural_ast": {
      "type": "Process",
      "body": [
        {
          "type": "Termination",
          "reason": "done"
        }
      ]
    ],
    "natural_language_summary": "ok"
  }
}`;
  await writeFile(filePath, raw, "utf8");
  const extracted = await extractMetadata(filePath);
  assert.equal(extracted.parseStatus, "tolerant");
  assert.equal(extracted.parseSeverity, "cosmetic");
  assert.ok(extracted.repairs.includes("corrected_mismatched_closer"));
  assert.equal(extracted.metadata.packet_id, "ECR-000003-EXP003-P001C");
  assert.equal(extracted.rawText, raw);
});
