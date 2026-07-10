import { classifyAgreement } from "./agreement-categories.js";
import { conceptualNormalizeText, textSimilarity } from "./normalize-values.js";
import { intersection, ratio, union } from "./utilities.js";

export function compareScalarValues(values) {
  const populated = values.filter(Boolean);
  if (populated.length < 2) {
    return { category: "unclear", similarity: 0, populated_count: populated.length };
  }
  const uniqueValues = [...new Set(populated)];
  const similarity = uniqueValues.length === 1 ? 1 : 0;
  return {
    category: classifyAgreement(similarity, populated.length),
    similarity,
    populated_count: populated.length,
  };
}

export function compareTextSets(valueSets) {
  const populated = valueSets.filter((items) => items.length > 0);
  if (populated.length < 2) {
    return { category: "unclear", similarity: 0, populated_count: populated.length };
  }
  let total = 0;
  let comparisons = 0;
  for (let index = 0; index < populated.length; index += 1) {
    for (let inner = index + 1; inner < populated.length; inner += 1) {
      total += ratio(populated[index], populated[inner]);
      comparisons += 1;
    }
  }
  const similarity = comparisons ? total / comparisons : 0;
  return {
    category: classifyAgreement(similarity, populated.length),
    similarity,
    populated_count: populated.length,
  };
}

export function compareConceptualTextSets(valueSets) {
  const conceptualSets = valueSets.map((items) => items.map((item) => conceptualNormalizeText(item)).filter(Boolean));
  return compareTextSets(conceptualSets);
}

export function compareInformationalTextSets(valueSets) {
  const populated = valueSets.filter((items) => items.length > 0);
  if (populated.length < 2) {
    return { category: "informational_only", similarity: 0, populated_count: populated.length };
  }
  let total = 0;
  let comparisons = 0;
  for (let index = 0; index < populated.length; index += 1) {
    for (let inner = index + 1; inner < populated.length; inner += 1) {
      const left = populated[index].join(" ");
      const right = populated[inner].join(" ");
      total += textSimilarity(left, right);
      comparisons += 1;
    }
  }
  return {
    category: "informational_only",
    similarity: comparisons ? total / comparisons : 0,
    populated_count: populated.length,
  };
}

export function compareBackboneFeatureSets(featureSets) {
  const populated = featureSets.filter((items) => items.length > 0);
  if (populated.length < 2) {
    return { category: "unclear", similarity: 0, populated_count: populated.length };
  }
  let total = 0;
  let comparisons = 0;
  for (let index = 0; index < populated.length; index += 1) {
    for (let inner = index + 1; inner < populated.length; inner += 1) {
      const shared = intersection(populated[index], populated[inner]).length;
      const merged = union(populated[index], populated[inner]).length || 1;
      total += shared / merged;
      comparisons += 1;
    }
  }
  const similarity = comparisons ? total / comparisons : 0;
  return {
    category: classifyAgreement(similarity, populated.length),
    similarity,
    populated_count: populated.length,
  };
}
