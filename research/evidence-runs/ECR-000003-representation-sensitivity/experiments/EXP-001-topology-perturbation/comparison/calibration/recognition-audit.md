# Recognition Classification Audit

## Scope

This audit reviews every canonical EXP-001 response file under `responses/gpt/`, `responses/claude/`, and `responses/gemini/`, plus the excluded pre-fix P001D file under `responses/pre-fix/p001d/`.

This is an instrument audit only.

No response files, comparator code, or experiment outputs were changed.

## Documented Rule Baseline

Allowed classifications:

- `recognized`
  - explicitly names or clearly identifies the source framework or canonical procedural family
- `partial`
  - identifies a closely related procedural family without naming the presumed source
- `unknown`
  - explicitly states unknown, unclear, or cannot identify
- `not_recognized`
  - leaves `recognized_artifact` empty or explicitly says no recognition occurred

## Audit Table

| Packet | Provider | Raw `recognized_artifact` | Comparator Assignment | Manual Audit | Follows Rules? | Rationale |
|---|---|---|---|---|---|---|
| P001A | GPT | empty string | `not_recognized` | `not_recognized` | Yes | Empty field matches the documented rule directly. |
| P001A | Claude | "beam search or iterative narrowing / candidate pruning procedure" | `partial` | `partial` | Yes | This identifies a broad procedural family, not the source artifact. |
| P001A | Gemini | `unrecognized` | `unknown` | `unknown` | Yes, with wording caveat | "unrecognized" functions like an explicit inability to identify. This is acceptable as `unknown`, though the boundary with `not_recognized` is fragile. |
| P001B | GPT | empty string | `not_recognized` | `not_recognized` | Yes | Empty field. |
| P001B | Claude | "no confident recognition ... suggests a generate-and-test or parallel-path selection procedure" | `partial` | `partial` | Yes | The response denies confident identification but still places the artifact in a broad procedural family. |
| P001B | Gemini | empty string | `not_recognized` | `not_recognized` | Yes | Empty field. |
| P001C | GPT | empty string | `not_recognized` | `not_recognized` | Yes | Empty field. |
| P001C | Claude | "No confident recognition ... resembles a generic iterative candidate-discrimination / hypothesis-refinement loop ... no specific named artifact is identified." | `recognized` in `raw-comparison-data.json` | `partial` | No | This is the clearest recognition-classification defect. The response explicitly denies specific identification and only names a broad family resemblance. |
| P001C | Gemini | `unrecognized` | `unknown` | `unknown` | Yes, with wording caveat | Same boundary issue as P001A Gemini. |
| P001D | GPT | empty string | `not_recognized` | `not_recognized` | Yes | Empty field. |
| P001D | Claude | empty string | `not_recognized` | `not_recognized` | Yes | Empty field despite domain-language leakage elsewhere in the response. |
| P001D | Gemini | empty string | `not_recognized` | `not_recognized` | Yes | Empty field. |
| P001D pre-fix v1.0 | unknown file in `responses/pre-fix/p001d/00001D.json` | `Unknown` | excluded | `unknown` if included | Yes, but excluded | Classification is not the issue; exclusion is correct because this is the pre-fix packet version. |

## Findings

### Scientifically sound

- Empty `recognized_artifact` values are handled consistently as `not_recognized`.
- Broad-family descriptions such as Claude P001A and Claude P001B can reasonably be classified as `partial`.
- Pre-fix P001D exclusion is correct and should remain unchanged.

### Calibration defects

- Claude P001C is a probable false `recognized`.
  - Evidence:
    - the raw text explicitly says "No confident recognition"
    - it says "no specific named artifact is identified"
    - it only places the graph in a broad procedural family
  - This should not pass the `recognized` rule.

- The `unknown` versus `not_recognized` boundary is under-specified for strings like `unrecognized`.
  - Current assignments are defensible, but the rule set should explicitly state how `unrecognized` maps.

- Comparator outputs are internally inconsistent.
  - `raw-comparison-data.json` shows `primary_record_count: 12` and no data-quality issues.
  - the current summary and data-quality report show 10/12 included with two malformed files.
  - This is not a recognition-rule error, but it weakens trust in the stored classification record.

## Possible False Cases

### Possible false recognition

- Claude P001C

### Possible false partial

- None clearly established.
- Claude P001A and P001B are borderline but still fit `partial` better than `recognized` or `unknown`.

### Possible false unknown

- Gemini P001A
- Gemini P001C

These are not strong defects. They reflect an unresolved rule-boundary question:

- does `unrecognized` mean "explicitly unknown"
- or does it mean "no recognition occurred"

The current `unknown` assignment is acceptable, but the mapping should be frozen explicitly before v3.1.

### Inconsistent provider treatment

- Claude is allowed to express broad-family resemblance and receives `partial`.
- Gemini uses compressed markers such as `unrecognized` and receives `unknown`.
- That difference is not necessarily wrong, but it means the comparator is sensitive to provider response style rather than only recognition construct.

## Recommendation

Recognition classification should not be frozen at v3.1 until:

1. The `unrecognized` boundary is explicitly documented.
2. Claude P001C style cases are regression-tested so "no confident recognition" cannot become `recognized`.
3. Stored machine-readable outputs are brought into internal consistency with the human-facing summary outputs.
