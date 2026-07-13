import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { readFile } from "node:fs/promises";

const root = path.join(process.cwd(), "experiments");

for (const dirName of [
  "EXP-001-topology-perturbation",
  "EXP-002-cross-representation-stability",
  "EXP-003-isomorphic-procedures"
]) {
  test(`${dirName} config pins comparator 3.1.0`, async () => {
    const filePath = path.join(root, dirName, "comparison-config.json");
    const config = JSON.parse(await readFile(filePath, "utf8"));
    assert.equal(config.comparator_version, "3.1.0");
    assert.equal(config.comparator_version_requirement, "3.1.0");
    assert.match(config.output_root, /comparison\/generated-v3\.1\/?$/);
  });
}
