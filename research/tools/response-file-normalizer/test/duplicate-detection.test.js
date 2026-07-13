import test from "node:test";
import assert from "node:assert/strict";
import { detectDuplicates } from "../src/detect-duplicates.js";

test("detects exact duplicates by canonical target and hash", () => {
  const duplicates = detectDuplicates([
    {
      canonicalTarget: "/tmp/ECR-000003-EXP002-P001A-gpt.json",
      primaryEligible: true,
      sha256: "abc",
      parsedJson: { a: 1 },
    },
    {
      canonicalTarget: "/tmp/ECR-000003-EXP002-P001A-gpt.json",
      primaryEligible: true,
      sha256: "abc",
      parsedJson: { a: 1 },
    },
  ]);
  assert.equal(duplicates.length, 1);
  assert.equal(duplicates[0].classification, "exact_duplicate");
});
