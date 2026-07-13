import path from "node:path";
import { exists, readJson, writeJson } from "./utilities.js";

export async function collectExperimentResults(context, logger) {
  const output = {
    ecr_id: "ECR-000003",
    comparator_version: "3.1.0",
    experiments: {},
    warnings: [],
    blocking_issues: []
  };

  for (const experiment of context.experiments) {
    const manifestPath = path.join(experiment.outputRoot, "run-manifest.json");
    const rawPath = path.join(experiment.outputRoot, "raw-comparison-data.json");
    if (!(await exists(rawPath))) {
      output.experiments[experiment.id] = {
        status: "missing_outputs",
        run_id: "",
        comparator_version: "3.1.0",
        ontology_version: "research/tools/comparison-engine/ontology",
        expected_records: 0,
        included_records: 0,
        excluded_records: 0,
        malformed_records: 0,
        tolerant_parsing_events: 0,
        recognition_results: [],
        structural_backbone_result: "",
        primitive_headline: "",
        constraint_concept_result: "",
        representation_compliance: "",
        leakage_findings: 0,
        observation_count: 0,
        unresolved_issues: ["Outputs not present."]
      };
      output.warnings.push(`${experiment.id} outputs not present.`);
      continue;
    }
    const raw = await readJson(rawPath);
    const manifest = await exists(manifestPath)
      ? await readJson(manifestPath)
      : {
          run_id: raw.run_state?.run_id || "",
          comparator_version: raw.run_state?.comparator_version || "3.1.0",
          ontology_version: "research/tools/comparison-engine/ontology",
          primary_record_count: raw.primary_record_count || raw.recognition_rows?.length || 0
        };
    output.experiments[experiment.id] = {
      status: "available",
      run_id: manifest.run_id,
      comparator_version: manifest.comparator_version,
      ontology_version: manifest.ontology_version || "research/tools/comparison-engine/ontology",
      expected_records: manifest.primary_record_count || 0,
      included_records: manifest.primary_record_count || 0,
      excluded_records: raw.data_quality.filter((item) => String(item.status).startsWith("excluded")).length,
      malformed_records: raw.data_quality.filter((item) => item.status === "malformed").length,
      tolerant_parsing_events: raw.data_quality.filter((item) => item.status === "tolerant_parse" || String(item.status).startsWith("warning_")).length,
      recognition_results: raw.recognition_rows.map((row) => ({ packet_id: row.packet_id, provider: row.provider, recognition_value: row.recognition_value })),
      structural_backbone_result: raw.structural.backbone_profile,
      primitive_headline: raw.primitives.primitive_sequence.category,
      constraint_concept_result: raw.constraints.conceptual.category,
      representation_compliance: raw.representation.procedural_ast_presence.category,
      leakage_findings: raw.leakage_rows.filter((row) => row.domain_terms.length > 0).length,
      observation_count: 0,
      unresolved_issues: raw.data_quality.map((item) => `${item.packet_id || "dataset"}:${item.status}`)
    };
  }

  await writeJson(path.join(context.pipelineGeneratedDir, "experiment-results.json"), output);
  logger.log("wrote pipeline/generated/experiment-results.json");
  return output;
}
