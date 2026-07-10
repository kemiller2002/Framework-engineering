export function classifyAgreement(similarity, populatedCount = 2) {
  if (populatedCount < 2) return "unclear";
  if (similarity >= 0.95) return "full_agreement";
  if (similarity >= 0.45) return "partial_agreement";
  return "disagreement";
}

export function summarizeAgreementCounts(counts) {
  const full = counts.full_agreement || 0;
  const partial = counts.partial_agreement || 0;
  const disagreement = counts.disagreement || 0;
  if (disagreement > full + partial) return "disagreement-heavy";
  if (full >= partial + disagreement) return "mostly_stable";
  if (partial > 0) return "mixed";
  return "unclear";
}
