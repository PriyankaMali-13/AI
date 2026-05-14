# RAG Document Q&A — Node.js + Ollama

No API keys. No cloud. Runs 100% on your machine.

## What is this?

You paste a document, ask questions, get answers — strictly from your document, not from the AI's general knowledge.

## How it works

User pastes a document → the doc is divided into small chunks → these chunks are later converted to vectors (numbers, because computers cannot understand human language) → these vectors are then saved to a vector DB (a JSON file where we store chunks and their corresponding vectors).

One thing to note — each chunk has 768 vectors no matter how big or small the text is.

We then have a retrieve function which combines all the above 3 tasks into one — this is what gets called when you hit the API.

When the user asks a question we send a request to retrieve which does cosine similarity — meaning it generates a vector of the question and finds the closest match in the vector DB. Once we have a match the relevant chunks are sent to the LLM. We have done some prompt engineering here to control how the output is shown to the user. The LLM just refines the output — it does not modify or do any similarity check on the chunks.

And that's it — you get your final answer.

## Project structure

```
rag-app/
├── server.js        ← all API routes
├── src/
│   ├── chunker.js   ← splits doc into chunks
│   ├── embedder.js  ← converts text to vectors via Ollama
│   ├── vectorDB.js  ← stores vectors, does cosine similarity
│   ├── retriever.js ← combines chunker + embedder + vectorDB
│   └── llm.js       ← prompt engineering + gets answer from llama3.2
└── data/
    └── db.json      ← your vector database
```

## Setup

1. Download and install Ollama from https://ollama.com

2. Pull the models

```bash
ollama pull nomic-embed-text
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

## API Routes

**POST /ingest** — paste your document here first

```json
{ "text": "your document text here..." }
```

**POST /ask** — ask your question

```json
{ "question": "What is deep learning?" }
```

**GET /db** — peek inside your vector DB

## One important thing

Always call `/ingest` before `/ask` — otherwise you will get:

```json
{ "error": "No document ingested yet. Please call /ingest first." }
```
