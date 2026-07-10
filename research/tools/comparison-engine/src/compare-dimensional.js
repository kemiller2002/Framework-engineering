import { classifyAgreement } from "./agreement-categories.js";
import { normalizeDimensionalItem, compareDimensionalItem } from "./dimensional-normalizer.js";

export function compareDimensionalTexts(textSets, taxonomies) {
  const populated = textSets
    .map((items) => items.map((item) => normalizeDimensionalItem(item, taxonomies)))
    .filter((items) => items.length > 0);

  if (populated.length < 2) {
    return {
      category: "unclear",
      similarity: 0,
      populated_count: populated.length,
      shared_roles: [],
    };
  }

  let pairCount = 0;
  let scoreTotal = 0;
  const sharedRoles = new Set();

  for (let index = 0; index < populated.length; index += 1) {
    for (let inner = index + 1; inner < populated.length; inner += 1) {
      let pairBest = 0;
      for (const left of populated[index]) {
        for (const right of populated[inner]) {
          const comparison = compareDimensionalItem(left, right);
          if (comparison.same_role) sharedRoles.add(left.role.key);
          if (comparison.compatible) pairBest = Math.max(pairBest, 1);
          else if (comparison.same_role) pairBest = Math.max(pairBest, 0.6);
          else if (comparison.same_object || comparison.same_purpose) pairBest = Math.max(pairBest, 0.3);
        }
      }
      scoreTotal += pairBest;
      pairCount += 1;
    }
  }

  const similarity = pairCount ? scoreTotal / pairCount : 0;
  return {
    category: classifyAgreement(similarity, populated.length),
    similarity,
    populated_count: populated.length,
    shared_roles: [...sharedRoles].filter(Boolean).sort(),
  };
}
