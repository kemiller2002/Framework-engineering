import { compareScalarValues, compareTextSets } from "./compare-literal.js";
import { compareDimensionalTexts } from "./compare-dimensional.js";
import { getLayerTexts, normalizeScalar } from "./normalize-values.js";
import { tally } from "./utilities.js";

const fields = [
  "structural_layer.entry_conditions",
  "structural_layer.exit_conditions",
  "structural_layer.required_steps",
  "structural_layer.loops",
  "structural_layer.branches",
  "structural_layer.termination_conditions",
];

export function compareStructure(records, taxonomies) {
  const fieldResults = [];
  for (const field of fields) {
    const textSets = records.map((record) => getLayerTexts(record.response, field));
    fieldResults.push({
      field,
      literal: compareTextSets(textSets),
      dimensional: compareDimensionalTexts(textSets, taxonomies),
    });
  }

  const controlFlow = compareScalarValues(
    records.map((record) => normalizeScalar(record.response?.structural_layer?.control_flow_shape)),
  );

  return {
    field_results: fieldResults,
    control_flow_shape: controlFlow,
    literal_counts: tally(fieldResults.map((item) => item.literal.category).concat(controlFlow.category)),
    dimensional_counts: tally(fieldResults.map((item) => item.dimensional.category)),
  };
}
