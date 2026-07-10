import test from "node:test";
import assert from "node:assert/strict";
import { compareStructure } from "../src/compare-structure.js";
import { comparePrimitives } from "../src/compare-primitives.js";
import { compareConstraints } from "../src/compare-constraints.js";

const taxonomies = {
  role: {
    observe: { patterns: ["observe", "inspect"] },
    evaluate: { patterns: ["evaluate", "assess", "re-sort"] },
    generate: { patterns: ["expand", "branch"] },
    terminate: { patterns: ["end", "exit", "terminate"] },
  },
  object: {
    path: { patterns: ["path", "candidate"] },
    input: { patterns: ["input", "evidence"] },
  },
  purpose: {
    assessment: { patterns: ["assess", "evaluate", "re-sort"] },
  },
  stage: {},
  control_flow: {},
};

test("neutral identity-node expansion is treated as elaboration in structural backbone", () => {
  const records = [
    {
      response: {
        structural_layer: {
          entry_conditions: [{ value: "START -> N1" }],
          exit_conditions: [{ value: "N6 -> END" }],
          loops: [{ value: "N4 -> N5 -> N2A -> N3 -> N4" }],
          branches: [{ value: "N1 -> N2A; N1 -> N2B; N1 -> N2C" }],
          termination_conditions: [{ value: "N6 -> END" }],
          control_flow_shape: "branch converge re-sort loop exit",
        },
      },
    },
    {
      response: {
        structural_layer: {
          entry_conditions: [{ value: "START -> N1" }],
          exit_conditions: [{ value: "N6 -> END" }],
          loops: [{ value: "N4 -> N5 -> N5a -> N2A -> N3 -> N4" }],
          branches: [{ value: "N1 -> N1a -> N2A; N1 -> N1b -> N2B; N1 -> N1c -> N2C" }],
          termination_conditions: [{ value: "N6 -> END" }],
          control_flow_shape: "branch converge re-sort loop exit",
        },
      },
    },
  ];
  const result = compareStructure(records, taxonomies);
  assert.equal(result.backbone.category, "full_agreement");
});

test("primitive reporting separates role stability from wording variance", () => {
  const records = [
    {
      response: {
        primitive_layer: {
          primitive_sequence: ["expand paths", "evaluate fit", "exit"],
          transitions: ["N1->N2A", "N2A->N3"],
          dominant_primitive: "evaluate fit",
          candidate_missing_primitives: ["threshold definition"],
        },
        notes: "node-oriented wording",
      },
    },
    {
      response: {
        primitive_layer: {
          primitive_sequence: ["branch candidates", "re-sort path", "terminate"],
          transitions: ["N1->N1a->N2A", "N2A->N3"],
          dominant_primitive: "re-sort path",
          candidate_missing_primitives: ["selection criterion"],
        },
        notes: "action-oriented wording",
      },
    },
  ];
  const result = comparePrimitives(records, taxonomies);
  assert.ok(result.primitive_roles);
  assert.ok(result.transition_backbone);
  assert.equal(result.style_variance.category, "informational_only");
});

test("constraints compare conceptually across field placement", () => {
  const records = [
    {
      response: {
        constraint_layer: {
          invariants: [{ value: "re-sorting follows differentiating input" }],
          preconditions: [],
          postconditions: [],
          stopping_criteria: [],
          validity_conditions: [],
        },
      },
    },
    {
      response: {
        constraint_layer: {
          invariants: [],
          preconditions: [],
          postconditions: [],
          stopping_criteria: [],
          validity_conditions: [{ value: "re-sorting follows differentiating input" }],
        },
      },
    },
  ];
  const result = compareConstraints(records, taxonomies);
  assert.ok(result.conceptual);
  assert.equal(result.conceptual.category, "full_agreement");
});
