# FE-012C Repeatability Run 001

## Purpose

This folder defines a repeatability run for FE-012C.

It reuses the same packet instrument from the original FE-012C manual replication run and is intended to test whether fresh model conversations produce similar results across time.

This is not a new theory experiment.

This is not a redesign exercise.

This is a repeatability test.

## Run Requirements

- Use fresh GPT-5, Claude, and Gemini conversations.
- Do not show prior model outputs to any model.
- Do not compare outputs until all responses are locked.
- Do not modify the packet text during execution.

## Directory Structure

- `pre-registration.md`
- `repeatability-protocol.md`
- `run-instructions.md`
- `packet-index.md`
- `comparison-plan.md`
- `interpretation-rules.md`
- `packets/`
- `responses/gpt/`
- `responses/claude/`
- `responses/gemini/`
- `comparison/`

## Packet Instrument Status

The packet contents in `packets/` were copied from:

`research/experiments/FE-012C-manual-replication/packets/`

No packet content changes were introduced during copy.

If any packet text is corrected later to address a broken placeholder or transcription defect, document the change in this file and in `repeatability-protocol.md` before the run is executed.
