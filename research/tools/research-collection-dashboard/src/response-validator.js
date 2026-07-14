export function validateResponseText(rawText, task, options = {}) {
  const allowTolerantJson = options.allowTolerantJson !== false;
  const result = {
    strict_parse_success: false,
    tolerant_parse_success: false,
    repairs_required: [],
    validation_warnings: [],
    blocking_issues: [],
    metadata: {},
    parsed: null,
    parse_mode: "failed",
  };

  let parsed = tryParse(rawText);
  if (parsed.ok) {
    result.strict_parse_success = true;
    result.parse_mode = "strict";
    result.parsed = parsed.value;
  } else if (allowTolerantJson) {
    const tolerant = sanitizeForTolerantParse(rawText);
    const reparsed = tryParse(tolerant.text);
    if (reparsed.ok) {
      result.tolerant_parse_success = true;
      result.repairs_required = tolerant.repairs;
      result.parse_mode = "tolerant";
      result.parsed = reparsed.value;
      result.validation_warnings.push("Tolerant parse was required.");
    } else {
      result.blocking_issues.push("Response is not valid JSON.");
      return result;
    }
  } else {
    result.blocking_issues.push("Response is not valid JSON.");
    return result;
  }

  result.metadata = extractMetadata(result.parsed);
  verifyMetadata(result, task);
  return result;
}

function tryParse(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, value: null };
  }
}

function sanitizeForTolerantParse(rawText) {
  let text = rawText.trim();
  const repairs = [];
  const fenceMatch = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenceMatch) {
    text = fenceMatch[1];
    repairs.push("removed_markdown_code_fence");
  }
  const replacedQuotes = text
    .replace(/[\u201C\u201D]/g, "\"")
    .replace(/[\u2018\u2019]/g, "'");
  if (replacedQuotes !== text) {
    text = replacedQuotes;
    repairs.push("normalized_smart_quotes");
  }
  const withoutTrailingCommas = text.replace(/,\s*([}\]])/g, "$1");
  if (withoutTrailingCommas !== text) {
    text = withoutTrailingCommas;
    repairs.push("removed_trailing_commas");
  }
  return { text, repairs };
}

function extractMetadata(parsed) {
  const object = parsed && typeof parsed === "object" ? parsed : {};
  return {
    packet_id: stringValue(object.packet_id),
    experiment_id: stringValue(object.experiment_id),
    variant_id: stringValue(object.variant_id),
    artifact_family_id: stringValue(object.artifact_family_id),
  };
}

function verifyMetadata(result, task) {
  const requiredMatches = [
    ["packet_id", task.packet.packet_id],
    ["experiment_id", task.packet.experiment_id],
    ["variant_id", task.packet.variant_id],
    ["artifact_family_id", task.packet.artifact_family_id],
  ];
  for (const [field, expected] of requiredMatches) {
    const actual = result.metadata[field];
    if (!actual) {
      result.validation_warnings.push(`Missing metadata field ${field}.`);
      continue;
    }
    if (actual !== expected) {
      result.blocking_issues.push(`Metadata mismatch for ${field}: expected ${expected}, received ${actual}.`);
    }
  }
}

function stringValue(value) {
  return typeof value === "string" ? value : "";
}
