import path from "node:path";

export function canonicalResponsePath(experimentDir, provider, packetId) {
  return path.join(experimentDir, "responses", provider, `${packetId}-${provider}.json`);
}

export function normalizationDir(experimentDir) {
  return path.join(experimentDir, "normalization");
}

export function comparisonConfigPath(experimentDir) {
  return path.join(experimentDir, "comparison-config.json");
}
