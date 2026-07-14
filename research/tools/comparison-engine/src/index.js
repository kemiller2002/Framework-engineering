import path from "node:path";
import crypto from "node:crypto";
import { loadAndResolveConfig } from "./validation.js";
import { loadExperimentData } from "./load-responses.js";
import { compareStructure } from "./compare-structure.js";
import { comparePrimitives } from "./compare-primitives.js";
import { compareConstraints } from "./compare-constraints.js";
import { compareRepresentation } from "./compare-representation.js";
import { classifyRecognition, classifyLeakageTerms, detectDomainLeakage, summarizeRecognitionByProvider } from "./compare-recognition.js";
import { loadJson, readOptional, tally } from "./utilities.js";
import { writeOutputs } from "./report-writer.js";
import { summarizeAgreementCounts } from "./agreement-categories.js";

export async function runComparisonEngine(configPath, options = {}) {
  const config = await loadAndResolveConfig(configPath, options);
  const taxonomies = await loadTaxonomies(config);
  const runId = crypto.randomUUID();
  const { records, warnings, dataQuality, packetFiles } = await loadExperimentData(config);
  const primaryRecords = records.filter((record) => record.status === "ok" && record.included_in_primary);
  const filteredDataQuality = [...dataQuality, ...warnings.filter(Boolean).map((item, index) => ({
    packet_id: "",
    provider: "",
    status: `warning_${index + 1}`,
    notes: item,
  }))].filter((item) => item && item.status !== "not_applicable");

  const recognitionRows = primaryRecords.map((record) => {
    const raw = String(record.response?.recognized_artifact ?? "");
    const domainTerms = detectDomainLeakage(record.response, config.terminology_watch || []);
    return {
      ecr_id: record.ecr_id,
      experiment_id: record.experiment_id,
      packet_id: record.packet_id,
      provider: record.provider,
      variant_id: record.variant_id,
      variant_order: record.variant_order,
      variant_label: config.variant_labels?.[record.variant_id] || record.variant_id,
      recognition_value: classifyRecognition(raw, config.named_recognition_patterns || []),
      recognized_artifact_raw: raw,
      domain_terms_introduced: domainTerms,
      prior_knowledge_leakage_risk:
        record.response?.recognition_analysis?.prior_knowledge_leakage_risk ||
        classifyLeakageTerms(domainTerms),
      notes: [record.version_note, record.parse_mode === "tolerant" ? "tolerant_parse" : ""].filter(Boolean).join("; "),
    };
  });

  const recognitionSummary = summarizeRecognitionByProvider(
    recognitionRows.map((row) => ({
      provider: row.provider,
      packet_id: row.packet_id,
      recognition: { value: row.recognition_value },
    })),
    config.variants,
  ).map((entry) => ({
    ...entry,
    rows: recognitionRows.filter((row) => row.provider === entry.provider).sort((left, right) => left.variant_order - right.variant_order),
  }));

  const leakageRows = recognitionRows.map((row) => ({
    packet_id: row.packet_id,
    provider: row.provider,
    domain_terms: row.domain_terms_introduced,
    classification: classifyLeakageTerms(row.domain_terms_introduced),
    notes: row.prior_knowledge_leakage_risk,
  }));

  const structural = { ...buildStructuralResults(primaryRecords, config, taxonomies), run_id: runId };
  const primitives = { ...comparePrimitives(primaryRecords, taxonomies), run_id: runId };
  const constraints = { ...compareConstraints(primaryRecords, taxonomies), run_id: runId };
  const representation = { ...compareRepresentation(primaryRecords), run_id: runId };

  const packetVersions = config.variants.map((variant) => ({
    packet_id: variant.packet_id,
    packet_version: packetFiles.get(variant.packet_id)?.packet_version || "",
  }));

  const observations = buildObservations({
    recognitionSummary,
    structural,
    leakageRows,
    dataQuality: filteredDataQuality,
  });

  const results = {
    config,
    records,
    primaryRecords,
    warnings,
    dataQuality: filteredDataQuality,
    runState: {
      run_id: runId,
      comparator_version: config.comparator_version || "3.1.0",
      generated_at: new Date().toISOString(),
    },
    recognitionRows,
    recognitionSummary,
    structural,
    primitives,
    constraints,
    representation,
    leakageRows,
    packetVersions,
    observations,
    providerNotes: buildProviderNotes(recognitionSummary, leakageRows),
    largestDisagreements: buildLargestDisagreements(structural, primitives, constraints, representation),
    leakageSummary: buildLeakageSummary(leakageRows),
    unresolved: buildUnresolved(filteredDataQuality, structural),
    edrReadiness: filteredDataQuality.some((item) => ["missing", "malformed", "version_unclear", "excluded_wrong_version"].includes(item.status))
      ? "Review data-quality-report.md before EDR drafting."
      : "Observation-only EDR draft is ready for human completion.",
    machine: {
      config: {
        ecr_id: config.ecr_id,
        experiment_id: config.experiment_id,
        title: config.title,
      },
      run_state: {
        run_id: runId,
        comparator_version: config.comparator_version || "3.1.0",
        generated_at: new Date().toISOString(),
      },
      primary_record_count: primaryRecords.length,
      data_quality: filteredDataQuality,
      recognition_rows: recognitionRows,
      structural,
      primitives,
      constraints,
      representation,
      leakage_rows: leakageRows,
      warnings,
    },
  };

  await writeOutputs(config, results);
  return results;
}

