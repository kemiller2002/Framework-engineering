import { stripMarkdownCodeFence } from "./utilities.js";

const smartQuoteMap = new Map([
  ["“", "\""],
  ["”", "\""],
  ["‘", "'"],
  ["’", "'"],
]);

export function sanitizeJsonText(rawText) {
  let text = stripMarkdownCodeFence(rawText);
  for (const [from, to] of smartQuoteMap.entries()) {
    text = text.split(from).join(to);
  }
  return text.trim();
}

export function parseResponseText(rawText) {
  const candidates = [sanitizeJsonText(rawText)];
  for (const candidate of candidates) {
    try {
      return { ok: true, data: JSON.parse(candidate), text: candidate };
    } catch (error) {
      return { ok: false, error: error.message, text: candidate };
    }
  }
  return { ok: false, error: "Unknown parse failure", text: "" };
}
