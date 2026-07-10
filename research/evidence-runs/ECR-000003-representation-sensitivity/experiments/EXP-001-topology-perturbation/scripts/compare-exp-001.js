import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { runComparisonEngine } from "../../../../../tools/comparison-engine/src/index.js";
import { readOptional, sha256Text, writeText } from "../../../../../tools/comparison-engine/src/utilities.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const experimentDir = path.resolve(__dirname, "..");
const configPath = path.join(experimentDir, "comparison-engine.config.json");
const calibrationDir = path.join(experimentDir, "comparison", "calibration");
const responsesDir = path.join(experimentDir, "responses");
const generatedDir = path.join(experimentDir, "comparison", "generated-v3.1");
const engineDir = path.resolve(experimentDir, "../../../../tools/comparison-engine");
const smokeMode = process.argv.includes("--smoke");

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  const beforeHashes = await hashResponseFiles(responsesDir);
  const unitTests = runUnitTests();
  let results = null;

  if (!smokeMode) {
    results = await runComparisonEngine(configPath);
  }

  const afterHashes = await hashResponseFiles(responsesDir);
  const hashVerification = compareHashes(beforeHashes, afterHashes);
  const regression = buildRegressionChecks({ unitTests, results, hashVerification, smokeMode });

  await writeText(
    path.join(calibrationDir, "comparator-v3.1-regression-report.md"),
    buildRegressionReport({ unitTests, regression, hashVerification, smokeMode }),
  );
  await writeText(
    path.join(calibrationDir, "comparator-v3.1-approval-record.md"),
    buildApprovalRecord({ regression, results, hashVerification, smokeMode }),
  );
}

function runUnitTests() {
  const completed = spawnSync("node", ["--test", "--test-reporter=tap"], {
    cwd: engineDir,
    encoding: "utf8",
  });

  const stdout = completed.stdout || "";
  const lines = stdout.split(/\r?\n/);
  const passed = [];
  const failed = [];

  for (const line of lines) {
    const okMatch = line.match(/^ok\s+\d+\s+-\s+(.+)$/);
    if (okMatch) {
      passed.push(okMatch[1]);
      continue;
    }
    const failMatch = line.match(/^not ok\s+\d+\s+-\s+(.+)$/);
    if (failMatch) {
      failed.push(failMatch[1]);
    }
  }

  return {
    total: passed.length + failed.length,
    passed,
    failed,
    exit_code: completed.status ?? 1,
    stderr: completed.stderr || "",
  };
}

async function hashResponseFiles(rootDir) {
  const files = await collectFiles(rootDir);
  const hashes = [];
  for (const filePath of files.filter((file) => file.endsWith(".json"))) {
    const text = await readFile(filePath, "utf8");
    hashes.push({
      file: path.relative(experimentDir, filePath),
      sha256: sha256Text(text),
    });
  }
  return hashes.sort((left, right) => left.file.localeCompare(right.file));
}

