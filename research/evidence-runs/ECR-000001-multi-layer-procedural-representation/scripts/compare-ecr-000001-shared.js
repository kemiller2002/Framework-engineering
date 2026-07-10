import path from "node:path";
import { fileURLToPath } from "node:url";
import { runComparisonEngine } from "../../../tools/comparison-engine/src/index.js";
import { buildMigrationDifferences } from "../../../tools/comparison-engine/src/report-writer.js";
import { writeText } from "../../../tools/comparison-engine/src/utilities.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const experimentDir = path.resolve(__dirname, "..");
const configPath = path.join(experimentDir, "comparison-engine.config.json");
const outputDir = path.join(experimentDir, "comparison", "generated-shared");

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function run() {
  const results = await runComparisonEngine(configPath);
  await writeText(
    path.join(outputDir, "migration-differences.md"),
    buildMigrationDifferences(
      results,
      "comparison/generated-v3/ecr-000001-comparator-v3-report.md",
    ),
  );
}
