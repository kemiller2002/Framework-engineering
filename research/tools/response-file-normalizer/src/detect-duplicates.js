import { normalizeJsonForSemanticCompare } from "./hash-file.js";

export function detectDuplicates(candidates) {
  const grouped = new Map();
  for (const candidate of candidates) {
    if (!candidate.canonicalTarget || !candidate.primaryEligible) {
      continue;
    }
    const current = grouped.get(candidate.canonicalTarget) || [];
    current.push(candidate);
    grouped.set(candidate.canonicalTarget, current);
  }

  const duplicates = [];
  for (const [target, items] of grouped.entries()) {
    if (items.length < 2) {
      continue;
    }
    const classification = classify(items);
    duplicates.push({ canonicalTarget: target, classification, items });
  }
  return duplicates;
}

function classify(items) {
  const hashes = new Set(items.map((item) => item.sha256));
  if (hashes.size === 1) {
    return "exact_duplicate";
  }
  const parseable = items.every((item) => item.parsedJson);
  if (parseable) {
    const normalized = new Set(items.map((item) => normalizeJsonForSemanticCompare(item.parsedJson)));
    if (normalized.size === 1) {
      return "semantic_duplicate";
    }
  }
  return "conflicting_duplicate";
}
