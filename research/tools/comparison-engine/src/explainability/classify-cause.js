export function classifyCause(difference) {
  const type = difference.difference_type;
  let primary = "unclear";
  let secondary = "";
  let confidence = "medium";

  if (["synonym_substitution", "phrase_rewording", "terminology_choice", "label_variation"].includes(type)) {
    primary = "lexical_variance";
    confidence = "high";
  } else if (type === "domain_vocabulary_substitution") {
    primary = "domain_semantics";
    secondary = "provider_style";
  } else if (["sequence_reordering", "edge_declaration_reordering", "list_order_variation", "narrative_order_variation"].includes(type)) {
    primary = "representation_format";
    secondary = "provider_style";
  } else if (["compressed_steps", "merged_steps", "equivalent_compressed"].includes(type) || difference.compression_state?.includes("compressed")) {
    primary = "compression";
    secondary = "abstraction_level";
  } else if (["expanded_steps", "split_steps", "pass_through_expansion"].includes(type) || difference.compression_state?.includes("expanded")) {
    primary = "elaboration";
    secondary = "abstraction_level";
  } else if (type === "same_constraint_different_field") {
    primary = "schema_placement";
    confidence = "high";
  } else if (["provider_style_difference", "prose_style_difference", "notes_detail_difference"].includes(type)) {
    primary = "provider_style";
  } else if (["loop_target_changed", "terminal_path_changed", "entry_path_changed", "invented_edge", "missing_edge"].includes(type)) {
    primary = "genuine_structural_divergence";
    confidence = "high";
  } else if (type === "recognition_with_structural_import") {
    primary = "prior_knowledge_leakage";
    secondary = "structural_inference";
  } else if (type === "recognition_without_structural_effect" || type === "terminology_leakage_only") {
    primary = "prior_knowledge_leakage";
    secondary = "provider_style";
  } else if (["true_role_conflict", "contradictory_constraint"].includes(type)) {
    primary = "genuine_structural_divergence";
  } else if (["unresolved_role_boundary", "evaluate_vs_verify", "decide_vs_terminate"].includes(type)) {
    primary = "comparator_limit";
    secondary = "insufficient_information";
  } else if (["omitted_ambiguity", "inserted_ambiguity", "ambiguity_collapsed", "explicitly_preserved_ambiguity"].includes(type)) {
    primary = "packet_ambiguity";
  } else if (difference.significance === "critical") {
    primary = "comparator_limit";
    secondary = "insufficient_information";
    confidence = "low";
  }

  return {
    primary_cause: primary,
    secondary_cause: secondary,
    rationale: `Cause inferred from difference type ${type}.`,
    classification_confidence: confidence,
  };
}
