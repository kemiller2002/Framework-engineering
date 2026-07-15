# ECR-000003 Comparison Summary

## Run Status

- Comparator version: 3.1.0
- Dataset status: READY

## Dataset Completeness

- EXP-001: expected 12, present 12, malformed 0, status READY.
- EXP-002: expected 12, present 12, malformed 0, status READY.
- EXP-003: expected 9, present 9, malformed 0, status READY.

## Comparator Version

- Comparator v3.1.0 remains frozen for ECR-000003.

## EXP-001 Topology Perturbation

- run_id: e2a2ed75-2dbc-46b4-a20d-742ea34a0393
- included_records: 12
- malformed_records: 0
- tolerant_parsing_events: 5
- structural_backbone_result: mixed

## EXP-002 Cross-Representation Stability

- run_id: f443d0d6-9763-45e1-911e-e014ab1856f2
- included_records: 12
- malformed_records: 0
- tolerant_parsing_events: 4
- structural_backbone_result: mixed

## EXP-003 Procedural Isomorphism

- run_id: 831e1fe8-ab35-4464-a66d-7dba12db6cc5
- included_records: 9
- malformed_records: 0
- tolerant_parsing_events: 3
- structural_backbone_result: mostly_stable

## Recognition Across Experiments

- EXP-001 ECR-000003-EXP001-P001A gpt: not_recognized
- EXP-001 ECR-000003-EXP001-P001A claude: partial
- EXP-001 ECR-000003-EXP001-P001A gemini: unknown
- EXP-001 ECR-000003-EXP001-P001B gpt: not_recognized
- EXP-001 ECR-000003-EXP001-P001B claude: partial
- EXP-001 ECR-000003-EXP001-P001B gemini: not_recognized
- EXP-002 ECR-000003-EXP002-P001A gpt: partial
- EXP-002 ECR-000003-EXP002-P001A claude: recognized
- EXP-002 ECR-000003-EXP002-P001A gemini: recognized
- EXP-002 ECR-000003-EXP002-P001B gpt: partial
- EXP-002 ECR-000003-EXP002-P001B claude: partial
- EXP-002 ECR-000003-EXP002-P001B gemini: unknown
- EXP-003 ECR-000003-EXP003-P001A gpt: partial
- EXP-003 ECR-000003-EXP003-P001A claude: partial
- EXP-003 ECR-000003-EXP003-P001A gemini: recognized
- EXP-003 ECR-000003-EXP003-P001B gpt: partial
- EXP-003 ECR-000003-EXP003-P001B claude: partial
- EXP-003 ECR-000003-EXP003-P001B gemini: partial

## Structural Backbone Across Experiments

- EXP-001: mixed
- EXP-002: mixed
- EXP-003: mostly_stable

## Primitive Stability Across Experiments

- EXP-001: disagreement
- EXP-002: disagreement
- EXP-003: disagreement

## Constraint Findings

- EXP-001: disagreement
- EXP-002: disagreement
- EXP-003: disagreement

## Representation Compliance

- EXP-001: full_agreement
- EXP-002: full_agreement
- EXP-003: full_agreement

## Provider-Specific Patterns

- Provider-specific patterns remain experiment-local and require human review before interpretation.

## Domain Leakage

- EXP-001: 3 leakage findings
- EXP-002: 5 leakage findings
- EXP-003: 5 leakage findings

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
