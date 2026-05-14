async function embedText(text) {
    if (!text || text.trim().length === 0) {
        throw new Error('embedder: cannot embed empty text')
    }

    let response

    try {
        response = await fetch('http://localhost:11434/api/embeddings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'nomic-embed-text',
                prompt: text
            })
        })
    } catch (err) {
        throw new Error(`embedder: could not reach Ollama — is it running? ${err.message}`)
    }

    if (!response.ok) {
        throw new Error(`embedder: Ollama returned error status ${response.status}`)
    }

    const data = await response.json()

    if (!data.embedding || !Array.isArray(data.embedding)) {
        throw new Error('embedder: Ollama returned invalid embedding')
    }

    return data.embedding
}

module.exports = { embedText }