# EXP-001 Design

Use the same underlying graph structure introduced in ECR-000002 `P001D`.

Variants:

- baseline graph
- same topology with randomly renamed nodes
- same graph with randomized edge declaration order
- same topology with neutral pass-through nodes inserted

Prediction:

If recognition persists across perturbations, structural recognition may depend on topology.

If recognition changes sharply, recognition may depend on presentation features.

## Version Note

`P001D identity-node-expanded` was corrected to packet version `1.1`.

Version `1.0` omitted the explicit terminal edge from the selected-path state to `END`.

Any `P001D` responses collected before this correction are pre-fix responses and are not directly valid for the topology-preservation comparison.
