const MODEL = "nomic-embed-text";
async function generateEmbedding(text) {
  const response = await fetch("http://localhost:11434/api/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, prompt: text }),
  });

  const json = await response.json();
  return json.embedding;
}

module.exports = { generateEmbedding };