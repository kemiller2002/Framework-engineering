import { classifyRecognition } from "../compare-recognition.js";

export function compareRecognitionExplainability(leftRecord, rightRecord, options = {}) {
  const leftRaw = String(leftRecord.response?.recognized_artifact ?? "");
  const rightRaw = String(rightRecord.response?.recognized_artifact ?? "");
  const leftClass = classifyRecognition(leftRaw, options.namedRecognitionPatterns || []);
  const rightClass = classifyRecognition(rightRaw, options.namedRecognitionPatterns || []);
  const leftTerms = leftRecord.response?.recognition_analysis?.domain_terms_introduced || [];
  const rightTerms = rightRecord.response?.recognition_analysis?.domain_terms_introduced || [];
  const differences = [];
  const structuralStable = ["full_agreement", "partial_agreement"].includes(options.backboneCategory || "");

  if (leftClass !== rightClass) {
    differences.push({
      layer: "recognition",
      field: "recognized_artifact",
      difference_type: structuralStable ? "recognition_without_structural_effect" : "recognition_with_structural_import",
      explanation: structuralStable
        ? "Recognition changed while the backbone remained stable."
        : "Recognition changed alongside a non-stable backbone result.",
      backbone_impact: structuralStable ? "none" : "unknown",
      left_value: leftRaw,
      right_value: rightRaw,
    });
  } else if (leftClass === "partial" && (leftRaw || rightRaw)) {
    differences.push({
      layer: "recognition",
      field: "recognized_artifact",
      difference_type: "family_resemblance",
      explanation: "Both responses express only family resemblance rather than confident recognition.",
      backbone_impact: "none",
      left_value: leftRaw,
      right_value: rightRaw,
    });
  }

  if ((leftTerms.length > 0 || rightTerms.length > 0) && structuralStable) {
    differences.push({
      layer: "recognition",
      field: "recognition_analysis.domain_terms_introduced",
      difference_type: "terminology_leakage_only",
      explanation: "Watched terminology appeared, but no backbone change was observed.",
      backbone_impact: "none",
      left_value: leftTerms,
      right_value: rightTerms,
    });
  }

  return {
    left_classification: leftClass,
    right_classification: rightClass,
    differences,
  };
}
