# FE-012C Repeatability Protocol

## Purpose

Provide a controlled rerun of FE-012C using the same packet instrument, fresh model conversations, and locked prior results.

## Core Rule

The repeatability run must test the same instrument rather than a revised one.

## Instrument Lock

- Packets were copied from `research/experiments/FE-012C-manual-replication/packets/`.
- No packet content changes were introduced during setup.
- Do not edit packet text unless a broken placeholder or obvious transcription defect is found.
- If a packet must be corrected, record the exact difference before running any model.

## Blinding Rules

- Do not show prior outputs to any model.
- Do not show one model another model's output.
- Use fresh GPT-5, Claude, and Gemini conversations.
- Do not append commentary about prior results.

## Prompt Consistency

- Every provider must receive the full packet contents.
- Every provider must receive the same standard execution prompt.
- Do not provide clarifications.
- Do not ask follow-up questions on behalf of the models.

## Response Handling

- Save raw GPT JSON to `responses/gpt/<packet_id>-gpt.json`.
- Save raw Claude JSON to `responses/claude/<packet_id>-claude.json`.
- Save raw Gemini JSON to `responses/gemini/<packet_id>-gemini.json`.
- Lock outputs before comparison.

## Comparison Timing

Do not compare repeatability outputs against prior FE-012C results until all current outputs are collected and locked.

## Interpretation Constraint

Repeatability evidence may strengthen or weaken confidence in the measurement instrument, but it does not by itself prove the underlying theory.
