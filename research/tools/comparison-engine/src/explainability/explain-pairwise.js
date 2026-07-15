import { compareStructure } from "../compare-structure.js";
import { comparePrimitives } from "../compare-primitives.js";
import { compareConstraints } from "../compare-constraints.js";
import { compareRepresentation } from "../compare-representation.js";
import { buildEvidenceTrace } from "./build-evidence-trace.js";
import { buildReviewPriority } from "./build-review-priority.js";
import { classifyCause } from "./classify-cause.js";
import { classifyCompression } from "./classify-compression.js";
import { classifySignificance } from "./classify-significance.js";
import { compareBackbones } from "./compare-backbones.js";
import { compareConstraintExplainability } from "./compare-constraints.js";
import { compareRecognitionExplainability } from "./compare-recognition.js";
import { compareRepresentationExplainability } from "./compare-representation.js";
import { compareSequences } from "./compare-sequences.js";
import { compareTransitions } from "./compare-transitions.js";
import { arrayFromField, buildPairSummary, pairId, scalarFromField, summarizeSignificance } from "./utilities.js";

export function explainPairwise(leftRecord, rightRecord, context) {
  const pairRecords = [leftRecord, rightRecord];
  const officialStructural = compareStructure(pairRecords, context.taxonomies);
  const officialPrimitives = comparePrimitives(pairRecords, context.taxonomies);
  const officialConstraints = compareConstraints(pairRecords, context.taxonomies);
  const officialRepresentation = compareRepresentation(pairRecords);

  const sequenceAnalysis = compareSequences(
    arrayFromField(leftRecord.response, "primitive_layer.primitive_sequence"),
    arrayFromField(rightRecord.response, "primitive_layer.primitive_sequence"),
    { layer: "primitive", field: "primitive_layer.primitive_sequence", executionSensitive: true },
  );
  const transitionAnalysis = compareTransitions(
    arrayFromField(leftRecord.response, "primitive_layer.transitions"),
    arrayFromField(rightRecord.response, "primitive_layer.transitions"),
    { layer: "primitive", field: "primitive_layer.transitions" },
  );
  const backboneAnalysis = compareBackbones(leftRecord.response, rightRecord.response);
  const constraintAnalysis = compareConstraintExplainability(leftRecord.response, rightRecord.response);
  const representationAnalysis = compareRepresentationExplainability(leftRecord.response, rightRecord.response);
  const recognitionAnalysis = compareRecognitionExplainability(leftRecord, rightRecord, {
    namedRecognitionPatterns: context.config.named_recognition_patterns || [],
    backboneCategory: officialStructural.backbone.category,
  });

  const rawDifferences = [
    ...sequenceAnalysis.differences,
    ...transitionAnalysis.differences,
    ...backboneAnalysis.differences,
    ...constraintAnalysis.differences,
    ...representationAnalysis.differences,
    ...recognitionAnalysis.differences,
  ];

  const differenceRecords = rawDifferences.map((difference) => {
    const enriched = {
      ...difference,
      official_v3_1: {
        structural_backbone: officialStructural.backbone.category,
        primitive_sequence: officialPrimitives.primitive_sequence.category,
        primitive_roles: officialPrimitives.primitive_roles.category,
        transitions: officialPrimitives.transitions.category,
        constraints: officialConstraints.conceptual.category,
        representation: officialRepresentation.procedural_ast_presence.category,
      },
      compression_state: classifyCompression(sequenceAnalysis),
    };
    const cause = classifyCause(enriched);
    const significance = classifySignificance(enriched);
    return {
      layer: enriched.layer,
      field: enriched.field,
      difference_type: enriched.difference_type,
      cause,
      significance,
      backbone_impact: enriched.backbone_impact || "unknown",
      left_value: enriched.left_value,
      right_value: enriched.right_value,
      explanation: enriched.explanation,
      evidence_references: buildEvidenceTrace({
        layer: enriched.layer,
        field: enriched.field,
        leftRecord,
        rightRecord,
        leftValue: enriched.left_value,
        rightValue: enriched.right_value,
      }),
      classification_confidence: cause.classification_confidence,
      official_v3_1: enriched.official_v3_1,
      compression_state: enriched.compression_state,
    };
  });

  const humanReviewPriority = buildReviewPriority(differenceRecords);
  const summary = {
    ...buildPairSummary(differenceRecords),
    maximum_significance: summarizeSignificance(differenceRecords.map((item) => item.significance)),
    review_priority: humanReviewPriority,
    official_backbone: officialStructural.backbone.category,
    official_primitive_roles: officialPrimitives.primitive_roles.category,
  };

  return {
    comparison_id: pairId(context.scopeType, leftRecord, rightRecord),
    experiment_id: context.config.experiment_id,
    scope: context.scopeLabel,
    scope_type: context.scopeType,
    left: {
      packet_id: leftRecord.packet_id,
      provider: leftRecord.provider,
      variant_id: leftRecord.variant_id,
      source_path: leftRecord.source_path,
    },
    right: {
      packet_id: rightRecord.packet_id,
      provider: rightRecord.provider,
      variant_id: rightRecord.variant_id,
      source_path: rightRecord.source_path,
    },
    official_v3_1_result: {
      structural_backbone: officialStructural.backbone.category,
      structural_literal: officialStructural.literal_counts,
      primitive_sequence: officialPrimitives.primitive_sequence.category,
      primitive_roles: officialPrimitives.primitive_roles.category,
      transitions: officialPrimitives.transitions.category,
      constraints: officialConstraints.conceptual.category,
      representation: officialRepresentation.procedural_ast_presence.category,
      recognition_left: recognitionAnalysis.left_classification,
      recognition_right: recognitionAnalysis.right_classification,
    },
    diagnostics: {
      sequence: {
        exact_ordered_overlap: sequenceAnalysis.exact_ordered_overlap,
        unordered_overlap: sequenceAnalysis.unordered_overlap,
        merge_candidates: sequenceAnalysis.merge_candidates,
        split_candidates: sequenceAnalysis.split_candidates,
      },
      transitions: {
        exact_edge_overlap: transitionAnalysis.exact_edge_overlap,
        normalized_edge_overlap: transitionAnalysis.normalized_edge_overlap,
      },
      constraint_concept_map: constraintAnalysis.concept_map,
      control_flow_shape: [
        scalarFromField(leftRecord.response, "structural_layer.control_flow_shape"),
        scalarFromField(rightRecord.response, "structural_layer.control_flow_shape"),
      ],
    },
    difference_records: differenceRecords,
    summary,
    human_review_priority: humanReviewPriority,
  };
}
