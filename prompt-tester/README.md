# 🧪 Prompt Tester — Node.js + Ollama + NVIDIA

![Status](https://img.shields.io/badge/Status-Working-brightgreen?style=for-the-badge)
![Local](https://img.shields.io/badge/Runs-100%25%20Local-blue?style=for-the-badge&logo=ollama)
![Node](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

---

## What is this?

A backend API that lets you compare how different prompts affect AI responses — side by side.

You send two prompts and one question, and the app calls the AI model twice (in parallel) and returns both responses together. Useful for testing how prompt wording changes the tone, style, or accuracy of AI output.

Supports two providers — **Ollama** (runs locally, free, no API key) and **NVIDIA's free OpenAI-compatible API**.

---

## How it works

```
Postman sends POST /compare with two prompts + one question
      ↓
server.js receives it and forwards to routes.js
      ↓
routes.js passes the request to controller.js
      ↓
controller.js calls modelService.callModel() twice — in parallel using Promise.all
      ↓
modelService.js checks the model name:
  - contains "/" → calls NVIDIA API
  - no "/"      → calls Ollama locally
      ↓
Both responses returned side by side
```

---

## Project structure

```
prompt-tester/
├── server.js          ← Entry point. Starts Express, wires up routes
├── .env               ← API keys and port config (never commit this)
└── src/
    ├── routes.js          ← Defines POST /compare and POST /test
    ├── controller.js      ← Handles request logic, runs parallel AI calls
    └── modelService.js    ← Talks to Ollama or NVIDIA, returns AI response
```

---

## Setup

1. Download and install Ollama from https://ollama.com

2. Pull the model

```bash
ollama pull llama3.1
```

3. Install dependencies

```bash
npm install
```

4. Create a `.env` file in the root:

```
PORT=3000
NVIDIA_API_KEY=your_nvidia_api_key_here
```

> For NVIDIA API key — sign up free at https://build.nvidia.com

5. Start the server

```bash
node server.js
```

Server runs on **http://localhost:3000**

---

## API Routes

### POST /compare — compare two prompts side by side

```json
{
  "prompt1": "You are a formal assistant. Answer professionally.",
  "prompt2": "You are a casual assistant. Answer like talking to a friend.",
  "question": "What is photosynthesis?",
  "model": "llama3.1"
}
```

Response:

```json
{
  "response1": "Photosynthesis is a vital biological process...",
  "response2": "So basically, plants make their own food from sunlight..."
}
```

---

### POST /test — test one prompt against multiple questions

```json
{
  "prompt": "You are a science teacher. Answer simply.",
  "questions": [
    "What is photosynthesis?",
    "What is gravity?",
    "What is the speed of light?"
  ],
  "model": "llama3.1"
}
```

Response:

```json
[
  "Photosynthesis is the way plants make their own food...",
  "Gravity is a force that attracts objects with mass...",
  "The speed of light is approximately 299,792 km/s."
]
```

---

## Switching between models

Pass the model name in the request body. The app auto-routes based on the model name:

| Model | Provider | Notes |
|---|---|---|
| `llama3.1` | Ollama | Runs locally, no API key needed |
| `meta/llama-3.2-3b-instruct` | NVIDIA | Free tier, requires API key |

Any model name containing `/` is routed to NVIDIA. Everything else goes to Ollama.

---

## One thing to know

Both `/compare` calls run **in parallel** using `Promise.all` — so you get both responses at the same time instead of waiting for one to finish before starting the other. Same applies to all questions in `/test`.
