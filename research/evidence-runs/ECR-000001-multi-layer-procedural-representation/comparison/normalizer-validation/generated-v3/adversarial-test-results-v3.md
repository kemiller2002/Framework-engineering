# Adversarial Test Results v3

| Case | Phrase A | Phrase B | Expected | Actual Shared Concepts | Result | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| NV-001 | Stop investigation. | Accept hypothesis. | related_but_distinct | None | ontology_gap | At least one role remained unresolved. |
| NV-002 | Generate alternatives. | Prioritize alternatives. | related_but_distinct | alternative | expected_pass | Pair remained related but distinct. |
| NV-003 | Gather evidence. | Evaluate evidence. | related_but_distinct | evidence, evidence_support | expected_pass | Pair remained related but distinct. |
| NV-004 | Compare competing explanations. | Verify a conclusion. | related_but_distinct | None | expected_pass | Pair remained related but distinct. |
| NV-005 | Identify the problem. | Solve the problem. | related_but_distinct | problem | ontology_gap | At least one role remained unresolved. |
| NV-006 | Reassess because confidence is insufficient. | Reflect after completion. | related_but_distinct | None | expected_pass | Pair remained related but distinct. |
| NV-007 | Coordinate team activity. | Communicate findings. | related_but_distinct | None | expected_pass | Pair remained related but distinct. |
| NV-008 | Classify into levels. | Move through procedural steps. | related_but_distinct | None | ontology_gap | At least one role remained unresolved. |
| NV-009 | Evidence is sufficient. | Further inquiry is not justified. | related_but_distinct | None | ontology_gap | At least one role remained unresolved. |
| NV-010 | Perform work. | Validate outcome. | related_but_distinct | work, outcome | expected_pass | Pair remained related but distinct. |
| NV-011 | Unresolved question identified. | Initial uncertainty recognized. | equivalent | question, uncertainty | false_negative_candidate | Equivalent pair failed dimensional equivalence. |
| NV-012 | Candidate explanation proposed. | Possible hypothesis generated. | equivalent | generate, explanation, hypothesis, exploration | expected_pass | Equivalent pair stayed aligned dimensionally. |
| NV-013 | Additional evidence is gathered. | More information is collected. | equivalent | observe, evidence, information, evidence_support | expected_pass | Equivalent pair stayed aligned dimensionally. |
| NV-014 | The process repeats when confidence is insufficient. | The cycle continues until support is adequate. | equivalent | reassess, confidence_building | expected_pass | Equivalent pair stayed aligned dimensionally. |
| NV-015 | Tasks are assigned to team members. | Responsibilities are allocated. | equivalent | allocate, coordination | expected_pass | Equivalent pair stayed aligned dimensionally. |
| NV-016 | Work is delivered as an increment. | A usable result is produced. | equivalent | act, outcome, execution | expected_pass | Equivalent pair stayed aligned dimensionally. |
| NV-017 | Items are grouped by type. | Items are ranked by importance. | related_but_distinct | None | expected_pass | Pair remained related but distinct. |
| NV-018 | A loop continues until confidence is sufficient. | A loop continues forever. | opposite | reassess | expected_pass | Opposite pair remained distinct or contradictory. |
| NV-019 | A decision is made. | A decision is deferred. | opposite | decision | expected_pass | Opposite pair remained distinct or contradictory. |
| NV-020 | The team aligns on next steps. | The artifact is classified into categories. | unrelated | None | expected_pass | Unrelated pair remained distinct. |
