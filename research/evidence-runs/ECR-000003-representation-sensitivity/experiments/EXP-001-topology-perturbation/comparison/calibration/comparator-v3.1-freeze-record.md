# Comparator v3.1 Freeze Record

Comparator Version:
3.1.0

Freeze Scope:
ECR-000003

Effective Date:
2026-07-10

Frozen Components:

- recognition classification rules 1.1
- structural stability rules 1.1
- primitive reporting rules
- constraint reporting rules 1.1
- representation reporting rules 1.1
- ontology version currently recorded by v3.1
- output consistency contract
- tolerant parsing rules

Allowed Changes During Freeze:

- critical defect correction
- raw-data safety correction
- output corruption correction
- adapter-only correction that does not alter scoring

Disallowed Changes During Freeze:

- threshold tuning
- ontology expansion for better agreement
- recognition-rule changes
- new scoring fields
- changed agreement categories
- retrospective changes intended to improve experimental results

Emergency Change Rule:

Any allowed correction requires:

1. documented blocking defect,
2. new patch version,
3. regression rerun,
4. impact report,
5. explicit approval.

Freeze Status:
ACTIVE

