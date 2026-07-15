# Engineering Change Package

**ID:** ECP-FE-000067  
**Title:** Comparator 3.2 Explainability Layer and ECR-000003 Closure  
**Repository:** framework-engineering  
**Category:** Research Instrument Explainability  
**Priority:** Critical

## Purpose

Add an explainability layer to Comparator v3.1 without changing its underlying scientific scoring behavior.

The current comparator successfully distinguishes structural backbone, literal agreement, conceptual agreement, dimensional agreement, primitive roles, transitions, constraints, representation compliance, recognition, and domain leakage. However, many reports still collapse differences into generic labels such as disagreement, partial agreement, mixed, or mostly stable.

Comparator 3.2 should explain:

1. Why two responses differ.
2. Whether the difference is lexical, structural, representational, or semantic.
3. Whether the difference changes the procedural backbone.
4. Whether the difference is likely a style artifact.
5. Whether the difference reflects compression or elaboration.
6. Which differences require human review.
7. Which differences are scientifically meaningful.
8. Which differences should not affect hypothesis interpretation.

This package must preserve Comparator v3.1 as the frozen measurement instrument for ECR-000003.

Comparator 3.2 is an explainability and reporting layer, not a rescoring engine.

## Core Principle

Comparator v3.1 answers:

> Do these outputs agree?

Comparator 3.2 explainability must answer:

> Why do they agree or disagree, and which differences matter?

## Scope

Target shared engine:

    research/tools/comparison-engine/

Target evidence run:

    research/evidence-runs/ECR-000003-representation-sensitivity/

Target completed experiments:

- EXP-001 Topology Perturbation
- EXP-002 Cross-Representation Stability
- EXP-003 Isomorphic Procedures

Comparator v3.1.0 remains frozen and authoritative for official ECR-000003 measurements.

Comparator 3.2 must consume v3.1 outputs and raw normalized records without changing v3.1 classifications.

## Guardrails

Do not:

- change Comparator v3.1 scores,
- change recognition classifications,
- change ontology mappings used for official v3.1 results,
- rewrite raw responses,
- alter packet content,
- alter normalization certificates,
- regenerate model responses,
- update hypotheses automatically,
- claim Framework Engineering is validated,
- claim Clarity or EDF is validated,
- replace human review,
- hide disagreement,
- turn uncertain differences into agreement,
- create false numerical precision,
- overwrite v3.1 outputs.

## Versioning

Create an explainability-layer version:

    3.2.0-explainability

Do not replace Comparator 3.1.0.

Create:

    research/tools/comparison-engine/EXPLAINABILITY_VERSION

Contents:

    3.2.0

Update `CHANGELOG.md` with:

## 3.2.0 Explainability Layer

- added structured difference taxonomy,
- added pairwise difference explanations,
- separated wording variance from structural divergence,
- added compression and elaboration classification,
- added significance classification,
- added human-review prioritization,
- added traceable evidence references,
- preserved Comparator v3.1 scoring and classifications.

## Architecture

Implement the explainability layer as a separate post-processing stage.

Flow:

    Normalized responses
        -> Comparator v3.1
        -> Official v3.1 results
        -> Comparator 3.2 Explainability Layer
        -> Difference explanations
        -> Human review inputs
        -> EDR review

The explainability layer must not mutate official v3.1 result files.

## Create Explainability Modules

Create under:

    research/tools/comparison-engine/src/explainability/

Files:

    index.js
    difference-taxonomy.js
    compare-sequences.js
    compare-transitions.js
    compare-backbones.js
    compare-constraints.js
    compare-representation.js
    compare-recognition.js
    classify-significance.js
    classify-cause.js
    classify-compression.js
    build-evidence-trace.js
    build-review-priority.js
    explain-pairwise.js
    explain-provider-pattern.js
    explain-variant-pattern.js
    report-writer.js
    utilities.js

## Difference Taxonomy

Create:

    research/tools/comparison-engine/docs/difference-taxonomy.md

Define these categories.

### Lexical Differences

- synonym_substitution
- phrase_rewording
- terminology_choice
- label_variation
- domain_vocabulary_substitution

Default significance: low.

### Ordering Differences

- sequence_reordering
- edge_declaration_reordering
- list_order_variation
- narrative_order_variation

Distinguish:

