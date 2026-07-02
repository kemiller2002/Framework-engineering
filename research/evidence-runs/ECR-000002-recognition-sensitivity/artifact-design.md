# ECR-000002 Artifact Design

## Design Goal

Vary recognizability while holding underlying procedural structure relatively constant within each artifact family.

## Families

### P001

Reasoning-heavy inquiry cycle.

Source family:
scientific method or diagnostic reasoning.

### P002

Execution-oriented iterative work cycle.

Source family:
Scrum-style sprint workflow.

### P003

Static hierarchical classification structure.

Source family:
Bloom-style taxonomy.

## Recognition Conditions

### Canonical

High recognizability.

Use language close to the source family without naming the framework directly.

### Paraphrased

Same underlying structure with less canonical wording.

Remove distinctive labels that would make recognition easy.

### Structural

Same underlying structure expressed as abstract procedural or structural relationships with minimal domain-specific cues.

### Graph Only

Same underlying structure expressed primarily as graph topology with minimal prose.

Use this only where structural recognition requires a more severe reduction of family wording.

## Design Constraints

- Packets must be self-contained.
- Packet bodies must not name the source artifact.
- Packets must not ask models to update hypotheses.
- Packets must not ask models to validate Framework Engineering, Clarity, or EDF.
- Each packet must embed the full response schema.
- Graph-only packets should avoid reasoning-family vocabulary when the purpose is structural recognition testing.
