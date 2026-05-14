const { chunkText } = require('./chunker')
const { embedText } = require('./embedder')
const { storeChunk, searchDB, clearDB } = require('./vectorDB')

async function ingestDocument(text) {
    let chunks

    // catch chunking errors
    try {
        chunks = chunkText(text)
    } catch (err) {
        throw new Error(`retriever: chunking failed — ${err.message}`)
    }

    console.log(`Created ${chunks.length} chunks`)

    clearDB()

    // embed and store each chunk
    for (let i = 0; i < chunks.length; i++) {
        console.log(`Embedding chunk ${i + 1} of ${chunks.length}...`)

        try {
            const embedding = await embedText(chunks[i].text)
            storeChunk({
                id: chunks[i].id,
                text: chunks[i].text,
                embedding
            })
        } catch (err) {
            throw new Error(`retriever: failed at chunk ${i + 1} — ${err.message}`)
        }
    }

    console.log(`Done! ${chunks.length} chunks stored in vector DB`)
    return chunks.length
}

async function retrieve(question, topK = 3) {
    let questionVector

    try {
        console.log('Embedding question...')
        questionVector = await embedText(question)
    } catch (err) {
        throw new Error(`retriever: failed to embed question — ${err.message}`)
    }

    try {
        console.log('Searching vector DB...')
        const results = searchDB(questionVector, topK)
        return results
    } catch (err) {
        throw new Error(`retriever: search failed — ${err.message}`)
    }
}

module.exports = { ingestDocument, retrieve }