import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { canonicalResponsePath, hashBytes } from "./response-writer.js";
import { validateResponseText } from "./response-validator.js";

export async function discoverResponseState(experiment, packets, providers, options = {}) {
  const tasks = [];
  for (const packet of packets) {
    for (const provider of providers) {
      const task = createTask(experiment, packet, provider);
      task.status = await deriveTaskStatus(task, experiment, options);
      tasks.push(task);
    }
  }
  return tasks;
}

export function createTask(experiment, packet, provider) {
  return {
    id: `${experiment.id}:${packet.packet_id}:${provider}`,
    experiment_id: experiment.id,
    provider,
    packet,
    canonical_path: canonicalResponsePath({ packet, provider }, experiment),
  };
}

async function deriveTaskStatus(task, experiment, options) {
  if (task.packet.metadata_missing.length > 0) {
    return { value: "blocked", notes: [`Missing packet metadata: ${task.packet.metadata_missing.join(", ")}`] };
  }
  const canonicalPath = canonicalResponsePath(task, experiment);
  if (await exists(canonicalPath)) {
    const rawText = await readFile(canonicalPath, "utf8");
    const validation = validateResponseText(rawText, task, options);
    return {
      value: validation.blocking_issues.length > 0 || validation.tolerant_parse_success || validation.validation_warnings.length > 0
        ? "complete_with_warning"
        : "complete",
      notes: [...validation.blocking_issues, ...validation.validation_warnings],
      sha256: hashBytes(Buffer.from(rawText, "utf8")),
      bytes: Buffer.byteLength(rawText, "utf8"),
      validation,
      target_path: canonicalPath,
    };
  }

  const conflictingDir = path.join(experiment.responsesRoot, "conflicting-candidates", task.provider);
  if (await containsCandidate(conflictingDir, task.packet.packet_id, task.provider)) {
    return { value: "conflicting_duplicate", notes: ["Conflicting candidate response exists."] };
  }
  return { value: "pending", notes: [], target_path: canonicalPath };
}

async function containsCandidate(dirPath, packetId, provider) {
  try {
    const entries = await readdir(dirPath);
    return entries.some((name) => name.startsWith(`${packetId}-${provider}-`) && name.endsWith(".json"));
  } catch {
    return false;
  }
}

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}
