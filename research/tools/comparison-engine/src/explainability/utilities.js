import path from "node:path";
import { stat } from "node:fs/promises";
import { deepGet, normalizeText, normalizeWhitespace, safeLower, sha256Text, toArray } from "../utilities.js";

export function normalizeItem(value) {
  if (typeof value === "string") return normalizeWhitespace(value);
  if (value && typeof value === "object") {
    return normalizeWhitespace(String(value.value ?? value.action ?? value.reason ?? value.condition ?? value.description ?? ""));
  }
  return normalizeWhitespace(String(value ?? ""));
}

export function normalizeItems(values) {
  return toArray(values).map(normalizeItem).filter(Boolean);
}

export function normalizedSet(values) {
  return [...new Set(normalizeItems(values).map((item) => normalizeText(item)))].filter(Boolean);
}

export function arrayFromField(response, field) {
  return normalizeItems(deepGet(response, field));
}

export function scalarFromField(response, field) {
  return normalizeWhitespace(String(deepGet(response, field) ?? ""));
}

export function pairId(scope, left, right) {
  return `${scope}:${left.packet_id}:${left.provider}:${right.packet_id}:${right.provider}`;
}

export function combinations(values) {
  const pairs = [];
  for (let index = 0; index < values.length; index += 1) {
    for (let second = index + 1; second < values.length; second += 1) {
      pairs.push([values[index], values[second]]);
    }
  }
  return pairs;
}

export function longestCommonSubsequence(left, right) {
  const table = Array.from({ length: left.length + 1 }, () => Array(right.length + 1).fill(0));
  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      if (normalizeText(left[i - 1]) === normalizeText(right[j - 1])) {
        table[i][j] = table[i - 1][j - 1] + 1;
      } else {
        table[i][j] = Math.max(table[i - 1][j], table[i][j - 1]);
      }
    }
  }
  return table[left.length][right.length];
}

export function countOverlap(left, right) {
  const leftSet = new Set(left.map((item) => normalizeText(item)));
  const rightSet = new Set(right.map((item) => normalizeText(item)));
  let overlap = 0;
  for (const item of leftSet) {
    if (rightSet.has(item)) overlap += 1;
  }
  return overlap;
}

export function parseTransition(value) {
  const text = normalizeWhitespace(String(value ?? ""));
  const match = text.match(/(.+?)(?:\s*\[.*?\])?\s*->\s*(.+)/);
  if (!match) {
    return {
      raw: text,
      from: "",
      to: "",
      normalized_from: normalizeText(text),
      normalized_to: "",
      is_loop: /loop|reassess|return/i.test(text),
      is_terminal: /terminate|end|exit|close/i.test(text),
    };
  }
  const from = normalizeWhitespace(match[1]);
  const to = normalizeWhitespace(match[2]);
  return {
    raw: text,
    from,
    to,
    normalized_from: normalizeText(from),
    normalized_to: normalizeText(to),
    is_loop: /loop|reassess|return/i.test(text) || normalizeText(from) === normalizeText(to),
    is_terminal: /terminate|end|exit|close/i.test(to) || /terminate|end|exit|close/i.test(text),
  };
}

export function determineBackboneFeatures(response) {
  const structural = response?.structural_layer || {};
  const features = [];
  if (normalizeItems(structural.entry_conditions).length > 0) features.push("entry");
  if (normalizeItems(structural.exit_conditions).length > 0) features.push("exit");
  if (normalizeItems(structural.loops).length > 0) features.push("loop");
  if (normalizeItems(structural.branches).length > 0) features.push("branch");
  if (normalizeItems(structural.termination_conditions).length > 1) features.push("multi_exit");
  const shape = safeLower(structural.control_flow_shape);
  if (shape.includes("cyclic") || shape.includes("loop")) features.push("cyclic");
  if (shape.includes("linear")) features.push("linear");
  if (shape.includes("branch")) features.push("branch_shape");
  if (shape.includes("feedback")) features.push("feedback");
  return [...new Set(features)].sort();
}

export function buildEvidenceReference(layer, field, leftPath, rightPath) {
  return {
    layer,
    field,
    left_source: leftPath,
    right_source: rightPath,
  };
}

export function summarizeSignificance(significanceValues) {
  const ordered = ["none", "low", "moderate", "high", "critical"];
  for (let index = ordered.length - 1; index >= 0; index -= 1) {
    if (significanceValues.includes(ordered[index])) return ordered[index];
  }
  return significanceValues.includes("unclear") ? "unclear" : "none";
}

export function summarizePriority(values) {
  const ordered = ["no_review_needed", "low", "medium", "high", "blocking"];
  for (let index = ordered.length - 1; index >= 0; index -= 1) {
    if (values.includes(ordered[index])) return ordered[index];
  }
  return "no_review_needed";
}

export function buildPairSummary(differences) {
  const significant = differences.filter((item) => ["high", "critical"].includes(item.significance));
  const structural = differences.filter((item) => ["material", "localized"].includes(item.backbone_impact));
  return {
    difference_count: differences.length,
    significant_count: significant.length,
    structural_count: structural.length,
  };
}

export async function latestMtime(filePaths) {
  let latest = 0;
  for (const filePath of filePaths) {
    const info = await stat(filePath);
    latest = Math.max(latest, info.mtimeMs);
  }
  return latest;
}

export function responseHash(records) {
  return sha256Text(JSON.stringify(records.map((record) => ({
    packet_id: record.packet_id,
    provider: record.provider,
    source_path: record.source_path,
    response: record.response,
  }))));
}

export function explainabilityOutputRoot(config, override = "") {
  return override || path.join(config.experiment_root, "comparison", "generated-v3.2-explainability");
}

export function providerPairLabel(left, right, variantLabel) {
  return `${variantLabel}: ${left.provider} vs ${right.provider}`;
}

export function variantPairLabel(left, right, provider) {
  return `${provider}: ${left.variant_id} vs ${right.variant_id}`;
}
