import { tally } from "../utilities.js";

export function explainVariantPattern(pairwiseRecords) {
  const grouped = new Map();
  for (const record of pairwiseRecords.filter((item) => item.scope_type === "variant_pair")) {
    const key = record.left.variant_id < record.right.variant_id
      ? `${record.left.variant_id}/${record.right.variant_id}`
      : `${record.right.variant_id}/${record.left.variant_id}`;
    const bucket = grouped.get(key) || [];
    bucket.push(record);
    grouped.set(key, bucket);
  }

  return [...grouped.entries()].map(([pair, records]) => ({
    pair,
    count: records.length,
    priority_profile: tally(records.map((item) => item.human_review_priority)),
    difference_profile: tally(records.flatMap((item) => item.difference_records.map((difference) => difference.difference_type))),
  }));
}
