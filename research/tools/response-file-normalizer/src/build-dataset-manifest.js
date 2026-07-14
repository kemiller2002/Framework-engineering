import path from "node:path";
import { sha256Text } from "../../comparison-engine/src/utilities.js";
import { loadJson } from "../../comparison-engine/src/utilities.js";

export async function buildDatasetManifest(experimentInfo, classifiedResponses, normalizerVersion) {
  const config = await loadJson(experimentInfo.config_path);
  const configHash = sha256Text(JSON.stringify(stableConfig(config)));
  const primaryResponses = classifiedResponses.filter((item) => item.primaryDatasetStatus === "primary");
  const excludedResponses = classifiedResponses.filter((item) => item.primaryDatasetStatus === "excluded");
  const duplicateResponses = classifiedResponses.filter((item) => item.primaryDatasetStatus.startsWith("duplicate"));
  const malformedResponses = classifiedResponses.filter((item) => item.primaryDatasetStatus === "malformed");
  const ambiguousResponses = classifiedResponses.filter((item) => item.primaryDatasetStatus === "ambiguous");
  const expectedTasks = experimentInfo.expected_tasks.map((task) => `${task.packet_id}:${task.provider}`);
  const datasetHash = sha256Text(JSON.stringify(primaryResponses
    .map((item) => ({
      packet_id: item.packet_id,
      provider: item.provider,
      canonical_relative_path: item.canonicalRelativePath,
      raw_sha256: item.sha256,
      packet_version: item.packet_version,
      config_hash: configHash,
    }))
    .sort((a, b) => `${a.packet_id}:${a.provider}`.localeCompare(`${b.packet_id}:${b.provider}`))));

  return {
    ecr_id: experimentInfo.ecr_id,
    experiment_id: experimentInfo.experiment_id,
    normalizer_version: normalizerVersion,
    generated_at: new Date().toISOString(),
    packet_sources: experimentInfo.packets.map((packet) => path.relative(experimentInfo.experiment_dir, packet.packet_path).replaceAll(path.sep, "/")),
    expected_tasks: expectedTasks,
    primary_responses: primaryResponses,
    excluded_responses: excludedResponses,
    duplicate_responses: duplicateResponses,
    malformed_responses: malformedResponses,
    ambiguous_responses: ambiguousResponses,
    warnings: classifiedResponses.flatMap((item) => item.warnings || []),
    blocking_issues: classifiedResponses.flatMap((item) => item.blockingIssues || []),
    dataset_hash: datasetHash,
    config_hash: configHash,
  };
}

function stableConfig(config) {
  return {
    ecr_id: config.ecr_id,
    experiment_id: config.experiment_id,
    providers: config.providers,
    variants: config.variants,
    packet_versions: config.packet_versions,
    version_rules: config.version_rules || {},
    comparator_version: config.comparator_version,
  };
}