- order_invariant_presentation
- order_changes_execution
- order_unclear

### Granularity Differences

- compressed_steps
- expanded_steps
- merged_steps
- split_steps
- pass_through_expansion
- abstraction_level_shift

### Inclusion Differences

- omitted_step
- inserted_step
- omitted_transition
- inserted_transition
- omitted_condition
- inserted_condition
- omitted_ambiguity
- inserted_ambiguity

### Structural Differences

- branch_added
- branch_removed
- loop_added
- loop_removed
- loop_target_changed
- merge_added
- merge_removed
- termination_added
- termination_removed
- terminal_path_changed
- entry_path_changed
- reachability_changed
- invented_edge
- missing_edge

Default significance: medium to high depending on backbone impact.

### Constraint Differences

- same_constraint_same_field
- same_constraint_different_field
- related_constraint
- contradictory_constraint
- threshold_difference
- stopping_rule_difference
- validity_rule_difference
- precondition_difference
- postcondition_difference

### Recognition Differences

- explicit_recognition
- family_resemblance
- unknown
- not_recognized
- provider_style_difference
- recognition_without_structural_effect
- recognition_with_structural_import
- terminology_leakage_only

### Representation Differences

- ast_present_vs_absent
- schema_completeness_difference
- summary_compression_difference
- prose_style_difference
- ambiguity_reporting_difference
- notes_detail_difference

### Semantic Role Differences

- same_role_different_label
- adjacent_role_substitution
- evaluate_vs_verify
- decide_vs_terminate
- generate_vs_prioritize
- observe_vs_interpret
- true_role_conflict
- unresolved_role_boundary

### Evidence and Confidence Differences

- confidence_label_difference
- support_level_difference
- evidence_source_difference
- unsupported_inference
- explicitly_preserved_ambiguity
- ambiguity_collapsed

## Difference Cause Classification

Create:

    research/tools/comparison-engine/docs/difference-cause-rules.md

Allowed causes:

- lexical_variance
- provider_style
- representation_format
- abstraction_level
- compression
- elaboration
- schema_placement
- domain_semantics
- prior_knowledge_leakage
- structural_inference
- genuine_structural_divergence
- comparator_limit
- packet_ambiguity
- insufficient_information
- unclear

Each difference must include:

- primary cause,
- optional secondary cause,
- rationale,
- evidence references,
- classification confidence.

Confidence values:

- high
- medium
- low

## Scientific Significance Classification

Create:

    research/tools/comparison-engine/docs/difference-significance-rules.md

Allowed significance:

- none
- low
- moderate
- high
- critical
- unclear

Definitions:

- none: formatting or presentation only.
- low: wording, style, or granularity with preserved role and backbone.
- moderate: decomposition, schema placement, or role assignment changes without clear backbone change.
- high: changes branches, loops, entry, exit, reachability, stopping rules, or central roles.
- critical: invalidates direct comparison or reveals an instrument/data defect.
- unclear: insufficient evidence.

## Backbone Impact Classification

Every difference must state:

- none
- elaboration_only
- localized
- material
- unknown

Rules:

- neutral pass-through nodes usually equal elaboration_only,
- node renaming equals none,
- edge declaration order changes equal none,
- loop-target changes are material,
- invented terminal paths are material,
- omitted ambiguity notes equal none,
- omitted required termination equals material.

## Compression and Elaboration Analysis

Create:

    research/tools/comparison-engine/docs/compression-elaboration-rules.md

Classify relationships:

- equivalent_same_granularity
- equivalent_compressed
- equivalent_expanded
- partially_equivalent_compressed
- partially_equivalent_expanded
- incompatible_granularity
- unclear

Do not collapse expanded and compressed forms when the expansion introduces unsupported branches or termination conditions.

## Sequence Difference Analysis

Create `compare-sequences.js`.

For primitive sequences and required steps, calculate:

- exact ordered overlap,
- unordered element overlap,
- longest common subsequence,
- insertions,
- omissions,
- reorderings,
- merge candidates,
- split candidates,
- semantic-role overlap,
- unresolved substitutions.

Scores are diagnostic only.

## Transition Difference Analysis

Create `compare-transitions.js`.

Calculate:

