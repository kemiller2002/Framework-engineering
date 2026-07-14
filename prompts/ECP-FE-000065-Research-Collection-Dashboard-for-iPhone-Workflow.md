# Engineering Change Package

**ID:** ECP-FE-000065  
**Title:** Research Collection Dashboard for iPhone Workflow  
**Repository:** framework-engineering  
**Category:** Research Data Collection  
**Priority:** Critical

## Purpose

Build a local web dashboard that lets the researcher collect model responses from an iPhone without manually managing filenames, folders, or experiment progress.

The dashboard must:

1. Run locally on the Mac.
2. Be reachable from an iPhone on the same Wi-Fi network.
3. Show the next unfinished packet/provider combination.
4. Display the full packet prompt.
5. Provide a Copy Prompt button.
6. Accept the pasted model response.
7. Validate and save the response under the correct canonical filename.
8. Track progress across GPT, Claude, and Gemini.
9. Prevent duplicate or accidental overwrites.
10. Integrate with the existing ECR response normalizer and pipeline.

This tool is for collection only.

It must not:

- call GPT, Claude, Gemini, or any remote model API,
- generate model responses,
- alter packet content,
- alter Comparator v3.1,
- update hypotheses,
- accept EDRs,
- expose the dashboard publicly,
- overwrite existing response files,
- rewrite raw response content.

## Primary Use Case

The researcher runs one command on the Mac:

    npm run collect

The terminal displays the local Mac URL, the LAN URL for the iPhone, and a QR code if practical.

The researcher opens the LAN URL in Safari on the iPhone. The dashboard shows the current ECR, experiment, packet, provider, progress, full packet text, a Copy Prompt button, a response paste area, and a Save Response button. After saving a valid response, the dashboard advances to the next unfinished item.

## Scope

Initial target:

- ECR-000003
- EXP-003 Isomorphic Procedures

Target ECR root:

    research/evidence-runs/ECR-000003-representation-sensitivity/

Target experiment:

    research/evidence-runs/ECR-000003-representation-sensitivity/experiments/EXP-003-isomorphic-procedures/

Expected providers:

- gpt
- claude
- gemini

Derive packet count dynamically from the experiment packet directory.

## Create Tool

Create:

    research/tools/research-collection-dashboard/

Files:

    package.json
    README.md
    src/server.js
    src/config.js
    src/discover-packets.js
    src/discover-responses.js
    src/response-validator.js
    src/response-writer.js
    src/progress.js
    src/network.js
    src/audit-log.js
    public/index.html
    public/app.js
    public/styles.css
    test/server.test.js
    test/discovery.test.js
    test/response-validator.test.js
    test/response-writer.test.js
    test/progress.test.js

Use Node.js built-in modules where practical. Avoid unnecessary dependencies. A lightweight QR dependency is acceptable if justified.

## ECR-Level Integration

Update or create ECR root scripts:

    "collect": "<command that starts the collection dashboard for ECR-000003>",
    "collect:exp003": "<command that starts the dashboard scoped to EXP-003>"

Expected command:

    npm run collect:exp003

Also support direct CLI execution:

    node research/tools/research-collection-dashboard/src/server.js --ecr-root <path> --experiment EXP-003 --port 4310 --host 0.0.0.0

## CLI Options

Support:

    --ecr-root <path>
    --experiment <experiment-id>
    --port <number>
    --host <host>
    --provider <provider>
    --read-only
    --no-qr
    --open-browser
    --allow-tolerant-json
    --incoming-root <path>

Defaults:

    host: 0.0.0.0
    port: 4310
    provider: all
    read-only: false
    allow-tolerant-json: true

Reject unknown experiments and providers.

## Security Requirements

This is a LAN-only local tool.

Required protections:

1. Bind only to the requested local interface.
2. Do not expose through tunneling services.
3. Do not add cloud deployment configuration.
4. Generate a random session token at startup.
5. Require the token in the browser URL or first request.
6. Reject requests without the active token.
7. Do not persist the token.
8. Do not allow arbitrary filesystem paths from the browser.
9. Restrict all reads and writes to the configured ECR root.
10. Escape packet and response text when rendering.
11. Limit request body size to a reasonable maximum such as 2 MB.
12. Log only metadata, not full response bodies.
13. Display a warning that the dashboard is reachable by devices on the same Wi-Fi while running.

