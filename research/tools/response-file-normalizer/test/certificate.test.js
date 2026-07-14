import test from "node:test";
import assert from "node:assert/strict";
import { buildNormalizationCertificate } from "../src/build-normalization-certificate.js";

const experimentInfo = {
  ecr_id: "ECR-000003",
  experiment_id: "EXP-003",
  expected_tasks: new Array(9).fill(null),
};

test("certificate becomes blocked when required responses are missing", () => {
  const manifest = {
    normalizer_version: "1.0.0",
    primary_responses: [],
    duplicate_responses: [],
    malformed_responses: [],
    ambiguous_responses: [],
    excluded_responses: [],
    warnings: [],
    blocking_issues: [],
    dataset_hash: "hash",
    config_hash: "config",
  };
  const cert = buildNormalizationCertificate(experimentInfo, manifest);
  assert.equal(cert.status, "BLOCKED");
  assert.equal(cert.ready_for_comparison, false);
});

test("certificate can be ready with warnings for cosmetic tolerant parsing only", () => {
  const manifest = {
    normalizer_version: "1.0.0",
    primary_responses: [{ parse_mode: "tolerant", packet_id: "A", provider: "gpt", packet_version: "not_stated", canonicalRelativePath: "responses/gpt/A-gpt.json", sha256: "x" }],
    duplicate_responses: [],
    malformed_responses: [],
    ambiguous_responses: [],
    excluded_responses: [],
    warnings: ["tolerant parse"],
    blocking_issues: [],
    dataset_hash: "hash",
    config_hash: "config",
  };
  const info = { ...experimentInfo, expected_tasks: [{}] };
  const cert = buildNormalizationCertificate(info, manifest);
  assert.equal(cert.status, "READY_WITH_WARNINGS");
  assert.equal(cert.ready_for_comparison, true);
});
