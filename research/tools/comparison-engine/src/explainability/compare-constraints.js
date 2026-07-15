import { normalizeItems, normalizedSet } from "./utilities.js";

const FIELDS = [
  "invariants",
  "preconditions",
  "postconditions",
  "stopping_criteria",
  "validity_conditions",
];

export function compareConstraintExplainability(leftResponse, rightResponse) {
  const leftLayer = leftResponse?.constraint_layer || {};
  const rightLayer = rightResponse?.constraint_layer || {};
  const differences = [];
  const conceptMap = [];

  for (const field of FIELDS) {
    const leftValues = normalizeItems(leftLayer[field]);
    const rightValues = normalizeItems(rightLayer[field]);
    const leftSet = normalizedSet(leftValues);
    const rightSet = normalizedSet(rightValues);
    for (const item of leftSet) {
      if (!rightSet.includes(item)) {
        const moved = FIELDS.find((other) => other !== field && normalizedSet(rightLayer[other]).includes(item));
        if (moved) {
          differences.push({
            layer: "constraint",
            field,
            difference_type: "same_constraint_different_field",
            explanation: `The same constraint concept appears in both responses but is placed under different fields (${field} vs ${moved}).`,
            backbone_impact: "none",
            left_value: item,
            right_value: item,
          });
          conceptMap.push({ concept: item, left_field: field, right_field: moved });
        } else {
          differences.push({
            layer: "constraint",
            field,
            difference_type: field === "preconditions" ? "precondition_difference" : field === "postconditions" ? "postcondition_difference" : field === "stopping_criteria" ? "stopping_rule_difference" : field === "validity_conditions" ? "validity_rule_difference" : "related_constraint",
            explanation: "A constraint concept appears in the left response but not the right response.",
            backbone_impact: "localized",
            left_value: item,
            right_value: "",
          });
        }
      }
    }
  }

  const contradictionLeft = JSON.stringify(leftLayer).toLowerCase().includes("must not");
  const contradictionRight = JSON.stringify(rightLayer).toLowerCase().includes("must");
  if (contradictionLeft && contradictionRight) {
    differences.push({
      layer: "constraint",
      field: "constraint_layer",
      difference_type: "contradictory_constraint",
      explanation: "Constraint wording suggests opposite obligation polarity across responses.",
      backbone_impact: "material",
      left_value: leftLayer,
      right_value: rightLayer,
    });
  }

  return {
    concept_map: conceptMap,
    differences,
  };
}
