# Difference Taxonomy

Comparator 3.2 uses a structured taxonomy to explain why two outputs differ without changing Comparator v3.1 classifications.

## Lexical Differences

- `synonym_substitution`
- `phrase_rewording`
- `terminology_choice`
- `label_variation`
- `domain_vocabulary_substitution`

Default significance: low.

## Ordering Differences

- `sequence_reordering`
- `edge_declaration_reordering`
- `list_order_variation`
- `narrative_order_variation`

Comparator 3.2 distinguishes:

- `order_invariant_presentation`
- `order_changes_execution`
- `order_unclear`

## Granularity Differences

- `compressed_steps`
- `expanded_steps`
- `merged_steps`
- `split_steps`
- `pass_through_expansion`
- `abstraction_level_shift`

## Inclusion Differences

- `omitted_step`
- `inserted_step`
- `omitted_transition`
- `inserted_transition`
- `omitted_condition`
- `inserted_condition`
- `omitted_ambiguity`
- `inserted_ambiguity`

## Structural Differences

- `branch_added`
- `branch_removed`
- `loop_added`
- `loop_removed`
- `loop_target_changed`
- `merge_added`
- `merge_removed`
- `termination_added`
- `termination_removed`
- `terminal_path_changed`
- `entry_path_changed`
- `reachability_changed`
- `invented_edge`
- `missing_edge`

Default significance ranges from medium to high depending on backbone impact.

## Constraint Differences

- `same_constraint_same_field`
- `same_constraint_different_field`
- `related_constraint`
- `contradictory_constraint`
- `threshold_difference`
- `stopping_rule_difference`
- `validity_rule_difference`
- `precondition_difference`
- `postcondition_difference`

## Recognition Differences

- `explicit_recognition`
- `family_resemblance`
- `unknown`
- `not_recognized`
- `provider_style_difference`
- `recognition_without_structural_effect`
- `recognition_with_structural_import`
- `terminology_leakage_only`

## Representation Differences

- `ast_present_vs_absent`
- `schema_completeness_difference`
- `summary_compression_difference`
- `prose_style_difference`
- `ambiguity_reporting_difference`
- `notes_detail_difference`

## Semantic Role Differences

- `same_role_different_label`
- `adjacent_role_substitution`
- `evaluate_vs_verify`
- `decide_vs_terminate`
- `generate_vs_prioritize`
- `observe_vs_interpret`
- `true_role_conflict`
- `unresolved_role_boundary`

## Evidence And Confidence Differences

- `confidence_label_difference`
- `support_level_difference`
- `evidence_source_difference`
- `unsupported_inference`
- `explicitly_preserved_ambiguity`
- `ambiguity_collapsed`
