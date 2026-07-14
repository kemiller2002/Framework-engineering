import path from "node:path";
import { readdir, stat } from "node:fs/promises";

const PROVIDERS = ["gpt", "claude", "gemini"];

export async function loadConfig(argv = process.argv.slice(2)) {
  const options = {
    ecrRoot: "",
    experiment: "",
    port: 4310,
    host: "0.0.0.0",
    provider: "all",
    readOnly: false,
    noQr: false,
    openBrowser: false,
    allowTolerantJson: true,
    incomingRoot: "",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--ecr-root") options.ecrRoot = argv[++index] || "";
    else if (value === "--experiment") options.experiment = argv[++index] || "";
    else if (value === "--port") options.port = Number(argv[++index] || "4310");
    else if (value === "--host") options.host = argv[++index] || "0.0.0.0";
    else if (value === "--provider") options.provider = argv[++index] || "all";
    else if (value === "--read-only") options.readOnly = true;
    else if (value === "--no-qr") options.noQr = true;
    else if (value === "--open-browser") options.openBrowser = true;
    else if (value === "--allow-tolerant-json") options.allowTolerantJson = true;
    else if (value === "--incoming-root") options.incomingRoot = argv[++index] || "";
    else throw new Error(`Unknown option: ${value}`);
  }

  if (!options.ecrRoot) {
    throw new Error("--ecr-root is required");
  }
  if (!options.experiment) {
    throw new Error("--experiment is required");
  }
  if (!Number.isInteger(options.port) || options.port < 1 || options.port > 65535) {
    throw new Error("Port must be an integer between 1 and 65535.");
  }
  if (options.provider !== "all" && !PROVIDERS.includes(options.provider)) {
    throw new Error(`Unknown provider: ${options.provider}`);
  }

  const ecrRoot = path.resolve(options.ecrRoot);
  const experimentsRoot = path.join(ecrRoot, "experiments");
  const experimentMap = await discoverExperiments(experimentsRoot);
  const experiment = experimentMap.get(options.experiment);
  if (!experiment) {
    throw new Error(`Unknown experiment: ${options.experiment}`);
  }

  return {
    ...options,
    ecrRoot,
    experiment,
    experimentsRoot,
    providers: options.provider === "all" ? PROVIDERS : [options.provider],
    collectionRoot: path.join(ecrRoot, "collection-dashboard"),
    incomingRoot: options.incomingRoot ? path.resolve(options.incomingRoot) : path.join(ecrRoot, "incoming-responses"),
  };
}

async function discoverExperiments(experimentsRoot) {
  const entries = await readdir(experimentsRoot, { withFileTypes: true });
  const map = new Map();
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const match = entry.name.match(/^(EXP-\d{3})-(.+)$/);
    if (!match) continue;
    const id = match[1];
    const root = path.join(experimentsRoot, entry.name);
    await stat(root);
    map.set(id, {
      id,
      dirName: entry.name,
      root,
      title: titleCase(match[2].replaceAll("-", " ")),
      packetsRoot: path.join(root, "packets"),
      responsesRoot: path.join(root, "responses"),
    });
  }
  return map;
}

function titleCase(value) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

export { PROVIDERS };
