import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { loadJson } from "../../comparison-engine/src/utilities.js";

export async function buildExpectedDataset(ecrRoot, selectedExperiment = "") {
  const experimentsRoot = path.join(ecrRoot, "experiments");
  const dirs = (await readdir(experimentsRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("EXP-"))
    .map((entry) => entry.name)
    .sort();

  const experiments = [];
  for (const dirName of dirs) {
    const experimentId = dirName.match(/^(EXP-\d{3})/)?.[1] || "";
    if (selectedExperiment && experimentId !== selectedExperiment) continue;
    const experimentDir = path.join(experimentsRoot, dirName);
    const packetsDir = path.join(experimentDir, "packets");
    const configPath = path.join(experimentDir, "comparison-config.json");
    const packetFiles = (await readdir(packetsDir)).filter((name) => name.endsWith(".md")).sort();
    const config = await loadJson(configPath);
    const packetMap = new Map();
    for (const fileName of packetFiles) {
      const filePath = path.join(packetsDir, fileName);
      const raw = await readFile(filePath, "utf8");
      const meta = parsePacketMetadata(raw);
      if (!meta.packet_id) continue;
      packetMap.set(meta.packet_id, {
        packet_id: meta.packet_id,
        experiment_id: meta.experiment_id || experimentId,
        variant_id: meta.variant_id || "",
        artifact_family_id: meta.artifact_family_id || "",
        recognition_condition: meta.recognition_condition || "",
        packet_version: meta.packet_version || config.packet_versions?.[meta.packet_id] || "not_stated",
        packet_path: filePath,
      });
    }
    experiments.push({
      ecr_id: config.ecr_id,
      experiment_id: config.experiment_id,
      title: config.title,
      experiment_dir: experimentDir,
      packets: [...packetMap.values()].sort((a, b) => a.packet_id.localeCompare(b.packet_id)),
      providers: config.providers || ["gpt", "claude", "gemini"],
      packet_versions: config.packet_versions || {},
      version_rules: config.version_rules || {},
      config_path: configPath,
      config,
      expected_tasks: [...packetMap.values()]
        .flatMap((packet) => (config.providers || ["gpt", "claude", "gemini"]).map((provider) => ({
          experiment_id: config.experiment_id,
          packet_id: packet.packet_id,
          variant_id: packet.variant_id,
          artifact_family_id: packet.artifact_family_id,
          recognition_condition: packet.recognition_condition,
          packet_version: packet.packet_version,
          provider,
        }))),
    });
  }
  return { experiments };
}

function parsePacketMetadata(rawText) {
  const metadata = {};
  for (const line of rawText.split(/\r?\n/)) {
    if (!line.trim()) break;
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    metadata[match[1]] = match[2];
  }
  return metadata;
}
