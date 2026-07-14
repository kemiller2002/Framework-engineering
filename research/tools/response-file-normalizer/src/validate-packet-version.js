export function validatePacketVersion(candidate, experimentInfo, expectedPacket) {
  const versionRules = experimentInfo.version_rules || {};
  const packetVersion = candidate.metadata.packet_version || expectedPacket.packet_version || "not_stated";
  const rule = versionRules[expectedPacket.variant_id];
  if (!rule) {
    return { status: "ok", packet_version: packetVersion, warning: "", blocking: false };
  }
  if (!packetVersion || packetVersion === "not_stated") {
    return { status: "version_unclear", packet_version: packetVersion, warning: "packet version required but not stated", blocking: true };
  }
  if (packetVersion !== rule.required_packet_version) {
    return {
      status: "excluded_wrong_version",
      packet_version: packetVersion,
      warning: `required ${rule.required_packet_version}, found ${packetVersion}`,
      blocking: true,
    };
  }
  if (candidate.relativePath.includes("/pre-fix/")) {
    return { status: "excluded_pre_fix", packet_version: packetVersion, warning: "pre-fix response excluded", blocking: true };
  }
  return { status: "ok", packet_version: packetVersion, warning: "", blocking: false };
}
