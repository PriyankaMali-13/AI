// Simple Ollama Fine-Tuning Demo

import { writeFileSync } from "fs";
import { execSync } from "child_process";

const BASE_URL = "http://localhost:11434";
const MODEL = "llama3.2:latest";

async function ask(model, systemPrompt, userQuestion) {
  const messages = [];
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
  messages.push({ role: "user", content: userQuestion });

  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, stream: false, messages }),
  });
  const data = await res.json();
  return data.message?.content ?? JSON.stringify(data);
}

function createCustomModel(name, baseModel, systemPrompt) {
  // Write a Modelfile and use the Ollama CLI to create the model
  const modelfile = `FROM ${baseModel}\nSYSTEM ${systemPrompt}\nPARAMETER temperature 0.3`;
  writeFileSync("Modelfile", modelfile);
  execSync(`ollama create ${name} -f Modelfile`, { stdio: "inherit" });
  console.log(`✓ Custom model "${name}" created\n`);
}

// ── Step 1: Ask the base model ──────────────────────────────
const question = "Explain promises like I am 5 years old.";

console.log("=== Base Model ===");
const baseAnswer = await ask(MODEL, "You are a helpful assistant.", question);
console.log(baseAnswer);

// ── Step 2: Create a custom model (simulates fine-tuning) ───
console.log("\n=== Creating Custom Model (CodeBot) ===");
await createCustomModel(
  "codebot:latest",
  MODEL,
  "You are CodeBot. Always reply in bullet points with a code example. End with: Happy coding!"
);

// ── Step 3: Ask the custom model the same question ──────────
console.log("=== Custom Model (CodeBot) ===");
const customAnswer = await ask("codebot:latest", "", question);
console.log(customAnswer);
