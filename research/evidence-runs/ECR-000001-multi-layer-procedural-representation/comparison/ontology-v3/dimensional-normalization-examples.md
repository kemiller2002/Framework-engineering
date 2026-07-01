# Dimensional Normalization Examples

Generate alternatives:
- role=generate
- object=alternative
- purpose=exploration

Prioritize alternatives:
- role=prioritize
- object=alternative
- purpose=ordering

Stop investigation:
- role=terminate
- object=process
- purpose=termination

Accept hypothesis:
- role=decide
- object=hypothesis
- purpose=selection

Gather evidence:
- role=observe
- object=evidence
- purpose=evidence_support

Evaluate evidence:
- role=evaluate
- object=evidence
- purpose=evidence_support

Compare competing explanations:
- role=compare
- object=explanation
- purpose=disambiguation

Verify a conclusion:
- role=verify
- object=conclusion
- purpose=validation
