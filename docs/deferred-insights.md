# Deferred Insights

Status: Working draft

Purpose: Track deferred research questions, predictions, and findings that are not yet accepted as formal Framework Engineering doctrine.

## Research Questions

### FE-002

Title: Framework Archetype Hypothesis

Hypothesis:
Many frameworks that appear unrelated are domain-specific implementations of a smaller number of fundamental framework grammars.

Status:
Under investigation.

### FE-007

Title: Knowledge Artifact Taxonomy

Hypothesis:
Framework Engineering requires a broader taxonomy of knowledge artifacts so that frameworks are not confused with models, notations, standards, methodologies, tools, or taxonomies.

Status:
Under investigation.

### FE-008

Title: Knowledge Artifact Boundary Study

Hypothesis:
Framework Engineering can classify ambiguous knowledge artifacts more reliably if artifacts are first characterized through operational fields and only then provisionally classified.

Status:
Under investigation.

### FE-008A

Title: Identity-Capability Principle

Hypothesis:
A knowledge artifact's identity is determined by its dominant purpose, while its capabilities describe the functions it can perform. Separating identity from capabilities should improve classification consistency and reduce reviewer disagreement.

Status:
Under investigation.

### RQ-010

Title: Calibration Integrity

Observation:
ARC-001, ARC-004, and ARC-005 suggest that Framework Engineering can be evaluated by whether confidence, complexity, and conclusions remain proportional to available evidence and problem complexity.

Potential Implication:
Calibration Integrity may become a formal Framework Engineering metric.

Subdimensions:

- Confidence Calibration
- Complexity Calibration
- Conclusion Calibration

Status:
Deferred / under investigation.

## Predictions

### P-FE-004

Title: Calibrated Confidence

Prediction:
The greatest strength of Framework Engineering will not be producing better answers. It will be producing better calibrated confidence.

Status:
Prediction / under investigation.

### P-FE-005

Title: Uncertainty Behavior

Prediction:
The maturity of a framework will ultimately be measured less by the number of correct answers it produces than by the quality of its behavior when the answer is uncertain.

Status:
Prediction / under investigation.

## Insights

### DI-FE-004

Title: Appropriate Precision

Observation:
Framework evaluations risk implying more precision than the evidence supports when qualitative judgments are converted into numeric scores.

Potential Implication:
Framework Engineering should prefer evidence profiles, categorical assessments, and explicit rationale over single aggregate scores unless the numbers are meaningful and reproducible.

Status:
Accepted as constitutional principle.

### DI-FE-005

Title: Evidence Profiles Over Aggregate Scores

Observation:
A single aggregate score can hide severe weakness in one dimension by averaging it with strength in another.

Potential Implication:
Framework validation should report multidimensional profiles as the primary evaluation artifact.

Status:
Under development.

### DI-FE-006

Title: Framework Canonical Model Standard

Observation:
EDF representation discussions revealed that YAML is useful but should not become the framework. Frameworks need implementation-independent canonical information models.

Potential Implication:
Framework Engineering should require every framework to separate grammar, canonical information model, serialization, representation, and tooling.

Status:
Accepted as architecture standard.

### DI-FE-007

Title: Existing Ecosystems First

Observation:
Adoption improves when frameworks reuse familiar formats and mental models rather than inventing unnecessary notation or syntax.

Potential Implication:
Future framework representations should reuse existing ecosystems wherever possible.

Status:
Under development.

### DI-FE-008

Title: Framework Validation Standard

Observation:
Framework Engineering needs a reusable quality-assurance pipeline for deciding when frameworks are ready for release candidate status.

Potential Implication:
FVS can become the standard release-readiness process for EDF, Clarity, Execution, and future frameworks.

Status:
Accepted as Framework Engineering artifact.

### DI-FE-009

Title: Independent Validation as Release Gate

Observation:
A framework is not sufficiently validated merely because its creators can use it successfully.

Potential Implication:
Independent practitioner validation should become a major release-readiness criterion.

Status:
Under development.

### DI-FE-010

Title: Primary Question as Archetype Signal

Observation:
Initial census work suggests that a framework's primary question may be more useful for taxonomy than its domain or terminology.

Potential Implication:
Framework Taxonomy may classify frameworks by grammar and question rather than industry category.

Status:
Under investigation.

### DI-FE-012

Title: Framework Boundary Test

Observation:
Predictive framework analysis revealed that many artifacts commonly called frameworks may actually be notations, models, standards, reference architectures, or tools.

Potential Implication:
Framework Engineering needs operational criteria for determining when its methods apply.

Status:
Under development.

### DI-FE-013

Title: Knowledge Promotion

Observation:
Framework Engineering needs a clear distinction between accepted foundation, active research, and practical applications.

Potential Implication:
Repository structure and research governance should reflect epistemic status so that provisional ideas are not confused with accepted principles.

Status:
Accepted as constitutional principle.

### DI-FE-014

Title: Artifact-First Reference Corpus

Observation:
CSV-only corpus structure risks losing evidence context and version history.

Potential Implication:
Each artifact should have its own folder with KACS, evidence, notes, and characterization history. CSVs should act as generated indexes rather than sources of truth.

Status:
Accepted as corpus architecture.

### DI-FE-015

Title: Batch Findings Reports

Observation:
Corpus development should evaluate both artifacts and the measurement instrument.

