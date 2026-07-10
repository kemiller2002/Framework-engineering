import { compareScalarValues, compareTextSets } from "./compare-literal.js";
import { normalizeScalar, observationArrayToTexts, transitionArrayToTexts } from "./normalize-values.js";
import { tally } from "./utilities.js";

export function comparePrimitives(records) {
  const sequence = compareTextSets(records.map((record) => observationArrayToTexts(record.response?.primitive_layer?.primitive_sequence)));
  const transitions = compareTextSets(records.map((record) => transitionArrayToTexts(record.response?.primitive_layer?.transitions)));
  const dominant = compareScalarValues(records.map((record) => normalizeScalar(record.response?.primitive_layer?.dominant_primitive)));
  const missing = compareTextSets(records.map((record) => observationArrayToTexts(record.response?.primitive_layer?.candidate_missing_primitives)));

  return {
    primitive_sequence: sequence,
    transitions,
    dominant_primitive: dominant,
    candidate_missing_primitives: missing,
    counts: tally([sequence.category, transitions.category, dominant.category, missing.category]),
  };
}
