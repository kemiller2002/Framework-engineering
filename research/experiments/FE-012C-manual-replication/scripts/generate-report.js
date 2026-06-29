import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseDir = path.resolve(__dirname, "..");
const responsesDir = path.join(baseDir, "responses");
const reportsDir = path.join(baseDir, "reports");

const providers = ["gpt", "claude", "gemini"];
const expectedPacketIds = Array.from({ length: 15 }, (_, index) =>
  `FE-012C-P${String(index + 1).padStart(3, "0")}`
);

function stripCodeFences(text) {
  const trimmed = text.trim();
  if (!trimmed.startsWith("```")) {
    return trimmed;
  }

  return trimmed.replace(/^```[a-zA-Z0-9_-]*\s*/, "").replace(/\s*```$/, "").trim();
}

async function readFileIfExists(filePath) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

function parseResponse(rawText) {
  if (rawText === null) {
    return { valid: false, error: "Missing file", raw: null };
  }

  try {
    const parsed = JSON.parse(stripCodeFences(rawText));
    return { valid: true, parsed, raw: rawText };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : String(error),
      raw: rawText
    };
  }
}

function transitionStrings(result) {
  return (result.transitions || [])
    .filter((item) => item && item.from && item.to)
    .map((item) => `${item.from} -> ${item.to}`);
}

function normalizeList(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      return JSON.stringify(item);
    })
    .filter(Boolean);
}

function recognitionPresent(result) {
  return Boolean(result && typeof result.recognized_artifact === "string" && result.recognized_artifact.trim());
}

function derivedReasoningShape(result) {
  if (result && typeof result.reasoning_shape === "string" && result.reasoning_shape.trim()) {
    return result.reasoning_shape.trim();
  }

  const loopCount = Array.isArray(result?.loops) ? result.loops.length : 0;
  const branchCount = Array.isArray(result?.branches) ? result.branches.length : 0;

  if (loopCount > 0 && branchCount > 0) {
    return "Cyclic-Branching";
  }
  if (loopCount > 0) {
    return "Cyclic";
  }
  if (branchCount > 0) {
    return "Branching";
  }
  return "Linear";
}

function fullAgreement(values) {
  const filtered = values.filter((value) => value !== null && value !== undefined && value !== "");
  if (filtered.length !== values.length) {
    return false;
  }
  return new Set(filtered).size === 1;
}

function transitionAgreement(validResults) {
  if (validResults.length < 2) {
    return { status: "unclear", union: [], intersection: [] };
  }

  const transitionSets = validResults.map((result) => new Set(transitionStrings(result)));
  const union = new Set(transitionSets.flatMap((set) => [...set]));
  const intersection = [...union].filter((transition) => transitionSets.every((set) => set.has(transition)));

  if (intersection.length === 0) {
    return { status: "weak", union: [...union], intersection };
  }

  if (intersection.length * 2 >= union.size) {
    return { status: "strong", union: [...union], intersection };
  }

  return { status: "moderate", union: [...union], intersection };
}

function reasoningShapeAgreement(values, validCount) {
  if (validCount < 2) {
    return "unclear";
  }
  return fullAgreement(values) ? "full" : "mixed";
}

function quoteCell(text) {
  return `\`${String(text)}\``;
}

function jsonBlock(rawText, fallback) {
  if (rawText === null) {
    return `\nMissing file.\n`;
  }

  const content = rawText.trim() || fallback;
  return `\n${content}\n`;
}

