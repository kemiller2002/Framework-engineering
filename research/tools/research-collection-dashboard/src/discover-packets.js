import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

export async function discoverPackets(experiment) {
  const entries = await readdir(experiment.packetsRoot, { withFileTypes: true });
  const packets = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const filePath = path.join(experiment.packetsRoot, entry.name);
    const text = await readFile(filePath, "utf8");
    const metadata = extractMetadata(text);
    const packet = {
      packet_id: metadata.packet_id || "",
      experiment_id: metadata.experiment_id || "",
      variant_id: metadata.variant_id || "",
      artifact_family_id: metadata.artifact_family_id || "",
      recognition_condition: metadata.recognition_condition || "",
      packet_version: metadata.packet_version || "not_stated",
      blinded_artifact_id: metadata.blinded_artifact_id || "",
      full_text: text,
      source_path: filePath,
      metadata_missing: [],
    };
    for (const field of ["packet_id", "experiment_id", "variant_id", "artifact_family_id", "recognition_condition"]) {
      if (!packet[field]) packet.metadata_missing.push(field);
    }
    packets.push(packet);
  }
  return packets.sort(comparePackets);
}

export function extractMetadata(text) {
  const metadata = {};
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    metadata[match[1]] = match[2];
  }
  return metadata;
}

function comparePackets(left, right) {
  const leftVariant = left.variant_id || left.packet_id;
  const rightVariant = right.variant_id || right.packet_id;
  return left.experiment_id.localeCompare(right.experiment_id)
    || leftVariant.localeCompare(rightVariant)
    || left.packet_id.localeCompare(right.packet_id);
}
