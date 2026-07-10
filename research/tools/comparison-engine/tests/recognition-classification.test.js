import test from "node:test";
import assert from "node:assert/strict";
import { classifyRecognition } from "../src/compare-recognition.js";

test("empty recognized_artifact becomes not_recognized", () => {
  assert.equal(classifyRecognition(""), "not_recognized");
});

test("'Unknown' becomes unknown", () => {
  assert.equal(classifyRecognition("Unknown"), "unknown");
});

test("named framework becomes recognized", () => {
  assert.equal(classifyRecognition("Scientific Method", ["scientific method"]), "recognized");
});

test("related procedural family becomes partial", () => {
  assert.equal(
    classifyRecognition("generate-and-test or parallel-path selection procedure"),
    "partial",
  );
});
