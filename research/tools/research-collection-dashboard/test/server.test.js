import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { Readable } from "node:stream";
import { handleRequest, createRuntimeState } from "../src/server.js";

async function setupState() {
  const root = await mkdtemp(path.join(os.tmpdir(), "dashboard-server-"));
  const ecrRoot = path.join(root, "ecr");
  const experimentRoot = path.join(ecrRoot, "experiments", "EXP-003-isomorphic-procedures");
  await mkdir(path.join(experimentRoot, "packets"), { recursive: true });
  await mkdir(path.join(experimentRoot, "responses", "gpt"), { recursive: true });
  await mkdir(path.join(experimentRoot, "responses", "claude"), { recursive: true });
  await mkdir(path.join(experimentRoot, "responses", "gemini"), { recursive: true });
  await writeFile(path.join(experimentRoot, "packets", "ECR-000003-EXP003-P001A-demo.md"), "packet_id: ECR-000003-EXP003-P001A\nexperiment_id: EXP-003\nvariant_id: P001A\nartifact_family_id: P001\nrecognition_condition: demo\n\nprompt");
  const config = {
    ecrRoot,
    experiment: {
      id: "EXP-003",
      title: "Isomorphic Procedures",
      root: experimentRoot,
      packetsRoot: path.join(experimentRoot, "packets"),
      responsesRoot: path.join(experimentRoot, "responses"),
    },
    providers: ["gpt", "claude", "gemini"],
    collectionRoot: path.join(ecrRoot, "collection-dashboard"),
    port: 0,
    host: "127.0.0.1",
    allowTolerantJson: true,
    readOnly: false,
  };
  return createRuntimeState(config, "token-123", "session-abc");
}

test("session token is required and request body limit is enforced", async () => {
  const state = await setupState();
  const forbidden = await invoke(state, { method: "GET", url: "/api/state", body: "" });
  assert.equal(forbidden.statusCode, 403);

  const okay = await invoke(state, { method: "GET", url: "/api/state?token=token-123", body: "" });
  assert.equal(okay.statusCode, 200);

  const oversized = await invoke(state, {
    method: "POST",
    url: "/api/validate?token=token-123",
    body: JSON.stringify({ taskId: state.tasks[0].id, responseText: "x".repeat(2 * 1024 * 1024 + 10) })
  });
  assert.equal(oversized.statusCode, 413);
});

test("read-only mode prevents writes and audit log excludes full response content", async () => {
  const state = await setupState();
  state.config.readOnly = true;
  const response = await invoke(state, {
    method: "POST",
    url: "/api/save?token=token-123",
    body: JSON.stringify({
      taskId: state.tasks[0].id,
      responseText: '{"packet_id":"ECR-000003-EXP003-P001A","experiment_id":"EXP-003","variant_id":"P001A","artifact_family_id":"P001"}',
      mode: "canonical"
    })
  });
  assert.equal(response.statusCode, 403);

  state.config.readOnly = false;
  const rawBody = '{"packet_id":"ECR-000003-EXP003-P001A","experiment_id":"EXP-003","variant_id":"P001A","artifact_family_id":"P001"}';
  const writeResponse = await invoke(state, {
    method: "POST",
    url: "/api/save?token=token-123",
    body: JSON.stringify({ taskId: state.tasks[0].id, responseText: rawBody, mode: "canonical" })
  });
  assert.equal(writeResponse.statusCode, 200);
  const logText = await readFile(path.join(state.config.collectionRoot, "logs", "session-abc.jsonl"), "utf8");
  assert.ok(!logText.includes(rawBody));
});

async function invoke(state, { method, url, body }) {
  const chunks = body ? [Buffer.from(body)] : [];
  const req = Readable.from(chunks);
  req.method = method;
  req.url = url;
  req.headers = { "content-type": "application/json" };
  const res = createMockResponse();
  await handleRequest(state, req, res);
  return res;
}

function createMockResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: "",
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    writeHead(statusCode, headers) {
      this.statusCode = statusCode;
      this.headers = { ...this.headers, ...Object.fromEntries(Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value])) };
    },
    end(body = "") {
      this.body += body;
    }
  };
}
