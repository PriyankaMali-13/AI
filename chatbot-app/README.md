# 💬 Chatbot App — Node.js + Ollama

![Status](https://img.shields.io/badge/Status-Working-brightgreen?style=for-the-badge)
![Local](https://img.shields.io/badge/Runs-100%25%20Local-blue?style=for-the-badge&logo=ollama)
![Node](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

---

## What is this?

A simple conversational chatbot that runs completely on your machine — no API keys, no internet required.

You send a message, it replies. But the interesting part is that it **remembers your entire conversation** across messages. Tell it your name in the first message and it will still know it five messages later. The conversation history is saved to a local JSON file so nothing is lost between requests.

---

## How it works

```
User sends message
      ↓
server.js receives it via POST /chat
      ↓
chatbot.js loads existing conversation history from data/conversation.json
      ↓
Builds a full prompt: System instructions + all past messages + new message
      ↓
Sends the full prompt to Ollama (llama3.2) running locally
      ↓
Gets reply back → saves updated history → returns response to user
```

The key idea here is the **prompt building** — every time you send a message, the entire conversation history is included in the prompt. This is how the model "remembers" what you said earlier. It's not magic, it's context.

---

## Project structure

```
chatbot-app/
├── server.js          ← API routes (chat, history, reset)
├── src/
│   └── chatbot.js     ← core logic: loads history, builds prompt, calls Ollama, saves history
└── data/
    └── conversation.json  ← your conversation is stored here
```

---

## Setup

1. Download and install Ollama from https://ollama.com

2. Pull the model

```bash
ollama pull llama3.2
```

3. Install dependencies

```bash
npm install
```

4. Start the server

```bash
node server.js
```

Server runs on **http://localhost:3000**

---

## API Routes

**POST /chat** — send a message

```json
{ "message": "Hey! My name is Priyanka." }
```

Response:

```json
{
  "message": "Hey! My name is Priyanka.",
  "reply": "Hi Priyanka! Great to meet you. How can I help you today?",
  "totalMessages": 2
}
```

---

**GET /history** — view the full conversation so far

```json
{
  "totalMessages": 4,
  "history": [
    { "role": "user", "content": "Hey! My name is Priyanka." },
    { "role": "assistant", "content": "Hi Priyanka! Great to meet you..." },
    ...
  ]
}
```

---

**POST /reset** — clear the conversation and start fresh

```json
{ "message": "Conversation cleared. Starting fresh!" }
```

---

## One thing to know

The conversation history is **persistent** — it's saved to `data/conversation.json` after every message. So even if you restart the server, your previous conversation is still there.

To start a completely fresh conversation, hit `POST /reset` first.
