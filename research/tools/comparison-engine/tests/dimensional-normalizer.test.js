import test from "node:test";
import assert from "node:assert/strict";
import { normalizeDimensionalItem } from "../src/dimensional-normalizer.js";

const taxonomies = {
  role: {
    observe: { patterns: ["observe", "look at"] },
    evaluate: { patterns: ["evaluate", "assess"] },
  },
  object: {
    evidence: { patterns: ["evidence", "data"] },
  },
  purpose: {
    assessment: { patterns: ["assessment", "assess"] },
  },
  stage: {},
  control_flow: {},
};

test("role-first dimensional normalization resolves role and object", () => {
  const result = normalizeDimensionalItem("evaluate evidence", taxonomies);
  assert.equal(result.role.key, "evaluate");
  assert.equal(result.object.key, "evidence");
});
