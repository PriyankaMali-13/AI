const express = require('express')
const { ingestDocument, retrieve } = require('./src/retriever')
const { askLLM } = require('./src/llm')

const app = express()
app.use(express.json())

// Route 1 — ingest a document
app.post('/ingest', async (req, res) => {
    const { text } = req.body

    if (!text) {
        return res.status(400).json({ error: 'No text provided' })
    }

    try {
        const totalChunks = await ingestDocument(text)
        res.json({
            message: 'Document ingested successfully',
            totalChunks
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Route 2 — ask a question
app.post('/ask', async (req, res) => {
    const { question } = req.body

    if (!question) {
        return res.status(400).json({ error: 'No question provided' })
    }

    try {
        const chunks = await retrieve(question, 3)
        const answer = await askLLM(question, chunks)

        res.json({
            question,
            answer,
            sourcedFrom: chunks.map(c => ({
                text: c.text.slice(0, 100) + '...',
                score: c.score.toFixed(4)
            }))
        })
    } catch (err) {
        // give helpful message if document not ingested yet
        if (err.message.includes('no chunks found')) {
            return res.status(400).json({
                error: 'No document ingested yet. Please call /ingest first.'
            })
        }
        res.status(500).json({ error: err.message })
    }
})

// Route 3 — peek inside the vector DB
app.get('/db', (req, res) => {
    try {
        const fs = require('fs')
        const raw = fs.readFileSync('./data/db.json', 'utf-8')
        res.json(JSON.parse(raw))
    } catch (err) {
        res.status(500).json({ error: 'Could not read DB — ' + err.message })
    }
})

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000')
})