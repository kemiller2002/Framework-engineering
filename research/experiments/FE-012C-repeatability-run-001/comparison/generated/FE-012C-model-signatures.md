# FE-012C Model Signatures

## GPT Repeatability Pattern

- Stable count: 0
- Elaboration drift count: 1
- Structural drift count: 14
- Common added primitives: Act (2), Compare (2), Decide (2), Evaluate (2), Generate (2)
- Common removed primitives: Bound (5)

## Claude Repeatability Pattern

- Stable count: 0
- Elaboration drift count: 2
- Structural drift count: 13
- Common added primitives: Observe (5), Decide (3), Act (2), Classify (2), Interpret (2)
- Common removed primitives: Bound (2), Prioritize (2), Generate (1)

## Gemini Repeatability Pattern

- Stable count: 1
- Elaboration drift count: 5
- Structural drift count: 9
- Common added primitives: Act (1), Classify (1), Coordinate (1), Reassess (1)
- Common removed primitives: Allocate (1), Communicate (1), Coordinate (1), Decide (1), Prioritize (1)

## Shared Model Behaviors

- All three providers were evaluated with the same packet IDs and packet contents.
- Shared stability should be treated as instrument repeatability evidence, not as independent confirmation of theory.
- Shared drift may reflect packet ambiguity, vocabulary pressure, or common pattern-completion behavior.

## Model-Specific Tendencies

Use the primitive add/remove tables above as descriptive signatures only.

Do not treat these tendencies as stable model personality traits without additional reruns.

## Warnings Against Overinterpreting Model Personality

- The sample size is limited to 15 packets per provider.
- Provider outputs remain sensitive to prompt phrasing, conversation freshness, and latent artifact recognition.
- Same-family or same-provider consistency is not equivalent to human or independent replication.
