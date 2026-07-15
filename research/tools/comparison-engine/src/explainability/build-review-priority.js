export function buildReviewPriority(differences) {
  if (differences.some((item) => item.cause?.primary_cause === "comparator_limit")) return "blocking";
  if (differences.some((item) => item.significance === "high" || item.backbone_impact === "material")) return "high";
  if (differences.some((item) => item.significance === "moderate")) return "medium";
  if (differences.some((item) => item.significance === "low")) return "low";
  return "no_review_needed";
}
