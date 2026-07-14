import http from "node:http";
import path from "node:path";
import crypto from "node:crypto";
import { readFile, mkdir, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import { loadConfig } from "./config.js";
import { discoverPackets } from "./discover-packets.js";
import { discoverResponseState } from "./discover-responses.js";
import { validateResponseText } from "./response-validator.js";
import { canonicalResponsePath, conflictingCandidatePath, malformedCandidatePath, writeResponseExact, hashBytes } from "./response-writer.js";
import { summarizeProgress, loadCollectionStatus, writeCollectionStatus } from "./progress.js";
import { discoverNetworkUrls } from "./network.js";
import { appendAuditEvent } from "./audit-log.js";

const MAX_BODY_BYTES = 2 * 1024 * 1024;

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

export async function main(argv = process.argv.slice(2)) {
  const config = await loadConfig(argv);
  const sessionToken = crypto.randomBytes(18).toString("base64url");
  const sessionId = crypto.randomUUID();
  const state = await createRuntimeState(config, sessionToken, sessionId);
  const server = createDashboardServer(state);
  await new Promise((resolve) => server.listen(config.port, config.host, resolve));
  await updateImplementationReport(state);
  printStartup(state);
  if (config.openBrowser) openBrowser(state.urls.localUrl);
}

export async function createRuntimeState(config, sessionToken = "test-token", sessionId = "test-session") {
  await verifyRoot(config.ecrRoot);
  await verifyRoot(config.experiment.root);
  await mkdir(config.collectionRoot, { recursive: true });
  const packets = await discoverPackets(config.experiment);
  const collectionStatus = await loadCollectionStatus(config.collectionRoot);
  const tasks = await discoverResponseState(config.experiment, packets, config.providers, { allowTolerantJson: config.allowTolerantJson });
  applyOverrides(tasks, collectionStatus);
  const progress = summarizeProgress(tasks);
  const urls = discoverNetworkUrls(config.host, config.port, sessionToken);
  await writeCollectionStatus(config.collectionRoot, {
    sessions: [{ session_id: sessionId, started_at: new Date().toISOString(), experiment: config.experiment.id }],
    task_overrides: collectionStatus.task_overrides || {},
    progress_summary: { total: progress.total, complete: progress.complete, remaining: progress.remaining }
  });
  return {
    config,
    sessionToken,
    sessionId,
    urls,
    packets,
    tasks,
    progress,
    diagnostics: collectDiagnostics(packets, tasks),
  };
}

export function createDashboardServer(state) {
  return http.createServer((req, res) => handleRequest(state, req, res));
}

export async function handleRequest(state, req, res) {
  try {
    if (!authorize(req, state.sessionToken)) {
      respondJson(res, 403, { error: "Missing or invalid session token." });
      return;
    }
    if (req.method === "GET" && req.url.startsWith("/?")) {
      setSessionCookie(res, state.sessionToken);
      const html = await readAsset("index.html");
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(html);
      return;
    }
    if (req.method === "GET" && req.url.startsWith("/app.js")) {
      setSessionCookie(res, state.sessionToken);
      return respondAsset(res, "app.js", "text/javascript; charset=utf-8");
    }
    if (req.method === "GET" && req.url.startsWith("/styles.css")) {
      setSessionCookie(res, state.sessionToken);
      return respondAsset(res, "styles.css", "text/css; charset=utf-8");
    }
    if (req.method === "GET" && req.url.startsWith("/api/state")) {
      await refreshState(state);
      respondJson(res, 200, serializeState(state));
      return;
    }
    if (req.method === "POST" && req.url.startsWith("/api/validate")) {
      const body = await readJsonBody(req);
      const task = findTask(state, body.taskId);
      const validation = validateResponseText(String(body.responseText || ""), task, { allowTolerantJson: state.config.allowTolerantJson });
      await appendAuditEvent(state.config.collectionRoot, state.sessionId, {
        action: "validate",
        experiment: task.experiment_id,
        packet_id: task.packet.packet_id,
        provider: task.provider,
        target_path: path.relative(state.config.ecrRoot, canonicalResponsePath(task, state.config.experiment)),
        validation_status: deriveValidationStatus(validation),
        warnings: [...validation.validation_warnings, ...validation.blocking_issues],
        result: "validated",
      });
      respondJson(res, 200, {
        validation,
        allowedActions: allowedActions(task, validation, state.config),
      });
      return;
    }
    if (req.method === "POST" && req.url.startsWith("/api/save")) {
      if (state.config.readOnly) {
        respondJson(res, 403, { error: "Read-only mode prevents writes." });
        return;
      }
      const body = await readJsonBody(req);
      const task = findTask(state, body.taskId);
      const responseText = String(body.responseText || "");
      const mode = String(body.mode || "canonical");
      const validation = validateResponseText(responseText, task, { allowTolerantJson: state.config.allowTolerantJson });
      const result = await saveResponseForTask(state, task, validation, responseText, mode);
      await refreshState(state);
      respondJson(res, 200, result);
      return;
    }
    if (req.method === "POST" && req.url.startsWith("/api/skip")) {
      const body = await readJsonBody(req);
      const task = findTask(state, body.taskId);
      const status = await loadCollectionStatus(state.config.collectionRoot);
      status.task_overrides = status.task_overrides || {};
      status.task_overrides[task.id] = { status: "skipped" };
      await writeCollectionStatus(state.config.collectionRoot, status);
      await appendAuditEvent(state.config.collectionRoot, state.sessionId, {
        action: "skip",
        experiment: task.experiment_id,
        packet_id: task.packet.packet_id,
        provider: task.provider,
        target_path: path.relative(state.config.ecrRoot, canonicalResponsePath(task, state.config.experiment)),
        validation_status: "not_applicable",
        warnings: [],
        result: "skipped",
      });
      await refreshState(state);
      respondJson(res, 200, { ok: true });
      return;
    }
    respondJson(res, 404, { error: "Not found." });
  } catch (error) {
    respondJson(res, error.statusCode || 500, { error: error.message });
  }
}

async function saveResponseForTask(state, task, validation, responseText, mode) {
  const experiment = state.config.experiment;
  const canonicalPath = canonicalResponsePath(task, experiment);
  const existing = await fileExists(canonicalPath);
  if (mode === "canonical") {
    if (existing) {
      const existingBytes = await readFile(canonicalPath);
      return {
        ok: false,
        error: "Canonical target already exists.",
        existing_sha256: hashBytes(existingBytes),
      };
    }
    if (validation.blocking_issues.length > 0) {
      throw Object.assign(new Error("Canonical save blocked by validation."), { statusCode: 400 });
    }
    const writeResult = await writeResponseExact(canonicalPath, responseText);
    await appendAuditEvent(state.config.collectionRoot, state.sessionId, {
      action: "save_canonical",
      experiment: task.experiment_id,
      packet_id: task.packet.packet_id,
      provider: task.provider,
      target_path: path.relative(state.config.ecrRoot, canonicalPath),
      validation_status: deriveValidationStatus(validation),
      warnings: validation.validation_warnings,
      sha256: writeResult.sha256,
      result: validation.validation_warnings.length > 0 ? "complete_with_warning" : "complete",
    });
    return { ok: true, targetPath: canonicalPath, ...writeResult };
  }
  if (mode === "candidate") {
    const targetPath = conflictingCandidatePath(task, experiment);
    const writeResult = await writeResponseExact(targetPath, responseText);
    await appendAuditEvent(state.config.collectionRoot, state.sessionId, {
      action: "save_candidate",
      experiment: task.experiment_id,
      packet_id: task.packet.packet_id,
      provider: task.provider,
      target_path: path.relative(state.config.ecrRoot, targetPath),
      validation_status: deriveValidationStatus(validation),
      warnings: [...validation.validation_warnings, ...validation.blocking_issues],
      sha256: writeResult.sha256,
      result: "conflicting_candidate",
    });
    return { ok: true, targetPath, ...writeResult };
  }
  if (mode === "blocking-warning") {
    const targetPath = malformedCandidatePath(task, experiment);
    const writeResult = await writeResponseExact(targetPath, responseText);
    await appendAuditEvent(state.config.collectionRoot, state.sessionId, {
      action: "save_blocking_warning",
      experiment: task.experiment_id,
      packet_id: task.packet.packet_id,
      provider: task.provider,
      target_path: path.relative(state.config.ecrRoot, targetPath),
      validation_status: deriveValidationStatus(validation),
      warnings: [...validation.validation_warnings, ...validation.blocking_issues],
      sha256: writeResult.sha256,
      result: "malformed_candidate",
    });
    return { ok: true, targetPath, ...writeResult };
  }
  throw Object.assign(new Error(`Unsupported save mode: ${mode}`), { statusCode: 400 });
}

async function refreshState(state) {
  const status = await loadCollectionStatus(state.config.collectionRoot);
  const tasks = await discoverResponseState(state.config.experiment, state.packets, state.config.providers, { allowTolerantJson: state.config.allowTolerantJson });
  applyOverrides(tasks, status);
  state.tasks = tasks;
  state.progress = summarizeProgress(tasks);
  state.diagnostics = collectDiagnostics(state.packets, tasks);
  await writeCollectionStatus(state.config.collectionRoot, {
    sessions: status.sessions || [],
    task_overrides: status.task_overrides || {},
    progress_summary: { total: state.progress.total, complete: state.progress.complete, remaining: state.progress.remaining }
  });
}

function serializeState(state) {
  return {
    ecr_id: "ECR-000003",
    experiment: { id: state.config.experiment.id, title: state.config.experiment.title },
    progress: state.progress,
    diagnostics: state.diagnostics,
    tasks: state.progress.tasks,
    next_commands: state.progress.remaining === 0
      ? ["npm run normalize:dry", "npm run normalize", "npm run pipeline"]
      : [],
    provider_guidance: [
      "Copy the prompt.",
      "Open the provider app on the iPhone.",
      "Paste the prompt and run the model manually.",
      "Copy the returned JSON.",
      "Return to Safari, paste, validate, and save.",
    ],
    warning: "This dashboard is reachable by devices on the same Wi-Fi while running.",
    collection_progress_path: path.join(state.config.collectionRoot, "collection-status.json"),
    token_required: true,
  };
}

function collectDiagnostics(packets, tasks) {
  return {
    missing_metadata: packets.filter((packet) => packet.metadata_missing.length > 0).map((packet) => ({
      packet_id: packet.packet_id || path.basename(packet.source_path),
      fields: packet.metadata_missing
    })),
    task_warnings: tasks.filter((task) => task.status.notes.length > 0).map((task) => ({
      task_id: task.id,
      status: task.status.value,
      notes: task.status.notes
    })),
  };
}

function applyOverrides(tasks, collectionStatus) {
  const overrides = collectionStatus.task_overrides || {};
  for (const task of tasks) {
    const override = overrides[task.id];
    if (override && task.status.value === "pending") {
      task.status = { ...task.status, value: override.status };
    }
  }
}

function authorize(req, expectedToken) {
  const requestUrl = new URL(req.url, "http://localhost");
  const queryToken = requestUrl.searchParams.get("token");
  const cookieToken = readCookie(req.headers.cookie || "", "dashboard_token");
  return queryToken === expectedToken || cookieToken === expectedToken;
}

function setSessionCookie(res, token) {
  res.setHeader("set-cookie", `dashboard_token=${token}; HttpOnly; SameSite=Lax; Path=/`);
}

function readCookie(cookieHeader, name) {
  return cookieHeader.split(/;\s*/).map((part) => part.split("=")).find(([key]) => key === name)?.[1] || "";
}

async function respondAsset(res, fileName, contentType) {
  const body = await readAsset(fileName);
  res.writeHead(200, { "content-type": contentType });
  res.end(body);
}

async function readAsset(fileName) {
  return readFile(path.join(path.dirname(new URL(import.meta.url).pathname), "..", "public", fileName), "utf8");
}

async function readJsonBody(req) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > MAX_BODY_BYTES) {
      throw Object.assign(new Error("Request body too large."), { statusCode: 413 });
    }
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

function respondJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  res.end(`${JSON.stringify(payload)}\n`);
}

function findTask(state, taskId) {
  const task = state.tasks.find((item) => item.id === taskId);
  if (!task) {
    throw Object.assign(new Error(`Unknown task: ${taskId}`), { statusCode: 404 });
  }
  return task;
}

function allowedActions(task, validation, config) {
  if (config.readOnly) return [];
  const actions = [];
  if (validation.blocking_issues.length === 0) {
    actions.push("canonical");
  }
  actions.push("candidate");
  if (validation.blocking_issues.length > 0) {
    actions.push("blocking-warning");
  }
  return actions;
}

function deriveValidationStatus(validation) {
  if (validation.blocking_issues.length > 0) return "blocked";
  if (validation.tolerant_parse_success || validation.validation_warnings.length > 0) return "warning";
  return "ok";
}

async function verifyRoot(targetPath) {
  await stat(targetPath);
}

async function fileExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

function printStartup(state) {
  console.log("Research Collection Dashboard");
  console.log(`Local:  ${state.urls.localUrl}`);
  const preferred = state.urls.lanUrls[0] || "No LAN IPv4 address detected.";
  console.log(`iPhone: ${preferred}`);
  if (state.urls.lanUrls.length === 0) {
    console.log("Firewall or network configuration may block iPhone access.");
  }
  console.log("Keep this terminal running while collecting responses.");
  console.log("Warning: this dashboard is reachable by devices on the same Wi-Fi while running.");
  console.log("QR code unavailable without optional dependency support.");
}

function openBrowser(url) {
  spawn("open", [url], { stdio: "ignore", detached: true }).unref();
}

async function updateImplementationReport(state) {
  const filePath = path.join(state.config.collectionRoot, "implementation-report.md");
  const text = [
    "# Research Collection Dashboard Implementation Report",
    "",
    `- Startup command: npm run collect:exp003`,
    `- Detected packet count: ${state.packets.length}`,
    `- Expected response count: ${state.packets.length * state.config.providers.length}`,
    `- Current completion count: ${state.progress.complete}`,
    `- Known limitations: Terminal QR output is not implemented; LAN accessibility depends on local firewall settings.`,
    `- Security assumptions: Token is process-local and not persisted; writes are restricted to the configured ECR root.`,
    `- Exact next action: npm run collect:exp003`,
  ].join("\n");
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeResponseExact(filePath, text);
}
