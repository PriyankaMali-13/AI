const axios = require('axios');

async function callModel(prompt, question, model) {

    if (model.includes('/')) {
        try {
            const response = await axios.post('https://integrate.api.nvidia.com/v1/chat/completions', 
            {
                model: model,
                messages: [
                    { "role": "system", "content": prompt },
                    { "role": "user", "content": question }
                    ],
                stream: false
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
                }
            });
            console.log("Response from NVDIA");
            
            return response.data.choices[0].message.content;
        } catch (error) {
            console.log("Error occured in NVDIA callModel", error);
        }
    }
    else {
        try {
            let updatedPrompt = prompt + " " + question;

            const response = await axios.post('http://localhost:11434/api/generate', {
                model: model,
                prompt: updatedPrompt,
                stream: false
            });
            console.log("Response from OLLAMA");
            return response.data.response;

        } catch (error) {
            console.log("Error occured in OLLAMA callModel", error);
        }
    }
}

module.exports = { callModel };



/*

const token = 'your_bearer_token_here';
    const response = await axios.get('https://example.com', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
*/








/*

Import axios
Write async function callModel(prompt, question, model)
Combine prompt and question into one string
Make a POST request to Ollama using axios
Extract the response text and return it
Export the function
Give it a try — for step 4, the Ollama body needs model, prompt, and stream: false.

*/