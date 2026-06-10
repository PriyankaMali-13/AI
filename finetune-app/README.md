# Ollama Fine-Tuning Demo

A simple Node.js app to learn and understand fine-tuning concepts using a local Ollama model.

---

## What this app does

1. Asks a **base model** (llama3.2) a question — general purpose answer
2. Creates a **custom model** (CodeBot) with a baked-in persona using a Modelfile
3. Asks **CodeBot** the same question — structured, opinionated answer

This demonstrates how fine-tuning/customization shapes model behavior.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Ollama](https://ollama.com/) installed and running
- llama3.2 model pulled

```bash
ollama pull llama3.2
ollama serve
```

---

## Setup

```bash
git clone <repo-url>
cd finetune-app
npm install
```

---

## Run

```bash
node src/finetune.js
```

Or using npm:

```bash
npm start
```

---

## Project Structure

```
finetune-app/
├── src/
│   └── finetune.js   ← main file (ask base model, create custom model, compare)
├── package.json
├── .gitignore
└── README.md
```

> **Note:** `Modelfile` is not committed to the repository because it is auto-generated every time you run the app.
> The app creates it fresh on each run via `writeFileSync("Modelfile", ...)` before calling `ollama create`.
> You do not need to create it manually.

---

## How it works

### `ask(model, systemPrompt, question)`
Calls Ollama's REST API at `localhost:11434` and returns the model's reply.

### `createCustomModel(name, baseModel, systemPrompt)`
1. Writes a `Modelfile` with the base model + persona
2. Runs `ollama create <name> -f Modelfile` to register it in Ollama

### Main logic
```js
const question = "Explain promises like I am 5 years old.";

// 1. Base model answers freely
ask("llama3.2:latest", "You are a helpful assistant.", question)

// 2. Create CodeBot with strict rules
createCustomModel("codebot:latest", "llama3.2:latest", "Always reply in bullet points with code. End with: Happy coding!")

// 3. CodeBot answers the same question differently
ask("codebot:latest", "", question)
```

---

## Change the question

Edit line 33 in `src/finetune.js`:

```js
const question = "What is a closure in JavaScript?";
```

### Sample questions to try

```js
// JavaScript concepts
"What is a closure in JavaScript?"
"What is the difference between var, let, and const?"
"How does the event loop work in Node.js?"

// Fun (shows personality difference best)
"Explain promises like I am 5 years old."
"Give me a fun fact about coding."
"What is your favourite programming language and why?"
```

---

## Fine-Tuning vs RAG

| | Fine-Tuning (this app) | RAG |
|---|---|---|
| Model changed? | ✅ Yes (persona baked in) | ❌ No |
| Data stored | Inside model weights | Outside (files, vector DB) |
| Like a student who... | Studied the subject | Opens book during exam |

---

## Real Fine-Tuning Workflow

This app simulates fine-tuning via a Modelfile. Real fine-tuning retrains the model weights:

```
1. Collect training data   →  data/training.jsonl
2. Train with Unsloth      →  https://github.com/unslothai/unsloth
3. Export as GGUF          →  model.save_pretrained_gguf(...)
4. Load into Ollama        →  FROM ./my-finetuned.gguf  (in Modelfile)
5. Run                     →  ollama run my-model
```
