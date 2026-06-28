# Reference Corpus

Status: Working draft

The Reference Corpus is the primary structured evidence base for Framework Engineering research.

It stores characterized knowledge artifacts using FEMS-1.

The corpus is artifact-first.

Each artifact has its own folder.

CSV files are generated indexes and summaries, not the source of truth.

Canonical artifact data lives in:

`research/corpus/artifacts/<artifact_id>/`

Each artifact folder may contain:

- README.md
- kacs-v1.yaml
- evidence.md
- notes.md
- characterization-history.md

Schema note:
`secondary_artifact_types` has been replaced by `capabilities` in the FE-008 identity-capability update. Historical references to the older field name should be treated as legacy vocabulary.

Blind-review note:
Validation corpora now record `identity`, `capabilities`, `framework_grammar`, and `primitive_composition` separately so agreement can be measured independently for each dimension.

Measurement note:
FEMS-1 is the active instrument for FE-008 and future related corpus work. Schema changes should be versioned rather than silently reinterpreted.

Rules:

- Do not overwrite prior KACS versions.
- Create `kacs-v2.yaml` when characterization materially changes.
- Record why changes occurred in `characterization-history.md`.
- Maintain evidence profiles for identity, capabilities, composition, and lifecycle.
- Every artifact must identify the measurement standard used.
- Every artifact must include review metadata.