- exact edge overlap,
- normalized edge overlap,
- renamed-node equivalence,
- pass-through compression equivalence,
- inserted edges,
- omitted edges,
- changed loop targets,
- changed terminal edges,
- changed branch reconvergence,
- changed reachability.

Generate explanations such as:

- Edge declaration order differs, but normalized topology is unchanged.
- Response B compresses a pass-through path.
- Response C adds a terminal path unsupported by the packet.

## Constraint Explainability

Create `compare-constraints.js`.

Compare constraints across fields.

Detect:

- same concept, same field,
- same concept, different field,
- related concept,
- contradictory concept,
- missing concept,
- additional inferred concept.

Generate a cross-field concept map.

Do not report same-concept/different-field as full construct disagreement.

## Recognition Explainability

Create `compare-recognition.js`.

For each recognition result, record:

- raw recognized_artifact,
- classification,
- family named,
- specificity,
- confidence language,
- negation language,
- watched terms,
- structural import evidence,
- whether extraction changed with recognition.

Generate distinctions:

- recognition persisted while structure remained stable,
- recognition decayed while structure remained stable,
- recognition changed with structural extraction,
- family resemblance only,
- domain terminology appeared outside recognition field,
- recognition effect unclear.

## Domain Leakage Explainability

Extend leakage reporting to explain:

- where the term appeared,
- whether it influenced structure,
- whether it appeared only in cautionary prose,
- whether it introduced unsupported primitives,
- whether it merely named a familiar family.

Impact values:

- no_observed_structural_import
- possible_structural_import
- likely_structural_import
- confirmed_structural_import
- unclear

Do not infer structural import solely from term presence.

## Pairwise Explanation Records

For every provider pair and variant pair, create a machine-readable record containing:

- comparison ID,
- experiment ID,
- scope,
- left and right response metadata,
- official v3.1 result,
- difference records,
- summary,
- human-review priority.

Each difference record must contain:

- layer,
- field,
- difference type,
- cause,
- secondary cause,
- significance,
- backbone impact,
- left value,
- right value,
- explanation,
- evidence references,
- classification confidence.

## Human Review Priority

Create `build-review-priority.js`.

Allowed values:

- no_review_needed
- low
- medium
- high
- blocking

Rules:

- formatting-only differences: no_review_needed,
- lexical or style variance: low,
- granularity, schema placement, or role-boundary differences: medium,
- branches, loops, stopping conditions, recognition import, or material constraints: high,
- data/comparator defects or incompatible structure: blocking.

## Explainability Outputs

For each experiment, create under:

    comparison/generated-v3.2-explainability/

Required files:

    explainability-run-manifest.json
    difference-summary.md
    pairwise-differences.json
    primitive-difference-explanations.md
    transition-difference-explanations.md
    structural-difference-explanations.md
    constraint-difference-explanations.md
    recognition-difference-explanations.md
    domain-leakage-impact.md
    compression-elaboration-report.md
    human-review-priority.md
    explainability-observation-ledger.md
    edr-explainability-input.md

Do not overwrite v3.1 outputs.

## Experiment-Specific Outputs

### EXP-001

Create:

    topology-perturbation-explainability.md

Explain node-renaming invariance, edge-order invariance, identity-node elaboration, recognition differences, and whether changes were structural or representational.

### EXP-002

Create:

    cross-representation-explainability.md

Explain narrative vs bullets, prose vs graph, graph vs transition table, representation-driven ambiguity, compression, and format sensitivity.

### EXP-003

Create:

    isomorphic-procedure-explainability.md

Explain technical troubleshooting vs logistics routing, logistics routing vs policy review, technical troubleshooting vs policy review, vocabulary effects, preserved backbone, domain-specific elaboration, recognition patterns, and leakage impact.

## EXP-003 Specific Requirements

Use the current v3.1 findings as inputs:

- 9/9 records included,
- structural backbone mostly stable,
- primitive roles full agreement,
- primitive sequence disagreement,
- transition disagreement,
- constraint disagreement,
- GPT persistent recognition,
- Claude gradual decay,
- Gemini persistent recognition,
- five responses with watched terminology,
- three cosmetic tolerant parsing events.

The explainability layer must answer:

1. Which primitive sequence differences are reordering, compression, expansion, or true omission?
2. Which transition differences affect topology?
3. Why did Gemini receive partial rather than full backbone agreement across variants?
4. Which constraint disagreements are field-placement variance?
5. Did watched terminology affect extracted structure?
6. Did recognition vary while backbone remained stable?
7. Which differences should influence H018 review?
8. Which differences are likely stylistic or domain-vocabulary effects?

