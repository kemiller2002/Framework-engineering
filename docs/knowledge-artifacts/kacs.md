# Knowledge Artifact Characterization Sheet (KACS)

Status: Working draft

## Purpose

KACS is the characterization record used before artifact classification.

Characterize first, classify second.

KACS is intended to reduce premature labeling by recording observable artifact properties before reviewers assign identity and capabilities.

All classifications remain provisional.

Use categorical confidence only.

FEMS-1 is the active measurement instrument for this record.

## KACS Fields

| Field | Purpose |
| --- | --- |
| artifact.id | Stable artifact identifier |
| artifact.name | Preferred artifact name |
| artifact.common_aliases | Common alternative names |
| artifact.domain | Domain context for the artifact |
| artifact.lifecycle | Lifecycle status using allowed values |
| review.analyst | Primary analyst |
| review.date | Characterization date |
| review.measurement_standard | Measurement instrument used |
| review.status | Review status using allowed values |
| review.reviewer | Reviewer name when available |
| review.review_notes | Review notes and disagreements |
| identity.value | Identity by dominant purpose |
| identity.evidence | Evidence supporting identity |
| identity.alternatives_considered | Alternatives considered and rejected |
| identity.confidence | Categorical confidence |
| identity.notes | Identity-specific ambiguity notes |
| capabilities.values | Zero or more reusable functions the artifact can perform |
| capabilities.evidence | Evidence supporting capability selection |
| capabilities.confidence | Categorical confidence |
| capabilities.notes | Capability-specific notes |
| composition.framework_grammar.primary | Primary framework grammar only when framework characteristics are present |
| composition.framework_grammar.supporting | Supporting framework grammar only when present |
| composition.primitive_composition | Primitive composition only when reasoning structure exists |
| composition.evidence | Evidence supporting composition |
| composition.confidence | Categorical confidence |
| composition.notes | Composition notes |
| domain.primary | Primary domain |
| domain.secondary | Secondary domains |
| classification_notes | Cross-cutting ambiguity and rationale |

## Allowed Values

Lifecycle values:

- `established`
- `emerging`
- `historical`
- `deprecated`
- `unknown`

Review statuses:

- `draft`
- `reviewed`
- `disputed`
- `superseded`

Confidence values:

- `low`
- `medium`
- `high`
- `mixed`
- `unknown`

## Rules

- Characterization precedes classification.
- Identity should contain exactly one value.
- Identity and capabilities should be recorded separately.
- Framework grammar should be recorded only when framework characteristics are present.
- Primitive composition should be recorded only when a reasoning structure exists.
- Uncertainty should be preserved explicitly in notes.
- Numeric scores should not be used.

## Minimal Template

```text
artifact:
  id:
  name:
  common_aliases:
  domain:
  lifecycle:

review:
  analyst:
  date:
  measurement_standard:
  status:
  reviewer:
  review_notes:

identity:
  value:
  evidence:
  alternatives_considered:
  confidence:
  notes:

capabilities:
  values:
  evidence:
  confidence:
  notes:

composition:
  framework_grammar:
    primary:
    supporting:
  primitive_composition:
  evidence:
  confidence:
  notes:

domain:
  primary:
  secondary:

classification_notes:
```
