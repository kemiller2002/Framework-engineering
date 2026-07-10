import { compareConceptualTextSets, compareTextSets } from "./compare-literal.js";
import { compareDimensionalTexts } from "./compare-dimensional.js";
import { getLayerTexts } from "./normalize-values.js";
import { tally } from "./utilities.js";

const fields = [
  "constraint_layer.invariants",
  "constraint_layer.preconditions",
  "constraint_layer.postconditions",
  "constraint_layer.stopping_criteria",
  "constraint_layer.validity_conditions",
];

export function compareConstraints(records, taxonomies) {
  const results = fields.map((field) => ({
    field,
    comparison: compareTextSets(records.map((record) => getLayerTexts(record.response, field))),
  }));

  const conceptualSets = records.map((record) =>
    fields.flatMap((field) => getLayerTexts(record.response, field)),
  );

  return {
    field_results: results,
    conceptual: compareConceptualTextSets(conceptualSets),
    dimensional: compareDimensionalTexts(conceptualSets, taxonomies),
    field_placement_sensitivity: classifyFieldPlacement(results),
    counts: tally(results.map((item) => item.comparison.category)),
  };
}

function classifyFieldPlacement(results) {
  const disagreementCount = results.filter((item) => item.comparison.category === "disagreement").length;
  if (disagreementCount >= 4) return "high";
  if (disagreementCount >= 2) return "medium";
  return "low";
}
