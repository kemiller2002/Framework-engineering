import { determineBackboneFeatures, normalizeItems, scalarFromField } from "./utilities.js";

export function compareBackbones(leftResponse, rightResponse) {
  const leftFeatures = determineBackboneFeatures(leftResponse);
  const rightFeatures = determineBackboneFeatures(rightResponse);
  const differences = [];
  const leftSet = new Set(leftFeatures);
  const rightSet = new Set(rightFeatures);

  if (scalarFromField(leftResponse, "structural_layer.control_flow_shape") !== scalarFromField(rightResponse, "structural_layer.control_flow_shape")
    && leftFeatures.join("|") === rightFeatures.join("|")) {
    differences.push({
      layer: "structural",
      field: "structural_layer.control_flow_shape",
      difference_type: "phrase_rewording",
      explanation: "Control-flow descriptions use different wording while preserving the same backbone features.",
      backbone_impact: "none",
      left_value: scalarFromField(leftResponse, "structural_layer.control_flow_shape"),
      right_value: scalarFromField(rightResponse, "structural_layer.control_flow_shape"),
    });
  }

  if (normalizeItems(leftResponse?.structural_layer?.loops).length === 0 && normalizeItems(rightResponse?.structural_layer?.loops).length > 0) {
    differences.push({
      layer: "structural",
      field: "structural_layer.loops",
      difference_type: "loop_added",
      explanation: "The right response introduces a loop absent from the left response.",
      backbone_impact: "material",
      left_value: leftResponse?.structural_layer?.loops || [],
      right_value: rightResponse?.structural_layer?.loops || [],
    });
  }
  if (normalizeItems(leftResponse?.structural_layer?.loops).length > 0 && normalizeItems(rightResponse?.structural_layer?.loops).length === 0) {
    differences.push({
      layer: "structural",
      field: "structural_layer.loops",
      difference_type: "loop_removed",
      explanation: "The right response omits a loop present in the left response.",
      backbone_impact: "material",
      left_value: leftResponse?.structural_layer?.loops || [],
      right_value: rightResponse?.structural_layer?.loops || [],
    });
  }

  if (normalizeItems(leftResponse?.structural_layer?.branches).length === 0 && normalizeItems(rightResponse?.structural_layer?.branches).length > 0) {
    differences.push({
      layer: "structural",
      field: "structural_layer.branches",
      difference_type: "branch_added",
      explanation: "The right response introduces a branch absent from the left response.",
      backbone_impact: "material",
      left_value: leftResponse?.structural_layer?.branches || [],
      right_value: rightResponse?.structural_layer?.branches || [],
    });
  }
  if (normalizeItems(leftResponse?.structural_layer?.branches).length > 0 && normalizeItems(rightResponse?.structural_layer?.branches).length === 0) {
    differences.push({
      layer: "structural",
      field: "structural_layer.branches",
      difference_type: "branch_removed",
      explanation: "The right response omits a branch present in the left response.",
      backbone_impact: "material",
      left_value: leftResponse?.structural_layer?.branches || [],
      right_value: rightResponse?.structural_layer?.branches || [],
    });
  }

  if ([...leftSet].every((item) => rightSet.has(item)) && [...rightSet].every((item) => leftSet.has(item)) && differences.length === 0) {
    const leftSteps = normalizeItems(leftResponse?.structural_layer?.required_steps);
    const rightSteps = normalizeItems(rightResponse?.structural_layer?.required_steps);
    if (Math.abs(leftSteps.length - rightSteps.length) === 1) {
      differences.push({
        layer: "structural",
        field: "structural_layer.required_steps",
        difference_type: "pass_through_expansion",
        explanation: "One response appears to add a neutral pass-through step without changing the backbone.",
        backbone_impact: "elaboration_only",
        left_value: leftSteps,
        right_value: rightSteps,
      });
    }
  }

  return {
    left_features: leftFeatures,
    right_features: rightFeatures,
    differences,
  };
}
