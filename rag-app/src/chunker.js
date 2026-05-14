function chunkText(text, chunkSize = 200, overlap = 40) {
    // validate input
    if (!text || typeof text !== 'string') {
        throw new Error('chunker: text must be a non empty string')
    }

    if (text.trim().length === 0) {
        throw new Error('chunker: text cannot be blank')
    }

    if (chunkSize <= overlap) {
        throw new Error('chunker: chunkSize must be greater than overlap')
    }

    const words = text.split(/\s+/).filter(w => w.length > 0)

    if (words.length < 20) {
        throw new Error('chunker: document too short, please provide more text')
    }

    const chunks = []
    let i = 0

    while (i < words.length) {
        const chunkWords = words.slice(i, i + chunkSize)
        const chunk = chunkWords.join(' ')

        if (chunkWords.length > 20) {
            chunks.push({
                id: chunks.length,
                text: chunk,
                wordCount: chunkWords.length
            })
        }

        i += chunkSize - overlap
        if (i + overlap >= words.length) break
    }

    return chunks
}

module.exports = { chunkText }