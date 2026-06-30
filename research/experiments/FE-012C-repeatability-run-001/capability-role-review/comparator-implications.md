# Comparator Implications

## Why Literal Comparison Overstates Disagreement

Literal comparison treats primitive insertion, omission, and local re-expression as structural disagreement even when entry role, exit role, and overall reasoning purpose may remain similar.

This creates a risk of counting representational detail as backbone drift.

## Why Semantic Rewrite Rules Are Insufficient

Local semantic rewrite rules can normalize a small set of recurring patterns, but they do not address broader cases where multiple primitives may serve adjacent capability roles.

They also depend on handcrafted equivalence assumptions that may not generalize across artifacts.

## Why Capability-Role Comparison May Be Appropriate

Capability-role comparison tests whether different primitive expressions still implement the same higher-level reasoning functions.

If many disagreement cases preserve the same role backbone, comparison above the primitive level may better represent procedural agreement.

## Risks Of Introducing Capability-Role Subjectivity

Capability roles are an interpretive abstraction.

Different reviewers may disagree about:

- which role a primitive serves in context
- whether a role is optional or structural
- whether two role paths are materially equivalent

This review exists partly to measure that risk before automation is considered.

## Criteria For Deciding Whether To Automate Capability-Role Comparison

Recommend automation only if manual review shows that most selected cases are better described as `stable` or `elaboration_drift`.

Do not recommend automation if most selected cases are better described as `role_drift` or `unclear`.

Additional safeguards before automation:

- the role mapping is internally coherent
- reviewers can apply it consistently
- disagreement patterns are not dominated by case-specific interpretation
