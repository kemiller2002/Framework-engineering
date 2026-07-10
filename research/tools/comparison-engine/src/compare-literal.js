import { classifyAgreement } from "./agreement-categories.js";
import { ratio } from "./utilities.js";

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
