# Adversarial Test Results

| Case | Phrase A | Phrase B | Expected | Actual Shared Concepts | Result | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| NV-001 | Stop investigation. | Accept hypothesis. | related_but_distinct | None | expected_pass | Distinct pair did not collapse into a shared concept. |
| NV-002 | Generate alternatives. | Prioritize alternatives. | related_but_distinct | HYPOTHESIS_GENERATION | false_positive_candidate | Distinct pair shares one or more concepts and may be over-merged. |
| NV-003 | Gather evidence. | Evaluate evidence. | related_but_distinct | None | ontology_gap | At least one phrase remained unresolved; safe non-collapse but ontology coverage is incomplete. |
| NV-004 | Compare competing explanations. | Verify a conclusion. | related_but_distinct | None | ontology_gap | At least one phrase remained unresolved; safe non-collapse but ontology coverage is incomplete. |
| NV-005 | Identify the problem. | Solve the problem. | related_but_distinct | None | ontology_gap | At least one phrase remained unresolved; safe non-collapse but ontology coverage is incomplete. |
| NV-006 | Reassess because confidence is insufficient. | Reflect after completion. | related_but_distinct | None | ontology_gap | At least one phrase remained unresolved; safe non-collapse but ontology coverage is incomplete. |
| NV-007 | Coordinate team activity. | Communicate findings. | related_but_distinct | None | ontology_gap | At least one phrase remained unresolved; safe non-collapse but ontology coverage is incomplete. |
| NV-008 | Classify into levels. | Move through procedural steps. | related_but_distinct | None | ontology_gap | At least one phrase remained unresolved; safe non-collapse but ontology coverage is incomplete. |
| NV-009 | Evidence is sufficient. | Further inquiry is not justified. | related_but_distinct | None | ontology_gap | At least one phrase remained unresolved; safe non-collapse but ontology coverage is incomplete. |
| NV-010 | Perform work. | Validate outcome. | related_but_distinct | None | ontology_gap | At least one phrase remained unresolved; safe non-collapse but ontology coverage is incomplete. |
| NV-011 | Unresolved question identified. | Initial uncertainty recognized. | equivalent | ENTRY_PROBLEM_IDENTIFICATION | expected_pass | Equivalent pair shares at least one concept. |
| NV-012 | Candidate explanation proposed. | Possible hypothesis generated. | equivalent | HYPOTHESIS_GENERATION | expected_pass | Equivalent pair shares at least one concept. |
| NV-013 | Additional evidence is gathered. | More information is collected. | equivalent | None | false_negative_candidate | Equivalent pair failed to share a concept. |
| NV-014 | The process repeats when confidence is insufficient. | The cycle continues until support is adequate. | equivalent | CONFIDENCE_THRESHOLD | expected_pass | Equivalent pair shares at least one concept. |
| NV-015 | Tasks are assigned to team members. | Responsibilities are allocated. | equivalent | COORDINATION | expected_pass | Equivalent pair shares at least one concept. |
| NV-016 | Work is delivered as an increment. | A usable result is produced. | equivalent | None | false_negative_candidate | Equivalent pair failed to share a concept. |
| NV-017 | Items are grouped by type. | Items are ranked by importance. | related_but_distinct | None | ontology_gap | At least one phrase remained unresolved; safe non-collapse but ontology coverage is incomplete. |
| NV-018 | A loop continues until confidence is sufficient. | A loop continues forever. | opposite | None | expected_pass | Pair remained separate. |
| NV-019 | A decision is made. | A decision is deferred. | opposite | None | expected_pass | Pair remained separate. |
| NV-020 | The team aligns on next steps. | The artifact is classified into categories. | unrelated | None | expected_pass | Pair remained separate. |
