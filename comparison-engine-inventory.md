# Comparison Engine Inventory

## Scope

This inventory was produced by searching the repository for executable code, package manifests, and documentation references related to:

- compare
- comparator
- normalize
- normalizer
- dashboard
- analysis
- analyze
- experiment
- evidence
- recognition
- persistence
- ECR
- comparison

Inspected locations included:

- `package.json`
- `package-lock.json`
- `scripts/`
- `src/`
- `tools/`
- `comparison/`
- `research/`
- `utilities/`
- `bin/`

## High-Level Findings

- There is no repo-root `package.json`.
- There are no top-level `scripts/`, `src/`, `comparison/`, `utilities/`, or `bin/` directories in the repository root.
- The active executable comparison tooling is concentrated in experiment-specific subprojects under `research/`.
- Comparator v3 exists as executable code, not just documentation.
- No broken `scripts/*.js` references were found in package manifests or repository documentation during this pass.

## 1. Every Comparison-Related Script Found

### ECR-000001 multi-layer procedural representation

Located under:
`research/evidence-runs/ECR-000001-multi-layer-procedural-representation/scripts/`

- `compare-ecr-000001.js`
  - Primary literal comparator for ECR-000001.
  - Generates reports under `comparison/generated/`.
- `compare-ecr-000001-v2.js`
  - Flat semantic comparator / normalization pass.
  - Generates reports under `comparison/generated-v2/`.
- `compare-ecr-000001-v3.js`
  - Dimensional comparator.
  - Generates reports under `comparison/generated-v3/`.
- `validate-semantic-normalizer.js`
  - Validation harness for the v2 semantic normalizer.
- `validate-semantic-normalizer-v3.js`
  - Validation harness for the v3 dimensional normalizer / ontology.
- `build-ecr-dashboard.js`
  - Dashboard builder that aggregates comparator and normalizer outputs.

### FE-012C repeatability run

Located under:
`research/experiments/FE-012C-repeatability-run-001/scripts/`

- `compare-datasets.js`
  - Compares prior FE-012C manual replication outputs against repeatability run outputs.
  - Generates reports under `comparison/generated/`.
- `semantic-compare.js`
  - Layered semantic comparator for FE-012C repeatability drift review.
  - Reads literal comparison output and produces semantic comparison reports.

### FE-012C primitive grammar agreement

Located under:
`research/experiments/FE-012C-primitive-grammar-agreement/scripts/`

- `compare-extractors.js`
  - Compares extractor outputs across providers.
- `build-transition-matrix.js`
  - Builds transition and primitive-position summaries from result JSON.
- `run-extraction.js`
  - Extraction runner for primitive grammar agreement experiments.
  - Not a comparator, but adjacent analysis infrastructure.

### FE-012C manual replication

Located under:
`research/experiments/FE-012C-manual-replication/scripts/`

- `generate-report.js`
  - Reads provider response JSON and produces agreement-oriented result reports.
  - Report generator rather than a reusable comparator engine.

### Non-comparison utility discovered during search

- `tools/ecp-generator/generate-ecp.js`
  - Not comparison-related.
  - Included here only because it appeared during the repository-wide script inventory.

## 2. Every npm Script Related to Comparison or Dashboards

### `research/evidence-runs/ECR-000001-multi-layer-procedural-representation/package.json`

- `compare:ecr000001` → `node scripts/compare-ecr-000001.js`
- `compare:ecr000001:v2` → `node scripts/compare-ecr-000001-v2.js`
- `validate:normalizer` → `node scripts/validate-semantic-normalizer.js`
- `compare:ecr000001:v3` → `node scripts/compare-ecr-000001-v3.js`
- `validate:normalizer:v3` → `node scripts/validate-semantic-normalizer-v3.js`
- `dashboard:ecr000001` → `node scripts/build-ecr-dashboard.js`

### `research/experiments/FE-012C-repeatability-run-001/package.json`

- `compare` → `node scripts/compare-datasets.js`
- `semantic-compare` → `node scripts/semantic-compare.js`

### `research/experiments/FE-012C-primitive-grammar-agreement/package.json`