## Packet Discovery

Derive packet inventory from:

    experiments/<experiment>/packets/

For every packet, extract:

- packet_id
- experiment_id
- variant_id
- artifact_family_id
- recognition_condition
- packet_version
- full packet text
- source path

Support Markdown packet files. Packet metadata is authoritative.

If required metadata is missing, flag the packet, show it in diagnostics, and do not create a response target until identity is unambiguous.

Sort packets by experiment ID, configured variant order, and packet ID.

## Provider Queue

For every packet, create collection tasks for:

- gpt
- claude
- gemini

Task identity:

    experiment + packet_id + provider

Statuses:

- pending
- complete
- complete_with_warning
- skipped
- blocked
- conflicting_duplicate

Progress must be derived from actual canonical response files, not only dashboard state.

## Canonical Response Filenames

Use:

    <packet-id>-<provider>.json

Example:

    ECR-000003-EXP003-P001A-gpt.json

Save under:

    experiments/<experiment>/responses/<provider>/

Never overwrite an existing canonical response.

If a target already exists, compare hashes, show the existing status, require an explicit Save as Candidate action, and save the new content under:

    responses/conflicting-candidates/<provider>/

## Dashboard Interface

Create a mobile-first interface.

Header:

- ECR ID
- Experiment ID and title
- completion progress
- current task position
- server connection status

Current task:

- provider
- packet ID
- variant
- packet version
- current status

Prompt area:

- full packet text
- Copy Prompt button
- Select All button
- expandable metadata panel

Response area:

- large paste field
- character count
- Clear button
- Validate button
- Save Response button

Navigation:

- Previous
- Skip
- Next
- Next Incomplete

Progress view:

| Packet | GPT | Claude | Gemini |
|---|---|---|---|

Diagnostics must show missing metadata, malformed response, tolerant parse use, duplicate target, provider mismatch, packet mismatch, and save failures.

When all responses are present, show exact next commands:

    npm run normalize:dry
    npm run normalize
    npm run pipeline

Do not run the analysis pipeline automatically.

## Provider Guidance

Do not embed provider credentials or APIs.

For each provider, show simple instructions to copy the prompt, open the provider app, paste, copy the returned JSON, return to Safari, paste, validate, and save.

## Response Validation

Always preserve pasted response text exactly as entered when saving the raw response.

Attempt:

1. strict JSON parse,
2. cosmetic tolerant parse if enabled.

Allowed tolerant fixes for validation only:

- smart quotation marks to standard quotation marks,
- unambiguous trailing comma removal,
- removal of an outer Markdown JSON code fence.

Do not modify the saved raw response.

Record strict_parse_success, tolerant_parse_success, repairs_required, validation_warnings, packet_id, experiment_id, and variant_id.

Unsafe malformed responses may be saved only with explicit Save With Blocking Warning and must be stored under:

    responses/malformed-candidates/<provider>/

## Metadata Verification

Compare response metadata against the current task.

Required matches where fields are present:

- packet_id
- experiment_id
- variant_id
- artifact_family_id

If metadata conflicts, block canonical save and permit only Save as Candidate.

If metadata is absent but the response is otherwise valid, show a warning and require explicit confirmation.

## Raw Response Preservation

Do not reformat, normalize, or pretty-print the pasted response before canonical storage.

Write the exact UTF-8 text.

After write:

- compute SHA-256,
- verify written bytes match submitted bytes,
- record the hash,
- update progress from the filesystem.

## Audit Log

Create under the ECR root:

    collection-dashboard/logs/

Each session writes:

    <session-id>.jsonl

Log metadata only:

- timestamp
- session ID
- action
- experiment
- packet ID
- provider
- target path
- validation status
- warnings
- SHA-256
- result

Do not log full prompts or full responses.

## Collection Manifest

Create or update:

    collection-dashboard/collection-status.json

