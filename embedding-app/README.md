# Embedding App

A lightweight Node.js/Express microservice that generates text embeddings using a locally-running [Ollama](https://ollama.com/) model. It wraps Ollama's embedding endpoint in a simple JSON API, making it easy to plug into RAG pipelines, semantic search systems, or any application that needs text-to-vector conversion without a cloud API.

---

## Prerequisites

- Node.js 18+ (uses built-in `fetch`)
- [Ollama](https://ollama.com/) running locally on port `11434`
- The `nomic-embed-text` model pulled in Ollama:

```bash
ollama pull nomic-embed-text
```

---

## Installation

```bash
npm install
```

---

## Running the Server

```bash
npm start
# or
node server.js
```

The server starts on port `3000` and logs:

```
server listening on port 3000
```

---

## API Routes

### `POST /embed`

Generates an embedding vector for the provided text.

**Request**

| Field | Type   | Required | Description              |
|-------|--------|----------|--------------------------|
| text  | string | Yes      | The text to embed        |

```bash
curl -X POST http://localhost:3000/embed \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world"}'
```

**Success Response — `200 OK`**

```json
{
  "input": "Hello world",
  "dimensions": 768,
  "vector": [0.123, -0.456, "..."]
}
```

| Field      | Type     | Description                            |
|------------|----------|----------------------------------------|
| input      | string   | The original input text                |
| dimensions | number   | Length of the embedding vector         |
| vector     | number[] | The embedding array from Ollama        |

**Error Response — `400 Bad Request`**

Returned when the `text` field is missing or empty:

```
Request Body is empty
```

---

## Project Structure

```
embedding-app/
├── server.js            # Express server and route definitions
├── embeddingService.js  # Calls Ollama to generate embeddings
├── package.json
└── package-lock.json
```

### `server.js`

Sets up an Express 5 app on port `3000`, registers `express.json()` middleware, validates incoming requests, and returns structured JSON responses.

### `embeddingService.js`

Exports a single async function `generateEmbedding(text)` that POSTs to `http://localhost:11434/api/embeddings` using the `nomic-embed-text` model and returns the raw embedding array.

---

## Configuration

All configuration is hardcoded — no `.env` file is required.

| Setting          | Value                                   | File                  |
|------------------|-----------------------------------------|-----------------------|
| Server port      | `3000`                                  | `server.js`           |
| Ollama endpoint  | `http://localhost:11434/api/embeddings` | `embeddingService.js` |
| Embedding model  | `nomic-embed-text`                      | `embeddingService.js` |

---

## Dependencies

| Package   | Version  | Purpose              |
|-----------|----------|----------------------|
| `express` | `^5.2.1` | HTTP server framework |

---

## Usage Examples

**Semantic search ingestion** — embed documents before storing them in a vector database:

```bash
curl -X POST http://localhost:3000/embed \
  -H "Content-Type: application/json" \
  -d '{"text": "The quick brown fox jumps over the lazy dog"}'
```

**RAG pipeline** — embed a user query before retrieving relevant chunks:

```bash
curl -X POST http://localhost:3000/embed \
  -H "Content-Type: application/json" \
  -d '{"text": "What are the benefits of vector search?"}'
```
