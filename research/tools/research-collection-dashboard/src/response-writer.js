import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export async function writeResponseExact(filePath, rawText) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const bytes = Buffer.from(rawText, "utf8");
  await writeFile(filePath, bytes);
  const written = await readFile(filePath);
  if (!written.equals(bytes)) {
    throw new Error("Written bytes do not match submitted bytes.");
  }
  return {
    sha256: hashBytes(written),
    bytes: written.length,
  };
}

export function canonicalResponsePath(task, experiment) {
  return path.join(experiment.responsesRoot, task.provider, `${task.packet.packet_id}-${task.provider}.json`);
}

export function conflictingCandidatePath(task, experiment, timestamp = Date.now()) {
  return path.join(experiment.responsesRoot, "conflicting-candidates", task.provider, `${task.packet.packet_id}-${task.provider}-${timestamp}.json`);
}

export function malformedCandidatePath(task, experiment, timestamp = Date.now()) {
  return path.join(experiment.responsesRoot, "malformed-candidates", task.provider, `${task.packet.packet_id}-${task.provider}-${timestamp}.json`);
}

export function hashBytes(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}
