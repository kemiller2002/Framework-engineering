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
  const strictCandidate = stripMarkdownCodeFence(rawText).trim();
  try {
    return { ok: true, data: JSON.parse(strictCandidate), text: strictCandidate, parse_mode: "strict", sanitization_applied: false };
  } catch {
    // continue to tolerant parse
  }

  const tolerantCandidate = sanitizeJsonText(rawText);
  try {
    return {
      ok: true,
      data: JSON.parse(tolerantCandidate),
      text: tolerantCandidate,
      parse_mode: "tolerant",
      sanitization_applied: tolerantCandidate !== strictCandidate,
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message,
      text: tolerantCandidate,
      parse_mode: "failed",
      sanitization_applied: tolerantCandidate !== strictCandidate,
    };
  }
}
