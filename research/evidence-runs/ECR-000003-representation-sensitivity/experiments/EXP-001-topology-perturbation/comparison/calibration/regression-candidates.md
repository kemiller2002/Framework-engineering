# Regression Candidates

## RC-001 False Recognition Guard

Purpose:

- Prevent broad-family resemblance from being upgraded to `recognized`.

Input:

- `recognized_artifact`: "No confident recognition ... resembles a generic iterative candidate-discrimination loop ... no specific named artifact is identified."

Expected behavior:

- classify as `partial`, not `recognized`

Reason:

- This is the clearest current false-recognition risk.

## RC-002 Unrecognized Boundary

Purpose:

- Freeze handling of `unrecognized`.

Input:

- `recognized_artifact`: `unrecognized`

Expected behavior:

- classify consistently according to the finalized rule text

Reason:

- Current behavior is defensible but under-specified.

## RC-003 Empty Recognition Field

Purpose:

- Ensure empty recognition remains `not_recognized`.

Input:

- `recognized_artifact`: `""`

Expected behavior:

- `not_recognized`

Reason:

- This is a stable behavior that should not regress.

## RC-004 Pre-Fix P001D Exclusion

Purpose:

- Preserve packet-version hygiene.

Input:

- response from `responses/pre-fix/p001d/00001D.json`

Expected behavior:

- exclude from primary comparison

Reason:

- Prevent packet-version contamination from re-entering the dataset.

## RC-005 Malformed Canonical Response Handling

Purpose:

- Ensure malformed canonical files are surfaced explicitly.

Input:

- malformed JSON response file in canonical provider directory

Expected behavior:

- record malformed status
- do not silently include in primary comparison

Reason:

- Current audit depends on this behavior being stable.

## RC-006 Machine Output / Human Output Consistency

Purpose:

- Prevent stale machine-readable output from disagreeing with current markdown reports.

Input:

- one run producing both `raw-comparison-data.json` and summary reports

Expected behavior:

- primary record count and data-quality counts agree across outputs

Reason:

- Current comparator state fails this consistency check.

## RC-007 Structural Backbone Stability

Purpose:

- Ensure topology-preserving variants are not globally labeled unstable solely because of paraphrase differences.

Input:

- same graph topology expressed through baseline, renumbered, shuffled-edge-order, and identity-expanded variants

Expected behavior:

- backbone/topology result remains stable or mostly stable
- literal disagreement may remain visible

Reason:

- This is the core construct under test in EXP-001.

## RC-008 Constraint Field Placement Sensitivity

Purpose:

- Measure whether semantically similar constraints moved across fields cause false disagreement.

Input:

- one response places "re-sorting follows differentiating input" under invariants
- another places it under validity conditions

Expected behavior:

- flag schema-placement sensitivity explicitly
- do not overstate it as full construct disagreement

Reason:

- This is the dominant current calibration problem in the constraint layer.

## RC-009 Representation Metric Demotion Candidate

Purpose:

- Verify that free-text fields are treated as informational when style dominates signal.

Input:

- semantically similar summaries written at different compression levels

Expected behavior:

- AST presence remains comparable
- prose-heavy fields do not drive strong disagreement headlines

Reason:

- Representation calibration currently mixes compliance signal with stylistic noise.
