export function classifySignificance(difference) {
  const type = difference.difference_type;
  const impact = difference.backbone_impact || "unknown";

  if (impact === "material") return "high";
  if (["invented_edge", "missing_edge", "true_role_conflict"].includes(type)) return "high";
  if (["contradictory_constraint", "loop_target_changed", "terminal_path_changed", "entry_path_changed"].includes(type)) return "high";
  if (["same_constraint_different_field", "compressed_steps", "expanded_steps", "merged_steps", "split_steps", "unresolved_role_boundary"].includes(type)) return "moderate";
  if (["synonym_substitution", "phrase_rewording", "terminology_choice", "label_variation", "edge_declaration_reordering", "list_order_variation", "narrative_order_variation", "omitted_ambiguity", "inserted_ambiguity", "prose_style_difference", "notes_detail_difference"].includes(type)) return "low";
  if (["recognition_without_structural_effect", "terminology_leakage_only", "same_role_different_label"].includes(type)) return "low";
  if (["recognition_with_structural_import", "unsupported_inference"].includes(type)) return "high";
  if (impact === "elaboration_only") return "low";
  if (impact === "localized") return "moderate";
  return "unclear";
}
