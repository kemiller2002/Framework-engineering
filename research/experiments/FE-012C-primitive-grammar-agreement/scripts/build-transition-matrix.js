import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const baseDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const resultsDir = path.join(baseDir, "results");

function isSuccessResult(payload) {
  return payload && !payload.error;
}

async function loadResults() {
  const files = await fs.readdir(resultsDir);
  const jsonFiles = files.filter((file) => file.endsWith(".json"));
  const results = [];

  for (const file of jsonFiles) {
    const payload = JSON.parse(await fs.readFile(path.join(resultsDir, file), "utf8"));
    if (isSuccessResult(payload)) {
      results.push(payload);
    }
  }

  return results;
}

function countMapEntries(items, projector) {
  const counts = new Map();

  for (const item of items) {
    const key = projector(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  return Object.fromEntries([...counts.entries()].sort((a, b) => b[1] - a[1]));
}

async function main() {
  const results = await loadResults();

  const transitions = results.flatMap((result) => result.transitions || []);
  const entries = results
    .map((result) => result.entry_primitive)
    .filter(Boolean);
  const exits = results
    .map((result) => result.exit_primitive)
    .filter(Boolean);
  const dominant = results
    .map((result) => result.dominant_primitive)
    .filter(Boolean);

  const transitionMatrix = countMapEntries(
    transitions.filter((item) => item.from && item.to),
    (item) => `${item.from} -> ${item.to}`
  );

  const primitivePositionSummary = {
    entry_primitives: countMapEntries(entries, (item) => item),
    exit_primitives: countMapEntries(exits, (item) => item),
    dominant_primitives: countMapEntries(dominant, (item) => item)
  };

  await fs.writeFile(
    path.join(resultsDir, "transition-matrix.json"),
    `${JSON.stringify(transitionMatrix, null, 2)}\n`,
    "utf8"
  );

  await fs.writeFile(
    path.join(resultsDir, "primitive-position-summary.json"),
    `${JSON.stringify(primitivePositionSummary, null, 2)}\n`,
    "utf8"
  );

  console.log("Top transitions:");
  for (const [transition, count] of Object.entries(transitionMatrix).slice(0, 10)) {
    console.log(`${transition}: ${count}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