- `compare` → `node scripts/compare-extractors.js`
- `matrix` → `node scripts/build-transition-matrix.js`

### Adjacent but not comparison/dashboard

- `research/experiments/FE-012C-primitive-grammar-agreement/package.json`
  - `extract` → `node scripts/run-extraction.js`
- `research/experiments/FE-012C-manual-replication/package.json`
  - `report` → `node scripts/generate-report.js`

## 3. Every Script That Consumes Response JSON

### Direct raw response JSON consumers

These scripts read provider response files from `responses/` directories or parse raw provider JSON outputs:

- `research/evidence-runs/ECR-000001-multi-layer-procedural-representation/scripts/compare-ecr-000001.js`
- `research/evidence-runs/ECR-000001-multi-layer-procedural-representation/scripts/compare-ecr-000001-v2.js`
- `research/evidence-runs/ECR-000001-multi-layer-procedural-representation/scripts/compare-ecr-000001-v3.js`
- `research/experiments/FE-012C-repeatability-run-001/scripts/compare-datasets.js`
- `research/experiments/FE-012C-repeatability-run-001/scripts/semantic-compare.js`
- `research/experiments/FE-012C-manual-replication/scripts/generate-report.js`
- `research/experiments/FE-012C-primitive-grammar-agreement/scripts/compare-extractors.js`
- `research/experiments/FE-012C-primitive-grammar-agreement/scripts/build-transition-matrix.js`

### Indirect / secondary JSON consumers

These scripts consume generated JSON, ontology JSON, or experiment JSON rather than raw provider response folders:

- `research/evidence-runs/ECR-000001-multi-layer-procedural-representation/scripts/build-ecr-dashboard.js`
  - Consumes generated markdown and JSON outputs such as `raw-validation-output-v3.json`.
- `research/evidence-runs/ECR-000001-multi-layer-procedural-representation/scripts/validate-semantic-normalizer.js`
  - Consumes ontology and validation JSON artifacts.
- `research/evidence-runs/ECR-000001-multi-layer-procedural-representation/scripts/validate-semantic-normalizer-v3.js`
  - Consumes dimensional ontology and validation JSON artifacts.
- `research/experiments/FE-012C-primitive-grammar-agreement/scripts/run-extraction.js`
  - Consumes experiment data JSON (`artifacts.json`, `primitives.json`) rather than response folders.

## 4. Which Scripts Appear to Be Orphaned

### Strict orphan check

No clear orphaned executable scripts were found among the comparison and dashboard tooling listed above.

Reason:

- Every discovered executable script under the relevant `scripts/` directories is wired to a local `package.json` script entry.
- Documentation references found for those tools are consistent with the package manifests.

### Practical orphan risk

These tools are not orphaned, but they are highly siloed:

- `research/evidence-runs/ECR-000001-multi-layer-procedural-representation/scripts/*`
- `research/experiments/FE-012C-repeatability-run-001/scripts/*`
- `research/experiments/FE-012C-primitive-grammar-agreement/scripts/*`
- `research/experiments/FE-012C-manual-replication/scripts/generate-report.js`

Interpretation:

- They are maintained as local experiment engines, not as a shared repository comparison platform.
- There is currently no top-level shared comparison package that standardizes invocation across ECRs and experiments.

## 5. Which Scripts Appear to Have Been Deleted or Are Referenced but Missing

No missing executable script references were identified in this pass.

Checks performed:

- Package manifest commands were matched against existing script files.
- Repository text was scanned for `scripts/*.js` references.
- No package script pointed at a non-existent file.
- No documentation reference to a missing comparator script was found.

Important nuance:

- There are many comparison and analysis documents under `comparison/`, including generated reports and planning material.
- Some areas, especially ECR-000002 and ECR-000003, contain comparison plans and run instructions but do not currently expose a matching executable comparator package in the same way ECR-000001 does.
- That is a tooling gap, not evidence of a deleted script.

## 6. Whether Comparator v3 Currently Exists as Executable Code or Only Documentation

Comparator v3 currently exists as executable code.

Evidence:

