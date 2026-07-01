# Expected Normalization Results

For every adversarial case, use these fields:
- expected same concept? yes/no
- allowed phrase_a concepts
- allowed phrase_b concepts
- forbidden shared concepts
- notes

## Cases

Case 1:
expected same concept? no
allowed phrase_a concepts: TERMINATION_OR_CLOSURE
allowed phrase_b concepts: COMMITMENT_DECISION
forbidden shared concepts: TERMINATION_OR_CLOSURE, COMMITMENT_DECISION
notes: adjacent concepts must not collapse.

Case 2:
expected same concept? no
allowed phrase_a concepts: HYPOTHESIS_GENERATION
allowed phrase_b concepts: none currently safe; unresolved acceptable
forbidden shared concepts: HYPOTHESIS_GENERATION
notes: generation differs from ordering.

Case 3:
expected same concept? no
allowed phrase_a concepts: INFORMATION_GATHERING
allowed phrase_b concepts: EVIDENCE_EVALUATION
forbidden shared concepts: INFORMATION_GATHERING, EVIDENCE_EVALUATION
notes: acquisition differs from judgment.

Case 4:
expected same concept? no
allowed phrase_a concepts: COMPARISON
allowed phrase_b concepts: unresolved acceptable
forbidden shared concepts: COMPARISON, EVIDENCE_EVALUATION
notes: verification should not collapse into comparison by default.

Case 5:
expected same concept? no
allowed phrase_a concepts: ENTRY_PROBLEM_IDENTIFICATION
allowed phrase_b concepts: unresolved acceptable
forbidden shared concepts: ENTRY_PROBLEM_IDENTIFICATION
notes: entry identification is upstream from solving.

Case 6:
expected same concept? no
allowed phrase_a concepts: REASSESSMENT_LOOP, CONFIDENCE_THRESHOLD
allowed phrase_b concepts: unresolved acceptable
forbidden shared concepts: REASSESSMENT_LOOP
notes: reflection after completion should remain distinct.

Case 7:
expected same concept? no
allowed phrase_a concepts: COORDINATION
allowed phrase_b concepts: unresolved acceptable
forbidden shared concepts: COORDINATION
notes: communication is not automatically coordination.

Case 8:
expected same concept? no
allowed phrase_a concepts: HIERARCHICAL_CLASSIFICATION
allowed phrase_b concepts: unresolved acceptable
forbidden shared concepts: HIERARCHICAL_CLASSIFICATION
notes: hierarchy is not a generic procedure marker.

Case 9:
expected same concept? no
allowed phrase_a concepts: CONFIDENCE_THRESHOLD
allowed phrase_b concepts: TERMINATION_OR_CLOSURE
forbidden shared concepts: CONFIDENCE_THRESHOLD, TERMINATION_OR_CLOSURE
notes: evidential closure differs from pragmatic stopping.

Case 10:
expected same concept? no
allowed phrase_a concepts: EXECUTION_CYCLE
allowed phrase_b concepts: unresolved acceptable
forbidden shared concepts: EXECUTION_CYCLE
notes: execution differs from validation.

Case 11:
expected same concept? yes
allowed phrase_a concepts: ENTRY_PROBLEM_IDENTIFICATION
allowed phrase_b concepts: ENTRY_PROBLEM_IDENTIFICATION
forbidden shared concepts: none
notes: equivalent entry-state phrases should converge.

Case 12:
expected same concept? yes
allowed phrase_a concepts: HYPOTHESIS_GENERATION
allowed phrase_b concepts: HYPOTHESIS_GENERATION
forbidden shared concepts: none
notes: explanatory candidate generation should converge.

Case 13:
expected same concept? yes
allowed phrase_a concepts: INFORMATION_GATHERING
allowed phrase_b concepts: INFORMATION_GATHERING
forbidden shared concepts: none
notes: acquisition wording variation should converge.

Case 14:
expected same concept? yes
allowed phrase_a concepts: REASSESSMENT_LOOP, CONFIDENCE_THRESHOLD
allowed phrase_b concepts: REASSESSMENT_LOOP, CONFIDENCE_THRESHOLD
forbidden shared concepts: none
notes: loop continuation phrasing should converge.

Case 15:
expected same concept? yes
allowed phrase_a concepts: COORDINATION
allowed phrase_b concepts: COORDINATION
forbidden shared concepts: none
notes: allocation language should converge.

Case 16:
expected same concept? yes
allowed phrase_a concepts: EXECUTION_CYCLE
allowed phrase_b concepts: EXECUTION_CYCLE
forbidden shared concepts: none
notes: delivery / usable-result wording should converge.

Case 17:
expected same concept? no
allowed phrase_a concepts: HIERARCHICAL_CLASSIFICATION
allowed phrase_b concepts: unresolved acceptable
forbidden shared concepts: HIERARCHICAL_CLASSIFICATION
notes: grouping differs from prioritization.

Case 18:
expected same concept? no
allowed phrase_a concepts: REASSESSMENT_LOOP, CONFIDENCE_THRESHOLD
allowed phrase_b concepts: REASSESSMENT_LOOP
forbidden shared concepts: REASSESSMENT_LOOP
notes: indefinite looping should not collapse into threshold-controlled looping.

Case 19:
expected same concept? no
allowed phrase_a concepts: COMMITMENT_DECISION
allowed phrase_b concepts: unresolved acceptable
forbidden shared concepts: COMMITMENT_DECISION
notes: decision and deferral should remain distinct.

Case 20:
expected same concept? no
allowed phrase_a concepts: COORDINATION
allowed phrase_b concepts: HIERARCHICAL_CLASSIFICATION
forbidden shared concepts: COORDINATION, HIERARCHICAL_CLASSIFICATION
notes: unrelated functions should not merge.
