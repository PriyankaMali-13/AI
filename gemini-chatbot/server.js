require("dotenv").config();
const express = require("express");
const generateResponse = require("./gemini");
const app = express();

app.use(express.json());

app.post("/generate", async (req, res) => {
    const prompt = req.body.prompt;
    const response = await generateResponse(prompt);

    return res.json({response});
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
