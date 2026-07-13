import { readFile } from "node:fs/promises";

const QUOTE_CLASS = "[\"“”]";

function capture(text, key) {
  const pattern = new RegExp(`${QUOTE_CLASS}${key}${QUOTE_CLASS}\\s*:\\s*${QUOTE_CLASS}([^\"“”]+)${QUOTE_CLASS}`, "i");
  const match = text.match(pattern);
  return match ? match[1] : "";
}

function extractPacketVersionFromText(text) {
  const match = text.match(new RegExp(`${QUOTE_CLASS}packet_version${QUOTE_CLASS}\\s*:\\s*${QUOTE_CLASS}([^\"“”]+)${QUOTE_CLASS}`, "i"));
  return match ? match[1] : "";
}

export async function extractMetadata(filePath) {
  const rawText = await readFile(filePath, "utf8");
  try {
    const parsed = JSON.parse(rawText);
    return {
      rawText,
      parsed,
      parseStatus: "strict",
      metadata: buildMetadata(parsed, rawText),
    };
  } catch {
    return {
      rawText,
      parsed: null,
      parseStatus: "malformed",
      metadata: {
        packet_id: capture(rawText, "packet_id"),
        experiment_id: capture(rawText, "experiment_id"),
        variant_id: capture(rawText, "variant_id"),
        artifact_family_id: capture(rawText, "artifact_family_id"),
        packet_version: extractPacketVersionFromText(rawText),
      },
    };
  }
}

function buildMetadata(parsed, rawText) {
  return {
    packet_id: readString(parsed.packet_id),
    experiment_id: readString(parsed.experiment_id),
    variant_id: readString(parsed.variant_id),
    artifact_family_id: readString(parsed.artifact_family_id),
    packet_version: readString(parsed.packet_version) || extractPacketVersionFromText(rawText),
  };
}

function readString(value) {
  return typeof value === "string" ? value : "";
}
