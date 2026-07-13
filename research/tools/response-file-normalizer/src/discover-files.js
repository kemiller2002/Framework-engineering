import { readdir } from "node:fs/promises";
import path from "node:path";

const SCANNED_EXTENSIONS = new Set([".json", ".txt", ".md", ".zip", ".ZIP"]);

export async function discoverFiles(rootDir) {
  const results = [];
  await walk(rootDir, results);
  return results.sort((left, right) => left.localeCompare(right));
}

async function walk(dirPath, results) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath, results);
      continue;
    }
    if (SCANNED_EXTENSIONS.has(path.extname(entry.name))) {
      results.push(fullPath);
    }
  }
}
