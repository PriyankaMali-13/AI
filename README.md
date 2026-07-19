# 🤖 AI Learning Journey

![AI](https://img.shields.io/badge/AI-Learning%20Journey-blue?style=for-the-badge&logo=openai&logoColor=white)
![Status](https://img.shields.io/badge/Status-Actively%20Learning-brightgreen?style=for-the-badge)
![Made With](https://img.shields.io/badge/Made%20With-Curiosity%20%26%20Coffee-orange?style=for-the-badge)

---

## 👋 About This Repository

This is my personal AI learning space.

I created this repository to document and share everything I build, experiment with, and learn as I explore the world of Artificial Intelligence. You will find hands-on projects, mini experiments, code snippets, notes, and anything else I pick up along the way — from beginner concepts to more advanced topics.

The goal is simple: **learn by doing**. Every folder here represents something I actually sat down and built or studied — not just read about.

---

## 🧠 What I'm Exploring

Here are the topics and technologies I am diving into:

| Area | Topics |
|---|---|
| 🦙 **LLMs** | Large Language Models, how they work, how to use them locally and via APIs |
| 🔍 **RAG** | Retrieval-Augmented Generation, vector search, document Q&A |
| 🤖 **AI Agents** | Autonomous agents, tool use, multi-step reasoning |
| ✍️ **Prompt Engineering** | Writing effective prompts, few-shot learning, chain-of-thought |
| 🗄️ **Vector Databases** | Embeddings, cosine similarity, semantic search |
| 🔌 **APIs & SDKs** | OpenAI, Anthropic (Claude), Ollama, Hugging Face |
| ☁️ **AWS AI Services** | Bedrock, SageMaker, Rekognition, Comprehend, Textract |
| 🐍 **Tools & Frameworks** | Node.js, LangChain, LlamaIndex |

---

## 📁 Folder Structure

As this repo grows, each topic will get its own folder so everything stays organized and easy to navigate.

```
AI/
├── rag-app/              ← RAG Document Q&A (Node.js + Ollama)
├── chatbot-app/          ← Conversational Chatbot (Node.js + Ollama)
├── similarity-app/       ← Document Similarity Checker (Node.js + Ollama)
├── finetune-app/         ← Fine-Tuning Demo (Node.js + Ollama)
├── prompt-tester/        ← Prompt Tester (Node.js + Ollama + NVIDIA)
├── desktop-analyzer/     ← Desktop Personality Analyzer (Node.js + NVIDIA Vision API)
├── embedding-app/        ← Embedding Demo (Node.js + Ollama)
├── agents/               ← coming soon
├── prompt-engineering/   ← coming soon
├── aws-ai/               ← coming soon
└── ...
```

Each folder has its own `README.md` explaining what the project does and how to run it.

---

## 🚀 Projects & Experiments

| # | Project | Description | Tech |
|---|---------|-------------|------|
| 01 | [rag-app](./rag-app/) | Local RAG system — paste a doc, ask questions, get answers from your document only. No API keys, no cloud. | Node.js, Ollama, nomic-embed-text, llama3.2 |
| 02 | [chatbot-app](./chatbot-app/) | Conversational chatbot with memory — chat back and forth with a local LLM that remembers the full conversation history. No API keys, no cloud. | Node.js, Ollama, llama3.2 |
| 03 | [similarity-app](./similarity-app/) | Document Similarity Checker — compare two texts or rank a list by similarity using embeddings and cosine similarity math. No API keys, no cloud. | Node.js, Ollama, nomic-embed-text |
| 04 | [finetune-app](./finetune-app/) | Fine-Tuning Demo — compare a base model vs a custom model built with a Modelfile. Understand how fine-tuning shapes model behavior. No API keys, no cloud. | Node.js, Ollama, llama3.2 |
| 05 | [prompt-tester](./prompt-tester/) | Prompt Tester — test and compare prompts across local Ollama models and NVIDIA cloud models from a single API. | Node.js, Express, Ollama, NVIDIA API |
| 06 | [desktop-analyzer](./desktop-analyzer/) | Desktop Personality Analyzer — upload a desktop screenshot and get an AI-generated analysis in serious, interview, or roast mode. | Node.js, Express, Multer, NVIDIA Vision API |
| 07 | [embedding-app](./[prompt-tester](./embedding-app)/) | Embedding Model Demo - A lightweight Node.js/Express microservice that generates text embeddings using a locally-running Ollama model. It wraps Ollama's embedding endpoint in a simple JSON API, making it easy to plug into RAG pipelines, semantic search systems, or any application that needs text-to-vector conversion without a cloud API. |
| — | More coming soon... | | |

---

## 🗺️ Learning Roadmap

### ✅ Done
- [x] Built a local RAG pipeline from scratch (chunking → embeddings → vector DB → LLM)
- [x] Built a conversational chatbot with memory using a local LLM
- [x] Built a document similarity checker using embeddings and cosine similarity
- [x] Understood how cosine similarity works for semantic search
- [x] Ran LLMs locally using Ollama
- [x] Explored fine-tuning basics — base model vs custom model using Modelfile
- [x] Built a prompt tester to compare outputs across local and cloud models
- [x] Built an AI vision app that analyzes desktop screenshots with personality modes
- [x] Explored Embedding in depth

### 🔄 In Progress
- [ ] Exploring AI Agents and tool-use patterns
- [ ] Learning prompt engineering techniques

### 📌 Up Next
- [ ] Build a simple AI agent with memory
- [ ] Experiment with AWS Bedrock
- [ ] Try LangChain for chaining LLM calls
- [ ] Explore advanced fine-tuning with real model retraining (Unsloth / Axolotl)
- [ ] Build a multi-document RAG system
- [ ] Integrate a proper vector database (ChromaDB / Pinecone)

---

## 🎯 Future Goals

- Build real-world AI-powered applications end to end
- Get comfortable working with both local models and cloud AI services
- Explore AWS AI/ML services and how they fit into production systems
- Understand how AI agents make decisions and use tools
- Document everything clearly so others can learn from it too

---

## 🛠️ How to Use This Repo

Each project folder is self-contained with its own setup instructions in its `README.md`. Just navigate to the folder you are interested in and follow the steps there.

---

## 📬 A Note

I am learning in public. Some of this will be messy, some of it will be experiments that didn't quite work, and that's okay. The point is to keep building and keep learning.

If you are on a similar journey, feel free to explore, fork, or reach out.

---

*This repository is actively maintained and updated as I learn.*
