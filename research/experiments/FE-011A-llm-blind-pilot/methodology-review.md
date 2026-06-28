# FE-011A Methodology Review

## Scope

This review assesses the FE-011A pilot kit as experimental infrastructure.

It does not report results.

It does not assume that Framework Engineering redesigns are beneficial.

## 1. What assumptions does this experiment make?

- LLM participant behavior is informative enough to expose weaknesses in the study design before human testing.
- The chosen scenarios are representative enough to reveal meaningful differences between original and redesigned packets.
- A blinded evaluator can judge output quality without being materially biased by packet-specific structure.
- The rubric dimensions capture relevant quality differences rather than simply reflecting the redesign goals.
- Version A and Version B comparisons are fair enough to support pilot-level conclusions, even though the redesigned packets generally provide more scaffolding.
- Categorical ratings are sufficient for this stage of research.
- The frameworks selected for the pilot are diverse enough to reveal general design problems rather than only framework-specific ones.

## 2. What are the biggest threats to validity?

- Structure confound:
  The redesigned packets usually request more steps, more sections, and more explicit calibration. This can improve evaluator impressions even if the underlying framework logic is not better.
- Rubric alignment bias:
  The rubric favors evidence use, traceability, actionability, and uncertainty handling. Those are also core redesign targets, so the study risks rewarding the redesign for satisfying its own criteria.
- Weak blinding:
  Evaluators may infer which outputs came from redesigned packets because the response structures differ visibly.
- Scenario dependence:
  Each framework is tested against a single scenario. Findings may reflect scenario fit rather than redesign quality.
- Output-length confound:
  Longer, more segmented answers may appear stronger even when they are only more verbose.
- Model dependence:
  Results may vary substantially by model family, temperature, context behavior, or evaluator model choice.
- Cross-framework asymmetry:
  The amount of redesign differs across SWOT, Five Whys, and OODA, which makes pooled claims harder to justify.

## 3. How could the experiment accidentally favor Framework Engineering?

- The redesigned packets provide richer instructions than the originals, effectively giving the redesigned condition more procedural support.
- The evaluator rubric rewards exactly the qualities the redesign tries to introduce.
- The participant prompt asks for uncertainty preservation and structural compliance, which may interact better with redesigned packets.
- Evaluators may equate explicit structure with rigor.
- If no output-length control is applied, redesigned packets may win because they elicit more complete-looking responses.
- If the same research team that designed the packets also judges edge cases, interpretation bias may drift toward favorable readings.

## 4. How could the experiment accidentally disadvantage Framework Engineering?

- Redesigned packets may impose enough structure to slow the participant or diffuse attention, reducing clarity or decisiveness.
- A compact original framework may perform better on narrow scenarios where speed and simplicity matter more than traceability.
- If evaluators penalize verbosity or repetition, redesigned outputs may score worse even when they preserve more uncertainty and evidence.
- If the participant model follows literal structure rigidly, redesigned packets may produce mechanical answers that obscure useful judgment.
- Because this is a pilot, small samples could make a few weak runs look like a general redesign failure.

## 5. What changes would make the experiment more rigorous?

- Use multiple scenarios per framework, including cases where the redesign is expected to help and cases where it may not.
- Add explicit output-length tracking and review whether quality gains remain after accounting for verbosity.
- Use separate participant and evaluator model families, or ideally human evaluators for at least part of the review.
- Increase blinding by normalizing output formatting before evaluation where possible.
- Add a counter-hypothesis posture to analysis:
  treat "no improvement" and "added complexity without benefit" as expected possibilities, not edge cases.
- Predefine decision rules for what counts as improvement, mixed evidence, or failure to justify follow-up.
- Compare redesigned packets not only against original packets but also against minimally structured controls to separate Framework Engineering effects from generic scaffolding effects.
- Record evaluator rationales in enough detail that disagreements can be audited later.

## 6. Would this study survive peer review in its current form?

Not as strong evidence for Framework Engineering effectiveness.

It could survive as a pilot-instrument paper or internal methods note if its claims remain narrow:

- the study is exploratory
- the instrument is being stress-tested
- the blinding is imperfect
- the packet redesigns are confounded with added structure
- the study does not establish external validity

If presented as evidence that Framework Engineering redesigns are better, the current design would be vulnerable to straightforward criticism.

## 7. What evidence would convince a skeptical reviewer?

- Replicated results across multiple scenarios per framework.
- Similar directional findings across more than one participant model family.
- Evaluator agreement showing that judgments are not purely idiosyncratic.
- Evidence that redesigned outputs remain better after accounting for answer length and formatting differences.
- Cases where redesigned packets outperform both original packets and simpler non-FE structured controls.
- Clear examples where redesigned packets improve traceability or actionability without merely adding boilerplate.
- Mixed findings reported honestly, including scenarios where redesigns add complexity without benefit.

## Overall Assessment

FE-011A is usable as a pilot kit for testing scenarios, packet design, prompting, and evaluation mechanics.

FE-011A is not yet a methodologically strong test of whether Framework Engineering is useful in general.

Its main value is diagnostic:
it can reveal whether the experiment itself is well-formed enough to justify a more rigorous follow-on study.