- Package entry:
  - `research/evidence-runs/ECR-000001-multi-layer-procedural-representation/package.json`
  - Script: `compare:ecr000001:v3`
- Executable file:
  - `research/evidence-runs/ECR-000001-multi-layer-procedural-representation/scripts/compare-ecr-000001-v3.js`
- Supporting validator:
  - `research/evidence-runs/ECR-000001-multi-layer-procedural-representation/scripts/validate-semantic-normalizer-v3.js`
- Generated outputs already present:
  - `research/evidence-runs/ECR-000001-multi-layer-procedural-representation/comparison/generated-v3/ecr-000001-comparator-v3-report.md`
  - `research/evidence-runs/ECR-000001-multi-layer-procedural-representation/comparison/generated-v3/raw-dimensional-normalized-table-v3.json`

Conclusion:

- Comparator v3 is implemented and executable.
- It is not documentation-only.

## 7. Which Existing Script Should Become the Long-Term Comparison Engine

Recommended candidate:

- `research/evidence-runs/ECR-000001-multi-layer-procedural-representation/scripts/compare-ecr-000001-v3.js`

Reasoning:

- It is the latest comparator generation in the repository.
- It already formalizes layered comparison beyond literal matching.
- It has an explicit supporting validator:
  - `validate-semantic-normalizer-v3.js`
- It is already part of a larger operational chain:
  - comparator output
  - normalizer validation
  - dashboard generation
- It produces machine-readable output as well as reviewer-facing markdown.

Why not the alternatives:

- `compare-ecr-000001.js`
  - Too literal and earlier-generation.
- `compare-ecr-000001-v2.js`
  - Transitional; less expressive than v3 dimensional comparison.
- `compare-datasets.js`
  - Useful for FE-012C repeatability, but specialized to prior-vs-repeat dataset comparison rather than general comparison architecture.
- `semantic-compare.js`
  - Valuable, but tied to FE-012C repeatability semantics and dependent on literal comparison output.
- `generate-report.js`
  - Primarily a one-off reporting tool for manual replication outputs.
- `compare-extractors.js`
  - Narrowly scoped to primitive extractor agreement.

Constraint:

- `compare-ecr-000001-v3.js` is still ECR-000001-specific.
- If it becomes the long-term engine, it should be refactored into a shared comparison module with:
  - reusable schema adapters
  - pluggable ontologies / taxonomies
  - experiment-specific configuration
  - stable top-level package entrypoints

## Additional Notes

### Package manifests found

- `research/evidence-runs/ECR-000001-multi-layer-procedural-representation/package.json`
- `research/experiments/FE-012C-manual-replication/package.json`
- `research/experiments/FE-012C-primitive-grammar-agreement/package.json`
- `research/experiments/FE-012C-repeatability-run-001/package.json`
- `tools/ecp-generator/package.json`

### Package lockfiles found

- `research/experiments/FE-012C-primitive-grammar-agreement/package-lock.json`

### Generated comparison/dashboard evidence already present

The repository already contains generated artifacts showing the executable tooling has been run in at least some subprojects:

- `research/evidence-runs/ECR-000001-multi-layer-procedural-representation/comparison/generated/`
- `research/evidence-runs/ECR-000001-multi-layer-procedural-representation/comparison/generated-v2/`
- `research/evidence-runs/ECR-000001-multi-layer-procedural-representation/comparison/generated-v3/`
- `research/evidence-runs/ECR-000001-multi-layer-procedural-representation/comparison/normalizer-validation/generated/`
- `research/evidence-runs/ECR-000001-multi-layer-procedural-representation/comparison/normalizer-validation/generated-v3/`
- `research/evidence-runs/ECR-000001-multi-layer-procedural-representation/dashboard/generated/`

## Bottom Line

The repository does have executable comparison infrastructure, but it is fragmented and local to specific research efforts. The strongest existing foundation for a long-term comparison engine is the ECR-000001 v3 stack centered on:

- `compare-ecr-000001-v3.js`
- `validate-semantic-normalizer-v3.js`
- `build-ecr-dashboard.js`

There is no evidence in this pass that Comparator v3 was deleted or exists only as documentation.
