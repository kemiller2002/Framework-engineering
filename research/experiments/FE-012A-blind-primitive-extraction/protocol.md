# FE-012A Protocol

## Phase 1. Artifact Selection

- Use 20 artifacts from diverse domains.
- Exclude Clarity and EDF from the extraction set.
- Preserve the candidate list unless there is a documented reason to substitute an artifact.

## Phase 2. Blinding

Remove or mask:

- artifact name
- domain-specific labels where practical
- author
- historical origin
- popularity
- implementation examples

Keep:

- procedural flow
- reasoning steps
- decision structure
- evaluation criteria

Document the blinding level and what was removed for each artifact.

## Phase 3. Verb Extraction

Extractor records:

- raw verb phrase
- surrounding context
- inferred reasoning operation
- confidence
- notes

Extraction should focus on reasoning verbs and operations rather than nouns, topic labels, or diagram structure.

## Phase 4. Primitive Normalization

- Normalize cautiously.
- Merge only when the reasoning function appears equivalent.
- Preserve disagreements rather than forcing early convergence.
- Document every synonym merge and every uncertain candidate primitive.

## Phase 5. Vocabulary Tracking

- Track vocabulary growth after each artifact.
- Record new raw verbs, new normalized primitives, and new candidate primitives.
- Watch for stabilization rather than assuming it.

## Phase 6. Reconstruction

- Select extracted primitive sequences from blinded artifacts.
- Remove artifact names and domain cues.
- Give only the primitive sequence to a reconstruction analyst.
- Ask the analyst to reconstruct the reasoning flow in plain language.
- Compare the reconstruction to the original artifact structure.

## Phase 7. Holdout Testing

- Freeze the initial primitive vocabulary before holdout testing.
- Do not test Clarity or EDF until the vocabulary is frozen.
- Use holdout testing to see whether the frozen primitive set transfers without modification.

## Phase 8. Analysis

- Review primitive frequency.
- Review vocabulary stabilization.
- Review extractor agreement.
- Review reconstruction success and failure patterns.
- Review ambiguity and disputed merges.

## Execution Notes

- Treat failure as useful evidence.
- Do not claim the primitive vocabulary is complete.
- Do not derive primitives from Framework Engineering terminology.
