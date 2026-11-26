# ⚡ CipherVortexAI

> **CipherVortexAI** is a next-generation MERN-stack conversational AI platform powered by LangChain and LangGraph microservices. Designed with an ultra-sleek dark/violet UI aesthetic, it features real-time intelligent agents for conversation, coding, document RAG, presentations, vision, and web exploration.

---

## 📸 Key Highlights
- 🧠 **Multi-Agent Orchestration**: Specialized LangChain/LangGraph agents (Auto, Chat, Coding, PDF, Vision, Search, PPT).
- 🎨 **Modern Purple Glow Theme**: Inspired by modern minimalist AI interfaces with reactive spotlights and glassmorphism.
- ⚡ **Code Artifacts & Live Preview**: Split-pane Monaco Code Editor with sandbox preview for HTML/CSS/JS outputs.
- 🎙️ **Speech & Vision Multi-Modal**: Web Speech API speech-to-text input and image analysis.
- 📄 **Document RAG & PDF Synthesis**: Extract insights from documents via vector embeddings and generate branded PDFs.
- 💳 **Monetization Ready**: Integrated Razorpay subscription billing drawers and credit usage tracking.
- 🔐 **Firebase Auth**: Secure Google authentication with server-side validation.

---

## 🏛️ Architecture Overview

CipherVortexAI is structured as an API Gateway routing requests to autonomous microservices with Redis caching:

```
                  +---------------------------+
                  |   Frontend (React/Vite)   |
                  |   http://localhost:5173   |
                  +-------------+-------------+
                                |
                                v
                  +---------------------------+
                  |    API Gateway (Express)  |
                  |   http://localhost:8000   |
                  +-------------+-------------+
                                |
       +-----------------+------+-----------------+-----------------+
       |                 |                        |                 |
       v                 v                        v                 v
+--------------+  +--------------+         +--------------+  +--------------+
| Auth Service |  | Chat Service |         | Agent Engine |  | Billing Svc  |
|  Port: 8001  |  |  Port: 8002  |         |  Port: 8003  |  |  Port: 8004  |
+-------+------+  +-------+------+         +-------+------+  +-------+------+
        |                 |                        |                 |
        +--------+--------+------------------------+                 v
                 |                                             (Razorpay)
                 v
     +-----------------------+      +-----------------------+
     |     MongoDB Atlas     |      |      Redis (Docker)   |
     |   (Persistent Store)  |      |     (Cache & Queues)  |
     +-----------------------+      +-----------------------+
```

---

## 🔌 Microservices & Port Mapping

| Service | Port | Description |
|---|---|---|
| **Frontend** | `5173` | React 19 + Tailwind CSS + Redux Toolkit UI |
| **Gateway** | `8000` | Express reverse proxy routing incoming client traffic |
| **Auth** | `8001` | Firebase auth validation and user profile management |
| **Chat** | `8002` | Conversation lifecycle, session history, and messages |
| **Agent** | `8003` | Multi-agent LangGraph orchestrator (Groq, Gemini, Tavily, Qdrant) |
| **Billing** | `8004` | Razorpay order generation, webhooks, and subscriptions |
| **Redis** | `6379` | Dockerized fast memory cache |

---

## 🤖 AI Agents Suite

| Agent | Engine | Capability |
|---|---|---|
| **Auto** | LangGraph Router | Automatically classifies user intent and dispatches to the ideal agent |
| **Chat** | Groq / Gemini | Conversational intelligence and reasoning |
| **Coding** | Groq / Gemini | Code generation, explanation, and Monaco live preview |
| **PDF** | LangChain + Qdrant | Ingestion, text chunking, and semantic RAG search |
| **PPT** | PptxGenJS | Generates downloadable presentations |
| **Vision** | Gemini Vision | Analyzes attached images and graphs |
| **Search** | Tavily Search | Live web retrieval for up-to-date queries |

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js** (v18+)
- **Docker Desktop** (for Redis)
- **Git**

### 2. Environment Setup
Copy `.env.example` templates across each service and configure your keys:
- `backend/gateway/.env.example` &rarr; `backend/gateway/.env`
- `backend/services/auth/.env.example` &rarr; `backend/services/auth/.env`
- `backend/services/chat/.env.example` &rarr; `backend/services/chat/.env`
- `backend/services/agent/.env.example` &rarr; `backend/services/agent/.env`
- `backend/services/billing/.env.example` &rarr; `backend/services/billing/.env`
- `frontend/.env.example` &rarr; `frontend/.env`

### 3. One-Click Launch (Windows)
Double-click or run from terminal:
```bat
scripts\start-all.bat
```
*Or via PowerShell:*
```powershell
.\scripts\start-all.ps1
```

Once running, navigate to:
```
http://localhost:5173
```

---

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, Redux Toolkit, Monaco Editor, Framer Motion
- **Backend**: Node.js, Express, LangChain, LangGraph, Mongoose, Redis (ioredis)
- **AI Providers**: Groq (Llama), Google Gemini, Tavily Search, Qdrant Vector DB
- **Payments**: Razorpay
- **DevOps**: Docker Compose, GitHub Actions CI/CD

---

## 📄 License
ISC © [vishalkumar2501](https://github.com/vishalkumar2501)
