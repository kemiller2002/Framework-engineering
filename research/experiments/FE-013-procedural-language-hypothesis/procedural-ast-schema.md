# Procedural AST Schema

```json
{
  "packet_id": "",
  "recognized_artifact": "",
  "entry_conditions": [],
  "exit_conditions": [],
  "preconditions": [],
  "postconditions": [],
  "required_steps": [],
  "optional_steps": [],
  "branches": [
    {
      "condition": "",
      "paths": []
    }
  ],
  "loops": [
    {
      "loop_condition": "",
      "returns_to": ""
    }
  ],
  "invariants": [],
  "termination_conditions": [],
  "procedural_ast": {
    "type": "",
    "label": "",
    "children": []
  },
  "canonical_summary": "",
  "ambiguities": [],
  "confidence": {
    "ast": "",
    "constraints": "",
    "overall": ""
  },
  "notes": ""
}
```

## Valid Confidence Values

- High
- Moderate
- Low

## Notes

- `procedural_ast` may be a tree or a compact graph-like structure encoded as nested nodes.
- Static artifacts are allowed to produce shallow or hierarchical structures.
- Missing loops or branches should be represented as empty arrays rather than invented structures.
