# Independent Replication Plan

## Purpose

Define replication levels for the major Framework Engineering experiments.

## Replication Levels

- same model, different prompt
- different model family
- human analyst
- domain expert
- blinded independent reviewer

## FE-008 Identity-Capability Classification

- Same model, different prompt:
  Re-run classification with alternative prompt wording and reduced FE terminology.
- Different model family:
  Compare identity-capability outputs across model families.
- Human analyst:
  Use human reviewers with the same KACS and FEMS framing.
- Domain expert:
  Include experts familiar with selected artifacts but not with FE.
- Blinded independent reviewer:
  Review characterization records without seeing the originating method.

## FE-011A Redesign Comparison

- Same model, different prompt:
  Re-run participant and evaluator prompts with tighter wording controls.
- Different model family:
  Separate participant and evaluator model families.
- Human analyst:
  Ask human practitioners to apply original and redesigned packets.
- Domain expert:
  Use domain specialists to judge whether traceability gains are meaningful.
- Blinded independent reviewer:
  Evaluate outputs without provenance and against non-FE structured baselines.

## FE-012A Primitive Extraction

- Same model, different prompt:
  Repeat extraction with altered prompting and no seed-vocabulary priming where possible.
- Different model family:
  Compare extracted primitives and merges across model families.
- Human analyst:
  Use independent human extractors with merge-disagreement logging.
- Domain expert:
  Ask domain experts whether extracted sequences distort artifact meaning.
- Blinded independent reviewer:
  Review normalization decisions and reconstruction outputs without knowing FE expectations.

## FE-012B Primitive Synthesis

- Same model, different prompt:
  Re-run synthesis on the same novelty set with varied prompt controls.
- Different model family:
  Compare synthesis coherence and missing-primitive pressure across models.
- Human analyst:
  Ask human analysts to synthesize from the frozen primitive set only.
- Domain expert:
  Ask domain experts whether synthesized procedures remain coherent under realistic domain pressure.
- Blinded independent reviewer:
  Evaluate synthesized frameworks for coherence, gaps, and genericity without knowing their origin.