async function loadTaxonomies(config) {
  const ontologyRoot = config.ontology_root || path.resolve(config._base_dir, "..", "ontology");
  return {
    role: await loadJson(path.join(ontologyRoot, "procedural-role-taxonomy.json")),
    object: await loadJson(path.join(ontologyRoot, "procedural-object-taxonomy.json")),
    purpose: await loadJson(path.join(ontologyRoot, "procedural-purpose-taxonomy.json")),
    stage: await loadJson(path.join(ontologyRoot, "procedural-stage-taxonomy.json")),
    control_flow: await loadJson(path.join(ontologyRoot, "control-flow-taxonomy.json")),
  };
}

function buildStructuralResults(primaryRecords, config, taxonomies) {
  const providerComparisons = [];

  for (const provider of config.providers) {
    const providerRecords = primaryRecords
      .filter((record) => record.provider === provider)
      .sort((left, right) => left.variant_order - right.variant_order);
    const comparison = compareStructure(providerRecords, taxonomies);
    providerComparisons.push({
      scope: `${provider} across variants`,
      literal: summarizeAgreementCounts(comparison.literal_counts),
      backbone: comparison.backbone.category,
      conceptual: summarizeAgreementCounts(comparison.conceptual_counts),
      dimensional: summarizeAgreementCounts(comparison.dimensional_counts),
      notes: "Within-provider variant stability with backbone separated from wording variance.",
    });
  }

  for (const variant of config.variants) {
    const variantRecords = primaryRecords.filter((record) => record.packet_id === variant.packet_id);
    const comparison = compareStructure(variantRecords, taxonomies);
    providerComparisons.push({
      scope: `${variant.packet_id} across providers`,
      literal: summarizeAgreementCounts(comparison.literal_counts),
      backbone: comparison.backbone.category,
      conceptual: summarizeAgreementCounts(comparison.conceptual_counts),
      dimensional: summarizeAgreementCounts(comparison.dimensional_counts),
      notes: "Across-provider variant stability with backbone separated from wording variance.",
    });
  }

  const overall = compareStructure(primaryRecords, taxonomies);
  return {
    providerComparisons,
    literal_profile: summarizeAgreementCounts(tally(providerComparisons.map((item) => item.literal))),
    backbone_profile: summarizeAgreementCounts(tally(providerComparisons.map((item) => item.backbone))),
    conceptual_profile: summarizeAgreementCounts(tally(providerComparisons.map((item) => item.conceptual))),
    dimensional_profile: summarizeAgreementCounts(tally(providerComparisons.map((item) => item.dimensional))),
    overall,
  };
}