Do not automatically update H018.

## ECR-000003 Cross-Experiment Explainability Summary

Create:

    research/evidence-runs/ECR-000003-representation-sensitivity/comparison/ECR-000003-explainability-summary.md

Sections:

- Instrument Versions
- EXP-001 Difference Patterns
- EXP-002 Difference Patterns
- EXP-003 Difference Patterns
- Stable Backbone Findings
- Repeated Lexical Variance
- Repeated Compression and Elaboration Patterns
- Repeated Provider-Specific Patterns
- Repeated Constraint Placement Patterns
- Recognition Versus Structural Recovery
- Domain Leakage Impact
- Material Structural Divergences
- Unresolved Instrument Questions
- Human Review Priorities
- What These Explanations Do Not Establish

Explicitly state that explainability does not validate hypotheses, increase agreement, replace v3.1, or remove human review.

## Difference Pattern Registry

Create:

    research/operating-system/difference-pattern-registry.md

Table:

| Pattern ID | Name | Description | First Observed | Experiments | Typical Cause | Backbone Impact | Status |
|---|---|---|---|---|---|---|---|

Seed only supported patterns:

- DPR-001 Lexical Equivalence With Stable Backbone
- DPR-002 Neutral Pass-Through Expansion
- DPR-003 Constraint Concept Moved Across Fields
- DPR-004 Recognition Decay With Stable Extraction
- DPR-005 Provider-Specific Granularity
- DPR-006 Domain Vocabulary Shift With Stable Topology
- DPR-007 Primitive Role Agreement With Sequence Disagreement
- DPR-008 Explicit vs Implicit Loop Representation
- DPR-009 Decide vs Terminate Boundary
- DPR-010 Evaluate vs Verify Boundary

Do not treat patterns as universal laws.

## EDR Integration

For each experiment EDR, add an Explainability Review section containing:

- highest-priority differences,
- low-significance differences,
- material backbone differences,
- unresolved classifications,
- compression/elaboration findings,
- recognition/structure relationship,
- domain leakage impact.

Do not automatically fill hypothesis direction, evidence strength, final decision, explanations weakened, or explanations surviving.

## Review Board Integration

Update EDR and ECR review templates with these questions:

1. Is the disagreement lexical or structural?
2. Does the difference alter the backbone?
3. Is one response compressed or expanded?
4. Did a model add unsupported structure?
5. Did recognition affect extraction?
6. Did domain vocabulary affect the result?
7. Is the difference scientifically relevant?
8. Does it expose a comparator limitation?
9. Should it affect hypothesis review?
10. Is additional evidence required?

## Claims and Hypothesis Guardrail

Explainability outputs may suggest review targets but must not update:

- hypothesis direction,
- evidence strength,
- claims registry status,
- publication readiness.

Generate inputs only.

## Package Scripts

Update comparison-engine package.json:

    "explain": "node src/explainability/index.js"
    "test:explainability": "node --test test/explainability/*.test.js"

Update experiment package.json files:

    "explain:v3.2": "<invoke explainability layer against local v3.1 outputs>"

Update ECR root package.json:

    "explain:all": "<run explainability for EXP-001, EXP-002, EXP-003>"
    "reports:explainability": "<generate cross-experiment explainability summary>"

## CLI Options

Support:

    --experiment EXP-001
    --experiment EXP-002
    --experiment EXP-003
    --all-experiments
    --v3-1-output <path>
    --response-root <path>
    --output-root <path>
    --force
    --review-priority <level>
    --pairwise-only
    --summary-only

Require official v3.1 outputs.

Refuse to run if:

- v3.1 run manifest is missing,
- v3.1 output is incomplete,
- dataset hash differs from the certified dataset,
- comparator version is not 3.1.0,
- response files changed since comparison.

## Explainability Run Manifest

Create per experiment:

    explainability-run-manifest.json

Include:

- explainability version,
- official comparator version,
- source run ID,
- source dataset hash,
- source config hash,
- generated timestamp,
- pairwise comparison count,
- difference count,
- high-priority count,
- blocking count,
- output files.

## Tests

