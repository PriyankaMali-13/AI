const fs = require('fs')
const path = require('path')

const CONVERSATION_PATH = path.join(__dirname, '../data/conversation.json')

const SYSTEM_PROMPT = `You are a helpful, friendly assistant. 
You remember everything the user has told you in this conversation.
Be concise but warm. If the user tells you something personal like 
their name or preferences, remember and use it naturally.`

function loadHistory() {
    try {
        if (fs.existsSync(CONVERSATION_PATH)) {
            const raw = fs.readFileSync(CONVERSATION_PATH, 'utf-8')
            if (!raw || raw.trim().length === 0) return { history: [] }
            return JSON.parse(raw)
        }
        return { history: [] }
    } catch (err) {
        throw new Error(`chatbot: failed to load history — ${err.message}`)
    }
}

function saveHistory(data) {
    try {
        fs.writeFileSync(CONVERSATION_PATH, JSON.stringify(data, null, 2))
    } catch (err) {
        throw new Error(`chatbot: failed to save history — ${err.message}`)
    }
}

function resetHistory() {
    saveHistory({ history: [] })
    console.log('conversation cleared')
}

async function chat(userMessage) {
    console.log('message received:', userMessage)

    const data = loadHistory()
    console.log('history loaded —', data.history.length, 'messages so far')

    data.history.push({
        role: 'user',
        content: userMessage
    })

    const fullPrompt = buildPrompt(data.history)
    console.log('sending to Ollama...')

    let response
    try {
        response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3.2',
                prompt: fullPrompt,
                stream: false
            })
        })
    } catch (err) {
        throw new Error(`chatbot: could not reach Ollama — is it running? ${err.message}`)
    }

    if (!response.ok) {
        throw new Error(`chatbot: Ollama returned error status ${response.status}`)
    }

    const result = await response.json()
    const assistantReply = result.response.trim()
    console.log('reply received:', assistantReply.slice(0, 60) + '...')

    data.history.push({
        role: 'assistant',
        content: assistantReply
    })

    saveHistory(data)
    console.log('history saved —', data.history.length, 'messages total')

    return assistantReply
}

function buildPrompt(history) {
    let prompt = `SYSTEM: ${SYSTEM_PROMPT}\n\n`

    history.forEach(msg => {
        if (msg.role === 'user') {
            prompt += `User: ${msg.content}\n`
        } else {
            prompt += `Assistant: ${msg.content}\n`
        }
    })

    prompt += `Assistant:`
    return prompt
}

function getHistory() {
    return loadHistory().history
}

module.exports = { chat, getHistory, resetHistory }