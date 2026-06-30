# FE-012C Capability Role Drift Review

## Purpose

This review package supports a focused human assessment of whether FE-012C repeatability drift reflects genuine reasoning-structure change or primitive-level variation around stable capability roles.

This is not a new extraction experiment.

This is not a new theory document.

This is a structured manual review of selected disagreement cases.

## Review Scope

The review targets five selected packet/provider cases drawn from the current FE-012C literal and semantic comparison outputs.

The aim is to determine whether comparison should remain at the primitive level or move to a higher abstraction level called Capability Roles.

## Datasets

Prior dataset:

- `research/experiments/FE-012C-manual-replication/responses/`

Repeat dataset:

- `research/experiments/FE-012C-repeatability-run-001/responses/`

## Review Files

- `role-mapping.md`
- `selected-cases.md`
- `manual-review-template.md`
- `review-results.md`
- `comparator-implications.md`
- `decision-log.md`

## How To Perform The Review

1. Open `selected-cases.md` and choose a case.
2. Open the referenced prior and repeat response files.
3. Copy the case into `review-results.md` or use `manual-review-template.md`.
4. Convert each primitive sequence into a capability-role sequence using `role-mapping.md`.
5. Assess whether the capability-role backbone changed materially.
6. Record exactly one classification: `stable`, `elaboration_drift`, `role_drift`, or `unclear`.
7. Record the comparator implication without assuming that automation is justified.

## How To Use The Role Mapping

The role mapping is provisional.

It is intended only to test whether some primitive-level disagreements collapse into stable capability-level agreement.

Reviewers should use the mapping consistently, but should also record when the mapping itself appears ambiguous or weak.

## How To Complete Review Results

`review-results.md` is prefilled only with:

- packet id
- provider
- prior response path
- repeat response path
- primitive sequences

The reviewer must complete:

- capability-role sequences
- backbone review
- classification
- reasoning
- comparator implication
- notes

## Decision Relevance

This review determines whether ECP-FE-000033 should be created.

If most reviewed cases classify as `stable` or `elaboration_drift`, an automated capability-role comparator may be justified for follow-on work.

If most reviewed cases classify as `role_drift` or `unclear`, automation should not be recommended.
