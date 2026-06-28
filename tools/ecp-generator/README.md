# ECP Generator

Status: Working draft

## Purpose

The ECP Generator renders structured YAML into consistent Codex-ready Engineering Change Package prompts.

It is intentionally lightweight.

## Usage

Install dependencies:

```bash
npm install
```

Generate a prompt:

```bash
node generate-ecp.js example-ecp.yaml > ECP-FE-000014.prompt.txt
```

Use a custom input file:

```bash
node generate-ecp.js /path/to/ecp.yaml
```

## Input Format

The generator expects YAML with this structure:

```yaml
ecp:
  id:
  title:
  repository:
  category:
  priority:

target:
  working_directory:
  stop_if_not_repo: true

purpose:

do_not_modify:
  - repo/file

create:
  - path

update:
  - path

content:
  - file:
    instructions:

rules:
  - evidence-first
  - no false precision
  - no unrelated files
```

## Behavior

- Reads a YAML file path from the CLI
- Validates required fields
- Produces markdown/text prompt output to stdout
- Includes target repo warning
- Includes create and update sections
- Includes content instructions
- Includes rules and do-not-modify entries

## Files

- `ecp-schema.yaml`: Human-readable schema reference
- `example-ecp.yaml`: Example input
- `generate-ecp.js`: CLI generator
