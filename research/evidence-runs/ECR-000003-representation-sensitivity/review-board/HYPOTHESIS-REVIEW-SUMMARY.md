# ECR-000003 Hypothesis Review Summary

| Hypothesis | Prior Direction | Proposed Direction | Prior Strength | Proposed Strength | Kill Condition | Recommendation |
|---|---|---|---|---|---|---|
| H002 | unresolved | mixed | low-moderate | weak | tested_not_met | retain |
| H003 | unresolved | slightly_supported | moderate | weak | partially_met | retain |
| H013 | unresolved | mixed | moderate | moderate | tested_not_met | split |
| H015 | unresolved | slightly_supported | moderate | moderate | tested_not_met | strengthen_qualitatively |
| H016 | unresolved | waiting | low | insufficient | not_tested | defer |
| H017 | unresolved | mixed | low | weak | partially_met | retain |
| H018 | proposed | slightly_supported | very low | weak | tested_not_met | retain |

## Strongest Gains

- H015 gained the clearest operational support because ECR-000003 completed normalization, certification, comparison, and explainability without raw-data mutation.
- H018 gained the strongest candidate theoretical support because `EXP-003` showed `mostly_stable` backbone across domain variants.

## Strongest Challenges

- H003 remains challenged by strong provider-specific recognition and primitive-layer divergence.
- H017 remains challenged by mixed backbone and persistent disagreement in primitive and constraint layers.

## Unresolved Hypotheses

- H002
- H013
- H016
- H017

## Hypotheses That May Need Splitting

- H013 Recognition Bias
  The review suggests lexical recognition bias and structural recognition pressure should be separated.

## Hypotheses Not Sufficiently Tested

- H016 Structural Recognition
  ECR-000003 raised the issue but did not provide a clean graph-only control.

## Hypotheses Whose Support Depends Strongly On Instrument Assumptions

- H002
- H003
- H015
- H017
- H018
