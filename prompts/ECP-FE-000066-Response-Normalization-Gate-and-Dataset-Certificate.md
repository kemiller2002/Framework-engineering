# Engineering Change Package

**ID:** ECP-FE-000066  
**Title:** Response Normalization Gate and Dataset Certificate  
**Repository:** framework-engineering  
**Category:** Research Data Quality  
**Priority:** Critical

## Purpose

Create a durable normalization gate between AI response collection and Comparator v3.1.

The normalization gate must:

1. Discover newly collected response files.
2. Derive response identity from embedded metadata rather than filenames.
3. Rename and place responses under canonical paths.
4. Detect duplicates, conflicts, malformed files, provider mismatches, and packet-version issues.
5. Preserve every raw response unchanged.
6. Produce a normalization certificate for each experiment.
7. Require a valid certificate before comparison.
8. Prevent Comparator v3.1 from running against an uncertified or changed dataset.
9. Support ECR-000003 EXP-001, EXP-002, and EXP-003.
10. Remain reusable for future ECRs.

This package should strengthen the existing response-file normalizer and pipeline. It should not create a second competing normalization implementation.

## Current State

ECR-000003 model collection is complete.

Before running or rerunning comparisons, response filenames and locations must be normalized and the datasets must be certified.

Current response flow should become:

    AI Responses
        -> Collection Dashboard / Incoming Files
        -> Response Normalization
        -> Dataset Verification
        -> Normalization Certificate
        -> Comparator v3.1
        -> Reports
        -> EDR Review

## Scope

Target ECR:

    research/evidence-runs/ECR-000003-representation-sensitivity/

Experiments:

    experiments/EXP-001-topology-perturbation/
    experiments/EXP-002-cross-representation-stability/
    experiments/EXP-003-isomorphic-procedures/

Existing normalizer:

    research/tools/response-file-normalizer/

Existing comparator:

    research/tools/comparison-engine/

Frozen comparator version:

    3.1.0

## Guardrails

Do not:

- run GPT, Claude, Gemini, or any other model,
- generate replacement responses,
- alter raw response content,
- pretty-print or rewrite raw JSON,
- overwrite existing canonical response files,
- silently choose between conflicting responses,
- delete duplicates,
- change Comparator v3.1 scoring,
- change ontology behavior,
- update hypotheses,
- accept EDRs,
- treat directory existence as dataset readiness,
- issue a ready certificate when required responses are missing or unsafe.

## Extend the Existing Normalizer

Inspect and extend:

    research/tools/response-file-normalizer/

Do not create a second normalizer unless the current implementation cannot be safely extended.

Add reusable modules as needed:

    src/build-expected-dataset.js
    src/validate-packet-identity.js
    src/validate-packet-version.js
    src/build-dataset-manifest.js
    src/build-normalization-certificate.js
    src/verify-normalization-certificate.js
    src/canonical-path.js
    src/safe-move.js

## Canonical Response Identity

Determine identity using this precedence:

1. embedded `packet_id`
2. embedded `experiment_id`
3. embedded `variant_id`
4. embedded `artifact_family_id`
5. embedded `packet_version`
6. provider directory
7. source collection task metadata
8. existing filename, lowest trust

Never rely on the filename alone.

Canonical primary filename:

    <packet-id>-<provider>.json

Example:

    ECR-000003-EXP003-P001A-gpt.json

Canonical destination:

    experiments/<experiment>/responses/<provider>/<packet-id>-<provider>.json

Allowed providers:

- gpt
- claude
- gemini

## Discovery Locations

Search under the ECR root for candidate responses in:

    incoming-responses/
    collection-dashboard/
    experiments/*/responses/
    experiments/*/incoming/
    downloads/
    archive/mobile-response-zips/

Also inspect ZIP contents safely.

Ignore packets, schemas, configs, manifests, fixtures, reports, EDRs, `.gitkeep`, `__MACOSX`, pre-fix responses, and generated comparator outputs.

## Expected Dataset Derivation

Derive expected responses dynamically from packet metadata.

For each experiment:

1. Read packet files.
2. Extract packet IDs and packet versions.
3. Multiply by configured providers.
4. Build the expected canonical response set.

Expected conceptual totals are likely:

- EXP-001: 12
- EXP-002: 12
- EXP-003: 9
- ECR total: 33

Do not hard-code these totals if packet metadata differs.

## Parsing and Validation

Attempt strict JSON parsing first.

If strict parsing fails, attempt cosmetic tolerant parsing for validation only.

Allowed cosmetic repairs:

- smart quotation marks to standard quotation marks,
- removal of a single outer Markdown JSON code fence,
- removal of an unambiguous trailing comma.

