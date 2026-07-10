# ECR-000003 EXP-001 Repair Report

## Overall Status

READY_AFTER_P001D_RERUN

## P001D Topology Repair

| Check | Status | Notes |
| --- | --- | --- |
| baseline terminal path identified | PASS | Baseline `P001A` includes explicit `N6 -> END` termination path |
| missing terminal edge restored | PASS | `P001D` now includes explicit `N6 -> END` |
| topology otherwise preserved | PASS | Only neutral pass-through expansion remains as the intended structural difference |
| neutral pass-through nodes remain neutral | PASS | `N1a`, `N1b`, `N1c`, `N5a`, `N5b`, and `N5c` remain pass-through states |
| packet version updated | PASS | `packet_version: 1.1` and refinement reason added |

## Existing Response Review

| Provider | Variant | Original Filename | Packet Version | Action | New Path |
| --- | --- | --- | --- | --- | --- |
| GPT | P001A | `0001A.json` | unaffected | renamed | `responses/gpt/ECR-000003-EXP001-P001A-gpt.json` |
| GPT | P001B | `0001B.json` | unaffected | renamed | `responses/gpt/ECR-000003-EXP001-P001B-gpt.json` |
| GPT | P001C | `0001C.json` | unaffected | renamed | `responses/gpt/ECR-000003-EXP001-P001C-gpt.json` |
| GPT | P001D | `00001D.json` | 1.0 pre-fix | moved to audit hold | `responses/pre-fix/p001d/00001D.json` |
| Claude | P001A | `0001A.json` | unaffected | renamed | `responses/claude/ECR-000003-EXP001-P001A-claude.json` |
| Claude | P001B | `0001B.json` | unaffected | renamed | `responses/claude/ECR-000003-EXP001-P001B-claude.json` |
| Claude | P001C | `00001C.json` | unaffected | renamed | `responses/claude/ECR-000003-EXP001-P001C-claude.json` |
| Claude | P001D | `00001D.json` | 1.0 pre-fix | moved to audit hold | `responses/pre-fix/p001d/00001D.json` |
| Gemini | P001A | `0001A.json` | unaffected | renamed | `responses/gemini/ECR-000003-EXP001-P001A-gemini.json` |
| Gemini | P001B | `0001B.json` | unaffected | renamed | `responses/gemini/ECR-000003-EXP001-P001B-gemini.json` |
| Gemini | P001C | `00001C.json` | unaffected | renamed | `responses/gemini/ECR-000003-EXP001-P001C-gemini.json` |
| Gemini | P001D | `00001D.json` | 1.0 pre-fix | moved to audit hold | `responses/pre-fix/p001d/00001D.json` |

## Filename Normalization

| Provider | Packet | Old Filename | New Filename | Status |
| --- | --- | --- | --- | --- |
| GPT | P001A | `0001A.json` | `ECR-000003-EXP001-P001A-gpt.json` | normalized |
| GPT | P001B | `0001B.json` | `ECR-000003-EXP001-P001B-gpt.json` | normalized |
| GPT | P001C | `0001C.json` | `ECR-000003-EXP001-P001C-gpt.json` | normalized |
| Claude | P001A | `0001A.json` | `ECR-000003-EXP001-P001A-claude.json` | normalized |
| Claude | P001B | `0001B.json` | `ECR-000003-EXP001-P001B-claude.json` | normalized |
| Claude | P001C | `00001C.json` | `ECR-000003-EXP001-P001C-claude.json` | normalized |
| Gemini | P001A | `0001A.json` | `ECR-000003-EXP001-P001A-gemini.json` | normalized |
| Gemini | P001B | `0001B.json` | `ECR-000003-EXP001-P001B-gemini.json` | normalized |
| Gemini | P001C | `00001C.json` | `ECR-000003-EXP001-P001C-gemini.json` | normalized |

## Archived Files

| File | Original Path | Archive Path | Notes |
| --- | --- | --- | --- |
| `responses.zip` | `responses.zip` | `archive/responses.zip` | Preserved rather than deleted |

## Remaining Blocking Issues

- Corrected primary comparison still requires new `P001D` responses for GPT, Claude, and Gemini using packet version `1.1`.

## Required Reruns

- GPT `P001D`
- Claude `P001D`
- Gemini `P001D`

## Exact Next Action

Corrected packet:

`research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/packets/ECR-000003-EXP001-P001D-identity-node-expanded.md`

Expected response filenames:

- `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/responses/gpt/ECR-000003-EXP001-P001D-gpt.json`
- `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/responses/claude/ECR-000003-EXP001-P001D-claude.json`
- `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/responses/gemini/ECR-000003-EXP001-P001D-gemini.json`
