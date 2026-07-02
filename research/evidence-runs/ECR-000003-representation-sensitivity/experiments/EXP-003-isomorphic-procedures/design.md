# EXP-003 Design

Use three domain-distinct packets with the same control-flow pattern.

The domains differ, but the procedural structure should remain matched:

- unresolved state
- multiple alternatives
- differentiating input
- reassessment
- loop if unresolved
- closure if accepted or no further continuation is justified

Prediction:

If extracted structures remain similar despite domain differences, H018 strengthens.

If they differ mainly by domain language, H018 weakens or remains low.