Do not modify the stored raw file.

Record strict parse status, tolerant parse status, repairs, severity, metadata extraction status, and primary-dataset eligibility.

Repair severity:

- none
- cosmetic
- recoverable
- unsafe

Unsafe responses must not enter the primary dataset.

## Metadata Validation

Validate against packet metadata:

- packet_id
- experiment_id
- variant_id
- artifact_family_id
- recognition_condition where present
- packet_version where required

Classifications:

- exact_match
- compatible_missing_optional_metadata
- mismatch
- ambiguous
- not_parseable

Mismatch or ambiguity blocks canonical primary placement.

## Packet Version Rules

EXP-001 P001D:

- only packet version 1.1 is valid for primary comparison,
- version 1.0 remains excluded,
- version-unclear responses must not receive a ready certificate.

For other packets, verify stated versions where present and use `not_stated` where absent.

## Duplicate Detection

Classify:

### exact_duplicate

Identical byte hash.

Store extras under:

    responses/duplicates/exact/<provider>/

### semantic_duplicate

Different formatting but equivalent parsed content.

Store extras under:

    responses/duplicates/semantic/<provider>/

### conflicting_duplicate

Same task identity but materially different content.

Store under:

    responses/duplicates/conflicting/<provider>/

Do not choose a winner automatically. Block certification for that task.

Never overwrite a response.

## Malformed and Ambiguous Storage

Store unsafe malformed candidates under:

    responses/malformed-candidates/<provider>/

Store identity-ambiguous candidates under:

    responses/ambiguous-candidates/<provider>/

Store mismatches under:

    responses/mismatched-candidates/<provider>/

Preserve source filename and hash.

## Safe File Operations

Before each move:

- record source path,
- calculate SHA-256,
- calculate size,
- determine target,
- verify target does not exist.

After each move:

- verify target exists,
- verify hash unchanged,
- verify source no longer exists,
- record result.

Failure blocks certification.

## Dataset Manifest

Create per experiment:

    experiments/<experiment>/normalization/dataset-manifest.json

Include:

- ecr_id
- experiment_id
- normalizer_version
- generated_at
- packet_sources
- expected_tasks
- primary_responses
- excluded_responses
- duplicate_responses
- malformed_responses
- ambiguous_responses
- warnings
- blocking_issues

Each primary response entry must include packet ID, provider, canonical path, raw hash, byte size, parse status, repairs, packet version, and metadata status.

## Dataset Hash

Calculate a deterministic dataset hash from the ordered set of:

- packet ID
- provider
- canonical relative path
- raw SHA-256
- packet version
- comparator-relevant configuration hash

Do not include timestamps.

## Normalization Certificate

Create per experiment:

    experiments/<experiment>/normalization/normalization-certificate.json

Include:

- certificate_version
- normalizer_version
- ecr_id
- experiment_id
- generated_at
- expected_response_count
- canonical_response_count
- strict_parse_count
- tolerant_parse_count
- unsafe_malformed_count
- missing_count
- duplicate counts
- ambiguous_count
- excluded_count
- warning_count
- packet_version_issues
- dataset_hash
- config_hash
- ready_for_comparison
- status
- blocking_issues
- warnings

Allowed status values:

- READY
- READY_WITH_WARNINGS
- BLOCKED
- INVALIDATED

READY requires all expected responses, no conflicts or unsafe files, valid packet versions, and strict parse success.

READY_WITH_WARNINGS allows only cosmetic or approved recoverable tolerant parsing.

BLOCKED applies when any required response is missing, conflicting, ambiguous, unsafe, mismatched, or wrong-version.

INVALIDATED applies when data or configuration changed after certificate generation.

## Human-Readable Normalization Report

Create:

    experiments/<experiment>/normalization/normalization-report.md

Include summary counts, canonical responses, moves, tolerant parsing events, duplicate handling, malformed or ambiguous files, packet-version issues, blockers, certificate status, and exact next command.

## ECR-Level Certificate Index

Create:

    normalization/CERTIFICATE-INDEX.md

Format:

| Experiment | Expected | Canonical | Warnings | Blockers | Dataset Hash | Status | Certificate |
|---|---:|---:|---:|---:|---|---|---|

## ECR-Level Normalization Summary

Create:

    normalization/ECR-000003-normalization-summary.md

Include overall expected count, canonical count, warnings, blockers, experiment statuses, and exact next commands.

## CLI Commands

Support:

    --ecr-root <path>
    --experiment EXP-001
    --experiment EXP-002
    --experiment EXP-003
    --all-experiments
    --dry-run
    --apply
    --verify-only
    --certificate-only
    --invalidate-certificates
    --incoming-only
    --force-recertificate

