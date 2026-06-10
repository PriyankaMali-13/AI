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

This app simulates fine-tuning via a Modelfile. Real fine-tuning retrains the model weights.

Think of it like **training a new employee**. You hire a general employee (the base model — llama3.2). They know a lot of general stuff but don't know your company's specific way of doing things. Fine-tuning is like putting them through a training program using your company's data — after training, they respond exactly the way you need.

### Step 1 — Collect Training Data
Create a file with question + answer pairs that show how you want the model to behave.
```json
{ "question": "What is our refund policy?", "answer": "We offer 30-day returns..." }
{ "question": "How do I reset my password?", "answer": "Go to settings > security..." }
```
> Like writing the training manual for your new employee.

### Step 2 — Train with a Tool (Unsloth / Axolotl)
Feed those Q&A pairs into a training tool. It adjusts the model's internal numbers (weights) so it learns your patterns. This happens on a GPU (your computer or free Google Colab).
> Like the employee actually studying the manual.

### Step 3 — Export as GGUF
After training, convert the model into a format Ollama understands — called GGUF.
> Like the employee getting a new ID card after completing training.

### Step 4 — Load into Ollama via Modelfile
Tell Ollama to use the newly trained model by pointing the `FROM` line to your GGUF file.
```
FROM ./my-finetuned.gguf
SYSTEM "You are a customer support agent..."
```
> Like the trained employee reporting to work.

### Step 5 — Use it
```bash
ollama run my-expert
```
Now it answers like a **specialist**, not a generalist.

---

## This App vs Real Fine-Tuning

| | This App | Real Fine-Tuning |
|---|---|---|
| What changes | SYSTEM prompt only | Actual model weights |
| Like... | Giving rules to follow | Actually learning & memorising |
| Speed | Seconds | Minutes to hours |
| GPU needed | ❌ No | ✅ Yes |
| Permanent? | ❌ No (lost if prompt removed) | ✅ Yes (baked into model) |

> **One line summary:** This app *tells* the model how to behave. Real fine-tuning *teaches* the model by retraining it on your data — the knowledge becomes permanent.
