import { mkdir, readFile, writeFile } from "node:fs/promises";
import crypto from "node:crypto";
import path from "node:path";

export async function loadJson(filePath) {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw);
}

export async function readOptional(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

export async function ensureDir(dirPath) {
  await mkdir(dirPath, { recursive: true });
}

export async function writeText(filePath, text) {
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, text, "utf8");
}

export function unique(values) {
  return [...new Set(values)];
}

export function compact(values) {
  return values.filter(Boolean);
}

export function normalizeText(value) {
  return String(value ?? "")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, "\"")
    .replace(/[–—]/g, "-")
    .toLowerCase()
    .replace(/[^a-z0-9\s/-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeWhitespace(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

export function simplifyPassThroughLabels(value) {
  return normalizeWhitespace(String(value ?? "").replace(/\b([A-Za-z]+\d+)[a-z]+\b/g, "$1"));
}

export function slugify(value) {
  return normalizeText(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function relativeTo(baseDir, targetPath) {
  if (!targetPath) return "";
  return path.relative(baseDir, targetPath) || ".";
}

export function percent(part, whole) {
  if (!whole) return "0%";
  return `${Math.round((part / whole) * 100)}%`;
}

export function tally(items) {
  const counts = {};
  for (const item of items) {
    counts[item] = (counts[item] || 0) + 1;
  }
  return counts;
}

export function intersection(left, right) {
  const rightSet = new Set(right);
  return left.filter((item) => rightSet.has(item));
}

export function union(left, right) {
  return unique([...left, ...right]);
}

export function listDifference(left, right) {
  const rightSet = new Set(right);
  return left.filter((item) => !rightSet.has(item));
}

export function ratio(left, right) {
  const denom = Math.max(left.length, right.length);
  if (!denom) return 1;
  return intersection(left, right).length / denom;
}

export function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, "\"\"")}"`;
  }
  return text;
}

export function parsePacketMetadata(rawText) {
  const metadata = {};
  for (const line of rawText.split(/\r?\n/)) {
    if (!line.trim()) break;
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    metadata[match[1]] = match[2];
  }
  return metadata;
}

export function stripMarkdownCodeFence(rawText) {
  const trimmed = String(rawText ?? "").trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced ? fenced[1] : trimmed;
}

export function deepGet(object, pathExpression) {
  return pathExpression.split(".").reduce((value, key) => value?.[key], object);
}

export function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === "") return [];
  return [value];
}

export function toSentence(value) {
  const normalized = normalizeWhitespace(value);
  if (!normalized) return "";
  return normalized[0].toUpperCase() + normalized.slice(1);
}

export function safeLower(value) {
  return String(value ?? "").toLowerCase().trim();
}

export function sha256Text(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}
