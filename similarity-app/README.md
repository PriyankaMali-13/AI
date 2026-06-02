# Document Similarity Checker

A fully local REST API that measures how similar two pieces of text are.
No cloud services, no API keys — everything runs on your machine using [Ollama](https://ollama.com) and the `nomic-embed-text` model.

---

## What it does

1. **Converts text into vectors** — each piece of text is turned into a list of ~768 numbers (called an *embedding*) that captures its meaning.
2. **Measures similarity** — compares two vectors using cosine similarity and returns a score between **0** (completely different) and **1** (identical meaning).
3. **Ranks documents** — given a query and a list of candidates, returns them sorted from most to least similar.

---

## How cosine similarity works (plain English)

Imagine every piece of text is an arrow pointing in a direction. Text with similar meaning points in roughly the same direction. Unrelated text points in a very different direction.

**Cosine similarity** measures the angle between two arrows:

- **Score = 1.0** → arrows point the same way → texts mean the same thing
- **Score = 0.5** → arrows are at an angle → texts are loosely related
- **Score = 0.0** → arrows point in opposite directions → texts have nothing in common

It ignores how long the text is and focuses only on what the text is about.

---

## Project Structure

```
similarity-app/
├── server.js          ← starts the server, defines the 2 routes
├── src/
│   ├── embedder.js    ← talks to Ollama, converts text into vectors
│   └── similarity.js  ← math functions that compare vectors
├── package.json
└── README.md
```

---

## Setup

### Prerequisites

| Tool | Install |
|---|---|
| Node.js 18 or higher | https://nodejs.org |
| Ollama | https://ollama.com/download |

### Steps

```bash
# 1 — Start Ollama (keep this running in a separate terminal)
ollama serve

# 2 — Pull the embedding model (one-time download, ~274 MB)
ollama pull nomic-embed-text

# 3 — Install dependencies
cd similarity-app
npm install

# 4 — Start the server
node server.js
```

You should see:
```
Server running at http://localhost:3000
Routes: POST /similarity  |  POST /nearest
```

---

## API Reference

### `POST /similarity`

Takes two texts and returns a score from 0 to 1.

**Request body**
```json
{
  "text1": "The cat sat on the mat.",
  "text2": "A kitten rested on a rug."
}
```

**Response**
```json
{
  "score": 0.8921,
  "text1": "The cat sat on the mat.",
  "text2": "A kitten rested on a rug."
}
```

**cURL example**
```bash
curl -X POST http://localhost:3000/similarity \
  -H "Content-Type: application/json" \
  -d '{"text1": "The cat sat on the mat.", "text2": "A kitten rested on a rug."}'
```

**Score guide**

| Score | Meaning |
|---|---|
| 0.85 – 1.00 | Very similar |
| 0.70 – 0.84 | Moderately similar |
| 0.50 – 0.69 | Loosely related |
| 0.00 – 0.49 | Not similar |

---

### `POST /nearest`

Takes one query text and a list of candidates. Returns the candidates ranked by how similar they are to the query (best match first).

**Request body**
```json
{
  "query": "Artificial intelligence and machine learning applications in healthcare and medicine",
  "candidates": [
    "Deep learning models are used to detect tumors in MRI and CT scans",
    "The football team scored three goals in the final match of the season",
    "Doctors are using AI-powered algorithms to diagnose patients faster and more accurately"
  ]
}
```

**Response**
```json
{
  "query": "Artificial intelligence and machine learning applications in healthcare and medicine",
  "results": [
    { "text": "Doctors are using AI-powered algorithms to diagnose patients faster and more accurately", "score": 0.8923 },
    { "text": "Deep learning models are used to detect tumors in MRI and CT scans",                    "score": 0.8812 },
    { "text": "The football team scored three goals in the final match of the season",                 "score": 0.3201 }
  ]
}
```

**cURL example**
```bash
curl -X POST http://localhost:3000/nearest \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Artificial intelligence and machine learning applications in healthcare and medicine",
    "candidates": [
      "Deep learning models are used to detect tumors in MRI and CT scans",
      "The football team scored three goals in the final match of the season",
      "Doctors are using AI-powered algorithms to diagnose patients faster and more accurately"
    ]
  }'
```

> **Tip:** Longer and more descriptive texts give more accurate scores. Short 2-3 word phrases produce scores that are very close together and harder to interpret.

---

## License

MIT
