# FE-013 Manual Run Instructions

## Goal

Collect procedural AST outputs from GPT-5, Claude, and Gemini using identical packets and identical execution prompts.

## Models

- GPT-5
- Claude
- Gemini

## Packet Directory

`packets/`

## Response Directories

`responses/gpt/`
`responses/claude/`
`responses/gemini/`

## File Naming Convention

For GPT:

- `responses/gpt/FE-013-P001-gpt.json`
- `responses/gpt/FE-013-P002-gpt.json`
- `responses/gpt/FE-013-P003-gpt.json`
- `responses/gpt/FE-013-P004-gpt.json`
- `responses/gpt/FE-013-P005-gpt.json`
- `responses/gpt/FE-013-P006-gpt.json`

For Claude:

- `responses/claude/FE-013-P001-claude.json`
- `responses/claude/FE-013-P002-claude.json`
- `responses/claude/FE-013-P003-claude.json`
- `responses/claude/FE-013-P004-claude.json`
- `responses/claude/FE-013-P005-claude.json`
- `responses/claude/FE-013-P006-claude.json`

For Gemini:

- `responses/gemini/FE-013-P001-gemini.json`
- `responses/gemini/FE-013-P002-gemini.json`
- `responses/gemini/FE-013-P003-gemini.json`
- `responses/gemini/FE-013-P004-gemini.json`
- `responses/gemini/FE-013-P005-gemini.json`
- `responses/gemini/FE-013-P006-gemini.json`

## Execution Procedure

For each model:

1. Open a fresh conversation.
2. Do not include prior Framework Engineering context.
3. Open packet `FE-013-P001`.
4. Paste the entire packet.
5. Append the standard execution prompt.
6. Save the raw JSON exactly as returned.
7. Repeat for packets `P002` through `P006`.
8. Do not compare responses until all model outputs are locked.
9. Do not show one model another model's output.
10. Do not ask follow-up questions unless the model fails to produce JSON.

## Standard Execution Prompt

Add the following exact text after the packet:

```text
You are participating in a blinded procedural language study.

Please follow the packet exactly as written.

Additional instructions:

1. Do not evaluate, redesign, improve, optimize, or critique the framework.
2. Do not identify the original framework unless recognition is unavoidable. If recognized, record it only in `recognized_artifact`.
3. Do not use the FE-012C primitive vocabulary.
4. Do not output primitive sequences.
5. Extract only the requested compiler-like procedural properties: entry conditions, exit conditions, preconditions, postconditions, branches, loops, invariants, termination conditions, and procedural AST.
6. Return exactly one valid JSON object matching the supplied schema.
7. Do not wrap the JSON in markdown.
8. Do not include explanatory text before or after the JSON.
9. If the packet is ambiguous, complete the extraction using best judgment and record the ambiguity in the `ambiguities` field rather than asking clarifying questions.
10. Do not use prior knowledge of named frameworks to fill in structure beyond what can reasonably be inferred from the packet.

Begin the extraction.
```

## Failure Handling

If a model returns markdown-wrapped JSON:

- Save the raw output.
- Also create a cleaned JSON file only if cleaning is mechanical.
- Record the issue in `comparison/parsing-issues.md`.

If a model refuses:

- Save refusal text as `.txt`.
- Record the issue.

If a model asks for clarification:

- Reply exactly:
  `"Please complete the extraction using the information provided in the packet."`
- Save final response.
- Record the issue.
