import test from "node:test";
import assert from "node:assert/strict";
import { summarizeProgress } from "../src/progress.js";

test("progress recalculates from task statuses", () => {
  const tasks = [
    { id: "1", provider: "gpt", packet: { packet_id: "A" }, status: { value: "complete" } },
    { id: "2", provider: "claude", packet: { packet_id: "A" }, status: { value: "pending" } },
    { id: "3", provider: "gemini", packet: { packet_id: "A" }, status: { value: "pending" } },
  ];
  const progress = summarizeProgress(tasks);
  assert.equal(progress.total, 3);
  assert.equal(progress.complete, 1);
  assert.equal(progress.remaining, 2);
  assert.equal(progress.nextTask.id, "2");
});
