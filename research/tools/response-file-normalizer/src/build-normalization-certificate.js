export function buildNormalizationCertificate(experimentInfo, manifest, options = {}) {
  const expectedResponseCount = experimentInfo.expected_tasks.length;
  const canonicalResponseCount = manifest.primary_responses.length;
  const strictParseCount = manifest.primary_responses.filter((item) => item.parse_mode === "strict").length;
  const tolerantParseCount = manifest.primary_responses.filter((item) => item.parse_mode === "tolerant").length;
  const unsafeMalformedCount = manifest.malformed_responses.filter((item) => item.parse_severity === "unsafe").length;
  const missingCount = expectedResponseCount - canonicalResponseCount;
  const duplicateCounts = {
    exact_duplicate: manifest.duplicate_responses.filter((item) => item.duplicate_classification === "exact_duplicate").length,
    semantic_duplicate: manifest.duplicate_responses.filter((item) => item.duplicate_classification === "semantic_duplicate").length,
    conflicting_duplicate: manifest.duplicate_responses.filter((item) => item.duplicate_classification === "conflicting_duplicate").length,
  };
  const ambiguousCount = manifest.ambiguous_responses.length;
  const excludedCount = manifest.excluded_responses.length;
  const warningCount = manifest.warnings.length;
  const packetVersionIssues = manifest.primary_responses
    .filter((item) => item.version_status && item.version_status !== "ok")
    .map((item) => `${item.packet_id}:${item.provider}:${item.version_status}`);

  let status = "READY";
  let readyForComparison = true;
  const blockingIssues = [...manifest.blocking_issues];
  const warnings = [...manifest.warnings];

  if (missingCount > 0 || duplicateCounts.conflicting_duplicate > 0 || ambiguousCount > 0 || unsafeMalformedCount > 0 || packetVersionIssues.length > 0) {
    status = "BLOCKED";
    readyForComparison = false;
  } else if (tolerantParseCount > 0 || warningCount > 0 || duplicateCounts.exact_duplicate > 0 || duplicateCounts.semantic_duplicate > 0 || excludedCount > 0) {
    status = "READY_WITH_WARNINGS";
  }

  if (options.invalidated) {
    status = "INVALIDATED";
    readyForComparison = false;
    blockingIssues.push("certificate invalidated by operator request or dataset change");
  }

  if (canonicalResponseCount === 0) {
    status = "BLOCKED";
    readyForComparison = false;
  }

  return {
    certificate_version: "1.0.0",
    normalizer_version: manifest.normalizer_version,
    ecr_id: experimentInfo.ecr_id,
    experiment_id: experimentInfo.experiment_id,
    generated_at: new Date().toISOString(),
    expected_response_count: expectedResponseCount,
    canonical_response_count: canonicalResponseCount,
    strict_parse_count: strictParseCount,
    tolerant_parse_count: tolerantParseCount,
    unsafe_malformed_count: unsafeMalformedCount,
    missing_count: missingCount,
    duplicate_counts: duplicateCounts,
    ambiguous_count: ambiguousCount,
    excluded_count: excludedCount,
    warning_count: warningCount,
    packet_version_issues: packetVersionIssues,
    dataset_hash: manifest.dataset_hash,
    config_hash: manifest.config_hash,
    ready_for_comparison: readyForComparison,
    status,
    blocking_issues: blockingIssues,
    warnings,
    allowed_comparator_versions: ["3.1.0"],
  };
}
