# ECR-000003 Run Instructions

## Execution Mode

Manual execution only.

Fresh conversation for every packet.

No previous outputs visible.

No model sees another model's response.

## Recommended Run Order

### Phase 1

Run `EXP-001` only.

Run GPT, Claude, and Gemini across the four topology variants.

After each model output, operator should record `recognition_value` using `metrics/recognition-scale.md` before reading detailed structure.

Use `P001D` packet version `1.1`.

Any prior `P001D` responses from version `1.0` are excluded from the corrected primary comparison.

`P001D` must be rerun for GPT, Claude, and Gemini after the fix.

`P001A`, `P001B`, and `P001C` do not need rerunning unless their responses are missing or invalid.

Stop and review.

### Phase 2

Run `EXP-002` only if `EXP-001` results justify continuing.

### Phase 3

Run `EXP-003` only after `EXP-002` review.

## Filename Convention

`responses/<provider>/<packet_id>-<provider>.json`

Example:

`experiments/EXP-001-topology-perturbation/responses/gpt/ECR-000003-EXP001-P001A-gpt.json`

## Comparison Step

After all corrected `EXP-001` responses are present:

1. Change into `experiments/EXP-001-topology-perturbation/`.
2. Run `npm run compare`.
3. Review `comparison/generated-v3.1/data-quality-report.md` first.
4. Review `comparison/generated-v3.1/recognition-persistence-report.md`.
5. Review `comparison/generated-v3.1/structural-stability-report.md`.
6. Treat Comparator v3.1 as frozen for `ECR-000003` after limited approval.
7. Use `research/evidence-runs/ECR-000003-representation-sensitivity/edr/EDR-ECR-000003-EXP001.md` as the working EDR, with `comparison/generated-v3.1/edr-draft.md` as source material only.
8. Complete and accept `EDR-ECR-000003-EXP001` before activating any later experiment.
9. Use the accepted EDR to decide whether `EXP-002` should proceed.

`EXP-002` may not begin until the accepted EDR selects it or another experiment as the highest-information next action.
