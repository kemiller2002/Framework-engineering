import test from "node:test";
import assert from "node:assert/strict";
import { parseResponseText } from "../src/parse-response.js";

test("strict JSON parse remains strict", () => {
  const result = parseResponseText('{"packet_id":"P1"}');
  assert.equal(result.ok, true);
  assert.equal(result.parse_mode, "strict");
});

test("smart-quote JSON uses tolerant parse", () => {
  const result = parseResponseText('{“packet_id”:“P1”}');
  assert.equal(result.ok, true);
  assert.equal(result.parse_mode, "tolerant");
  assert.equal(result.sanitization_applied, true);
});
