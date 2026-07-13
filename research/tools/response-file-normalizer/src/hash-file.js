import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

export async function hashFile(filePath) {
  const buffer = await readFile(filePath);
  return createHash("sha256").update(buffer).digest("hex");
}

export function hashBuffer(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

export function normalizeJsonForSemanticCompare(value) {
  return JSON.stringify(sortValue(value));
}

function sortValue(value) {
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, sortValue(value[key])]),
    );
  }
  return value;
}
