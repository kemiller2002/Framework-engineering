import test from "node:test";
import assert from "node:assert/strict";
import { validateResponseText } from "../src/response-validator.js";

const task = {
  provider: "gpt",
  packet: {
    packet_id: "ECR-000003-EXP003-P001A",
    experiment_id: "EXP-003",
    variant_id: "P001A",
    artifact_family_id: "P001",
  }
};

test("strict JSON validation succeeds", () => {
  const result = validateResponseText('{"packet_id":"ECR-000003-EXP003-P001A","experiment_id":"EXP-003","variant_id":"P001A","artifact_family_id":"P001"}', task, {});
  assert.equal(result.strict_parse_success, true);
  assert.equal(result.blocking_issues.length, 0);
});

test("smart quotes and code fences can be tolerated for parsing", () => {
  const result = validateResponseText("```json\n{“packet_id”:“ECR-000003-EXP003-P001A”,“experiment_id”:“EXP-003”,“variant_id”:“P001A”,“artifact_family_id”:“P001”,}\n```", task, {});
  assert.equal(result.tolerant_parse_success, true);
  assert.ok(result.repairs_required.includes("removed_markdown_code_fence"));
  assert.ok(result.repairs_required.includes("normalized_smart_quotes"));
});

test("metadata mismatch blocks canonical save", () => {
  const result = validateResponseText('{"packet_id":"wrong","experiment_id":"EXP-003","variant_id":"P001A","artifact_family_id":"P001"}', task, {});
  assert.ok(result.blocking_issues.some((item) => item.includes("packet_id")));
});
