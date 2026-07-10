# ECR-000003 EXP-001 Location and Readiness Report

## Summary

Overall status:
- FOUND_BUT_INCOMPLETE

## Search Results

| Search Term | Matches Found | Relevant Paths |
|---|---:|---|
| `EXP-001` | 23+ | `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/`; `research/evidence-runs/ECR-000003-representation-sensitivity/run-instructions.md`; `research/evidence-runs/ECR-000003-representation-sensitivity/hypothesis-impact-matrix.md` |
| `EXP001` | 20+ | `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/packets/`; `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/responses/` |
| `topology-perturbation` | 8+ | `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/` |
| `representation-sensitivity` | 20+ | `research/evidence-runs/ECR-000003-representation-sensitivity/` |
| `ECR-000003` | 40+ | `research/evidence-runs/ECR-000003-representation-sensitivity/`; `research/operating-system/hypothesis-registry.md` |
| `baseline-graph` | 2 | `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/README.md`; `.../packets/ECR-000003-EXP001-P001A-baseline-graph.md` |
| `renumbered-graph` | 2 | `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/README.md`; `.../packets/ECR-000003-EXP001-P001B-renumbered-graph.md` |
| `edge-order-shuffled` | 2 | `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/README.md`; `.../packets/ECR-000003-EXP001-P001C-edge-order-shuffled.md` |
| `identity-node-expanded` | 2 | `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/README.md`; `.../packets/ECR-000003-EXP001-P001D-identity-node-expanded.md` |
| `P001A` / `P001B` / `P001C` / `P001D` | many | Present under `EXP-001`, `EXP-002`, `EXP-003`, and related ECR-000002 notes |
| alternate path patterns | 0 relevant alternates | No better alternate EXP-001 location found outside the expected directory |

## Expected Location

Expected path:
`research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/`

Actual path:
`research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/`

## Alternate Names or Locations

| Found Name | Path | Likely Equivalent To EXP-001? | Notes |
|---|---|---|---|
| `EXP-001-topology-perturbation` | `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/` | Yes | Exact expected experiment directory found |
| `responses.zip` | `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/responses.zip` | No | Extra artifact; not part of expected setup |

## Required Files

| Required Item | Status | Actual Path | Notes |
|---|---|---|---|
| Experiment directory | FOUND | `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/` | Expected location exists |
| `README.md` | FOUND | `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/README.md` | Present |
| `design.md` | FOUND | `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/design.md` | Present |
| `P001A baseline graph` | FOUND | `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/packets/ECR-000003-EXP001-P001A-baseline-graph.md` | Present |
| `P001B renumbered graph` | FOUND | `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/packets/ECR-000003-EXP001-P001B-renumbered-graph.md` | Present |
| `P001C edge-order shuffled` | FOUND | `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/packets/ECR-000003-EXP001-P001C-edge-order-shuffled.md` | Present |
| `P001D identity-node expanded` | FOUND | `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/packets/ECR-000003-EXP001-P001D-identity-node-expanded.md` | Present, but see blocking content issue below |
| `responses/gpt/.gitkeep` | FOUND | `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/responses/gpt/.gitkeep` | Present; directory also contains response JSON files |
| `responses/claude/.gitkeep` | FOUND | `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/responses/claude/.gitkeep` | Present; directory also contains response JSON files |
| `responses/gemini/.gitkeep` | FOUND | `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/responses/gemini/.gitkeep` | Present; directory also contains response JSON files |
| `comparison/.gitkeep` | FOUND | `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/comparison/.gitkeep` | Present |

## Packet Verification

| Packet | Found | Metadata Complete | Schema Embedded | Instructions Complete | Blocking Issues |
|---|---|---|---|---|---|
| `ECR-000003-EXP001-P001A-baseline-graph.md` | Yes | Yes | Yes | Yes | None found |
| `ECR-000003-EXP001-P001B-renumbered-graph.md` | Yes | Yes | Yes | Yes | None found |
| `ECR-000003-EXP001-P001C-edge-order-shuffled.md` | Yes | Yes | Yes | Yes | None found |
| `ECR-000003-EXP001-P001D-identity-node-expanded.md` | Yes | Yes | Yes | Yes | Graph body omits explicit `N6 -> END` edge that exists in the baseline graph, so the stated topology preservation is incomplete |

## ECR-Level Support Files

| File | Status | Notes |
|---|---|---|
| `README.md` | FOUND | Present |
| `pre-registration.md` | FOUND | Present |
| `research-questions.md` | FOUND | Present |
| `hypothesis-impact-matrix.md` | FOUND | Present |
| `shared-response-schema.json` | FOUND | Present |
| `shared-instructions.md` | FOUND | Present |
| `run-instructions.md` | FOUND | Present |
| `analysis-plan.md` | FOUND | Present |
| `interpretation-rules.md` | FOUND | Present |
| `threats-to-validity.md` | FOUND | Present |
| `decision-log.md` | FOUND | Present |

## Recognition Persistence Support

| File | Status | Notes |
|---|---|---|
| `metrics/recognition-persistence.md` | FOUND | Present |
| `metrics/recognition-persistence-template.csv` | FOUND | Present |
| `metrics/recognition-scale.md` | FOUND | Present |
| `comparison/recognition-persistence-tracker.md` | FOUND | Present |

## EDR Support

| File | Status | Notes |
|---|---|---|
| `edr/README.md` | FOUND | Present |
| `edr/EDR-ECR-000003-EXP001-template.md` | FOUND | Present |

## Response Directory Readiness

| Provider | Directory | Status |
|---|---|---|
| GPT | `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/responses/gpt/` | EXISTS_AND_WRITABLE |
| Claude | `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/responses/claude/` | EXISTS_AND_WRITABLE |
| Gemini | `research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/responses/gemini/` | EXISTS_AND_WRITABLE |

## Blocking Issues

- `P001D identity-node-expanded` does not fully preserve the baseline graph as written because the graph body is missing the explicit `N6 -> END` termination edge.

## Warnings

- Existing EXP-001 response files use nonstandard names such as `0001A.json`, `00001C.json`, and `00001D.json` instead of the documented `ECR-000003-EXP001-P001A-gpt.json` style filename convention.
- `responses.zip` exists under the experiment directory and is not part of the expected scaffold.
- Some providers use inconsistent zero-padding across response filenames (`0001C.json` vs `00001C.json`).
- Packet metadata, embedded schema, and instructions are present across all four packets.
- Graph-only terminology restrictions appear to be respected in the packet bodies; no `TODO` markers, unresolved placeholders, or external schema references were found in the EXP-001 packets.

## Recommended Action

- Fix listed blocking issues first.

## Exact Next Command or Path

Open:
`research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-001-topology-perturbation/packets/`
