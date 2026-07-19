const express = require("express");
const embeddingService = require("./embeddingService");
const PORT = 3000;

const app = express();

app.use(express.json());

app.post("/embed", async (req, res) => {
  const text = req.body.text;
  if (!text) {
    return res.status(400).send("Request Body is empty");
  }
  const response = await embeddingService.generateEmbedding(text);
  return res.json({
    input: text,
    dimensions: response.length,
    vector: response,
  });
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
