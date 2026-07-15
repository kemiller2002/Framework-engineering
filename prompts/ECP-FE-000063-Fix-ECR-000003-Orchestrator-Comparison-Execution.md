# ECP-FE-000063

## Fix ECR-000003 Orchestrator Comparison Execution

> This document is intended to be pasted into Codex as a single
> artifact.

## Purpose

Fix the ECR-000003 orchestration pipeline so that it **actually
executes** experiment comparisons instead of only verifying
infrastructure and generating aggregate reports.

Current behavior:

-   Verifies environment
-   Verifies directories
-   Verifies package scripts
-   Calculates dataset completeness
-   Generates EDR placeholders
-   Generates aggregate reports

Missing behavior:

-   Does **not** invoke Comparator v3.1
-   Treats existing directories as evidence of completed datasets
-   May generate reports from stale or nonexistent comparison outputs

## Required Changes

### 1. Execute Comparator Processes

Update `scripts/run-ecr-000003.js` so that:

-   `--compare-all` launches the comparator for every eligible
    experiment.
-   `--experiment EXP-001`
-   `--experiment EXP-002`
-   `--experiment EXP-003`

run only that experiment.

Spawn:

``` text
npm run compare:v3.1
```

inside each experiment directory.

Capture:

-   command
-   working directory
-   stdout
-   stderr
-   exit code
-   timestamps

Fail the experiment on non-zero exit.

------------------------------------------------------------------------

### 2. Verify Actual Response Files

Do **not** treat provider directories as proof that responses exist.

Derive expected responses from packet metadata.

Verify:

-   expected packet count
-   expected providers
-   canonical filenames
-   tolerant parse status
-   malformed responses
-   duplicates
-   missing responses

Status values:

-   READY
-   READY_WITH_WARNINGS
-   BLOCKED

------------------------------------------------------------------------

### 3. Partial Execution

If:

-   EXP-001 ready
-   EXP-002 ready
-   EXP-003 blocked

Run:

-   EXP-001
-   EXP-002

Skip:

-   EXP-003

Overall status:

`PARTIAL_READY_FOR_HUMAN_REVIEW`

Do not block unrelated experiments.

------------------------------------------------------------------------

### 4. Verify Comparator Outputs

After comparison completes verify:

-   run-manifest.json exists
-   comparator version = 3.1.0
-   reports exist
-   output timestamp is current

Reject stale output.

------------------------------------------------------------------------

### 5. Fix EDR Status

Placeholder EDRs must contain:

> PLACEHOLDER: Comparison evidence is incomplete.

Only mark an EDR as evidence-ready when comparator outputs are verified.

------------------------------------------------------------------------

### 6. Improve Logging

Log:

-   comparator command
-   cwd
-   exit code
-   generated reports
-   skipped experiments

------------------------------------------------------------------------

### 7. Tests

Add tests for:

-   comparator invocation
-   missing responses
-   stale output
-   partial execution
-   placeholder EDR behavior
-   dry-run immutability

------------------------------------------------------------------------

### Success Criteria

-   `npm run compare:all` actually executes comparisons.
-   Empty response folders do not count as datasets.
-   EXP-002 can run while EXP-003 is blocked.
-   Aggregate reports are based only on verified outputs.
-   Placeholder EDRs are clearly identified.
-   Final readiness reflects actual evidence state.
