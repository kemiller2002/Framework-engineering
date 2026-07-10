# EXP-001 Topology Perturbation

## Purpose

Determine whether recognition depends on the graph's underlying topology or superficial graph presentation.

## Variants

- `P001A`: baseline graph
- `P001B`: renumbered graph
- `P001C`: edge-order-shuffled
- `P001D`: identity-node-expanded

## Comparison

Run:

`npm run compare`

Generated outputs:

- `comparison/generated-v3.1/exp-001-comparison-summary.md`
- `comparison/generated-v3.1/recognition-persistence-report.md`
- `comparison/generated-v3.1/structural-stability-report.md`
- `comparison/generated-v3.1/primitive-stability-report.md`
- `comparison/generated-v3.1/constraint-stability-report.md`
- `comparison/generated-v3.1/representation-stability-report.md`
- `comparison/generated-v3.1/domain-leakage-report.md`
- `comparison/generated-v3.1/data-quality-report.md`
- `comparison/generated-v3.1/observation-ledger.md`
- `comparison/generated-v3.1/edr-draft.md`
- `comparison/generated-v3.1/raw-comparison-data.json`
- `comparison/generated-v3.1/recognition-persistence-results.csv`

Smoke / regression check:

`npm run compare:smoke`
