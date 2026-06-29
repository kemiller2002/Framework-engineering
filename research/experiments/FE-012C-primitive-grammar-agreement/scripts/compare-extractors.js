import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const baseDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const resultsDir = path.join(baseDir, "results");

function normalizeTransition(item) {
  return `${item.from} -> ${item.to}`;
}

function isSuccessResult(payload) {
  return payload && !payload.error;
}

function agreementStatus(resultSet) {
  if (resultSet.length < 2) {
    return { status: "unclear", shared: [], union: [] };
  }

  const transitionSets = resultSet.map((result) =>
    new Set((result.transitions || []).filter((item) => item.from && item.to).map(normalizeTransition))
  );

  const union = new Set(transitionSets.flatMap((set) => [...set]));
  const shared = [...union].filter((transition) => transitionSets.every((set) => set.has(transition)));

  if (shared.length === 0) {
    return { status: "weak", shared, union: [...union] };
  }

  if (shared.length * 2 >= union.size) {
    return { status: "strong", shared, union: [...union] };
  }

  return { status: "moderate", shared, union: [...union] };
}

async function loadResults() {
  const files = await fs.readdir(resultsDir);
  const jsonFiles = files.filter((file) => file.endsWith(".json"));
  const grouped = new Map();

  for (const file of jsonFiles) {
    const payload = JSON.parse(await fs.readFile(path.join(resultsDir, file), "utf8"));
    if (!isSuccessResult(payload)) {
      continue;
    }

    const artifactId = payload.artifact_id;
    if (!grouped.has(artifactId)) {
      grouped.set(artifactId, []);
    }

    grouped.get(artifactId).push(payload);
  }

  return grouped;
}

async function main() {
  const grouped = await loadResults();
  const summary = [];

  for (const [artifactId, results] of grouped.entries()) {
    console.log(`\nArtifact: ${artifactId}`);

    for (const result of results) {
      console.log(`${result.provider}: ${(result.primitive_sequence || []).join(" -> ")}`);
    }

    const agreement = agreementStatus(results);
    const payload = {
      artifact_id: artifactId,
      successful_outputs: results.length,
      primitive_sequences: results.map((result) => ({
        provider: result.provider,
        model: result.model,
        primitive_sequence: result.primitive_sequence || []
      })),
      shared_transitions: agreement.shared || [],
      union_transitions: agreement.union || [],
      agreement_status: agreement.status || "unclear"
    };

    summary.push(payload);
  }

  await fs.writeFile(
    path.join(resultsDir, "extractor-agreement.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
    "utf8"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
