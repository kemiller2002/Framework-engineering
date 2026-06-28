# FE-011A Protocol

## Objective

Test whether Framework Engineering redesigns improve output quality before human validation work begins.

## Hypotheses

H1:
Framework Engineering redesigns will produce outputs with stronger evidence use.

H2:
Framework Engineering redesigns will produce outputs with better traceability.

H3:
Framework Engineering redesigns will produce more actionable conclusions.

H4:
Framework Engineering redesigns may produce longer or more complex outputs.

H5:
If redesigned versions do not improve performance in the LLM pilot, the redesign protocol should be revised before human testing.

## Experimental Design

For each framework:

- Provide one original-style version.
- Provide one Framework Engineering redesigned version.
- Label them only as Version A and Version B.
- Provide the same task scenario.
- Ask LLM participants to perform the task, not judge the framework.
- Store outputs separately.
- Use a blinded evaluator prompt to evaluate outputs without knowing which version generated them.

## Randomization / Version Masking

- Version labels are masked as A and B.
- Mixed ordering is used to avoid consistently placing redesigned versions second.

Assignment:

- SWOT
  Version A: Original SWOT
  Version B: Evidence-Structured SWOT
- Five Whys
  Version A: Evidence-Guided Why Analysis
  Version B: Original Five Whys
- OODA
  Version A: Original OODA
  Version B: Evidence-Calibrated OODA

## Participant Instructions

- Apply the provided framework packet to the provided scenario.
- Do not evaluate the framework.
- Preserve uncertainty.
- Avoid inventing facts outside the scenario.

## Evaluator Blinding

- Evaluators receive outputs without version provenance.
- Evaluators assess output quality only.
- Evaluators should not infer which packet is original or redesigned.

## Data Collection

- model name
- date
- framework packet used
- scenario used
- participant output
- evaluator output
- run notes

## Failure Conditions

- Redesigned versions produce no observable improvement.
- Redesigned versions are consistently more verbose without improved quality.
- Redesigned versions reduce clarity.
- Evaluator cannot distinguish output quality differences.
- Original versions produce equal or better outputs across most dimensions.

## Success Conditions

- Redesigned versions improve evidence use.
- Redesigned versions improve traceability.
- Redesigned versions improve actionability.
- Redesigned versions preserve or improve clarity.
- Redesign tradeoffs are identifiable.

## Threats to Validity

- LLM behavior may not generalize to human participants.
- Prompt sensitivity may distort differences between framework packets.
- Evaluator judgment may still reflect hidden bias even when blinded.
- Small pilot size may overstate or understate effects.

## Known Design Limitations

- The redesigned packets generally include more scaffolding than the original packets. This means the pilot may measure the effect of additional structure, not only the effect of Framework Engineering.
- The evaluator rubric emphasizes evidence use, traceability, actionability, and uncertainty handling. Those dimensions are aligned with the redesign goals and may therefore favor redesigned packets by construction.
- The packet structures are not output-length neutral. More structured packets may produce longer answers that appear more complete even when the underlying reasoning quality is unchanged.
- Version masking is weaker than true blinding because evaluators may infer which outputs came from redesigned packets based on section names and response structure.
- Each framework is paired with a single scenario. Positive or negative findings may reflect scenario fit rather than a framework-level effect.
- If the same model family is used for both participant and evaluator roles, model-specific preferences may distort the comparison.

## Interpretation Constraints

- This pilot is an instrument check, not a validation study.
- A positive result would justify further testing, not acceptance of Framework Engineering redesign claims.
- A negative or mixed result should be treated as evidence that the packets, prompts, scenarios, rubric, or redesign assumptions need revision before human studies.
- Cross-framework aggregation should be treated cautiously because the redesigns are not equally invasive across SWOT, Five Whys, and OODA.
