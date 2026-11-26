# CipherVortexAI

An advanced AI chat application built with the MERN stack, featuring multiple intelligent agents for chat, coding, PDF analysis, image recognition, PPT generation, and web search.

## Features
- 🤖 Multi-agent AI system (Chat, Coding, PDF, Vision, Search, PPT)
- 🔐 Google Authentication via Firebase
- 💳 Razorpay billing integration
- 📄 PDF generation & RAG (Retrieval-Augmented Generation)
- 🎨 Code editor with live preview (Monaco Editor)
- ⚡ Real-time streaming responses
- 🗂️ Conversation history with Redis caching

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS v4, Redux Toolkit
- **Backend**: Node.js, Express (microservices)
- **AI**: LangChain, LangGraph agents
- **Database**: MongoDB
- **Cache**: Redis
- **Auth**: Firebase
- **Payments**: Razorpay
- **Deploy**: Docker, GitHub Actions

## Getting Started

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend (each service)
cd backend/services/agent && npm install && node index.js
```

---
Built with ❤️ — CipherVortexAI
