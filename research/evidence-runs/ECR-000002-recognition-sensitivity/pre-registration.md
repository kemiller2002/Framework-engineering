# ECR-000002 Pre-Registration

## Purpose

Run a recognition-sensitivity study before making stronger claims about procedural extraction.

## Predictions

- Recognition rate should be highest in canonical packets.
- Recognition rate should decrease from canonical to paraphrased to structural.
- `P001D` should reduce lexical recognition cues more than `P001C`.
- If topology alone is sufficient for recognition, `P001D graph_only` may still trigger recognition despite stronger lexical reduction.
- If structure extraction is not recognition-dependent, structural and constraint layers should remain relatively stable within each artifact family.
- Primitive layer may drift more than structural or constraint layer.
- Static or classification packets should remain less procedurally rich than reasoning or execution packets.
- Product relevance should remain observational and should not dominate extraction.

## Competing Expected Outcomes

### Outcome A

Recognition persists and structure remains stable.

Interpretation:
Possible structural recognition.

### Outcome B

Recognition drops and structure remains stable.

Interpretation:
Extraction may be topology-driven rather than recognition-driven.

### Outcome C

Recognition drops and structure destabilizes.

Interpretation:
Recognition may contribute materially to extraction.

### Outcome D

Recognition persists but models introduce forbidden domain terminology.

Interpretation:
Prior-knowledge leakage remains a major threat.

## Weakening Signals

- Structure collapses when recognition decreases.
- Structural packets produce unrelated outputs across models.
- Static packets appear as procedurally rich as reasoning packets.
- Models fill in canonical details not present in paraphrased or structural packets.
- Recognition remains high even for structural packets.
- Recognition remains high in `P001D`, but extracted structure becomes unstable or speculative.

## Scope Limits

- No models are run as part of this package creation.
- No hypothesis confidence is updated automatically.
- Model agreement is not treated as human validation.
- `P001D` is an extension test, not proof of topology-driven recognition.
