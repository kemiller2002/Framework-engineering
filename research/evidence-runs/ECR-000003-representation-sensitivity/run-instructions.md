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

Stop and review.

### Phase 2

Run `EXP-002` only if `EXP-001` results justify continuing.

### Phase 3

Run `EXP-003` only after `EXP-002` review.

## Filename Convention

`responses/<provider>/<packet_id>-<provider>.json`

Example:

`experiments/EXP-001-topology-perturbation/responses/gpt/ECR-000003-EXP001-P001A-gpt.json`