Filesystem response files remain authoritative.

## Network Discovery

At startup:

1. Determine localhost URL.
2. Determine likely LAN IPv4 addresses.
3. Print the preferred iPhone URL.
4. Generate a QR code in the terminal or local image if practical.
5. Print firewall guidance if the port is unreachable.

Example:

    Research Collection Dashboard
    Local:  http://localhost:4310/?token=...
    iPhone: http://192.168.1.45:4310/?token=...

    Keep this terminal running while collecting responses.

## Startup Behavior

On start:

- verify ECR root,
- verify experiment exists,
- discover packets,
- discover existing responses,
- calculate progress,
- start server,
- print URLs,
- optionally open the Mac browser.

Default task order:

1. packet order,
2. GPT,
3. Claude,
4. Gemini.

Allow packet-first and provider-first ordering.

## Read-Only Mode

Support:

    --read-only

Read-only mode may display progress and copy prompts but must disable response saving.

## Tests

Add automated tests for:

1. Packet discovery.
2. Dynamic task generation.
3. Existing response detection.
4. Canonical filename generation.
5. Exact raw byte preservation.
6. Strict JSON validation.
7. Smart-quote tolerant validation.
8. Markdown code-fence tolerant validation.
9. Metadata mismatch blocking.
10. Existing target overwrite prevention.
11. Conflicting candidate storage.
12. Unsafe malformed candidate storage.
13. Session-token enforcement.
14. Filesystem path restriction.
15. Request body size limit.
16. Progress recalculation from disk.
17. EXP-003 expected count equals packet count times provider count.
18. Mobile rendering without desktop-only dependencies.
19. Read-only mode prevents writes.
20. Audit log excludes full response content.

Package scripts:

    "start": "node src/server.js",
    "test": "node --test test/*.test.js"

## Documentation

README must include Quick Start, iPhone Workflow, After Collection commands, and troubleshooting for connection issues, firewall, duplicate responses, malformed JSON, smart quotes, wrong provider, and accidental terminal closure.

## ECR Pipeline Integration

Update PIPELINE.md and ORCHESTRATION.md to add response collection before normalization:

1. Collect responses.
2. Normalize responses.
3. Verify dataset.
4. Run Comparator v3.1.
5. Generate reports.
6. Review EDRs.

Do not automatically trigger analysis after collection.

## Human Review Dashboard Integration

When an experiment is blocked for missing responses, show:

- missing response count,
- collection dashboard command,
- collection progress path.

For the current state, EXP-003 should show:

    Next action: npm run collect:exp003

## Current State

Update CURRENT_STATE.md:

Current Phase:
ECR-000003 EXP-003 Response Collection

Current Goal:
Collect the nine EXP-003 model responses through the mobile Research Collection Dashboard, normalize them, and run Comparator v3.1.

Immediate Command:

    cd /Users/kevinmiller/dev/Framework-engineering/research/evidence-runs/ECR-000003-representation-sensitivity
    npm run collect:exp003

After Collection:

    npm run normalize:dry
    npm run normalize
    npm run pipeline

## Implementation Report

Create:

    research/evidence-runs/ECR-000003-representation-sensitivity/collection-dashboard/implementation-report.md

Include component status, startup command, detected packet count, expected response count, test results, known limitations, security assumptions, and exact next action.

## Success Criteria

1. One command starts the dashboard.
2. The iPhone can connect over the same Wi-Fi.
3. Packets are discovered from repository metadata.
4. Existing responses determine progress.
5. The dashboard shows the next unfinished packet/provider task.
6. Copy Prompt copies the complete packet.
7. Pasted responses are validated.
8. Canonical filenames are generated automatically.
9. Existing canonical files are never overwritten.
10. Raw response bytes are preserved exactly.
11. Duplicate and malformed candidates are retained separately.
12. Session-token protection is active.
13. File access is restricted to the configured ECR root.
14. Progress is visible on mobile.
15. EXP-003 can be completed without typing filenames.
16. The final view provides exact normalization and pipeline commands.
17. Automated tests pass.
18. Comparator v3.1 and raw experiment packets remain unchanged.
