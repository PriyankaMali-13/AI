const express = require('express')
const { chat, getHistory, resetHistory } = require('./src/chatbot')

const app = express()
app.use(express.json())

// Route 1 — send a message
app.post('/chat', async (req, res) => {
    const { message } = req.body

    if (!message || message.trim().length === 0) {
        return res.status(400).json({ error: 'No message provided' })
    }

    try {
        const reply = await chat(message)

        res.json({
            message,
            reply,
            totalMessages: getHistory().length
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Route 2 — get full conversation history
app.get('/history', (req, res) => {
    const history = getHistory()

    if (history.length === 0) {
        return res.json({ message: 'No conversation yet', history: [] })
    }

    res.json({
        totalMessages: history.length,
        history
    })
})

// Route 3 — reset conversation
app.post('/reset', (req, res) => {
    resetHistory()
    res.json({ message: 'Conversation cleared. Starting fresh!' })
})

app.listen(3000, () => {
    console.log('Chatbot running on http://localhost:3000')
})