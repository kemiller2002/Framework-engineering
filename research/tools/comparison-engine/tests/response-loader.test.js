import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { loadExperimentData } from "../src/load-responses.js";
import { observationArrayToTexts } from "../src/normalize-values.js";

test("loader reports legacy filename warning and version exclusion", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "comparison-engine-"));
  const packets = path.join(root, "packets");
  const responses = path.join(root, "responses", "gpt");
  await mkdir(packets, { recursive: true });
  await mkdir(responses, { recursive: true });

  await writeFile(
    path.join(packets, "packet.md"),
    "packet_id: PKT-001\nvariant_id: P001D\npacket_version: 1.1\n\nbody\n",
    "utf8",
  );
  await writeFile(
    path.join(responses, "legacy.json"),
    JSON.stringify({ packet_id: "PKT-001", variant_id: "P001D", recognized_artifact: "Unknown" }),
    "utf8",
  );

  const { records, warnings } = await loadExperimentData({
    ecr_id: "ECR-X",
    experiment_id: "EXP-X",
    experiment_root: root,
    response_root: path.join(root, "responses"),
    packet_root: packets,
    providers: ["gpt"],
    variants: [{ packet_id: "PKT-001", variant_id: "P001D", variant_order: 1 }],
    version_rules: {
      P001D: { required_packet_version: "1.1" },
    },
  });

  assert.equal(records[0].status, "ok");
  assert.equal(records[0].included_in_primary, true);
  assert.match(warnings[0], /Legacy filename mapped/);
});

test("loader excludes pre-fix P001D responses from primary comparison", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "comparison-engine-"));
  const packets = path.join(root, "packets");
  const responses = path.join(root, "responses", "gpt");
  await mkdir(packets, { recursive: true });
  await mkdir(responses, { recursive: true });

  await writeFile(
    path.join(packets, "packet.md"),
    "packet_id: PKT-001\nvariant_id: P001D\npacket_version: 1.0\n\nbody\n",
    "utf8",
  );
  await writeFile(
    path.join(responses, "PKT-001-gpt.json"),
    JSON.stringify({ packet_id: "PKT-001", variant_id: "P001D", recognized_artifact: "Unknown" }),
    "utf8",
  );

  const { records, dataQuality } = await loadExperimentData({
    ecr_id: "ECR-X",
    experiment_id: "EXP-X",
    experiment_root: root,
    response_root: path.join(root, "responses"),
    packet_root: packets,
    providers: ["gpt"],
    variants: [{ packet_id: "PKT-001", variant_id: "P001D", variant_order: 1 }],
    version_rules: {
      P001D: { required_packet_version: "1.1" },
    },
  });

  assert.equal(records[0].included_in_primary, false);
  assert.equal(dataQuality[0].status, "excluded_wrong_version");
});

test("loader reports missing response handling", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "comparison-engine-"));
  const packets = path.join(root, "packets");
  await mkdir(packets, { recursive: true });
  await writeFile(
    path.join(packets, "packet.md"),
    "packet_id: PKT-002\nvariant_id: P001A\n\nbody\n",
    "utf8",
  );

  const { records, dataQuality } = await loadExperimentData({
    ecr_id: "ECR-X",
    experiment_id: "EXP-X",
    experiment_root: root,
    response_root: path.join(root, "responses"),
    packet_root: packets,
    providers: ["gpt"],
    variants: [{ packet_id: "PKT-002", variant_id: "P001A", variant_order: 1 }],
  });

  assert.equal(records[0].status, "missing");
  assert.equal(dataQuality[0].status, "missing");
});

test("loader reports malformed JSON", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "comparison-engine-"));
  const packets = path.join(root, "packets");
  const responses = path.join(root, "responses", "gpt");
  await mkdir(packets, { recursive: true });
  await mkdir(responses, { recursive: true });
  await writeFile(
    path.join(packets, "packet.md"),
    "packet_id: PKT-003\nvariant_id: P001A\n\nbody\n",
    "utf8",
  );
  await writeFile(path.join(responses, "PKT-003-gpt.json"), "{bad json", "utf8");

  const { records, dataQuality } = await loadExperimentData({
    ecr_id: "ECR-X",
    experiment_id: "EXP-X",
    experiment_root: root,
    response_root: path.join(root, "responses"),
    packet_root: packets,
    providers: ["gpt"],
    variants: [{ packet_id: "PKT-003", variant_id: "P001A", variant_order: 1 }],
  });

  assert.equal(records[0].status, "malformed");
  assert.equal(dataQuality[0].status, "malformed");
});

test("object and string observation arrays normalize consistently", () => {
  const normalized = observationArrayToTexts([
    "plain text",
    { value: "structured text" },
    { description: "described text" },
  ]);

  assert.deepEqual(normalized, ["plain text", "structured text", "described text"]);
});
