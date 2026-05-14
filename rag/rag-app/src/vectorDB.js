const fs = require('fs')
const path = require('path')

const DB_PATH = path.join(__dirname, '../data/db.json')

function loadDB() {
    try {
        if (fs.existsSync(DB_PATH)) {
            const raw = fs.readFileSync(DB_PATH, 'utf-8')
            
            // if file is empty return fresh DB instead of crashing
            if (!raw || raw.trim().length === 0) {
                return { chunks: [] }
            }

            return JSON.parse(raw)
        }
        return { chunks: [] }
    } catch (err) {
        throw new Error(`vectorDB: failed to load DB — ${err.message}`)
    }
}

function saveDB(db) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
    } catch (err) {
        throw new Error(`vectorDB: failed to save DB — ${err.message}`)
    }
}

function storeChunk(chunk) {
    if (!chunk || !chunk.text || !chunk.embedding) {
        throw new Error('vectorDB: chunk must have text and embedding')
    }

    const db = loadDB()
    db.chunks.push(chunk)
    saveDB(db)
}

function cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) {
        throw new Error('vectorDB: vectors must be same length for comparison')
    }

    let dot = 0
    let magA = 0
    let magB = 0

    for (let i = 0; i < vecA.length; i++) {
        dot  += vecA[i] * vecB[i]
        magA += vecA[i] * vecA[i]
        magB += vecB[i] * vecB[i]
    }

    return dot / (Math.sqrt(magA) * Math.sqrt(magB))
}

function searchDB(questionVector, topK = 3) {
    if (!questionVector || !Array.isArray(questionVector)) {
        throw new Error('vectorDB: questionVector must be an array')
    }

    const db = loadDB()

    if (db.chunks.length === 0) {
        throw new Error('vectorDB: no chunks found — please ingest a document first')
    }

    const scored = db.chunks.map(chunk => ({
        ...chunk,
        score: cosineSimilarity(chunk.embedding, questionVector)
    }))

    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
}

function clearDB() {
    saveDB({ chunks: [] })
}

module.exports = { storeChunk, searchDB, clearDB }