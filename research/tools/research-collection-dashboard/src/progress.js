import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";

export function summarizeProgress(tasks, order = "packet-first") {
  const sortedTasks = [...tasks].sort(order === "provider-first" ? providerFirst : packetFirst);
  const completeCount = tasks.filter((task) => task.status.value === "complete" || task.status.value === "complete_with_warning").length;
  const nextIncompleteIndex = sortedTasks.findIndex((task) => !["complete", "complete_with_warning", "skipped"].includes(task.status.value));
  const nextTask = nextIncompleteIndex >= 0 ? sortedTasks[nextIncompleteIndex] : sortedTasks[0] || null;
  return {
    total: tasks.length,
    complete: completeCount,
    remaining: tasks.length - completeCount,
    nextTask,
    currentPosition: nextTask ? nextIncompleteIndex + 1 : tasks.length,
    tasks: sortedTasks,
    progressMatrix: buildProgressMatrix(sortedTasks),
  };
}

export async function loadCollectionStatus(collectionRoot) {
  const filePath = path.join(collectionRoot, "collection-status.json");
  try {
    const text = await readFile(filePath, "utf8");
    return JSON.parse(text);
  } catch {
    return { sessions: [], task_overrides: {} };
  }
}

export async function writeCollectionStatus(collectionRoot, status) {
  const filePath = path.join(collectionRoot, "collection-status.json");
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(status, null, 2)}\n`, "utf8");
  return filePath;
}

function buildProgressMatrix(tasks) {
  const rows = new Map();
  for (const task of tasks) {
    const row = rows.get(task.packet.packet_id) || {
      packet_id: task.packet.packet_id,
      variant_id: task.packet.variant_id,
      gpt: "",
      claude: "",
      gemini: "",
    };
    row[task.provider] = task.status.value;
    rows.set(task.packet.packet_id, row);
  }
  return [...rows.values()];
}

function packetFirst(left, right) {
  return left.packet.packet_id.localeCompare(right.packet.packet_id) || providerOrder(left.provider) - providerOrder(right.provider);
}

function providerFirst(left, right) {
  return providerOrder(left.provider) - providerOrder(right.provider) || left.packet.packet_id.localeCompare(right.packet.packet_id);
}

function providerOrder(provider) {
  return ["gpt", "claude", "gemini"].indexOf(provider);
}
