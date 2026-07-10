import { normalizeText, unique } from "./utilities.js";

const rolePriority = [
  "terminate",
  "decide",
  "verify",
  "prioritize",
  "compare",
  "evaluate",
  "observe",
  "generate",
  "identify",
  "bound",
  "classify",
  "interpret",
  "explain",
  "act",
  "reflect",
  "reassess",
  "communicate",
  "allocate",
  "coordinate",
  "schedule",
  "sequence",
];

export function normalizeDimensionalItem(raw, taxonomies) {
  return {
    raw,
    role: chooseBestMatch(raw, taxonomies.role, "role"),
    object: chooseBestMatch(raw, taxonomies.object, "object"),
    purpose: chooseBestMatch(raw, taxonomies.purpose, "purpose"),
    stage: chooseBestMatch(raw, taxonomies.stage, "stage"),
    control_flow: chooseBestMatch(raw, taxonomies.control_flow, "control_flow"),
  };
}

export function compareDimensionalItem(left, right) {
  const sameRole = Boolean(left.role.key && left.role.key === right.role.key);
  const sameObject = Boolean(left.object.key && left.object.key === right.object.key);
  const samePurpose = Boolean(left.purpose.key && left.purpose.key === right.purpose.key);
  const compatible = sameRole && (sameObject || samePurpose);
  return {
    same_role: sameRole,
    same_object: sameObject,
    same_purpose: samePurpose,
    compatible,
  };
}

function chooseBestMatch(raw, taxonomy, dimension) {
  const normalized = normalizeText(raw);
  const tokens = new Set(normalized.split(" ").filter(Boolean));
  const matches = [];

  for (const [key, entry] of Object.entries(taxonomy || {})) {
    if ((dimension === "stage" && key === "unclear") || (dimension === "control_flow" && ["none", "unclear"].includes(key))) {
      continue;
    }
    for (const pattern of entry.patterns || []) {
      const patternNorm = normalizeText(pattern);
      const patternTokens = patternNorm.split(" ").filter(Boolean);
      const exact = normalized.includes(patternNorm);
      const covered = patternTokens.length > 0 && patternTokens.every((token) => tokens.has(token));
      if (exact || covered) {
        matches.push({
          key,
          pattern,
          score: scorePattern(key, patternNorm, exact, covered, dimension),
        });
      }
    }
  }

  if (matches.length === 0) {
    return { key: "", patterns: [] };
  }

  matches.sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score;
    if (dimension === "role") return rolePriority.indexOf(left.key) - rolePriority.indexOf(right.key);
    return left.key.localeCompare(right.key);
  });

  const best = matches[0];
  return {
    key: best.key,
    patterns: unique(matches.filter((match) => match.key === best.key).map((match) => match.pattern)),
  };
}

function scorePattern(key, pattern, exact, covered, dimension) {
  let score = 0;
  if (exact) score += 3;
  if (covered) score += 2;
  score += pattern.split(" ").length;
  if (dimension === "role" && ["prioritize", "terminate", "decide", "verify", "compare", "evaluate"].includes(key)) {
    score += 1;
  }
  return score;
}
