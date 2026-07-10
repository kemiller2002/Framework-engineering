import { deepGet, normalizeText, normalizeWhitespace, toArray, unique } from "./utilities.js";

const objectTextKeys = [
  "value",
  "description",
  "source_text",
  "condition",
  "label",
  "summary",
  "ambiguity",
  "reason",
  "notes",
  "location",
];

export function normalizeScalar(value) {
  return normalizeWhitespace(value);
}

export function observationToText(item) {
  if (item === undefined || item === null) return "";
  if (typeof item === "string") return normalizeWhitespace(item);
  if (typeof item === "number" || typeof item === "boolean") return String(item);
  if (Array.isArray(item)) return item.map((entry) => observationToText(entry)).filter(Boolean).join(" | ");
  if (typeof item === "object") {
    for (const key of objectTextKeys) {
      if (item[key]) return normalizeWhitespace(item[key]);
    }
    if (item.from || item.to) {
      return normalizeTransition(item);
    }
    return normalizeWhitespace(JSON.stringify(item));
  }
  return "";
}

export function observationArrayToTexts(value) {
  return unique(
    toArray(value)
      .map((item) => observationToText(item))
      .filter(Boolean),
  );
}

export function normalizeTransition(item) {
  if (typeof item === "string") return normalizeWhitespace(item);
  if (!item || typeof item !== "object") return "";
  const from = normalizeWhitespace(item.from);
  const to = normalizeWhitespace(item.to);
  const condition = normalizeWhitespace(item.condition);
  if (!from && !to) return "";
  return condition ? `${from}->${to} [${condition}]` : `${from}->${to}`;
}

export function transitionArrayToTexts(value) {
  return unique(
    toArray(value)
      .map((item) => normalizeTransition(item))
      .filter(Boolean),
  );
}

export function getLayerTexts(response, pathExpression) {
  return observationArrayToTexts(deepGet(response, pathExpression));
}

export function textSimilarity(left, right) {
  const leftNorm = normalizeText(left);
  const rightNorm = normalizeText(right);
  if (!leftNorm && !rightNorm) return 1;
  if (leftNorm === rightNorm) return 1;
  if (!leftNorm || !rightNorm) return 0;

  const leftTokens = unique(leftNorm.split(" ").filter(Boolean));
  const rightTokens = unique(rightNorm.split(" ").filter(Boolean));
  const shared = leftTokens.filter((token) => rightTokens.includes(token));
  return shared.length / Math.max(leftTokens.length, rightTokens.length, 1);
}

export function normalizeConfidenceValue(value) {
  const normalized = normalizeText(value);
  if (!normalized) return "";
  if (normalized.includes("medium") && normalized.includes("high")) return "medium-high";
  if (normalized.includes("high")) return "high";
  if (normalized.includes("medium")) return "medium";
  if (normalized.includes("low")) return "low";
  return normalized;
}
