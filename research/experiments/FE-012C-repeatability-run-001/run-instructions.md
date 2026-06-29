# FE-012C Repeatability Run Instructions

## Standard Workflow

1. Open a fresh conversation in GPT-5.
2. Paste the full packet contents.
3. Append the standard execution prompt.
4. Save raw JSON to `responses/gpt/<packet_id>-gpt.json`.
5. Repeat the same process for Claude and save raw JSON to `responses/claude/<packet_id>-claude.json`.
6. Repeat the same process for Gemini and save raw JSON to `responses/gemini/<packet_id>-gemini.json`.

## Constraints

- Do not provide clarifications.
- Do not ask follow-up questions.
- Do not show one model another model's output.
- Do not compare until all outputs are locked.

## Standard Execution Prompt

Use this exact text after the packet:

```text
You are participating in a blinded research replication study.

Please follow the packet exactly as written.

Additional instructions:

1. Do not identify the original framework unless explicitly requested by the packet.
2. Do not redesign, improve, optimize, or critique the process.
3. Do not introduce reasoning primitives that are not in the supplied vocabulary unless no supplied primitive reasonably represents the operation. If that occurs, record it only under `candidate_missing_primitives`.
4. Return exactly one valid JSON object matching the supplied schema.
5. Do not wrap the JSON in markdown.
6. Do not include explanatory text before or after the JSON.
7. If any part of the packet is ambiguous, complete the extraction using your best judgment and record the ambiguity in the `ambiguities` field rather than asking clarifying questions.
8. Do not use knowledge of previously seen frameworks to improve the extraction beyond what can reasonably be inferred from the packet itself.

Begin the extraction.
```
