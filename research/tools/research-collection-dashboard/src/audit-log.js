import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

export async function appendAuditEvent(collectionRoot, sessionId, event) {
  const logsDir = path.join(collectionRoot, "logs");
  await mkdir(logsDir, { recursive: true });
  const filePath = path.join(logsDir, `${sessionId}.jsonl`);
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    session_id: sessionId,
    ...event,
  });
  await appendFile(filePath, `${line}\n`, "utf8");
  return filePath;
}
