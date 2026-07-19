const fs = require('fs')
const path = require('path')
const CONVERSATION_PATH = path.join(__dirname, '../data/conversation.json')

const SYSTEM_PROMPT = `You are a helpful, friendly assistant. 
You remember everything the user has told you in this conversation.
Be concise but warm. If the user tells you something personal like 
their name or preferences, remember and use it naturally.`

// ─── Context Window Config ───────────────────────────────────────────────────
// Simple option — just keep last N messages (less accurate, but easy to understand)
// const MAX_MESSAGES = 10
// function trimToLastN(history) { return history.slice(-MAX_MESSAGES) }

// Better option — token based trimming (what we use)
const MAX_TOKENS = 2048         // max tokens to send to the model
const CHARS_PER_TOKEN = 4       // rough estimate: 1 token ≈ 4 characters
const SUMMARY_THRESHOLD = 10    // summarise when history exceeds this many messages

// ─── Token Estimator ─────────────────────────────────────────────────────────
function estimateTokens(text) {
    return Math.ceil(text.length / CHARS_PER_TOKEN)
}

// ─── Summariser ───────────────────────────────────────────────────────────────
// When history gets long, ask Ollama to summarise the older messages.
// The summary is stored as a single system-style message at the top of history.
async function summariseHistory(oldMessages) {
    console.log(`summariser: summarising ${oldMessages.length} old messages...`)

    const conversation = oldMessages
        .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n')

    const prompt = `Summarise the following conversation in 3-5 sentences. 
Focus on key facts the user shared (name, preferences, important context). 
Be concise. Do not add commentary.

Conversation:
${conversation}

Summary:`

    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3.2',
                prompt,
                stream: false
            })
        })

        if (!response.ok) throw new Error(`Ollama returned ${response.status}`)

        const result = await response.json()
        const summary = result.response.trim()
        console.log('summariser: summary generated —', summary.slice(0, 80) + '...')
        return summary
    } catch (err) {
        console.warn('summariser: failed to summarise, falling back to trimming —', err.message)
        return null
    }
}

// ─── Context Window Manager ───────────────────────────────────────────────────
// Strategy:
// 1. If history is short — send as is
// 2. If history is long — summarise the old messages, keep recent ones
// 3. If summarisation fails — fall back to token-based trimming
async function buildContextHistory(history) {
    // Short enough — send everything
    if (history.length <= SUMMARY_THRESHOLD) {
        return history
    }

    console.log(`context window: history has ${history.length} messages, summarising old ones...`)

    // Split: older half gets summarised, recent half kept as is
    const splitPoint = Math.floor(history.length / 2)
    const oldMessages = history.slice(0, splitPoint)
    const recentMessages = history.slice(splitPoint)

    const summary = await summariseHistory(oldMessages)

    if (summary) {
        // Prepend summary as a system message so the model knows what happened earlier
        const summaryMessage = {
            role: 'assistant',
            content: `[Summary of earlier conversation: ${summary}]`
        }
        console.log(`context window: using summary + ${recentMessages.length} recent messages`)
        return [summaryMessage, ...recentMessages]
    }

    // Fallback — token based trimming if summarisation failed
    console.log('context window: falling back to token trimming')
    return trimToContextWindow(history)
}

// ─── Token Trimmer (fallback) ─────────────────────────────────────────────────
function trimToContextWindow(history) {
    const systemTokens = estimateTokens(SYSTEM_PROMPT)
    let availableTokens = MAX_TOKENS - systemTokens
    const trimmed = []

    for (let i = history.length - 1; i >= 0; i--) {
        const msgTokens = estimateTokens(history[i].content)
        if (availableTokens - msgTokens < 0) break
        trimmed.unshift(history[i])
        availableTokens -= msgTokens
    }

    const dropped = history.length - trimmed.length
    if (dropped > 0) {
        console.log(`context window: trimmed ${dropped} old message(s) to stay within ${MAX_TOKENS} token limit`)
    }

    return trimmed
}

// ─── File Helpers ─────────────────────────────────────────────────────────────
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

// ─── Main Chat Function ───────────────────────────────────────────────────────
async function chat(userMessage) {
    console.log('message received:', userMessage)

    const data = loadHistory()
    console.log('history loaded —', data.history.length, 'messages so far')

    // Add new user message to full history
    data.history.push({ role: 'user', content: userMessage })

    // Build context — summarise if long, trim if needed
    const contextHistory = await buildContextHistory(data.history)
    console.log(`context window: sending ${contextHistory.length} messages to model`)

    const fullPrompt = buildPrompt(contextHistory)
    console.log(`estimated prompt size: ~${estimateTokens(fullPrompt)} tokens`)

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

    // Save full history to disk — nothing is ever lost
    data.history.push({ role: 'assistant', content: assistantReply })
    saveHistory(data)
    console.log('history saved —', data.history.length, 'messages total')

    return assistantReply
}

// ─── Prompt Builder ───────────────────────────────────────────────────────────
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

// ─── Getters ──────────────────────────────────────────────────────────────────
function getHistory() {
    return loadHistory().history
}

module.exports = { chat, getHistory, resetHistory }
