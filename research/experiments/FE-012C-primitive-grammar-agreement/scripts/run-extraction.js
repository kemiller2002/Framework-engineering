import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const baseDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(baseDir, "data");
const promptsDir = path.join(baseDir, "prompts");
const resultsDir = path.join(baseDir, "results");

const openaiModel = process.env.OPENAI_MODEL || "gpt-5";
const anthropicModel = process.env.ANTHROPIC_MODEL || "claude-opus-4-20250514";
const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-pro";

const openaiClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const anthropicClient = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const geminiClient = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

function stripMarkdownFences(text) {
  const trimmed = text.trim();
  if (!trimmed.startsWith("```")) {
    return trimmed;
  }

  return trimmed
    .replace(/^```[a-zA-Z0-9_-]*\s*/, "")
    .replace(/\s*```$/, "")
    .trim();
}

async function loadJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function loadPrompt() {
  return fs.readFile(path.join(promptsDir, "extractor.md"), "utf8");
}

function buildPrompt(template, primitives, artifact) {
  return template
    .replace("{{PRIMITIVES}}", primitives.join(", "))
    .replace("{{ARTIFACT}}", JSON.stringify(artifact, null, 2));
}

function buildErrorPayload(artifactId, provider, error, raw = "") {
  return {
    artifact_id: artifactId,
    provider,
    error: error instanceof Error ? error.message : String(error),
    raw
  };
}

async function saveResult(artifactId, provider, payload) {
  const target = path.join(resultsDir, `${artifactId}--${provider}.json`);
  await fs.writeFile(target, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

async function runOpenAI(prompt) {
  if (!openaiClient) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  const response = await openaiClient.responses.create({
    model: openaiModel,
    input: prompt,
    temperature: 0
  });

  return response.output_text || "";
}

async function runAnthropic(prompt) {
  if (!anthropicClient) {
    throw new Error("Missing ANTHROPIC_API_KEY");
  }

  const response = await anthropicClient.messages.create({
    model: anthropicModel,
    max_tokens: 4000,
    temperature: 0,
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  });

  const textBlock = response.content.find((item) => item.type === "text");
  return textBlock ? textBlock.text : "";
}

async function runGemini(prompt) {
  if (!geminiClient) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const model = geminiClient.getGenerativeModel({
    model: geminiModel,
    generationConfig: {
      temperature: 0
    }
  });

  const response = await model.generateContent(prompt);
  return response.response.text();
}

async function runProvider(provider, model, artifactId, prompt, fn) {
  let raw = "";

  try {
    raw = await fn(prompt);
    const cleaned = stripMarkdownFences(raw);
    const parsed = JSON.parse(cleaned);

    parsed.provider = provider;
    parsed.model = model;
    parsed.artifact_id = parsed.artifact_id || artifactId;

    await saveResult(artifactId, provider, parsed);
    console.log(`saved ${artifactId} ${provider}`);
  } catch (error) {
    const payload = buildErrorPayload(artifactId, provider, error, raw);
    await saveResult(artifactId, provider, payload);
    console.error(`error ${artifactId} ${provider}: ${payload.error}`);
  }
}

async function main() {
  await fs.mkdir(resultsDir, { recursive: true });

  const artifacts = await loadJson(path.join(dataDir, "artifacts.json"));
  const primitives = await loadJson(path.join(dataDir, "primitives.json"));
  const template = await loadPrompt();

  for (const artifact of artifacts) {
    const prompt = buildPrompt(template, primitives, artifact);

    await runProvider("openai", openaiModel, artifact.artifact_id, prompt, runOpenAI);
    await runProvider("anthropic", anthropicModel, artifact.artifact_id, prompt, runAnthropic);
    await runProvider("gemini", geminiModel, artifact.artifact_id, prompt, runGemini);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
