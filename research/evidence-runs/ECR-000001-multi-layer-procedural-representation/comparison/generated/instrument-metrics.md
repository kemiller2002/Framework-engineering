# Instrument Metrics

Schema top-level keys loaded from reference schema: packet_id, blinded_artifact_id, recognized_artifact, structural_layer, primitive_layer, constraint_layer, representation_layer, product_relevance_layer, confidence, notes.

## JSON Validity and Schema Compliance

| Packet | Provider | Status | Parse Mode | Schema Completeness | Recognition Present | Ambiguity Count | Confidence Values | Source File |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ECR-000001-P001 | gpt | malformed | no | incomplete | no | 0 | structural_layer=-, primitive_layer=-, constraint_layer=-, representation_layer=-, product_relevance_layer=-, overall=- | responses/gpt/001.json |
| ECR-000001-P002 | gpt | ok | normalized | complete | no | 3 | structural_layer=high, primitive_layer=high, constraint_layer=medium, representation_layer=high, product_relevance_layer=high, overall=high | responses/gpt/002.json |
| ECR-000001-P003 | gpt | ok | normalized | complete | no | 2 | structural_layer=high, primitive_layer=high, constraint_layer=medium, representation_layer=high, product_relevance_layer=medium, overall=high | responses/gpt/003.json |
| ECR-000001-P001 | claude | ok | strict | complete | yes | 4 | structural_layer=high — control flow is explicitly described with clear entry, loop, branch, and exit semantics; main uncertainty is in branch topology, primitive_layer=medium-high — dominant primitives are clear; transitions at reformulate back-edge and branch exclusivity are genuinely ambiguous, constraint_layer=high — invariants and stopping criteria are explicit; threshold values are deliberately unspecified in the source, representation_layer=medium — AST and summary are well-grounded but four non-trivial ambiguities remain unresolved and are preserved rather than collapsed, product_relevance_layer=low-medium — observations are inferred; packet provides no product context, overall=medium-high — structural and constraint extraction is reliable; ambiguities are explicitly preserved per v1.1 instructions rather than resolved | responses/claude/001.json |
| ECR-000001-P002 | claude | ok | strict | complete | yes | 4 | structural_layer=high — all five steps are explicit; loop is strongly implied; branches and termination are absent or unspecified, primitive_layer=high for sequence identification; moderate for transition semantics and loop boundary placement, constraint_layer=moderate — preconditions and postconditions are derivable; stopping criteria and validity edge cases are underspecified, representation_layer=high for summary and AST structure; moderate for ambiguity resolution, product_relevance_layer=low — product context (Clarity, EDF) is not described in the packet; observations are speculative, overall=moderate-high — the procedural content is clear and fully explicit; uncertainty is concentrated in loop termination, step boundaries, and product relevance | responses/claude/002.json |
| ECR-000001-P003 | claude | ok | strict | complete | yes | 3 | structural_layer=high — procedural steps are short but unambiguous in sequence, primitive_layer=medium — dominant primitive is clear; missing primitives (DEFINE, VERIFY) are plausible but inferred, constraint_layer=medium — invariants and postconditions are derivable; stopping criteria require inference, representation_layer=medium — AST is faithful to packet but terminal branch ambiguity limits precision, product_relevance_layer=low — no product context is provided; all observations are inferred, overall=medium | responses/claude/003.json |
| ECR-000001-P001 | gemini | ok | strict | complete | yes | 2 | structural_layer=high, primitive_layer=high, constraint_layer=high, representation_layer=high, product_relevance_layer=medium, overall=high | responses/gemini/001.json |
| ECR-000001-P002 | gemini | ok | strict | complete | yes | 2 | structural_layer=high, primitive_layer=high, constraint_layer=high, representation_layer=high, product_relevance_layer=high, overall=high | responses/gemini/002.json |
| ECR-000001-P003 | gemini | ok | strict | complete | yes | 1 | structural_layer=high, primitive_layer=high, constraint_layer=high, representation_layer=high, product_relevance_layer=medium, overall=high | responses/gemini/003.json |

## Malformed or Missing Files

- ECR-000001-P001 gpt: malformed. Expected responses/gpt/ECR-000001-P001-gpt.json; fallback responses/gpt/001.json. Unterminated string in JSON at position 8370 (line 1 column 8371)

## Notes

- Legacy fallback filenames were accepted when canonical ECP filenames were absent.
- Normalized parse mode indicates non-strict JSON was repaired in memory for analysis only; raw files were not modified.