function buildObservations({ recognitionSummary, structural, leakageRows, dataQuality }) {
  const observations = [];
  let index = 1;
  for (const entry of recognitionSummary) {
    observations.push({
      id: `OBS-${String(index).padStart(3, "0")}`,
      observation: `${entry.provider} recognition pattern classified as ${entry.pattern}.`,
      source: "recognition-persistence-results.csv",
      confidence: "medium",
    });
    index += 1;
  }
  observations.push({
    id: `OBS-${String(index).padStart(3, "0")}`,
    observation: `Structural stability profile is ${structural.dimensional_profile} dimensionally and ${structural.literal_profile} literally.`,
    source: "structural-stability-report.md",
    confidence: "medium",
  });
  index += 1;
  observations.push({
    id: `OBS-${String(index).padStart(3, "0")}`,
    observation: `Structural backbone profile is ${structural.backbone_profile}; wording-sensitive literal profile is ${structural.literal_profile}.`,
    source: "structural-stability-report.md",
    confidence: "medium",
  });
  index += 1;
  const leakageCount = leakageRows.filter((row) => row.domain_terms.length > 0).length;
  observations.push({
    id: `OBS-${String(index).padStart(3, "0")}`,
    observation: `${leakageCount} primary responses introduced watched domain terminology.`,
    source: "domain-leakage-report.md",
    confidence: "medium",
  });
  index += 1;
  if (dataQuality.length > 0) {
    observations.push({
      id: `OBS-${String(index).padStart(3, "0")}`,
      observation: `${dataQuality.length} data-quality issues were recorded and require review before interpretation.`,
      source: "data-quality-report.md",
      confidence: "high",
    });
  }
  return observations;
}

function buildProviderNotes(recognitionSummary, leakageRows) {
  const notes = [];
  for (const entry of recognitionSummary) {
    notes.push(`${entry.provider} pattern: ${entry.pattern}.`);
  }
  const leakageByProvider = tally(
    leakageRows.filter((row) => row.domain_terms.length > 0).map((row) => row.provider),
  );
  for (const [provider, count] of Object.entries(leakageByProvider)) {
    notes.push(`${provider} introduced watched domain terms in ${count} responses.`);
  }
  return notes;
}

function buildLargestDisagreements(structural, primitives, constraints, representation) {
  const notes = [];
  if (structural.literal_profile !== structural.dimensional_profile) {
    notes.push("Structural literal and dimensional profiles diverge.");
  }
  if (structural.backbone_profile !== structural.literal_profile) {
    notes.push("Structural backbone stability is stronger than wording-sensitive literal agreement.");
  }
  for (const [field, result] of Object.entries(primitives)) {
    if (result?.category === "disagreement") {
      notes.push(`Primitive disagreement: ${field}.`);
    }
  }
  for (const item of constraints.field_results) {
    if (item.comparison.category === "disagreement") {
      notes.push(`Constraint disagreement: ${item.field}.`);
    }
  }
  if (representation.canonical_summary.category === "disagreement") {
    notes.push("Canonical summary disagreement remains material.");
  }
  return notes.length > 0 ? notes : ["No single disagreement dominates the dataset."];
}

function buildLeakageSummary(leakageRows) {
  const matches = leakageRows.filter((row) => row.domain_terms.length > 0);
  if (matches.length === 0) {
    return ["No watched domain terms were introduced in the included primary responses."];
  }
  return matches.map((row) => `${row.packet_id} ${row.provider}: ${row.domain_terms.join(", ")} (${row.classification}).`);
}

function buildUnresolved(dataQuality, structural) {
  const unresolved = dataQuality.map((item) => `${item.packet_id || "dataset"} ${item.provider || ""}: ${item.status} (${item.notes})`.trim());
  if (structural.literal_profile === "mixed" || structural.dimensional_profile === "mixed") {
    unresolved.push("Structural comparison remains mixed and still needs human review.");
  }
  return unresolved.length > 0 ? unresolved : ["No additional unresolved issues recorded."];
}
