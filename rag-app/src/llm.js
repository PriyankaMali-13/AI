async function askLLM(question, chunks) {
    if (!question || question.trim().length === 0) {
        throw new Error('llm: question cannot be empty')
    }

    if (!chunks || chunks.length === 0) {
        throw new Error('llm: no chunks provided to answer from')
    }

    const context = chunks
        .map((chunk, index) => `[Excerpt ${index + 1}]:\n${chunk.text}`)
        .join('\n\n')

    const prompt = `You are a helpful assistant that answers questions strictly from the provided document context.

Rules:
1. Answer ONLY from the context provided below
2. If the answer is not in the context, say "I could not find that in the document"
3. Be concise and clear
4. Mention which excerpt your answer came from

Context from document:
${context}

Question: ${question}

Answer:`

    let response

    try {
        response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3.2',
                prompt,
                stream: false
            })
        })
    } catch (err) {
        throw new Error(`llm: could not reach Ollama — is it running? ${err.message}`)
    }

    if (!response.ok) {
        throw new Error(`llm: Ollama returned error status ${response.status}`)
    }

    const data = await response.json()

    if (!data.response) {
        throw new Error('llm: Ollama returned empty response')
    }

    return data.response
}

module.exports = { askLLM }