Potential Implication:
Every 10 artifacts should produce a Batch Findings Report to identify ambiguity, vocabulary issues, and potential FEMS refinements.

Status:
Accepted as research process.

### DI-FE-016

Title: LLM Blind Pilot Before Human Study

Observation:
Before recruiting human participants, an LLM blind pilot can expose flaws in scenarios, prompts, rubrics, and redesign packets.

Potential Implication:
Human studies should be deferred until the experimental instrument survives low-cost pilot testing.

Status:
Accepted as research process.

### DI-FE-017

Title: Characterize First, Classify Second

Observation:
Boundary disputes often arise because artifacts are labeled before their observable properties are recorded.

Potential Implication:
Framework Engineering may need a standard characterization sheet, blind review protocol, and multidimensional classification process before assigning artifact types.

Status:
Under development.

### DI-FE-023

Title: Recognition as Experimental Variable

Observation:
Recognition bias should be varied intentionally rather than treated only as a defect.

Potential Implication:
Canonical, paraphrased, and structural packet variants can help distinguish recognition-driven reconstruction from procedural extraction.

Status:
Accepted for ECR-000002.

### DI-FE-024

Title: Structural Recognition

Observation:
P001C structural paraphrase still triggered recognition across models, suggesting that recognition may occur from control-flow topology rather than canonical terminology alone.

Potential Implication:
Recognition bias should be treated as both lexical and structural.

Status:
Active test planned through P001D graph-only packet.

### DI-FE-025

Title: Procedural Fingerprints

Observation:
Graph-only representation reduced recognition for some models but not all, suggesting procedural topology may carry recognizable signatures.

Potential Implication:
Certain procedures may have control-flow fingerprints that survive abstraction and paraphrase.

Status:
Active test planned through ECR-000003.

### DI-FE-018

Title: General Reasoning Grammar

Observation:
FE-011A redesign outputs repeatedly improved reasoning by separating observations, interpretations, uncertainty, verification, and reassessment.

Potential Implication:
Clarity and EDF may be reference implementations of a broader reasoning grammar rather than isolated frameworks.

Status:
Under Investigation.

### DI-FE-019

Title: Reasoning Grammar and Coordination Grammar May Diverge

Observation:
FE-012A and FE-012B together suggest that reasoning-heavy artifacts compress more cleanly into the current primitive vocabulary than coordination-heavy problems.

Potential Implication:
Framework Engineering may need separate but related grammars for procedural reasoning and execution or coordination.

Status:
Under Investigation.

### DI-FE-020

Title: Framework Engineering Is Stronger At Characterization Than Generation

Observation:
Current evidence is stronger for characterizing artifacts and improving traceability than for generating distinctive new frameworks.

Potential Implication:
Framework Engineering may mature first as a characterization and redesign methodology before it matures as a full engineering discipline.

Status:
Under Investigation.

### DI-FE-021

Title: Validation Before Expansion

Observation:
Theory integration and traceability work make the research program coherent enough to justify adversarial validation, but not strong enough to justify broader theoretical expansion.

Potential Implication:
Framework Engineering should attack its current claims through competing explanations and replication before creating larger theory structures.

Status:
Accepted as research process.

### DI-FE-022

Title: Primitive Grammar Agreement

Observation:
FE-012C produced strong agreement across GPT-5, Claude, and Gemini on entry primitive, reasoning shape, transition structure, and dominant primitive for many packets.

Potential Implication:
Primitive grammar extraction may be more reproducible than expected under a shared packet instrument, but improved blinding and human validation are still required.

Status:
Under Investigation.

### DI-FE-023

Title: Procedural Frameworks as Language Artifacts

Observation:
FE-012C suggests that procedural frameworks may be better compared through grammar, control flow, constraints, and canonical structure than through literal primitive sequences.

Potential Implication:
Frameworks may be analyzable as natural-language procedural programs with AST-like structures.

Status:
Under Investigation.

### DI-FE-024

Title: Research Operating System

Observation:
One-off experiments make it harder to update confidence coherently across related hypotheses and measurement layers.

Potential Implication:
Framework Engineering research may need bundled Evidence Collection Runs, a hypothesis registry, kill conditions, and a common measurement schema to accumulate evidence without inflating theory.

Status:
Under Investigation.

### DI-FE-025

Title: Research Dependency Graph

Observation:
As hypotheses accumulate, downstream claims can appear stronger than their upstream dependencies justify.

Potential Implication:
Framework Engineering may need explicit dependency tracking so weakened instrument, convergence, or bias assumptions automatically trigger review of downstream claims.

Status:
Under Investigation.

### DI-FE-026

Title: Clarity as Belief Management

Observation:
Research practice revealed a recurring pattern: hypotheses behave like managed beliefs with evidence, confidence, assumptions, competing explanations, kill conditions, and next experiments.

Potential Implication:
Clarity may be best understood as a belief-management system rather than a note-taking, decision-support, or generic knowledge-management tool.

Status:
Accepted as product architecture hypothesis.

### DI-FE-027

Title: Evidence Decision Records

Observation:
Evidence runs produce observations and measurements, but the research program still needs a reusable decision artifact that records what the evidence warrants next.

Potential Implication:
Framework Engineering may need Evidence Decision Records and a research queue so confidence review and next-experiment selection are separated from raw run output.

Status:
Accepted as research operating system component.
