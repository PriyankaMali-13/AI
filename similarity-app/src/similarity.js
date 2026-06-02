// Math helpers for comparing embedding vectors.

// Step 1: Multiply each pair of numbers and add them all up
function dotProduct(a, b) {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

// Step 2: Find the "length" of a vector
function magnitude(v) {
  return Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
}

// Step 3: Cosine similarity — divides the dot product by both magnitudes
// Returns a number between 0 (totally different) and 1 (identical meaning)
function cosineSimilarity(a, b) {
  return dotProduct(a, b) / (magnitude(a) * magnitude(b));
}

// Takes a query vector and a list of candidate vectors + their texts,
// and returns them sorted from most similar to least similar
function rankBySimilarity(queryVec, candidateVecs, candidateTexts) {
  const scored = candidateTexts.map((text, i) => ({
    text,
    score: parseFloat(cosineSimilarity(queryVec, candidateVecs[i]).toFixed(4)),
  }));

  return scored.sort((a, b) => b.score - a.score);
}

module.exports = { cosineSimilarity, rankBySimilarity };
