export function validatePacketIdentity(candidate, expectedPacket) {
  const checks = [
    ["packet_id", candidate.metadata.packet_id, expectedPacket.packet_id, true],
    ["experiment_id", candidate.metadata.experiment_id, expectedPacket.experiment_id, true],
    ["variant_id", candidate.metadata.variant_id, expectedPacket.variant_id, true],
    ["artifact_family_id", candidate.metadata.artifact_family_id, expectedPacket.artifact_family_id, true],
    ["recognition_condition", candidate.metadata.recognition_condition, expectedPacket.recognition_condition, false],
  ];
  const warnings = [];
  const mismatches = [];
  let missingRequired = 0;
  for (const [field, actual, expected, required] of checks) {
    if (!actual) {
      if (required) missingRequired += 1;
      continue;
    }
    if (expected && actual !== expected) {
      mismatches.push(`${field}: expected ${expected}, received ${actual}`);
    }
  }
  if (mismatches.length > 0) {
    return { status: "mismatch", warnings, mismatches };
  }
  if (candidate.parseStatus === "failed") {
    return { status: "not_parseable", warnings, mismatches: ["response not parseable"] };
  }
  if (missingRequired === checks.filter(([, , , required]) => required).length) {
    return { status: "ambiguous", warnings, mismatches: ["required metadata missing"] };
  }
  if (missingRequired > 0) {
    warnings.push("required metadata missing but packet_id-derived identity is compatible");
    return { status: "compatible_missing_optional_metadata", warnings, mismatches: [] };
  }
  return { status: "exact_match", warnings, mismatches: [] };
}
