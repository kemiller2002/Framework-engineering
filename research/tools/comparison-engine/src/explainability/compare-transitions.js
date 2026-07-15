import { parseTransition } from "./utilities.js";

export function compareTransitions(leftValues, rightValues, options = {}) {
  const left = (leftValues || []).map(parseTransition);
  const right = (rightValues || []).map(parseTransition);
  const leftEdges = new Set(left.map((item) => `${item.normalized_from}->${item.normalized_to}`));
  const rightEdges = new Set(right.map((item) => `${item.normalized_from}->${item.normalized_to}`));
  const differences = [];

  if (left.length === right.length && leftEdges.size === rightEdges.size && [...leftEdges].every((item) => rightEdges.has(item))) {
    differences.push({
      layer: options.layer || "primitive",
      field: options.field || "transitions",
      difference_type: "edge_declaration_reordering",
      explanation: "Edge declaration order differs, but normalized topology is unchanged.",
      backbone_impact: "none",
      left_value: left.map((item) => item.raw),
      right_value: right.map((item) => item.raw),
    });
  }

  for (const edge of left) {
    const key = `${edge.normalized_from}->${edge.normalized_to}`;
    if (!rightEdges.has(key)) {
      differences.push({
        layer: options.layer || "primitive",
        field: options.field || "transitions",
        difference_type: edge.is_terminal ? "terminal_path_changed" : edge.is_loop ? "loop_target_changed" : "missing_edge",
        explanation: edge.is_terminal
          ? "A terminal edge in the left response does not appear in the right response."
          : edge.is_loop
            ? "A loop target in the left response does not appear in the right response."
            : "A transition in the left response does not appear in the right response.",
        backbone_impact: edge.is_terminal || edge.is_loop ? "material" : "localized",
        left_value: edge.raw,
        right_value: "",
      });
    }
  }

  for (const edge of right) {
    const key = `${edge.normalized_from}->${edge.normalized_to}`;
    if (!leftEdges.has(key)) {
      differences.push({
        layer: options.layer || "primitive",
        field: options.field || "transitions",
        difference_type: edge.is_terminal ? "terminal_path_changed" : edge.is_loop ? "invented_edge" : "inserted_transition",
        explanation: edge.is_terminal
          ? "The right response adds a terminal path not present in the left response."
          : edge.is_loop
            ? "The right response adds a loop or loop target not present in the left response."
            : "The right response adds a transition not present in the left response.",
        backbone_impact: edge.is_terminal || edge.is_loop ? "material" : "localized",
        left_value: "",
        right_value: edge.raw,
      });
    }
  }

  return {
    exact_edge_overlap: [...leftEdges].filter((item) => rightEdges.has(item)).length,
    normalized_edge_overlap: [...leftEdges].filter((item) => rightEdges.has(item)).length,
    differences,
  };
}
