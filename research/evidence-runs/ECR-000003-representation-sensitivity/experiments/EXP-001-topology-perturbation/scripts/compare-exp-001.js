import path from "node:path";
import { fileURLToPath } from "node:url";
import { runComparisonEngine } from "../../../../../tools/comparison-engine/src/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const experimentDir = path.resolve(__dirname, "..");
const configPath = path.join(experimentDir, "comparison-engine.config.json");

runComparisonEngine(configPath).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
