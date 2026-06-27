# Evaluation Principles

Status: Working draft

## Purpose

Evaluation Principles define how Framework Engineering evaluates frameworks, analyses, artifacts, and validation results without creating false precision.

## Appropriate Precision

Frameworks should avoid expressing judgments with greater precision than the available evidence can support.

Numerical values should be used only when they correspond to meaningful, reproducible measurements or when they demonstrably improve decision-making.

When numerical precision cannot be objectively justified, frameworks should prefer:

- categorical assessments
- evidence profiles
- explicit rationale
- qualitative confidence ranges
- reviewer notes
- supporting and opposing evidence

This principle is not anti-math.

Measured values such as latency, pressure, temperature, defect counts, transaction volume, or elapsed time should be represented numerically when appropriate.

The concern is artificial precision in judgments such as:

- quality
- readiness
- confidence
- priority
- severity
- maturity
- diagnostic strength
- framework value

## Evidence Profiles

An Evidence Profile preserves multiple dimensions of evaluation rather than compressing them into a single score.

Example dimensions:

- adoption
- unique value
- reproducibility
- calibration
- usability
- evidence support
- known weaknesses

## Categorical Assessment

Preferred categories may include:

- Demonstrated
- Partially Demonstrated
- Needs Refinement
- Not Demonstrated
- Not Applicable

For artifact maturity:

- Experimental
- Emerging
- Established
- Mature

## When Numbers Are Appropriate

Numbers are appropriate when they represent:

- direct measurements
- counts
- elapsed time
- observed frequencies
- reproducible statistical calculations
- explicitly bounded estimates with documented uncertainty

## When Numbers Are Risky

Numbers are risky when they represent:

- subjective quality
- confidence without calibration
- readiness
- maturity
- importance
- priority
- severity without a shared scale
- value judgments

## Aggregate Score Warning

Aggregate scores may obscure weaknesses.

If used, they must be secondary to the evidence profile.

## Evaluation Rule

Do not compress evaluation into a single number unless the decision being made genuinely requires that compression and the loss of information is acceptable.
