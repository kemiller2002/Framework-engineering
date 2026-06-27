# Framework Canonical Model Standard

Status: Working draft

## Purpose

The Framework Canonical Model Standard defines how frameworks separate meaning from implementation.

A framework should define its concepts independently from any programming language, file format, storage system, diagramming tool, or renderer.

## Core Architecture

```text
Grammar
↓
Canonical Information Model
↓
Supported Serializations
↓
Generated Representations
↓
Tools
```

## Definitions

### Grammar

The conceptual language of the framework.

Examples:

- EDF: System Context, Manifestations, Origin Network, Propagation, Control Points, Calibration
- Clarity: Current Understanding, Current Justification, Reconsideration Criteria

Grammar defines meaning.

### Canonical Information Model

The implementation-independent model of the framework.

It defines:

- entities
- relationships
- attributes
- constraints
- required elements
- optional elements
- validation rules

The Canonical Information Model is normative.

It is not YAML.
It is not JSON.
It is not a database schema.
It is not a programming-language class model.

Those may represent it, but they do not define it.

### Supported Serializations

A serialization is a way to store or exchange the canonical model.

Examples:

- YAML
- JSON
- XML
- Markdown front matter
- database tables
- graph database records
- spreadsheets
- paper forms

YAML may be recommended as a human-authoring format, but it must not be required by the framework itself.

### Generated Representations

Representations are derived views of the canonical model.

Examples:

- Mermaid diagrams
- Graphviz diagrams
- mind maps
- markdown reports
- HTML
- PDF
- dashboards
- web UI
- printed forms

Representations should not contain semantic information that cannot be expressed in the canonical model.

### Tools

Tools may validate, render, compare, transform, or assist framework artifacts.

Tools support the framework.

Tools do not define the framework.

## Principles

### Implementation Independence

A framework must not require a specific programming language, file format, database, or toolchain.

Someone should be able to use the framework on paper, in markdown, in a spreadsheet, in YAML, in JSON, in a database, or in a custom application.

### Meaning Before Encoding

The canonical model defines meaning.

Serializations encode meaning.

Representations display meaning.

Tools assist with meaning.

Do not confuse the encoding with the framework.

### Single Semantic Source

Semantic information should exist in one place: the canonical model.

Generated artifacts should derive from the canonical model rather than being independently maintained.

### Existing Ecosystems First

Frameworks should reuse established formats, tools, and mental models when they adequately express the intended meaning.

New notation, syntax, or tooling should be introduced only when existing approaches cannot represent the concept without material loss of clarity or capability.

### Low-Friction Adoption

Framework representations should be easy enough to use that they do not get in the way of the work.

If people spend more time learning the representation than using the framework, the representation has failed.

## YAML Guidance

YAML is a strong candidate for human-authored serialization because it is familiar, readable, diff-friendly, and widely supported.

However:

YAML is a supported serialization, not the framework.

A framework may recommend YAML without requiring it.

## Example: EDF

EDF Grammar:

- System Context
- Manifestations
- Origin Network
- Propagation
- Control Points
- Calibration

EDF Canonical Information Model:
Defines the entities, relationships, and constraints behind those concepts.

Supported serializations may include:

- YAML
- JSON
- Markdown
- database records

Generated representations may include:

- narrative report
- origin map
- propagation flow
- control point table
- calibration panel

## Compliance

A framework complies with this standard if:

- its grammar is defined separately from implementation
- its canonical information model is implementation-independent
- it identifies supported serializations
- generated representations can be traced back to the canonical model
- tools do not become required to understand or apply the framework
