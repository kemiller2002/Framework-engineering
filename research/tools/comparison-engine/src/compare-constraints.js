import { compareTextSets } from "./compare-literal.js";
import { getLayerTexts } from "./normalize-values.js";
import { tally } from "./utilities.js";

const fields = [
  "constraint_layer.invariants",
  "constraint_layer.preconditions",
  "constraint_layer.postconditions",
  "constraint_layer.stopping_criteria",
  "constraint_layer.validity_conditions",
];

export function compareConstraints(records) {
  const results = fields.map((field) => ({
    field,
    comparison: compareTextSets(records.map((record) => getLayerTexts(record.response, field))),
  }));

  return {
    field_results: results,
    counts: tally(results.map((item) => item.comparison.category)),
  };
}