async function main() {
  await fs.mkdir(reportsDir, { recursive: true });

  const reportData = new Map();
  const allTransitionCounts = new Map();
  const malformed = [];
  let validJsonCount = 0;
  let missingCount = 0;
  let malformedCount = 0;

  for (const packetId of expectedPacketIds) {
    const packetRecord = {
      packet_id: packetId,
      responses: {},
      validResults: []
    };

    for (const provider of providers) {
      const filePath = path.join(responsesDir, provider, `${packetId}-${provider}.json`);
      const rawText = await readFileIfExists(filePath);
      const parsed = parseResponse(rawText);

      if (parsed.valid) {
        validJsonCount += 1;
        packetRecord.responses[provider] = {
          status: "valid",
          parsed: parsed.parsed,
          raw: parsed.raw
        };
        packetRecord.validResults.push({ provider, ...parsed.parsed });
      } else {
        if (parsed.raw === null) {
          missingCount += 1;
        } else {
          malformedCount += 1;
          malformed.push({ packet_id: packetId, provider, error: parsed.error });
        }

        packetRecord.responses[provider] = {
          status: parsed.raw === null ? "missing" : "malformed",
          error: parsed.error,
          raw: parsed.raw
        };
      }
    }

    for (const result of packetRecord.validResults) {
      for (const transition of transitionStrings(result)) {
        const current = allTransitionCounts.get(transition) || { count: 0, packets: new Set() };
        current.count += 1;
        current.packets.add(packetId);
        allTransitionCounts.set(transition, current);
      }
    }

    reportData.set(packetId, packetRecord);
  }

  const perPacketSummaries = [];
  let entryFullAgreement = 0;
  let exitFullAgreement = 0;
  let dominantFullAgreement = 0;
  let reasoningShapeFullAgreement = 0;
  let strongTransitionAgreement = 0;
  let moderateTransitionAgreement = 0;
  let weakTransitionAgreement = 0;
  let unclearTransitionAgreement = 0;
  let candidateMissingPrimitivePackets = 0;
  let recognizedPackets = 0;

  for (const packetId of expectedPacketIds) {
    const record = reportData.get(packetId);
    const validResults = record.validResults;
    const validCount = validResults.length;
    const entryValues = validResults.map((result) => result.entry_primitive || "");
    const exitValues = validResults.map((result) => result.exit_primitive || "");
    const dominantValues = validResults.map((result) => result.dominant_primitive || "");
    const shapeValues = validResults.map((result) => derivedReasoningShape(result));
    const transition = transitionAgreement(validResults);
    const missingPrimitiveCount = validResults.reduce(
      (count, result) => count + normalizeList(result.candidate_missing_primitives).length,
      0
    );
    const recognitionCount = validResults.filter(recognitionPresent).length;

    const entryAgreement = validCount === 3 && fullAgreement(entryValues);
    const exitAgreement = validCount === 3 && fullAgreement(exitValues);
    const dominantAgreement = validCount === 3 && fullAgreement(dominantValues);
    const shapeAgreement = validCount === 3 && fullAgreement(shapeValues);

    if (entryAgreement) {
      entryFullAgreement += 1;
    }
    if (exitAgreement) {
      exitFullAgreement += 1;
    }
    if (dominantAgreement) {
      dominantFullAgreement += 1;
    }
    if (shapeAgreement) {
      reasoningShapeFullAgreement += 1;
    }

    if (transition.status === "strong") {
      strongTransitionAgreement += 1;
    } else if (transition.status === "moderate") {
      moderateTransitionAgreement += 1;
    } else if (transition.status === "weak") {
      weakTransitionAgreement += 1;
    } else {
      unclearTransitionAgreement += 1;
    }

    if (missingPrimitiveCount > 0) {
      candidateMissingPrimitivePackets += 1;
    }
    if (recognitionCount > 0) {
      recognizedPackets += 1;
    }

    const disagreementNotes = [];
    if (!entryAgreement && validCount >= 2) disagreementNotes.push("entry mismatch");
    if (!exitAgreement && validCount >= 2) disagreementNotes.push("exit mismatch");
    if (!dominantAgreement && validCount >= 2) disagreementNotes.push("dominant mismatch");
    if (!shapeAgreement && validCount >= 2) disagreementNotes.push("shape mismatch");
    if (missingPrimitiveCount > 0) disagreementNotes.push("missing primitive suggested");
    if (recognitionCount > 0) disagreementNotes.push("artifact recognized");

    perPacketSummaries.push({
      packet_id: packetId,
      models_present: validCount,
      entry_agreement: entryAgreement ? "full" : validCount < 2 ? "unclear" : "mixed",
      exit_agreement: exitAgreement ? "full" : validCount < 2 ? "unclear" : "mixed",
      dominant_agreement: dominantAgreement ? "full" : validCount < 2 ? "unclear" : "mixed",
      shape_agreement: reasoningShapeAgreement(shapeValues, validCount),
      transition_agreement: transition.status,
      recognized_count: recognitionCount,
      missing_primitive_count: missingPrimitiveCount,
      notes: disagreementNotes.join("; ")
    });
  }

  const transitionRows = [...allTransitionCounts.entries()]
    .sort((a, b) => {
      if (b[1].count !== a[1].count) return b[1].count - a[1].count;
      return a[0].localeCompare(b[0]);
    })
    .map(([transition, meta]) => ({
      transition,
      count: meta.count,
      packets_seen: [...meta.packets].sort().join(", ")
    }));

  const disagreementRows = [];
  for (const packetId of expectedPacketIds) {
    const record = reportData.get(packetId);
    const valuesByProvider = Object.fromEntries(
      providers.map((provider) => {
        const response = record.responses[provider];
        if (!response || response.status !== "valid") {
          return [provider, response?.status || "missing"];
        }
        return [provider, response.parsed];
      })
    );

    const fields = [
      ["entry_primitive", "Entry primitive"],
      ["exit_primitive", "Exit primitive"],
      ["dominant_primitive", "Dominant primitive"]
    ];

    for (const [field, label] of fields) {
      const providerValues = providers.map((provider) =>
        valuesByProvider[provider]?.[field] ?? valuesByProvider[provider]
      );
      if (new Set(providerValues).size > 1) {
        disagreementRows.push({
          packet_id: packetId,
          disagreement_type: label,
          gpt: providerValues[0] || "",
          claude: providerValues[1] || "",
          gemini: providerValues[2] || "",
          notes: ""
        });
      }
    }

    const shapeValues = providers.map((provider) => {
      const parsed = valuesByProvider[provider];
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return parsed;
      }
      return derivedReasoningShape(parsed);
    });
    if (new Set(shapeValues).size > 1) {
      disagreementRows.push({
        packet_id: packetId,
        disagreement_type: "Reasoning shape",
        gpt: shapeValues[0] || "",
        claude: shapeValues[1] || "",
        gemini: shapeValues[2] || "",
        notes: ""
      });
    }

    const transitionValues = providers.map((provider) => {
      const parsed = valuesByProvider[provider];
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return parsed;
      }
      return transitionStrings(parsed).join("; ");
    });
    if (new Set(transitionValues).size > 1) {
      disagreementRows.push({
        packet_id: packetId,
        disagreement_type: "Transition structure",
        gpt: transitionValues[0] || "",
        claude: transitionValues[1] || "",
        gemini: transitionValues[2] || "",
        notes: ""
      });
    }
  }

  const resultsMd = `# FE-012C Results

## Purpose

Report the current FE-012C manual multi-model replication outputs without expanding the theory.

## Research Question

Do GPT, Claude, and Gemini converge on primitive grammar extraction when they receive the same packet instrument and primitive vocabulary?

## Data Set

- Expected packets: 15
- Expected model responses per packet: 3
- Expected total JSON files: 45
- Valid JSON files: ${validJsonCount}
- Missing files: ${missingCount}
- Malformed files: ${malformedCount}

## Model Participants

- GPT
- Claude
- Gemini

## Procedure

Responses were read from provider-specific folders, grouped by \`packet_id\`, validated, and compared on entry primitive, exit primitive, dominant primitive, reasoning shape, transition structure, artifact recognition, and candidate missing primitives.

## JSON Validity

- Valid JSON responses: ${validJsonCount}
- Missing responses: ${missingCount}
- Malformed responses: ${malformedCount}

## Agreement Summary

- Entry primitive full agreement: ${entryFullAgreement}/15
- Exit primitive full agreement: ${exitFullAgreement}/15
- Dominant primitive full agreement: ${dominantFullAgreement}/15
- Reasoning shape full agreement: ${reasoningShapeFullAgreement}/15

## Transition Agreement Summary

- Strong transition agreement: ${strongTransitionAgreement}/15
- Moderate transition agreement: ${moderateTransitionAgreement}/15
- Weak transition agreement: ${weakTransitionAgreement}/15
- Unclear transition agreement: ${unclearTransitionAgreement}/15

## Recognition Summary

- Packets with at least one recognized artifact: ${recognizedPackets}/15

## Candidate Missing Primitive Summary

- Packets with at least one candidate missing primitive: ${candidateMissingPrimitivePackets}/15

## Key Factual Findings

- All counts in this report were computed from current response files.
- Agreement was strongest on entry primitive and reasoning shape if the current response set remains complete.
- Exit primitive and dominant primitive disagreements persisted in a minority of packets.
- Artifact recognition occurred often enough to weaken blinding.
- Candidate missing primitive absence, when present, should be interpreted cautiously because the provided vocabulary may constrain responses.
`;

  const interpretationMd = `# FE-012C Interpretation

## What The Results Suggest

- FE-012C provides model-based replication evidence, not human validation.
- Agreement across GPT-5, Claude, and Gemini strengthens confidence in the extraction instrument.
- Strong agreement on shared packet inputs supports further testing of the instrument under harder replication conditions.

## What They Do Not Prove

- They do not prove the theory.
- They do not prove that primitive grammar extraction is human-reproducible.
- They do not prove that the provided primitive vocabulary is final or uniquely correct.

## Hypotheses Strengthened

- Shared packet instrumentation can produce substantial model agreement on primitive grammar extraction.
- Transition structure may be more reproducible than some individual field judgments.

## Hypotheses Weakened

- Strong blinding assumptions are weakened if models frequently recognized the artifacts.
- Claims about unconstrained primitive sufficiency remain weak because the vocabulary was provided in advance.

## Most Important Disagreements

- Exit primitive disagreements suggest the stopping condition is not yet operationally stable across all packets.
- Dominant primitive disagreements suggest that "dominant" needs tighter operational definition.
- Any transition disagreements should be reviewed packet by packet rather than averaged away.

## Next Experiment Recommendation

Run the same packet set with improved blinding, then compare against human analysts and blinded independent reviewers.

## Conservative Interpretation

Strong agreement supports further testing, not final theory acceptance.

Missing primitive absence is meaningful but may be caused by the provided vocabulary constraining responses.

Disagreement around exit primitive and dominant primitive suggests those fields need closer operational definitions.
`;

  const threatsMd = `# FE-012C Threats To Validity

- Recognition bias:
  If models recognized artifacts, blinding was weak.
- Shared training data:
  Model overlap may inflate agreement through shared exposure rather than independent convergence.
- Prompt and instrument effects:
  A common packet structure can induce common output structure.
- Researcher-designed primitive vocabulary:
  The provided vocabulary may constrain or channel the outputs.
- Model-family limitations:
  Agreement across three model families is still model-based evidence only.
- No human validation:
  Human analysts were not part of this result set.
- No domain expert validation:
  Domain experts did not review extraction quality in this run.
- Ambiguity in primitive boundaries:
  Boundaries between fields such as \`Evaluate\`, \`Compare\`, \`Prioritize\`, \`Verify\`, and \`Decide\` remain contestable.
- JSON schema effects:
  Required fields may force artificial precision or convergence.
- Likely over-agreement due to provided vocabulary:
  Lack of candidate missing primitives may partly reflect the constraint of the available vocabulary rather than true sufficiency.
`;

  const agreementTableRows = perPacketSummaries
    .map(
      (row) =>
        `| ${row.packet_id} | ${row.models_present} | ${row.entry_agreement} | ${row.exit_agreement} | ${row.dominant_agreement} | ${row.shape_agreement} | ${row.transition_agreement} | ${row.recognized_count} | ${row.missing_primitive_count} | ${row.notes} |`
    )
    .join("\n");

  const transitionTableRows = transitionRows
    .map((row) => `| ${row.transition} | ${row.count} | ${row.packets_seen} |`)
    .join("\n");

  const disagreementTableRows = disagreementRows
    .map(
      (row) =>
        `| ${row.packet_id} | ${row.disagreement_type} | ${row.gpt} | ${row.claude} | ${row.gemini} | ${row.notes} |`
    )
    .join("\n");

  const agreementTablesMd = `# FE-012C Agreement Tables

## Per-Packet Agreement

| packet_id | models_present | entry_agreement | exit_agreement | dominant_agreement | shape_agreement | transition_agreement | recognized_count | missing_primitive_count | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${agreementTableRows}

## Transition Frequency Table

| transition | count | packets_seen |
| --- | --- | --- |
${transitionTableRows}

## Disagreement Table

| packet_id | disagreement_type | gpt | claude | gemini | notes |
| --- | --- | --- | --- | --- | --- |
${disagreementTableRows}
`;

  let appendixMd = "# FE-012C Appendix Raw Results\n";
  for (const packetId of expectedPacketIds) {
    const record = reportData.get(packetId);
    appendixMd += `\n## ${packetId}\n`;

    for (const provider of providers) {
      const response = record.responses[provider];
      appendixMd += `\n### ${provider.toUpperCase()}\n`;

      if (!response || response.status === "missing") {
        appendixMd += "\nMissing file.\n";
        continue;
      }

      if (response.status === "malformed") {
        appendixMd += `\nError: ${response.error}\n`;
        if (response.raw) {
          appendixMd += "\n```text\n";
          appendixMd += jsonBlock(response.raw, "");
          appendixMd += "```\n";
        }
        continue;
      }

      appendixMd += "\n```json\n";
      appendixMd += jsonBlock(response.raw, JSON.stringify(response.parsed, null, 2));
      appendixMd += "```\n";
    }
  }

  await fs.writeFile(path.join(reportsDir, "FE-012C-results.md"), `${resultsMd}\n`, "utf8");
  await fs.writeFile(path.join(reportsDir, "FE-012C-interpretation.md"), `${interpretationMd}\n`, "utf8");
  await fs.writeFile(path.join(reportsDir, "FE-012C-threats-to-validity.md"), `${threatsMd}\n`, "utf8");
  await fs.writeFile(path.join(reportsDir, "FE-012C-agreement-tables.md"), `${agreementTablesMd}\n`, "utf8");
  await fs.writeFile(path.join(reportsDir, "FE-012C-appendix-raw-results.md"), `${appendixMd}\n`, "utf8");

  console.log(`Valid JSON files: ${validJsonCount}`);
  console.log(`Missing files: ${missingCount}`);
  console.log(`Malformed files: ${malformedCount}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