async function collectFiles(dirPath) {
  let results = [];
  const entries = await readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(await collectFiles(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

function compareHashes(beforeHashes, afterHashes) {
  const before = JSON.stringify(beforeHashes);
  const after = JSON.stringify(afterHashes);
  return {
    verified: before === after,
    file_count: beforeHashes.length,
    beforeHashes,
    afterHashes,
  };
}

function buildRegressionChecks({ unitTests, results, hashVerification, smokeMode }) {
  const checks = [];

  checks.push(testCase("RG-001", "critical", "broad-family resemblance with explicit negation becomes partial", unitTests.passed.includes("broad-family resemblance with explicit recognition negation becomes partial"), "Recognition classifier regression"));
  checks.push(testCase("RG-002", "major", "`unrecognized` maps to unknown", unitTests.passed.includes("'Unknown' becomes unknown") && unitTests.passed.includes("explicit 'unrecognized' becomes unknown"), "Recognition boundary regression"));
  checks.push(testCase("RG-003", "major", "empty recognition remains not_recognized", unitTests.passed.includes("empty recognized_artifact becomes not_recognized"), "Recognition empty-field regression"));
  checks.push(testCase("RG-004", "critical", "raw responses are unchanged", hashVerification.verified, `${hashVerification.file_count} response hashes compared before/after run`));

  if (smokeMode || !results) {
    checks.push(testCase("RG-005", "major", "full comparator reanalysis not run in smoke mode", false, "Smoke mode skips EXP-001 regeneration"));
    return finalizeChecks(checks, unitTests);
  }

  checks.push(testCase("RG-005", "critical", "all generated outputs share one immutable run state", awaitableRunStateCheck(results), "Run state ID is written from one in-memory result set"));
  checks.push(testCase("RG-006", "major", "structural backbone stability is separated from wording variance", Boolean(results.structural.backbone_profile && results.structural.conceptual_profile), `Backbone=${results.structural.backbone_profile}; Literal=${results.structural.literal_profile}`));
  checks.push(testCase("RG-007", "major", "neutral identity-node expansion is handled as elaboration", results.structural.backbone_profile === "mostly_stable" || results.structural.backbone_profile === "mixed", `Backbone profile ${results.structural.backbone_profile}`));
  checks.push(testCase("RG-008", "major", "primitive reporting separates role/transition stability from style variance", Boolean(results.primitives.primitive_roles && results.primitives.transition_backbone && results.primitives.style_variance), "Primitive roles, transition backbone, and style variance are all reported"));
  checks.push(testCase("RG-009", "major", "constraints are compared conceptually across field placement", Boolean(results.constraints.conceptual && results.constraints.field_placement_sensitivity), `Conceptual=${results.constraints.conceptual.category}; placement=${results.constraints.field_placement_sensitivity}`));
  checks.push(testCase("RG-010", "major", "free-form representation prose is informational rather than score-bearing", results.representation.natural_language_summary.category === "informational_only" && results.representation.notes.category === "informational_only", "Representation prose metrics demoted to informational status"));
  checks.push(testCase("RG-011", "major", "tolerant parsing is explicit and auditable", results.dataQuality.some((item) => item.status === "tolerant_parse"), "Tolerant parse events appear in data-quality output"));
  checks.push(testCase("RG-012", "critical", "EXP-001 outputs regenerated under generated-v3.1", Boolean(results.runState && results.config.output_root.endsWith("generated-v3.1")), results.config.output_root));
  checks.push(testCase("RG-013", "critical", "no output consistency mismatch", noOutputConsistencyMismatch(results), `primary=${results.primaryRecords.length}; machine=${results.machine.primary_record_count}; dq=${results.dataQuality.length}`));

  return finalizeChecks(checks, unitTests);
}

function awaitableRunStateCheck(results) {
  return Boolean(results.runState?.run_id && results.machine?.run_state?.run_id === results.runState.run_id);
}

function noOutputConsistencyMismatch(results) {
  return results.machine.primary_record_count === results.primaryRecords.length
    && Array.isArray(results.machine.data_quality)
    && results.machine.data_quality.length === results.dataQuality.length;
}

function testCase(id, severity, name, passed, evidence) {
  return { id, severity, name, passed, evidence };
}

function finalizeChecks(checks, unitTests) {
  const blockingFailures = checks.filter((item) => !item.passed && ["critical", "major"].includes(item.severity));
  return {
    checks,
    total: checks.length + unitTests.total,
    passed: checks.filter((item) => item.passed).length + unitTests.passed.length,
    failed: checks.filter((item) => !item.passed).length + unitTests.failed.length,
    blockingFailures,
    warnings: checks.filter((item) => !item.passed && item.severity === "observation"),
  };
}

function buildRegressionReport({ unitTests, regression, hashVerification, smokeMode }) {
  const failedNames = [
    ...unitTests.failed.map((name) => `unit: ${name}`),
    ...regression.checks.filter((item) => !item.passed).map((item) => `${item.id}: ${item.name}`),
  ];

  return [
    "# Comparator v3.1 Regression Report",
    "",
    `- total tests: ${regression.total}`,
    `- passed tests: ${regression.passed}`,
    `- failed tests: ${regression.failed}`,
    `- warnings: ${regression.warnings.length}`,
    `- blocking failures: ${regression.blockingFailures.length}`,
    `- mode: ${smokeMode ? "smoke" : "full"}`,
    "",
    "## Exact Failed Test Names",
    "",
    ...(failedNames.length > 0 ? failedNames.map((name) => `- ${name}`) : ["- None"]),
    "",
    "## Raw Response Hash Verification",
    "",
    `- verified: ${hashVerification.verified ? "yes" : "no"}`,
    `- files checked: ${hashVerification.file_count}`,
    "",
    "## Regression Checks",
    "",
    "| ID | Severity | Name | Status | Evidence |",
    "|---|---|---|---|---|",
    ...regression.checks.map((item) => `| ${item.id} | ${item.severity} | ${item.name} | ${item.passed ? "PASS" : "FAIL"} | ${item.evidence} |`),
    "",
    "## Promotion Gate",
    "",
    `- all critical tests pass: ${gateStatus(regression.checks, "critical")}`,
    `- all major tests pass: ${gateStatus(regression.checks, "major")}`,
    `- no output consistency mismatch: ${findCheck(regression.checks, "RG-013")?.passed ? "yes" : "no"}`,
    `- no false-recognition regression: ${findCheck(regression.checks, "RG-001")?.passed ? "yes" : "no"}`,
    `- no raw-response mutation: ${hashVerification.verified ? "yes" : "no"}`,
    "",
  ].join("\n");
}

function gateStatus(checks, severity) {
  return checks.filter((item) => item.severity === severity).every((item) => item.passed) ? "yes" : "no";
}

function findCheck(checks, id) {
  return checks.find((item) => item.id === id);
}

function buildApprovalRecord({ regression, results, hashVerification, smokeMode }) {
  const regressionPass = regression.blockingFailures.length === 0 && hashVerification.verified && !smokeMode;
  const blocking = regression.blockingFailures.map((item) => `${item.id} ${item.name}`);
  const ontologyVersion = "v3 taxonomy set copied from ECR-000001 ontology-v3";
  return [
    "# Comparator v3.1 Approval Record",
    "",
    "Comparator Version:",
    "3.1.0",
    "",
    "Ontology Version:",
    ontologyVersion,
    "",
    "Recognition Rules Version:",
    "1.1",
    "",
    "Structural Rules Version:",
    "1.1",
    "",
    "Constraint Rules Version:",
    "1.1",
    "",
    "Representation Rules Version:",
    "1.1",
    "",
    "Regression Status:",
    regressionPass ? "PASS" : "FAIL",
    "",
    "EXP-001 Reanalysis Status:",
    !smokeMode && results ? "COMPLETE" : "INCOMPLETE",
    "",
    "Blocking Defects:",
    blocking.length > 0 ? blocking.join("; ") : "None",
    "",
    "Approved Status:",
    "",
    "- not_approved",
    "",
    "Approved For:",
    "",
    "- None while status is not_approved",
    "",
    "Reviewer:",
    "",
    "Date:",
    "",
    "Notes:",
    "",
    "- Codex prepared the record but did not mark the comparator approved automatically.",
    `- Raw response hash verification: ${hashVerification.verified ? "passed" : "failed"}.`,
    `- Run output root: ${results?.config?.output_root || "not generated"}.`,
    "",
  ].join("\n");
}
