import test from "node:test";
import assert from "node:assert/strict";
import { classifyAgreement } from "../src/agreement-categories.js";

test("high similarity is full agreement", () => {
  assert.equal(classifyAgreement(1, 3), "full_agreement");
});

test("mid similarity is partial agreement", () => {
  assert.equal(classifyAgreement(0.5, 3), "partial_agreement");
});

test("low similarity is disagreement", () => {
  assert.equal(classifyAgreement(0.1, 3), "disagreement");
});
