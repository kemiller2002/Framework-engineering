export function detectProvider(filePath) {
  const normalized = filePath.replaceAll("\\", "/").toLowerCase();
  if (normalized.includes("/responses/gpt/") || normalized.includes("/incoming-responses/gpt/")) {
    return "gpt";
  }
  if (normalized.includes("/responses/claude/") || normalized.includes("/incoming-responses/claude/")) {
    return "claude";
  }
  if (normalized.includes("/responses/gemini/") || normalized.includes("/incoming-responses/gemini/")) {
    return "gemini";
  }
  return "";
}
