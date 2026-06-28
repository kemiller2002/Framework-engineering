#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const yaml = require("yaml");

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

function loadYaml(filePath) {
  const absolutePath = path.resolve(process.cwd(), filePath);
  let raw;

  try {
    raw = fs.readFileSync(absolutePath, "utf8");
  } catch (error) {
    fail(`unable to read input file: ${absolutePath}`);
  }

  try {
    return yaml.parse(raw);
  } catch (error) {
    fail(`invalid YAML in ${absolutePath}: ${error.message}`);
  }
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateArrayOfStrings(value, fieldName) {
  if (value == null) {
    return [];
  }

  if (!Array.isArray(value)) {
    fail(`${fieldName} must be an array`);
  }

  value.forEach((item, index) => {
    if (!isNonEmptyString(item)) {
      fail(`${fieldName}[${index}] must be a non-empty string`);
    }
  });

  return value;
}

function validateContent(value) {
  if (value == null) {
    return [];
  }

  if (!Array.isArray(value)) {
    fail("content must be an array");
  }

  value.forEach((item, index) => {
    if (item == null || typeof item !== "object" || Array.isArray(item)) {
      fail(`content[${index}] must be an object`);
    }

    if (!isNonEmptyString(item.file)) {
      fail(`content[${index}].file must be a non-empty string`);
    }

    if (!isNonEmptyString(item.instructions)) {
      fail(`content[${index}].instructions must be a non-empty string`);
    }
  });

  return value;
}

function validate(input) {
  if (input == null || typeof input !== "object" || Array.isArray(input)) {
    fail("root YAML document must be an object");
  }

  const { ecp, target, purpose } = input;

  if (ecp == null || typeof ecp !== "object" || Array.isArray(ecp)) {
    fail("ecp must be an object");
  }

  ["id", "title", "repository", "category", "priority"].forEach((field) => {
    if (!isNonEmptyString(ecp[field])) {
      fail(`ecp.${field} is required`);
    }
  });

  if (target == null || typeof target !== "object" || Array.isArray(target)) {
    fail("target must be an object");
  }

  if (!isNonEmptyString(target.working_directory)) {
    fail("target.working_directory is required");
  }

  if (typeof target.stop_if_not_repo !== "boolean") {
    fail("target.stop_if_not_repo must be a boolean");
  }

  if (!isNonEmptyString(purpose)) {
    fail("purpose is required");
  }

  return {
    ecp,
    target,
    purpose: purpose.trim(),
    doNotModify: validateArrayOfStrings(input.do_not_modify, "do_not_modify"),
    create: validateArrayOfStrings(input.create, "create"),
    update: validateArrayOfStrings(input.update, "update"),
    content: validateContent(input.content),
    rules: validateArrayOfStrings(input.rules, "rules"),
  };
}

function sectionTitle(title) {
  return `${title}:\n`;
}

function renderList(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function renderContent(items) {
  return items
    .map((item) => `${item.file}\n${item.instructions}`)
    .join("\n\n");
}

function renderPrompt(data) {
  const parts = [];

  parts.push("Engineering Change Package:");
  parts.push(`  id: ${data.ecp.id}`);
  parts.push(`  title: ${data.ecp.title}`);
  parts.push(`  repository: ${data.ecp.repository}`);
  parts.push(`  category: ${data.ecp.category}`);
  parts.push(`  priority: ${data.ecp.priority}`);
  parts.push("");

  parts.push("TARGET REPOSITORY / WORKING DIRECTORY:");
  parts.push(data.target.working_directory);
  parts.push("");

  if (data.target.stop_if_not_repo) {
    parts.push(
      `If the selected working directory is not the ${data.ecp.repository} repository, STOP and report that this prompt is intended for the ${data.ecp.repository} repo.`,
    );
    parts.push("");
  }

  parts.push("PURPOSE:");
  parts.push(data.purpose);
  parts.push("");

  if (data.doNotModify.length > 0) {
    parts.push("DO NOT MODIFY:");
    parts.push(renderList(data.doNotModify));
    parts.push("");
  }

  if (data.create.length > 0) {
    parts.push("CREATE:");
    parts.push(renderList(data.create));
    parts.push("");
  }

  if (data.update.length > 0) {
    parts.push("UPDATE:");
    parts.push(renderList(data.update));
    parts.push("");
  }

  if (data.content.length > 0) {
    parts.push("CONTENT:");
    parts.push(renderContent(data.content));
    parts.push("");
  }

  if (data.rules.length > 0) {
    parts.push("RULES:");
    parts.push(renderList(data.rules));
    parts.push("");
  }

  return parts.join("\n").trimEnd() + "\n";
}

function main() {
  const inputPath = process.argv[2];

  if (!isNonEmptyString(inputPath)) {
    fail("usage: node generate-ecp.js <ecp.yaml>");
  }

  const parsed = loadYaml(inputPath);
  const validated = validate(parsed);
  const output = renderPrompt(validated);
  process.stdout.write(output);
}

main();
