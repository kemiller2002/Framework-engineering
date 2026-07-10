import { compareConceptualTextSets, compareScalarValues, compareTextSets } from "./compare-literal.js";
import { compareDimensionalTexts } from "./compare-dimensional.js";
import { normalizeScalar, observationArrayToTexts, transitionArrayToTexts } from "./normalize-values.js";
import { tally } from "./utilities.js";

export function comparePrimitives(records, taxonomies) {
  const sequenceSets = records.map((record) => observationArrayToTexts(record.response?.primitive_layer?.primitive_sequence));
  const transitionSets = records.map((record) => transitionArrayToTexts(record.response?.primitive_layer?.transitions));
  const sequence = compareTextSets(sequenceSets);
  const roleSequence = compareDimensionalTexts(sequenceSets, taxonomies);
  const transitions = compareTextSets(transitionSets);
  const transitionBackbone = compareConceptualTextSets(transitionSets);
  const dominant = compareScalarValues(records.map((record) => normalizeScalar(record.response?.primitive_layer?.dominant_primitive)));
  const dominantRole = compareDimensionalTexts(
    records.map((record) => observationArrayToTexts(record.response?.primitive_layer?.dominant_primitive)),
    taxonomies,
  );
  const missing = compareTextSets(records.map((record) => observationArrayToTexts(record.response?.primitive_layer?.candidate_missing_primitives)));
  const styleVarianceBase = compareConceptualTextSets(records.map((record) => observationArrayToTexts(record.response?.notes)));
  const styleVariance = {
    ...styleVarianceBase,
    category: "informational_only",
  };

  return {
    primitive_sequence: sequence,
    primitive_roles: roleSequence,
    transitions,
    transition_backbone: transitionBackbone,
    dominant_primitive: dominant,
    dominant_role: dominantRole,
    candidate_missing_primitives: missing,
    style_variance: styleVariance,
    counts: tally([sequence.category, transitions.category, dominant.category, missing.category]),
  };
}
