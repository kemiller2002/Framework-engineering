import { readFile } from "node:fs/promises";
import { stripMarkdownCodeFence } from "../../comparison-engine/src/utilities.js";

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
    const parsed = JSON.parse(stripMarkdownCodeFence(rawText).trim());
    return {
      rawText,
      parsed,
      parseStatus: "strict",
      parseSeverity: "none",
      repairs: [],
      metadata: buildMetadata(parsed, rawText),
    };
  } catch {
    const tolerant = tolerantParse(rawText);
    if (tolerant.parsed) {
      return {
        rawText,
        parsed: tolerant.parsed,
        parseStatus: "tolerant",
        parseSeverity: tolerant.repairs.length > 0 ? "cosmetic" : "recoverable",
        repairs: tolerant.repairs,
        metadata: buildMetadata(tolerant.parsed, rawText),
      };
    }
    return {
      rawText,
      parsed: null,
      parseStatus: "failed",
      parseSeverity: "unsafe",
      repairs: tolerant.repairs,
      metadata: {
        packet_id: capture(rawText, "packet_id"),
        experiment_id: capture(rawText, "experiment_id"),
        variant_id: capture(rawText, "variant_id"),
        artifact_family_id: capture(rawText, "artifact_family_id"),
        recognition_condition: capture(rawText, "recognition_condition"),
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
    recognition_condition: readString(parsed.recognition_condition),
    packet_version: readString(parsed.packet_version) || extractPacketVersionFromText(rawText),
  };
}

function readString(value) {
  return typeof value === "string" ? value : "";
}

function tolerantParse(rawText) {
  const repairs = [];
  let text = stripMarkdownCodeFence(rawText).trim();
  if (text !== rawText.trim()) repairs.push("removed_markdown_code_fence");
  const normalizedQuotes = text
    .replace(/[\u201C\u201D]/g, "\"")
    .replace(/[\u2018\u2019]/g, "'");
  if (normalizedQuotes !== text) {
    text = normalizedQuotes;
    repairs.push("normalized_smart_quotes");
  }
  const noTrailingComma = text.replace(/,\s*([}\]])/g, "$1");
  if (noTrailingComma !== text) {
    text = noTrailingComma;
    repairs.push("removed_trailing_commas");
  }
  try {
    return { parsed: JSON.parse(text), repairs };
  } catch {
    return { parsed: null, repairs };
  }
}
