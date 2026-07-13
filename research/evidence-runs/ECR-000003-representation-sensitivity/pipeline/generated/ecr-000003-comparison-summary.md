# ECR-000003 Comparison Summary

## Run Status

- Comparator version: 3.1.0
- Dataset status: NOT_READY

## Dataset Completeness

- EXP-001: expected 12, present 12, malformed 4, status READY_WITH_WARNINGS.
- EXP-002: expected 12, present 12, malformed 4, status READY_WITH_WARNINGS.
- EXP-003: expected 9, present 0, malformed 0, status NOT_READY.

## Comparator Version

- Comparator v3.1.0 remains frozen for ECR-000003.

## EXP-001 Topology Perturbation

- run_id: 179fa743-b92a-4f75-b4a2-492fa9eb7898
- included_records: 12
- malformed_records: 0
- tolerant_parsing_events: 5
- structural_backbone_result: mixed

## EXP-002 Cross-Representation Stability

- Outputs not available.

## EXP-003 Procedural Isomorphism

- Outputs not available.

## Recognition Across Experiments

- EXP-001 ECR-000003-EXP001-P001A gpt: not_recognized
- EXP-001 ECR-000003-EXP001-P001A claude: partial
- EXP-001 ECR-000003-EXP001-P001A gemini: unknown
- EXP-001 ECR-000003-EXP001-P001B gpt: not_recognized
- EXP-001 ECR-000003-EXP001-P001B claude: partial
- EXP-001 ECR-000003-EXP001-P001B gemini: not_recognized
- EXP-002: unavailable
- EXP-003: unavailable

## Structural Backbone Across Experiments

- EXP-001: mixed
- EXP-002: unavailable
- EXP-003: unavailable

## Primitive Stability Across Experiments

- EXP-001: disagreement
- EXP-002: unavailable
- EXP-003: unavailable

## Constraint Findings

- EXP-001: disagreement
- EXP-002: unavailable
- EXP-003: unavailable

## Representation Compliance

- EXP-001: full_agreement
- EXP-002: unavailable
- EXP-003: unavailable

## Provider-Specific Patterns

- Provider-specific patterns remain experiment-local and require human review before interpretation.

## Domain Leakage

- EXP-001: 3 leakage findings
- EXP-002: 0 leakage findings
- EXP-003: 0 leakage findings

## Instrument Limitations

- Tolerant parsing events remain visible and may affect strict-parser workflows.
- Missing EXP-003 responses block full ECR completion.
- Comparator approval does not validate any theory or product claim.

## Observations Ready For EDR Review

- Use the experiment EDR drafts and the ECR summary EDR for human review.

## What This ECR Does Not Establish

- Does not validate Framework Engineering.
- Does not validate Clarity.
- Does not validate EDF.
- Does not prove a universal procedural grammar.
- Does not establish human equivalence.
- Does not establish model independence.
- Does not justify product claims.
