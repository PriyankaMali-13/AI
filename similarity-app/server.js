// A simple Express server that checks how similar two pieces of text are.
// It uses Ollama to turn text into numbers, then compares those numbers.

const express = require('express');
const { embedMany } = require('./src/embedder');
const { cosineSimilarity, rankBySimilarity } = require('./src/similarity');

const app = express();
const PORT = 3000;

// This lets Express read JSON from request bodies
app.use(express.json());

// Takes two texts and returns a score from 0 to 1
// 0 = completely different, 1 = identical meaning
app.post('/similarity', async (req, res) => {
  const { text1, text2 } = req.body;

  console.log('Comparing two texts...');

  // Get the embedding vectors for both texts at the same time
  const [vec1, vec2] = await embedMany([text1, text2]);

  // Compare the two vectors using cosine similarity
  const score = parseFloat(cosineSimilarity(vec1, vec2).toFixed(4));

  console.log('Similarity score:', score);
  res.json({ score, text1, text2 });
});


// Takes one query text and a list of candidates
// Returns the candidates sorted by how similar they are to the query
app.post('/nearest', async (req, res) => {
  const { query, candidates } = req.body;

  console.log(`Finding most similar texts to: "${query}"`);

  // Embed the query and all candidates in one go
  const [queryVec, ...candidateVecs] = await embedMany([query, ...candidates]);

  // Sort candidates from most to least similar
  const results = rankBySimilarity(queryVec, candidateVecs, candidates);

  console.log('Top match:', results[0].text, '— score:', results[0].score);
  res.json({ query, results });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
