// embedder.js
// Talks to Ollama to turn text into an embedding vector (a list of numbers).

const OLLAMA_URL = 'http://localhost:11434';
const MODEL = 'nomic-embed-text';

// Sends one piece of text to Ollama and gets back a vector
async function embed(text) {
  console.log(`Getting embedding for: "${text}"`);

  const response = await fetch(`${OLLAMA_URL}/api/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, prompt: text }),
  });

  const json = await response.json();
  console.log(`Got a vector with ${json.embedding.length} numbers`);
  return json.embedding;
}

// Embeds multiple texts at the same time (faster than one by one)
async function embedMany(texts) {
  console.log(`Embedding ${texts.length} texts...`);
  return Promise.all(texts.map(embed));
}

module.exports = { embed, embedMany };
