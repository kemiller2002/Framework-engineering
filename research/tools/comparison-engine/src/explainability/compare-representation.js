import { normalizeItems, scalarFromField } from "./utilities.js";

export function compareRepresentationExplainability(leftResponse, rightResponse) {
  const differences = [];
  const leftAst = Boolean(leftResponse?.representation_layer?.procedural_ast);
  const rightAst = Boolean(rightResponse?.representation_layer?.procedural_ast);
  if (leftAst !== rightAst) {
    differences.push({
      layer: "representation",
      field: "representation_layer.procedural_ast",
      difference_type: "ast_present_vs_absent",
      explanation: "One response provides a procedural AST and the other does not.",
      backbone_impact: "unknown",
      left_value: leftAst,
      right_value: rightAst,
    });
  }

  const leftSummary = scalarFromField(leftResponse, "representation_layer.natural_language_summary");
  const rightSummary = scalarFromField(rightResponse, "representation_layer.natural_language_summary");
  if (leftSummary && rightSummary && leftSummary !== rightSummary) {
    differences.push({
      layer: "representation",
      field: "representation_layer.natural_language_summary",
      difference_type: "summary_compression_difference",
      explanation: "Summaries differ in compression or prose detail.",
      backbone_impact: "none",
      left_value: leftSummary,
      right_value: rightSummary,
    });
  }

  const leftAmbiguities = normalizeItems(leftResponse?.representation_layer?.ambiguities);
  const rightAmbiguities = normalizeItems(rightResponse?.representation_layer?.ambiguities);
  if (leftAmbiguities.length !== rightAmbiguities.length) {
    differences.push({
      layer: "representation",
      field: "representation_layer.ambiguities",
      difference_type: leftAmbiguities.length > rightAmbiguities.length ? "ambiguity_reporting_difference" : "inserted_ambiguity",
      explanation: "The responses record a different amount of ambiguity detail.",
      backbone_impact: "none",
      left_value: leftAmbiguities,
      right_value: rightAmbiguities,
    });
  }

  const leftNotes = scalarFromField(leftResponse, "notes");
  const rightNotes = scalarFromField(rightResponse, "notes");
  if (leftNotes !== rightNotes) {
    differences.push({
      layer: "representation",
      field: "notes",
      difference_type: "notes_detail_difference",
      explanation: "Notes differ in explanatory detail or style.",
      backbone_impact: "none",
      left_value: leftNotes,
      right_value: rightNotes,
    });
  }

  return { differences };
}
