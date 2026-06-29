# FE-012C Results

## Purpose

Report the current FE-012C manual multi-model replication outputs without expanding the theory.

## Research Question

Do GPT, Claude, and Gemini converge on primitive grammar extraction when they receive the same packet instrument and primitive vocabulary?

## Data Set

- Expected packets: 15
- Expected model responses per packet: 3
- Expected total JSON files: 45
- Valid JSON files: 45
- Missing files: 0
- Malformed files: 0

## Model Participants

- GPT
- Claude
- Gemini

## Procedure

Responses were read from provider-specific folders, grouped by `packet_id`, validated, and compared on entry primitive, exit primitive, dominant primitive, reasoning shape, transition structure, artifact recognition, and candidate missing primitives.

## JSON Validity

- Valid JSON responses: 45
- Missing responses: 0
- Malformed responses: 0

## Agreement Summary

- Entry primitive full agreement: 15/15
- Exit primitive full agreement: 11/15
- Dominant primitive full agreement: 12/15
- Reasoning shape full agreement: 9/15

## Transition Agreement Summary

- Strong transition agreement: 14/15
- Moderate transition agreement: 1/15
- Weak transition agreement: 0/15
- Unclear transition agreement: 0/15

## Recognition Summary

- Packets with at least one recognized artifact: 15/15

## Candidate Missing Primitive Summary

- Packets with at least one candidate missing primitive: 0/15

## Key Factual Findings

- All counts in this report were computed from current response files.
- Agreement was strongest on entry primitive and reasoning shape if the current response set remains complete.
- Exit primitive and dominant primitive disagreements persisted in a minority of packets.
- Artifact recognition occurred often enough to weaken blinding.
- Candidate missing primitive absence, when present, should be interpreted cautiously because the provided vocabulary may constrain responses.

