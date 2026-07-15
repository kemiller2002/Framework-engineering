import path from "node:path";
import { writeFile } from "node:fs/promises";

const repoRoot = path.resolve(process.cwd(), "../../..");
const dashboardDir = path.join(repoRoot, "research", "operating-system", "evidence-dashboard");

const dashboard = {
  current_research_state: "ECR-000003 complete; synthesis and formal review in progress.",
  completed_ecrs: [
    {
      id: "ECR-000003",
      title: "Representation Sensitivity",
      status: "complete_under_review",
    },
  ],
  active_hypotheses: [
    { id: "H002", name: "Representation Independence", direction: "mixed", evidence_strength: "weak", latest_evidence: "ECR-000003 Findings", next_test: "Negative non-isomorphic controls" },
    { id: "H003", name: "Multi-Model Convergence", direction: "slightly_supported", evidence_strength: "weak", latest_evidence: "Hypothesis Review Board", next_test: "Human baseline extraction" },
    { id: "H013", name: "Recognition Bias", direction: "mixed", evidence_strength: "moderate", latest_evidence: "Hypothesis Review Board", next_test: "Recognition-control replication" },
    { id: "H015", name: "Measurement Instrument Reliability", direction: "slightly_supported", evidence_strength: "moderate", latest_evidence: "Hypothesis Review Board", next_test: "Human baseline extraction" },
    { id: "H016", name: "Structural Recognition", direction: "waiting", evidence_strength: "insufficient", latest_evidence: "Hypothesis Review Board", next_test: "Recognition-control replication" },
    { id: "H017", name: "Procedural Compression", direction: "mixed", evidence_strength: "weak", latest_evidence: "Hypothesis Review Board", next_test: "Negative non-isomorphic controls" },
    { id: "H018", name: "Procedural Isomorphism", direction: "slightly_supported", evidence_strength: "weak", latest_evidence: "Hypothesis Review Board", next_test: "Negative non-isomorphic controls" },
  ],
  current_claims: {
    candidate_supported: [
      "Structural backbone may remain more stable than primitive sequence in some settings.",
      "Recognition and watched terminology do not always force structural divergence.",
      "Provider-specific differences remain material in ECR-000003.",
    ],
    unsupported: [
      "Framework Engineering is proven.",
      "Universal procedural grammar is proven.",
      "Clarity, EDF, or HelixNote are validated by ECR-000003.",
    ],
  },
  instrument_status: {
    official_comparator: "3.1.0",
    official_comparator_state: "frozen_for_ecr_000003",
    explainability_layer: "3.2.0",
  },
  material_threats: [
    "no human baseline",
    "recognition leakage",
    "representation-format effects",
    "provider-specific response style",
    "false structural equivalence risk",
  ],
  unresolved_uncertainty: [
    "whether negative non-isomorphic controls sharply reduce apparent stability",
    "whether human experts recover similar structures",
    "whether recognition pressure is primarily lexical or structural",
  ],
  next_research_action: {
    recommendation: "Negative Non-Isomorphic Controls",
    rationale: "Highest current risk is false structural equivalence.",
  },
};

const index = `# Framework Engineering Evidence Dashboard

## Current Research State

${dashboard.current_research_state}

## Completed ECRs

- ECR-000003 Representation Sensitivity

## Active Hypotheses

| Hypothesis | Direction | Evidence Strength | Latest Evidence | Next Test |
|---|---|---|---|---|
${dashboard.active_hypotheses.map((item) => `| ${item.id} ${item.name} | ${item.direction} | ${item.evidence_strength} | ${item.latest_evidence} | ${item.next_test} |`).join("\n")}

## Current Claims

${dashboard.current_claims.candidate_supported.map((item) => `- ${item}`).join("\n")}

## Instrument Status

- Official comparator: ${dashboard.instrument_status.official_comparator}
- Explainability layer: ${dashboard.instrument_status.explainability_layer}

## Material Threats

${dashboard.material_threats.map((item) => `- ${item}`).join("\n")}

## Unresolved Uncertainty

${dashboard.unresolved_uncertainty.map((item) => `- ${item}`).join("\n")}

## Next Research Action

- ${dashboard.next_research_action.recommendation}

## What May Be Said Publicly

- evidence is consistent with limited backbone stability under some transformations
- candidate methodological findings are stronger than broad theoretical claims
- the measurement instrument supported formal evidence review in ECR-000003

## What Must Not Be Claimed

- Framework Engineering is proven
- universal procedural grammar is proven
- Clarity, EDF, or HelixNote are validated
- recognition is required for structural recovery
`;

async function main() {
  await writeFile(path.join(dashboardDir, "evidence-dashboard.json"), `${JSON.stringify(dashboard, null, 2)}\n`, "utf8");
  await writeFile(path.join(dashboardDir, "index.md"), `${index}\n`, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