Default mode is dry-run.

## Package Scripts

Update the ECR root package.json with verified relative paths:

    "normalize:dry"
    "normalize"
    "normalize:verify"
    "normalize:certify"
    "normalize:exp001"
    "normalize:exp002"
    "normalize:exp003"

## Comparator Certificate Gate

Update the comparison engine and adapters only enough to enforce certification.

Before official comparison, verify:

1. certificate exists,
2. status is READY or READY_WITH_WARNINGS,
3. `ready_for_comparison` is true,
4. current dataset hash matches,
5. config hash matches,
6. comparator version is allowed.

Refuse official comparison on missing, blocked, invalidated, or stale certificates.

Support diagnostic-only override:

    --diagnostic-without-certificate

Diagnostic mode must write to a separate directory and must not create official reports or evidence-ready EDRs.

## Certificate Invalidation

Certificates become stale when:

- a primary response is added, removed, renamed, or changed,
- packet metadata changes,
- comparison config changes,
- provider list changes,
- packet-version rules change.

The comparator must detect stale certificates by hash.

## Pipeline Integration

Required phase order:

1. environment verification,
2. normalization dry run,
3. normalization apply,
4. certificate generation,
5. certificate verification,
6. comparator execution,
7. report generation,
8. EDR draft generation.

The pipeline must not compare before certificate verification.

Update dataset, comparison-status, readiness, and human-review reports with normalization status, certificate status, dataset hash, and certificate timestamps.

## Collection Dashboard Integration

When collection is complete, show:

    npm run normalize:dry
    npm run normalize
    npm run normalize:certify
    npm run pipeline

Show certificate status where available.

## Audit Log

Create:

    normalization/logs/<normalization-run-id>.jsonl

Log metadata only, including run ID, action, experiment, packet, provider, paths, hashes, validation result, certificate result, and warnings or blockers.

## Tests

Add tests for:

1. Expected dataset derivation.
2. Canonical filename generation.
3. Provider verification.
4. Raw-byte preservation.
5. Strict and tolerant parsing.
6. Unsafe malformed exclusion.
7. Metadata mismatch blocking.
8. Packet-version blocking.
9. P001D v1.0 exclusion.
10. Exact, semantic, and conflicting duplicate handling.
11. Ambiguous identity blocking.
12. No overwrite.
13. Hash preservation after move.
14. Deterministic dataset hash.
15. READY, READY_WITH_WARNINGS, BLOCKED, and INVALIDATED certificates.
16. Certificate invalidation after response change.
17. Comparator refusal without or with stale certificate.
18. Comparator acceptance with verified certificate.
19. Diagnostic mode isolation.
20. Pipeline certificate-before-comparison order.
21. ECR certificate index generation.
22. Dry-run immutability.

## Documentation

Update:

    research/tools/response-file-normalizer/README.md
    research/tools/comparison-engine/README.md
    research/evidence-runs/ECR-000003-representation-sensitivity/PIPELINE.md
    research/evidence-runs/ECR-000003-representation-sensitivity/ORCHESTRATION.md
    research/operating-system/research-operating-manual.md

Document the certificate lifecycle, invalidation, official versus diagnostic comparison, and exact operator commands.

## Recommended Operator Workflow

From the ECR-000003 root:

    npm run normalize:dry
    npm run normalize
    npm run normalize:verify
    npm run normalize:certify
    npm run pipeline

## Current State

Update `CURRENT_STATE.md`:

Current Phase:
ECR-000003 Response Normalization and Certification

Current Goal:
Normalize all completed responses, issue verified dataset certificates, and run Comparator v3.1 only against certified datasets.

## Implementation Report

Create:

    normalization/normalization-gate-implementation-report.md

Include component status, packet counts, expected response counts, discovered candidates, normalization results, certificate results, tests, comparator gate behavior, limitations, and exact next commands.

## Success Criteria

1. Every response candidate is inventoried.
2. Identity is derived from metadata.
3. Canonical paths are applied safely.
4. No response is overwritten.
5. Raw bytes remain unchanged.
6. Problematic files are preserved and classified.
7. Expected datasets are derived dynamically.
8. Each experiment receives a dataset manifest.
9. Eligible experiments receive normalization certificates.
10. Dataset hashes are deterministic.
11. Certificates become stale when data or config changes.
12. Comparator v3.1 refuses uncertified or stale official datasets.
13. Diagnostic comparison cannot create official evidence outputs.
14. The pipeline enforces certification before comparison.
15. Reports show exact blockers and next commands.
16. EXP-001, EXP-002, and EXP-003 can be certified independently.
17. Automated tests pass.
18. Comparator scientific logic remains unchanged.
