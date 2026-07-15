export function classifyCompression(sequenceAnalysis) {
  if (!sequenceAnalysis) return "unclear";
  const { left_only = [], right_only = [], exact_ordered_overlap = 0, left_length = 0, right_length = 0 } = sequenceAnalysis;
  if (left_length === right_length && left_only.length === 0 && right_only.length === 0) return "equivalent_same_granularity";
  if (left_only.length === 0 && right_only.length > 0 && exact_ordered_overlap > 0) return "equivalent_expanded";
  if (right_only.length === 0 && left_only.length > 0 && exact_ordered_overlap > 0) return "equivalent_compressed";
  if (left_only.length > 0 && right_only.length > 0 && exact_ordered_overlap > 0) {
    return left_length > right_length ? "partially_equivalent_compressed" : "partially_equivalent_expanded";
  }
  if (exact_ordered_overlap === 0 && (left_length || right_length)) return "incompatible_granularity";
  return "unclear";
}
