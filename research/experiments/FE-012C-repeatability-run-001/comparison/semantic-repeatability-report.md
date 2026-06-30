# FE-012C Semantic Repeatability Report

## Purpose

Add a layered semantic grammar comparison beside the existing literal comparator.

This report does not replace syntactic comparison.

## Literal Drift Summary

- Stable: 1/45
- Elaboration drift: 8/45
- Structural drift: 36/45
- Missing or invalid: 0/45

## Semantic Drift Summary

- Stable: 6/45
- Elaboration drift: 0/45
- Structural drift: 38/45
- Unclear: 1/45

## Cases Where Literal Drift Disappears Under Semantic Comparison

| Packet ID | Provider | Literal | Semantic | Rules Triggered | Notes |
| --- | --- | --- | --- | --- | --- |
| FE-012C-P010 | gpt | elaboration_drift | stable | none | Semantically stable. Rules triggered: none. |
| FE-012C-P010 | claude | elaboration_drift | stable | none | Semantically stable. Rules triggered: none. |
| FE-012C-P011 | claude | elaboration_drift | unclear | none | Semantic normalization reduces some drift, but ambiguity or candidate missing primitives still warrant human review. |
| FE-012C-P007 | gemini | elaboration_drift | stable | none | Semantically stable. Rules triggered: none. |
| FE-012C-P010 | gemini | elaboration_drift | stable | none | Semantically stable. Rules triggered: none. |
| FE-012C-P013 | gemini | elaboration_drift | stable | none | Semantically stable. Rules triggered: none. |

## Cases Where Semantic Drift Remains Real

| Packet ID | Provider | Literal | Semantic | Notes |
| --- | --- | --- | --- | --- |
| FE-012C-P001 | gpt | structural_drift | structural_drift | Backbone or control-flow structure still differs after semantic normalization. |
| FE-012C-P002 | gpt | structural_drift | structural_drift | Backbone or control-flow structure still differs after semantic normalization. |
| FE-012C-P003 | gpt | structural_drift | structural_drift | Backbone or control-flow structure still differs after semantic normalization. |
| FE-012C-P004 | gpt | structural_drift | structural_drift | Backbone or control-flow structure still differs after semantic normalization. |
| FE-012C-P005 | gpt | structural_drift | structural_drift | Backbone or control-flow structure still differs after semantic normalization. |
| FE-012C-P006 | gpt | structural_drift | structural_drift | Backbone or control-flow structure still differs after semantic normalization. |
| FE-012C-P007 | gpt | structural_drift | structural_drift | Backbone or control-flow structure still differs after semantic normalization. |
| FE-012C-P008 | gpt | structural_drift | structural_drift | Backbone or control-flow structure still differs after semantic normalization. |
| FE-012C-P009 | gpt | structural_drift | structural_drift | Backbone or control-flow structure still differs after semantic normalization. |
| FE-012C-P011 | gpt | structural_drift | structural_drift | Backbone or control-flow structure still differs after semantic normalization. |
| FE-012C-P012 | gpt | structural_drift | structural_drift | Backbone or control-flow structure still differs after semantic normalization. |
| FE-012C-P013 | gpt | structural_drift | structural_drift | Backbone or control-flow structure still differs after semantic normalization. |
| FE-012C-P014 | gpt | structural_drift | structural_drift | Backbone or control-flow structure still differs after semantic normalization. |
| FE-012C-P015 | gpt | structural_drift | structural_drift | Backbone or control-flow structure still differs after semantic normalization. |
| FE-012C-P001 | claude | structural_drift | structural_drift | Backbone or control-flow structure still differs after semantic normalization. |
| FE-012C-P002 | claude | structural_drift | structural_drift | Backbone or control-flow structure still differs after semantic normalization. |
| FE-012C-P003 | claude | structural_drift | structural_drift | Backbone or control-flow structure still differs after semantic normalization. |
| FE-012C-P004 | claude | structural_drift | structural_drift | Backbone or control-flow structure still differs after semantic normalization. |
| FE-012C-P005 | claude | structural_drift | structural_drift | Backbone or control-flow structure still differs after semantic normalization. |
| FE-012C-P006 | claude | structural_drift | structural_drift | Backbone or control-flow structure still differs after semantic normalization. |

## Uncertain Cases Needing Human Review

| Packet ID | Provider | Literal | Notes |
| --- | --- | --- | --- |
| FE-012C-P011 | claude | elaboration_drift | Semantic normalization reduces some drift, but ambiguity or candidate missing primitives still warrant human review. |

## Interpretation

- Semantic comparison is provisional tooling, not a proven equivalence theory.
- Literal differences remain part of the record even when semantic drift decreases.
- Backbone agreement, elaboration drift, and control-flow agreement should be interpreted together rather than in isolation.
