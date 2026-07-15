export function buildEvidenceTrace({ layer, field, leftRecord, rightRecord, leftValue, rightValue }) {
  return [
    {
      layer,
      field,
      left_packet_id: leftRecord.packet_id,
      right_packet_id: rightRecord.packet_id,
      left_provider: leftRecord.provider,
      right_provider: rightRecord.provider,
      left_source: leftRecord.source_path,
      right_source: rightRecord.source_path,
      left_excerpt: excerpt(leftValue),
      right_excerpt: excerpt(rightValue),
    },
  ];
}

function excerpt(value) {
  const text = Array.isArray(value) ? value.join(" | ") : String(value ?? "");
  return text.length > 220 ? `${text.slice(0, 217)}...` : text;
}
