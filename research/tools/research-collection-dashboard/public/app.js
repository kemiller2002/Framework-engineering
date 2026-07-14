const app = document.querySelector("#app");
let state = null;
let currentTaskId = null;
let currentValidation = null;
let orderMode = "packet-first";

async function loadState() {
  const response = await fetch(`/api/state?order=${encodeURIComponent(orderMode)}`);
  state = await response.json();
  currentTaskId = state.progress.nextTask?.id || state.tasks[0]?.id || null;
  render();
}

function currentTask() {
  return state?.tasks.find((task) => task.id === currentTaskId) || state?.progress.nextTask || null;
}

function render() {
  const task = currentTask();
  if (!state || !task) {
    app.innerHTML = "<p>No tasks available.</p>";
    return;
  }
  app.innerHTML = "";

  const header = document.createElement("section");
  header.className = "panel";
  header.innerHTML = `
    <h1>${escapeHtml(state.ecr_id)} · ${escapeHtml(state.experiment.id)} · ${escapeHtml(state.experiment.title)}</h1>
    <p>${state.progress.complete}/${state.progress.total} complete · task ${state.progress.currentPosition} of ${state.progress.total}</p>
    <p class="warning">${escapeHtml(state.warning)}</p>
  `;

  const taskPanel = document.createElement("section");
  taskPanel.className = "panel";
  taskPanel.innerHTML = `
    <h2>Current Task</h2>
    <p><strong>Provider:</strong> ${escapeHtml(task.provider)}</p>
    <p><strong>Packet ID:</strong> ${escapeHtml(task.packet.packet_id)}</p>
    <p><strong>Variant:</strong> ${escapeHtml(task.packet.variant_id)}</p>
    <p><strong>Packet Version:</strong> ${escapeHtml(task.packet.packet_version)}</p>
    <p><strong>Status:</strong> ${escapeHtml(task.status.value)}</p>
  `;

  const promptPanel = document.createElement("section");
  promptPanel.className = "panel";
  const promptText = document.createElement("textarea");
  promptText.value = task.packet.full_text;
  promptText.readOnly = true;
  promptText.className = "prompt";
  const promptActions = document.createElement("div");
  promptActions.className = "actions";
  promptActions.append(
    button("Copy Prompt", async () => navigator.clipboard.writeText(task.packet.full_text)),
    button("Select All", () => { promptText.focus(); promptText.select(); })
  );
  promptPanel.append(title("Prompt"), promptActions, promptText, metadataPanel(task));

  const responsePanel = document.createElement("section");
  responsePanel.className = "panel";
  const responseArea = document.createElement("textarea");
  responseArea.className = "response";
  responseArea.placeholder = "Paste model JSON response here.";
  const charCount = document.createElement("p");
  charCount.textContent = "Characters: 0";
  responseArea.addEventListener("input", () => {
    charCount.textContent = `Characters: ${responseArea.value.length}`;
  });
  const diagnostics = document.createElement("div");
  diagnostics.className = "diagnostics";
  const responseActions = document.createElement("div");
  responseActions.className = "actions";
  responseActions.append(
    button("Clear", () => { responseArea.value = ""; charCount.textContent = "Characters: 0"; diagnostics.innerHTML = ""; currentValidation = null; }),
    button("Validate", async () => {
      const result = await post("/api/validate", { taskId: task.id, responseText: responseArea.value });
      currentValidation = result;
      diagnostics.innerHTML = renderValidation(result.validation, result.allowedActions);
    }),
    button("Save Response", async () => saveMode("canonical", responseArea.value)),
    button("Save as Candidate", async () => saveMode("candidate", responseArea.value)),
    button("Save With Blocking Warning", async () => saveMode("blocking-warning", responseArea.value)),
  );
  responsePanel.append(title("Response"), responseActions, responseArea, charCount, diagnostics);

  const navigation = document.createElement("section");
  navigation.className = "panel";
  navigation.append(
    title("Navigation"),
    navButtons(),
    progressTable()
  );

  const commands = document.createElement("section");
  commands.className = "panel";
  commands.innerHTML = `<h2>Next Commands</h2>${state.next_commands.length
    ? `<pre>${state.next_commands.join("\n")}</pre>`
    : "<p>Complete remaining collection tasks first.</p>"}`;

  app.append(header, taskPanel, promptPanel, responsePanel, navigation, commands);
}

function navButtons() {
  const wrapper = document.createElement("div");
  wrapper.className = "actions";
  const index = state.tasks.findIndex((task) => task.id === currentTaskId);
  wrapper.append(
    button("Previous", () => moveTo(index - 1)),
    button("Skip", async () => { await post("/api/skip", { taskId: currentTaskId }); await loadState(); }),
    button("Next", () => moveTo(index + 1)),
    button("Next Incomplete", () => { currentTaskId = state.progress.nextTask?.id || currentTaskId; render(); })
  );
  return wrapper;
}

function progressTable() {
  const table = document.createElement("table");
  table.innerHTML = `
    <thead><tr><th>Packet</th><th>GPT</th><th>Claude</th><th>Gemini</th></tr></thead>
    <tbody>
      ${state.progress.progressMatrix.map((row) => `<tr><td>${escapeHtml(row.packet_id)}</td><td>${escapeHtml(row.gpt)}</td><td>${escapeHtml(row.claude)}</td><td>${escapeHtml(row.gemini)}</td></tr>`).join("")}
    </tbody>
  `;
  return table;
}

function metadataPanel(task) {
  const details = document.createElement("details");
  details.innerHTML = `
    <summary>Metadata</summary>
    <pre>${escapeHtml(JSON.stringify({
      packet_id: task.packet.packet_id,
      experiment_id: task.packet.experiment_id,
      variant_id: task.packet.variant_id,
      artifact_family_id: task.packet.artifact_family_id,
      recognition_condition: task.packet.recognition_condition,
      packet_version: task.packet.packet_version,
      source_path: task.packet.source_path
    }, null, 2))}</pre>
  `;
  return details;
}

function renderValidation(validation, allowedActions) {
  return `
    <p><strong>Parse mode:</strong> ${escapeHtml(validation.parse_mode)}</p>
    <p><strong>Warnings:</strong> ${escapeHtml((validation.validation_warnings || []).join(" | ") || "none")}</p>
    <p><strong>Blocking issues:</strong> ${escapeHtml((validation.blocking_issues || []).join(" | ") || "none")}</p>
    <p><strong>Allowed actions:</strong> ${escapeHtml(allowedActions.join(", ") || "none")}</p>
  `;
}

async function saveMode(mode, responseText) {
  const result = await post("/api/save", { taskId: currentTaskId, responseText, mode });
  if (!result.ok) {
    alert(result.error || "Save failed.");
    return;
  }
  await loadState();
}

function moveTo(index) {
  if (index < 0 || index >= state.tasks.length) return;
  currentTaskId = state.tasks[index].id;
  render();
}

function title(value) {
  const heading = document.createElement("h2");
  heading.textContent = value;
  return heading;
}

function button(label, handler) {
  const element = document.createElement("button");
  element.type = "button";
  element.textContent = label;
  element.addEventListener("click", handler);
  return element;
}

async function post(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  return response.json();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;");
}

loadState().catch((error) => {
  app.innerHTML = `<pre>${escapeHtml(error.message)}</pre>`;
});
