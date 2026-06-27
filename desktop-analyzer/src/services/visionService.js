const axios = require("axios");
const getPrompt = require('./promptService');

async function analyzeImage(imageBuffer, mode) {
  try {
    const image = imageBuffer.toString("base64");
    const response = await axios.post(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        model: "meta/llama-3.2-11b-vision-instruct",
        max_tokens: 1024,
        temperature : 0.7,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: getPrompt(mode)},
              {
                type: "image_url",
                image_url: { url: `data:image/png;base64,${image}` },
              },
            ],
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
        },
      },
    );
    const cleanResult = response.data.choices[0].message.content
      .replace(/\*/g, "")
      .trim();

    return cleanResult;
  } catch (error) {
        throw new Error('Failed to analyze image');
  }
}

module.exports = analyzeImage;
