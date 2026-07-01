# Next Action Recommendation

Allowed actions:
- proceed_to_limited_hypothesis_review
- sample_unresolved_items_first
- revise_ontology_before_review
- rerun_calibration
- pause_for_manual_review

Decision rules:
- If v3 validation is `safe_for_limited_calibration_use` and false positives are zero, prefer `proceed_to_limited_hypothesis_review`.
- If unresolved items remain very high, record that unresolved sampling should happen before ECR-000002 even if limited review proceeds.
- If malformed input or unresolved ontology issues dominate, prefer refinement or manual review.
