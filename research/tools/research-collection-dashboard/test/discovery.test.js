import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { discoverPackets } from "../src/discover-packets.js";
import { discoverResponseState } from "../src/discover-responses.js";

test("packet discovery reads markdown metadata and response state derives task count", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "dashboard-discovery-"));
  const experiment = {
    id: "EXP-003",
    packetsRoot: path.join(root, "packets"),
    responsesRoot: path.join(root, "responses"),
  };
  await mkdir(experiment.packetsRoot, { recursive: true });
  await mkdir(path.join(experiment.responsesRoot, "gpt"), { recursive: true });
  await writeFile(path.join(experiment.packetsRoot, "ECR-000003-EXP003-P001A-demo.md"), "packet_id: ECR-000003-EXP003-P001A\nexperiment_id: EXP-003\nvariant_id: P001A\nartifact_family_id: P001\nrecognition_condition: demo\n\nbody");
  await writeFile(path.join(experiment.packetsRoot, "ECR-000003-EXP003-P001B-demo.md"), "packet_id: ECR-000003-EXP003-P001B\nexperiment_id: EXP-003\nvariant_id: P001B\nartifact_family_id: P001\nrecognition_condition: demo\n\nbody");

  const packets = await discoverPackets(experiment);
  const tasks = await discoverResponseState(experiment, packets, ["gpt", "claude", "gemini"], {});
  assert.equal(packets.length, 2);
  assert.equal(tasks.length, 6);
});
