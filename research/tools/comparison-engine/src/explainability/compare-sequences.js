import { countOverlap, longestCommonSubsequence, normalizeItems, normalizedSet } from "./utilities.js";

export function compareSequences(leftValues, rightValues, options = {}) {
  const left = normalizeItems(leftValues);
  const right = normalizeItems(rightValues);
  const leftSet = normalizedSet(left);
  const rightSet = normalizedSet(right);
  const exactOrderedOverlap = longestCommonSubsequence(left, right);
  const unorderedOverlap = countOverlap(left, right);
  const leftOnly = left.filter((item) => !rightSet.includes(item.toLowerCase()));
  const rightOnly = right.filter((item) => !leftSet.includes(item.toLowerCase()));
  const reorder = left.length === right.length && leftOnly.length === 0 && rightOnly.length === 0 && exactOrderedOverlap !== left.length;
  const differences = [];

  if (reorder) {
    differences.push({
      layer: options.layer || "primitive",
      field: options.field || "sequence",
      difference_type: "sequence_reordering",
      explanation: options.executionSensitive
        ? "The same elements appear in a different order, and sequence order may affect execution interpretation."
        : "The same elements appear in a different order, but the underlying set is unchanged.",
      backbone_impact: options.executionSensitive ? "localized" : "none",
      left_value: left,
      right_value: right,
    });
  }

  if (leftOnly.length > 0 && rightOnly.length === 0) {
    differences.push({
      layer: options.layer || "primitive",
      field: options.field || "sequence",
      difference_type: "compressed_steps",
      explanation: "The right response compresses steps present in the left response.",
      backbone_impact: "elaboration_only",
      left_value: leftOnly,
      right_value: [],
    });
  }

  if (rightOnly.length > 0 && leftOnly.length === 0) {
    differences.push({
      layer: options.layer || "primitive",
      field: options.field || "sequence",
      difference_type: options.passThroughExpansion ? "pass_through_expansion" : "expanded_steps",
      explanation: "The right response expands steps beyond the left response.",
      backbone_impact: options.passThroughExpansion ? "elaboration_only" : "localized",
      left_value: [],
      right_value: rightOnly,
    });
  }

  if (leftOnly.length > 0 && rightOnly.length > 0) {
    for (const item of leftOnly) {
      differences.push({
        layer: options.layer || "primitive",
        field: options.field || "sequence",
        difference_type: "omitted_step",
        explanation: "A step appears in the left response but not the right response.",
        backbone_impact: "localized",
        left_value: item,
        right_value: "",
      });
    }
    for (const item of rightOnly) {
      differences.push({
        layer: options.layer || "primitive",
        field: options.field || "sequence",
        difference_type: "inserted_step",
        explanation: "A step appears in the right response but not the left response.",
        backbone_impact: "localized",
        left_value: "",
        right_value: item,
      });
    }
  }

  return {
    left_length: left.length,
    right_length: right.length,
    exact_ordered_overlap: exactOrderedOverlap,
    unordered_overlap: unorderedOverlap,
    left_only: leftOnly,
    right_only: rightOnly,
    merge_candidates: leftOnly.length === 1 && rightOnly.length > 1 ? rightOnly : [],
    split_candidates: rightOnly.length === 1 && leftOnly.length > 1 ? leftOnly : [],
    reorder,
    differences,
  };
}
