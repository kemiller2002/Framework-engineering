import { normalizeText, safeLower, tally, unique } from "./utilities.js";

const genericFamilyIndicators = [
  "workflow",
  "procedure",
  "selection procedure",
  "ranking procedure",
  "candidate-evaluation",
  "generate-and-test",
  "multi-path selection",
  "parallel-path selection",
  "scoring",
  "sorting",
  "decision procedure",
  "reasoning pattern",
];

export function classifyRecognition(rawText, namedPatterns = []) {
  const raw = String(rawText ?? "").trim();
  const normalized = normalizeText(raw);
  const named = namedPatterns.some((pattern) => normalized.includes(normalizeText(pattern)));

  if (!raw) {
    return "not_recognized";
  }

  const hasGenericFamily = genericFamilyIndicators.some((indicator) => normalized.includes(normalizeText(indicator)));
  const saysUnknown = /\bunknown\b|\bunclear\b|\bcannot identify\b|\bno specific named artifact\b|\bnot confidently identified\b|\bunrecognized\b/.test(normalized);
  const saysNoRecognition = /\bno recognition\b|\bno unavoidable recognition\b|\bno recognized artifact\b/.test(normalized);

  if (named) {
    return "recognized";
  }
  if (hasGenericFamily) {
    return "partial";
  }
  if (saysUnknown) {
    return "unknown";
  }
  if (saysNoRecognition) {
    return "not_recognized";
  }
  return "partial";
}

export function detectDomainLeakage(response, watchedTerms) {
  const text = normalizeText(extractStringValues(response).join(" "));
  const terms = [];
  for (const term of watchedTerms) {
    if (text.includes(normalizeText(term))) {
      terms.push(term);
    }
  }
  return unique(terms);
}

export function classifyLeakageTerms(terms) {
  const normalized = terms.map((item) => safeLower(item));
  if (normalized.some((term) => ["scientific method", "diagnosis", "differential diagnosis", "hypothesis testing", "abductive reasoning"].includes(term))) {
    return "likely_prior_knowledge_leakage";
  }
  if (normalized.some((term) => ["experiment", "evidence", "inquiry"].includes(term))) {
    return "possible_structural_inference";
  }
  if (normalized.length === 0) {
    return "generic_procedural_language";
  }
  return "unclear";
}

export function summarizeRecognitionByProvider(records, variants) {
  const variantOrder = new Map(variants.map((variant) => [variant.packet_id, variant.variant_order]));
  const providerGroups = new Map();
  for (const record of records) {
    const key = record.provider;
    const group = providerGroups.get(key) || [];
    group.push(record);
    providerGroups.set(key, group);
  }

  return [...providerGroups.entries()].map(([provider, items]) => {
    items.sort((left, right) => (variantOrder.get(left.packet_id) || 0) - (variantOrder.get(right.packet_id) || 0));
    const values = items.map((item) => item.recognition.value);
    return {
      provider,
      values,
      pattern: classifyRecognitionPattern(values),
      counts: tally(values),
    };
  });
}

export function classifyRecognitionPattern(values) {
  const present = values.filter(Boolean);
  if (present.length < 2) return "insufficient_data";
  const startsStrong = ["recognized", "partial"].includes(present[0]);
  const endsWeak = ["unknown", "not_recognized"].includes(present[present.length - 1]);
  if (present.every((item) => ["recognized", "partial"].includes(item))) return "persistent_recognition";
  if (startsStrong && endsWeak && present.slice(1).every((item) => ["unknown", "not_recognized"].includes(item))) return "rapid_decay";
  if (startsStrong && endsWeak) return "gradual_decay";
  if (new Set(present).size > 2) return "unstable_recognition";
  return "provider_specific_recognition";
}

function extractStringValues(value) {
  if (value === undefined || value === null) return [];
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap((item) => extractStringValues(item));
  if (typeof value === "object") return Object.values(value).flatMap((item) => extractStringValues(item));
  return [];
}
