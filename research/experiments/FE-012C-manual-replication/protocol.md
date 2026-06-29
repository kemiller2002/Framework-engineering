# FE-012C Manual Replication Protocol

## Purpose

Provide a transparent manual process for collecting comparable primitive grammar extraction outputs from multiple model providers.

## Blinding

- Packets must not reveal the source artifact name.
- Packets must not include author, history, popularity, or framework branding.
- Packets should minimize domain cues where possible without destroying procedural structure.

## Prompt Consistency

- Every model receives the same packet text for a given packet ID.
- No prompt edits are allowed between providers.
- No model should see another model's response.

## Storage Rules

- Store GPT responses in `responses/gpt/`.
- Store Claude responses in `responses/claude/`.
- Store Gemini responses in `responses/gemini/`.
- Use stable packet-ID filenames.
- Preserve raw JSON responses as returned, unless whitespace normalization is needed for repository storage.

## Comparison Rules

- Compare responses only after all available provider outputs are collected for the same packet.
- Use `packet_id` as the primary key in comparison files.
- Record unresolved disagreements explicitly rather than forcing consensus.

## Failure Handling

- If a model refuses, errors, or returns invalid JSON, record that outcome in the experiment log and notes.
- Do not repair the model's reasoning output manually.
- If JSON needs cleanup for parsing, preserve the original raw response outside the comparison documents when possible.
