import { compareScalarValues, compareTextSets } from "./compare-literal.js";
import { normalizeScalar, getLayerTexts } from "./normalize-values.js";
import { tally } from "./utilities.js";

export function compareRepresentation(records) {
  const astPresence = compareScalarValues(
    records.map((record) => (record.response?.representation_layer?.procedural_ast ? "present" : "")),
  );
  const naturalSummary = compareTextSets(records.map((record) => getLayerTexts(record.response, "representation_layer.natural_language_summary")));
  const canonicalSummary = compareTextSets(records.map((record) => getLayerTexts(record.response, "representation_layer.canonical_summary")));
  const ambiguities = compareTextSets(records.map((record) => getLayerTexts(record.response, "representation_layer.ambiguities")));
  const notes = compareScalarValues(records.map((record) => normalizeScalar(record.response?.notes)));

  return {
    procedural_ast_presence: astPresence,
    natural_language_summary: naturalSummary,
    canonical_summary: canonicalSummary,
    ambiguities,
    notes,
    counts: tally([astPresence.category, naturalSummary.category, canonicalSummary.category, ambiguities.category, notes.category]),
  };
}
