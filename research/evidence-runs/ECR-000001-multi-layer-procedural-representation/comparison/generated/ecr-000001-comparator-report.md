# ECR-000001 Comparator Report

## Executive Summary

- Valid records: 8 of 9.
- Malformed records: 1.
- Missing records: 0.
- Recognition present: 6/8.
- Total extracted ambiguity records: 21.
- Instrument readiness recommendation: Conditionally ready for calibration review, but malformed or repaired JSON remains a tooling threat.
- Calibration evidence is not theory validation, and this comparator does not update hypotheses automatically.

## Packet-Level Comparison

| Packet | Label | Valid Providers | Strongest Agreements | Largest Disagreements |
| --- | --- | --- | --- | --- |
| ECR-000001-P001 | Scientific Method | 2/3 | loopPresenceAgreement, branchPresenceAgreement, preconditionCount, stoppingCriteriaCount, validityConditionCount, proceduralAstPresent, naturalLanguageSummaryPresent, canonicalSummaryPresent | controlFlowShapeAgreement, entryConditionsSimilarity, terminationConditionAgreement, transitionOverlap, dominantPrimitiveAgreement, candidateMissingPrimitives, qualitativeOverlap, ambiguityCount, canonicalSummaryComparison |
| ECR-000001-P002 | Scrum Workflow | 3/3 | loopPresenceAgreement, preconditionCount, stoppingCriteriaCount, proceduralAstPresent, naturalLanguageSummaryPresent, canonicalSummaryPresent | controlFlowShapeAgreement, entryConditionsSimilarity, exitConditionsSimilarity, terminationConditionAgreement, transitionOverlap, dominantPrimitiveAgreement, candidateMissingPrimitives, validityConditionCount, qualitativeOverlap, ambiguityCount, canonicalSummaryComparison |
| ECR-000001-P003 | Bloom Taxonomy | 3/3 | branchPresenceAgreement, preconditionCount, proceduralAstPresent, naturalLanguageSummaryPresent, canonicalSummaryPresent | controlFlowShapeAgreement, entryConditionsSimilarity, exitConditionsSimilarity, terminationConditionAgreement, primitiveSequenceOverlap, transitionOverlap, dominantPrimitiveAgreement, candidateMissingPrimitives, invariantCount, qualitativeOverlap, ambiguityCount, canonicalSummaryComparison |

## Strongest Agreements

- ECR-000001-P001 loopPresenceAgreement: All providers agree on presence or absence.
- ECR-000001-P001 branchPresenceAgreement: All providers agree on presence or absence.
- ECR-000001-P001 preconditionCount: All providers reported the same count.
- ECR-000001-P001 stoppingCriteriaCount: All providers reported the same count.
- ECR-000001-P001 validityConditionCount: All providers reported the same count.
- ECR-000001-P001 proceduralAstPresent: All providers agree on presence or absence.
- ECR-000001-P001 naturalLanguageSummaryPresent: All providers agree on presence or absence.
- ECR-000001-P001 canonicalSummaryPresent: All providers agree on presence or absence.
- ECR-000001-P002 loopPresenceAgreement: All providers agree on presence or absence.
- ECR-000001-P002 preconditionCount: All providers reported the same count.
- ECR-000001-P002 stoppingCriteriaCount: All providers reported the same count.
- ECR-000001-P002 proceduralAstPresent: All providers agree on presence or absence.
- ECR-000001-P002 naturalLanguageSummaryPresent: All providers agree on presence or absence.
- ECR-000001-P002 canonicalSummaryPresent: All providers agree on presence or absence.
- ECR-000001-P003 branchPresenceAgreement: All providers agree on presence or absence.
- ECR-000001-P003 preconditionCount: All providers reported the same count.
- ECR-000001-P003 proceduralAstPresent: All providers agree on presence or absence.
- ECR-000001-P003 naturalLanguageSummaryPresent: All providers agree on presence or absence.
- ECR-000001-P003 canonicalSummaryPresent: All providers agree on presence or absence.

## Largest Disagreements

- ECR-000001-P001 controlFlowShapeAgreement: Values describe materially different content.
- ECR-000001-P001 entryConditionsSimilarity: No normalized overlap detected across populated arrays.
- ECR-000001-P001 terminationConditionAgreement: No normalized overlap detected across populated arrays.
- ECR-000001-P001 transitionOverlap: No normalized overlap detected across populated arrays.
- ECR-000001-P001 dominantPrimitiveAgreement: Values describe materially different content.
- ECR-000001-P001 candidateMissingPrimitives: No normalized overlap detected across populated arrays.
- ECR-000001-P001 qualitativeOverlap: No normalized overlap detected across populated arrays.
- ECR-000001-P001 ambiguityCount: Counts differ materially across providers.
- ECR-000001-P001 canonicalSummaryComparison: Values describe materially different content.
- ECR-000001-P002 controlFlowShapeAgreement: Values describe materially different content.
- ECR-000001-P002 entryConditionsSimilarity: No normalized overlap detected across populated arrays.
- ECR-000001-P002 exitConditionsSimilarity: No normalized overlap detected across populated arrays.
- ECR-000001-P002 terminationConditionAgreement: No normalized overlap detected across populated arrays.
- ECR-000001-P002 transitionOverlap: No normalized overlap detected across populated arrays.
- ECR-000001-P002 dominantPrimitiveAgreement: Values describe materially different content.
- ECR-000001-P002 candidateMissingPrimitives: No normalized overlap detected across populated arrays.
- ECR-000001-P002 validityConditionCount: Counts differ materially across providers.
- ECR-000001-P002 qualitativeOverlap: No normalized overlap detected across populated arrays.
- ECR-000001-P002 ambiguityCount: Counts differ materially across providers.
- ECR-000001-P002 canonicalSummaryComparison: Values describe materially different content.
- ECR-000001-P003 controlFlowShapeAgreement: Values describe materially different content.
- ECR-000001-P003 entryConditionsSimilarity: No normalized overlap detected across populated arrays.
- ECR-000001-P003 exitConditionsSimilarity: No normalized overlap detected across populated arrays.
- ECR-000001-P003 terminationConditionAgreement: No normalized overlap detected across populated arrays.
- ECR-000001-P003 primitiveSequenceOverlap: No normalized overlap detected across populated arrays.
- ECR-000001-P003 transitionOverlap: No normalized overlap detected across populated arrays.
- ECR-000001-P003 dominantPrimitiveAgreement: Values describe materially different content.
- ECR-000001-P003 candidateMissingPrimitives: No normalized overlap detected across populated arrays.
- ECR-000001-P003 invariantCount: Counts differ materially across providers.
- ECR-000001-P003 qualitativeOverlap: No normalized overlap detected across populated arrays.
- ECR-000001-P003 ambiguityCount: Counts differ materially across providers.
- ECR-000001-P003 canonicalSummaryComparison: Values describe materially different content.

## Interpretation Flags

- bloomBias: not flagged; Bloom appears less procedurally rich than Scientific Method in this calibration set.
- scrumDistinct: flagged; Scrum shows a distinct execution-oriented dominant primitive profile relative to Scientific Method.
- productDominance: not flagged; Product relevance observations do not dominate extraction volume.
- representationStability: flagged; Structural layer agreement exceeds primitive layer agreement; representation-stability hypothesis is supported as a review question.
- recognitionThreat: flagged; Recognition is high enough to keep H013 active as a threat.

## Instrument Readiness Recommendation

Conditionally ready for calibration review, but malformed or repaired JSON remains a tooling threat

## Constraint

Do not update hypotheses automatically from this report. Use the generated reviewer-input table instead.
