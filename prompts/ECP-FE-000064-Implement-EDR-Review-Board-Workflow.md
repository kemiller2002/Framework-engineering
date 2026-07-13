# Engineering Change Package

**ID:** ECP-FE-000064

**Title:** Implement EDR Review Board Workflow

**Priority:** Critical

## Purpose

Implement a formal review process for Evidence Decision Records (EDRs).

The goal is to ensure every experiment follows the same evidence
lifecycle:

Raw Responses → Comparator v3.1 → Experiment EDR Draft → Human Review
Board → Accepted EDR → ECR Summary → Hypothesis Evidence Matrix

The review board must distinguish direct observations from
interpretations and preserve scientific traceability.

------------------------------------------------------------------------

# Scope

Applies to:

-   EDR-ECR-000003-EXP001
-   EDR-ECR-000003-EXP002
-   EDR-ECR-000003-EXP003
-   EDR-ECR-000003-SUMMARY

Do not modify Comparator v3.1.

Do not modify raw responses.

Do not update hypotheses automatically.

------------------------------------------------------------------------

# Create Review Templates

Create directory:

research/operating-system/review-board/

Files:

-   EDR-REVIEW-TEMPLATE.md
-   ECR-REVIEW-TEMPLATE.md
-   REVIEW-STATUS.md
-   REVIEW-CHECKLIST.md

------------------------------------------------------------------------

# Experiment Review Template

Every experiment review must include:

## Dataset Integrity

-   Expected responses
-   Present responses
-   Missing responses
-   Malformed responses
-   Comparator version
-   Run ID

## Direct Observations

List only observations directly supported by comparator outputs.

No interpretation.

## Instrument Limitations

Document:

-   parsing issues
-   comparator limitations
-   dataset weaknesses
-   provider-specific concerns

## Interpretation

Separate section.

Explicitly distinguish:

-   Supported by evidence
-   Reviewer inference

## Hypothesis Impact

For every hypothesis referenced include:

-   Supporting observations
-   Challenging observations
-   Unknowns

Do not assign confidence automatically.

## Recommended Follow-up

Document one of:

-   additional experiment needed
-   replication recommended
-   no further work
-   insufficient evidence

## Review Outcome

Allowed values:

-   Accepted
-   Accepted with Notes
-   Needs Revision
-   Deferred

------------------------------------------------------------------------

# ECR Review Template

The ECR summary review combines accepted experiment EDRs.

It must answer:

-   What observations survived review?
-   Which observations were rejected?
-   Which hypotheses gained evidence?
-   Which hypotheses lost evidence?
-   Which observations remain inconclusive?
-   What experiment should come next?
-   What claims are now supportable?
-   What claims remain unsupported?

------------------------------------------------------------------------

# Review Status Index

Create:

review-board/REVIEW-STATUS.md

Track:

  Artifact   Draft   Reviewed   Accepted   Reviewer   Date
  ---------- ------- ---------- ---------- ---------- ------

------------------------------------------------------------------------

# Review Checklist

Confirm:

-   Raw responses preserved
-   Comparator version verified
-   Dataset completeness verified
-   Direct observations evidence-backed
-   Interpretation separated from observation
-   Hypothesis updates justified
-   Remaining uncertainty documented
-   Follow-up experiments identified

------------------------------------------------------------------------

# Dashboard Integration

Update the Human Review Dashboard.

Replace generic "Review EDR" with status values:

-   Draft
-   Under Review
-   Accepted
-   Deferred

Include links to:

-   Experiment review
-   ECR review
-   Hypothesis inputs

------------------------------------------------------------------------

# Pipeline Support

When an experiment comparison finishes automatically create:

-   review-board/EXP001-review.md
-   review-board/EXP002-review.md
-   review-board/EXP003-review.md

Prefill:

-   metadata
-   dataset integrity
-   comparator information
-   direct observations
-   instrument limitations

Leave blank:

-   interpretation
-   hypothesis impact
-   review outcome

------------------------------------------------------------------------

# Success Criteria

The workflow is complete when:

1.  Every experiment produces a review document.
2.  Observations and interpretations are clearly separated.
3.  Accepted EDRs are explicitly tracked.
4.  The ECR summary is based only on accepted experiment reviews.
5.  Hypothesis updates occur only after review.
6.  The dashboard shows review progress.
7.  The research process is fully auditable from raw response to
    accepted evidence.
