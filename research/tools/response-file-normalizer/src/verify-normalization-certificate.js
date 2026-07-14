import path from "node:path";
import { readFile } from "node:fs/promises";
import { buildExpectedDataset } from "./build-expected-dataset.js";
import { normalizationDir } from "./canonical-path.js";
import { loadJson, sha256Text } from "../../comparison-engine/src/utilities.js";

export async function verifyNormalizationCertificate({ ecrRoot, experimentId, certificatePath = "", comparatorVersion = "3.1.0", diagnosticWithoutCertificate = false, normalizerVersion = "1.0.0" }) {
  if (diagnosticWithoutCertificate) {
    return { ok: true, status: "DIAGNOSTIC", ready_for_comparison: false, warnings: ["diagnostic_without_certificate enabled"] };
  }
  const { experiments } = await buildExpectedDataset(ecrRoot, experimentId);
  const experiment = experiments[0];
  if (!experiment) {
    throw new Error(`Unknown experiment for certificate verification: ${experimentId}`);
  }
  const certFile = certificatePath || path.join(normalizationDir(experiment.experiment_dir), "normalization-certificate.json");
  const manifestFile = path.join(normalizationDir(experiment.experiment_dir), "dataset-manifest.json");
  const certificate = await loadJson(certFile);
  if (!["READY", "READY_WITH_WARNINGS"].includes(certificate.status) || !certificate.ready_for_comparison) {
    throw new Error(`Certificate status ${certificate.status} does not allow official comparison.`);
  }
  if (!certificate.allowed_comparator_versions?.includes(comparatorVersion)) {
    throw new Error(`Comparator version ${comparatorVersion} is not allowed by the normalization certificate.`);
  }
  const manifest = JSON.parse(await readFile(manifestFile, "utf8"));
  const config = await loadJson(experiment.config_path);
  const recomputed = {
    dataset_hash: sha256Text(JSON.stringify((manifest.primary_responses || [])
      .map((item) => ({
        packet_id: item.packet_id,
        provider: item.provider,
        canonical_relative_path: item.canonical_relative_path || item.canonicalRelativePath,
        raw_sha256: item.raw_sha256 || item.sha256,
        packet_version: item.packet_version,
        config_hash: sha256Text(JSON.stringify(stableConfig(config))),
      }))
      .sort((a, b) => `${a.packet_id}:${a.provider}`.localeCompare(`${b.packet_id}:${b.provider}`)))),
    config_hash: sha256Text(JSON.stringify(stableConfig(config))),
  };
  if (recomputed.dataset_hash !== certificate.dataset_hash) {
    throw new Error("Normalization certificate is stale: dataset hash changed.");
  }
  if (recomputed.config_hash !== certificate.config_hash) {
    throw new Error("Normalization certificate is stale: config hash changed.");
  }
  return { ok: true, status: certificate.status, ready_for_comparison: true, certificate };
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
