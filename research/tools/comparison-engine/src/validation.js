import path from "node:path";
import { loadJson } from "./utilities.js";

export async function loadAndResolveConfig(configPath) {
  const rawConfig = await loadJson(configPath);
  validateConfigShape(rawConfig);
  const baseDir = path.dirname(configPath);

  return {
    ...rawConfig,
    _config_path: configPath,
    _base_dir: baseDir,
    experiment_root: path.resolve(baseDir, rawConfig.experiment_root),
    response_root: path.resolve(baseDir, rawConfig.response_root),
    packet_root: path.resolve(baseDir, rawConfig.packet_root),
    output_root: path.resolve(baseDir, rawConfig.output_root),
    edr_template: rawConfig.edr_template ? path.resolve(baseDir, rawConfig.edr_template) : "",
    ontology_root: rawConfig.ontology_root ? path.resolve(baseDir, rawConfig.ontology_root) : "",
  };
}

function validateConfigShape(config) {
  const required = [
    "ecr_id",
    "experiment_id",
    "title",
    "experiment_root",
    "response_root",
    "packet_root",
    "providers",
    "variants",
    "comparison_layers",
    "output_root",
  ];
  for (const key of required) {
    if (!(key in config)) {
      throw new Error(`Missing required config field: ${key}`);
    }
  }
}
