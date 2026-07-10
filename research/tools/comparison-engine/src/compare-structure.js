import { compareBackboneFeatureSets, compareConceptualTextSets, compareScalarValues, compareTextSets } from "./compare-literal.js";
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
      conceptual: compareConceptualTextSets(textSets),
      dimensional: compareDimensionalTexts(textSets, taxonomies),
    });
  }

  const controlFlow = compareScalarValues(
    records.map((record) => normalizeScalar(record.response?.structural_layer?.control_flow_shape)),
  );

  return {
    field_results: fieldResults,
    control_flow_shape: controlFlow,
    backbone: compareBackboneFeatureSets(records.map((record) => buildBackboneFeatures(record.response))),
    literal_counts: tally(fieldResults.map((item) => item.literal.category).concat(controlFlow.category)),
    conceptual_counts: tally(fieldResults.map((item) => item.conceptual.category)),
    dimensional_counts: tally(fieldResults.map((item) => item.dimensional.category)),
  };
}

function buildBackboneFeatures(response) {
  const features = [];
  const structural = response?.structural_layer || {};
  if ((structural.entry_conditions || []).length > 0) features.push("entry");
  if ((structural.exit_conditions || []).length > 0) features.push("exit");
  if ((structural.loops || []).length > 0) features.push("loop");
  if ((structural.branches || []).length > 0) features.push("branch");
  if ((structural.termination_conditions || []).length > 1) features.push("multi_exit");
  const shape = normalizeScalar(structural.control_flow_shape).toLowerCase();
  if (shape.includes("converg")) features.push("converge");
  if (shape.includes("different")) features.push("differentiate");
  if (shape.includes("re-sort") || shape.includes("resort") || shape.includes("sort")) features.push("resort");
  return [...new Set(features)];
}
