import { compareInformationalTextSets, compareScalarValues } from "./compare-literal.js";
import { normalizeScalar, getLayerTexts } from "./normalize-values.js";
import { tally } from "./utilities.js";

export function compareRepresentation(records) {
  const astPresence = compareScalarValues(
    records.map((record) => (record.response?.representation_layer?.procedural_ast ? "present" : "")),
  );
  const naturalSummary = compareInformationalTextSets(records.map((record) => getLayerTexts(record.response, "representation_layer.natural_language_summary")));
  const canonicalSummary = compareInformationalTextSets(records.map((record) => getLayerTexts(record.response, "representation_layer.canonical_summary")));
  const ambiguities = compareInformationalTextSets(records.map((record) => getLayerTexts(record.response, "representation_layer.ambiguities")));
  const notes = {
    category: "informational_only",
    similarity: 0,
    populated_count: records.map((record) => normalizeScalar(record.response?.notes)).filter(Boolean).length,
  };

  return {
    procedural_ast_presence: astPresence,
    natural_language_summary: naturalSummary,
    canonical_summary: canonicalSummary,
    ambiguities,
    notes,
    counts: tally([astPresence.category]),
  };
}
