import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { loadAndResolveConfig } from "../src/validation.js";

test("official comparison refuses missing or stale normalization certificate", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "comparison-gate-"));
  const experimentDir = path.join(tmp, "experiments", "EXP-999-demo");
  await mkdir(path.join(experimentDir, "packets"), { recursive: true });
  await mkdir(path.join(experimentDir, "responses"), { recursive: true });
  await mkdir(path.join(experimentDir, "comparison"), { recursive: true });
  const configPath = path.join(experimentDir, "comparison-config.json");
  await writeFile(configPath, `${JSON.stringify({
    ecr_id: "ECR-TEST",
    experiment_id: "EXP-999",
    title: "Demo",
    experiment_root: ".",
    response_root: "responses",
    packet_root: "packets",
    output_root: "comparison/generated",
    comparator_version: "3.1.0",
    providers: ["gpt"],
    variants: [],
    comparison_layers: ["recognition"]
  }, null, 2)}\n`);
  await assert.rejects(() => loadAndResolveConfig(configPath), /certificate|Certificate|stale/i);
});