Create under:

    research/tools/comparison-engine/test/explainability/

Required tests:

1. Synonym substitution classification.
2. Phrase rewording classification.
3. Sequence reordering without execution impact.
4. Sequence reordering with execution impact.
5. Compressed-step detection.
6. Expanded-step detection.
7. Neutral pass-through elaboration.
8. Inserted-step detection.
9. Omitted-step detection.
10. Edge-order invariance.
11. Node-renaming invariance.
12. Loop-target change detection.
13. Invented-edge detection.
14. Terminal-path change detection.
15. Same constraint, different field.
16. Contradictory constraint detection.
17. Evaluate vs Verify unresolved boundary.
18. Decide vs Terminate material distinction.
19. Recognition decay with stable backbone.
20. Recognition change with structural import.
21. Leakage term in cautionary prose only.
22. Leakage term with unsupported structural import.
23. Provider-style difference classification.
24. Domain-vocabulary substitution.
25. Human-review priority assignment.
26. Explainability does not mutate v3.1 output.
27. Explainability does not change official classifications.
28. Stale v3.1 input rejection.
29. Dataset-hash mismatch rejection.
30. Pairwise evidence trace completeness.

## Documentation

Create:

    research/tools/comparison-engine/docs/comparator-3.2-explainability.md

Update:

    research/tools/comparison-engine/README.md
    research/evidence-runs/ECR-000003-representation-sensitivity/PIPELINE.md
    research/evidence-runs/ECR-000003-representation-sensitivity/ORCHESTRATION.md
    research/operating-system/research-operating-manual.md
    research/operating-system/research-memory-index.md

Document official scoring versus explanation, difference taxonomy, significance, compression/elaboration, review priority, limitations, commands, and EDR use.

## ECR-000003 Closure

Do not start ECR-000004 in this package.

Create:

    research/evidence-runs/ECR-000003-representation-sensitivity/ECR-000003-CLOSURE-READINESS.md

Include:

- experiment completion,
- official comparator status,
- explainability status,
- EDR status,
- hypothesis review readiness,
- claims review readiness,
- threats review readiness,
- remaining human actions,
- closure status.

Allowed closure statuses:

- NOT_READY
- READY_FOR_EXPERIMENT_REVIEW
- READY_FOR_ECR_REVIEW
- READY_FOR_HYPOTHESIS_REVIEW
- CLOSED

Do not mark CLOSED automatically.

## Recommended Operator Workflow

From the ECR-000003 root:

    npm run explain:all
    npm run reports:explainability

Then review:

    comparison/ECR-000003-explainability-summary.md

Then review experiment EDRs and Review Board records.

## Current State

Update `CURRENT_STATE.md`:

Current Phase:
ECR-000003 Explainability and Evidence Review

Current Instrument:
Comparator v3.1.0 frozen

Current Explainability Layer:
Comparator 3.2.0

Current Goal:
Explain why outputs differ across ECR-000003, identify which differences materially affect procedural structure, and prepare the experiment EDRs for human review.

Immediate Commands:

    cd /Users/kevinmiller/dev/Framework-engineering/research/evidence-runs/ECR-000003-representation-sensitivity
    npm run explain:all
    npm run reports:explainability

## Implementation Report

Create:

    research/evidence-runs/ECR-000003-representation-sensitivity/comparison/comparator-3.2-explainability-implementation-report.md

Include component status, source run IDs, explainability run IDs, difference counts, significance distribution, high-priority review items, tests, limitations, and exact next actions.

## Success Criteria

1. Comparator v3.1 official results remain unchanged.
2. Every major disagreement receives an explanation.
3. Difference types are classified consistently.
4. Lexical variance is separated from structural divergence.
5. Compression and elaboration are identified.
6. Transition differences explain topology impact.
7. Constraint differences explain field-placement variance.
8. Recognition differences are related to structural extraction.
9. Domain leakage reports whether structure was affected.
10. Human-review priority is assigned.
11. Pairwise explanation records are machine-readable.
12. Experiment-specific explainability reports are generated.
13. An ECR-wide explainability summary is generated.
14. EDR review templates consume explainability inputs.
15. Hypotheses and claims remain unchanged automatically.
16. Tests pass.
17. ECR-000003 closure readiness is documented.
18. ECR-000004 is not started automatically.
