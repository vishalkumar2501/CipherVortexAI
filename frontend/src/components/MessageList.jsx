import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import MessageBubble from './MessageBubble'
import LoadingAnimation from './LoadingAnimation'

function MessageList() {
  const { selectedConversation } = useSelector((state) => state.conversation)
  const { messages, isLoading } = useSelector((state) => state.message)
  const bottomRef = useRef(null)

  useEffect(() => {
    requestAnimationFrame(() => {
      bottomRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      })
    })
  }, [messages?.length, isLoading])

  const samplePrompts = [
    "Write a Netflix clone with React",
    "Explain Redis caching in simple terms",
    "Build an interactive crypto dashboard"
  ]

  const handleSelectPrompt = (promptText) => {
    window.dispatchEvent(new CustomEvent("ciphervortex:set_prompt", { detail: { prompt: promptText } }))
  }

  return (
    <div className='flex-1 overflow-y-auto px-6 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
      {messages.length === 0 || !selectedConversation ? (
        <div className="h-full flex flex-col items-center justify-center gap-5 text-center relative overflow-hidden">
          {/* Violet Spotlight Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[320px] bg-violet-600/[0.08] rounded-full blur-[90px] pointer-events-none" />

          <div className='flex flex-col items-center gap-3 relative z-10'>
            <img
              src="/logo.png"
              alt="CipherVortexAI"
              className='w-14 h-14 rounded-2xl object-cover shadow-lg shadow-violet-500/25 border border-violet-500/20'
            />
            <div className='flex flex-col gap-1.5'>
              <h1 className='text-[22px] font-bold bg-gradient-to-r from-violet-300 via-purple-300 to-pink-300 bg-clip-text text-transparent tracking-tight'>
                Welcome to CipherVortexAI
              </h1>
              <p className='text-[18px] font-semibold text-slate-200 tracking-tight'>
                How Can I Assist You?
              </p>
              <p className='text-[13px] text-slate-500 max-w-[280px] leading-relaxed'>
                Ask me anything - code, ideas, explanations, or analysis.
              </p>
            </div>
          </div>

          <div className='flex flex-wrap justify-center gap-2 mt-1 relative z-10'>
            {samplePrompts.map((s) => (
              <button
                key={s}
                onClick={() => handleSelectPrompt(s)}
                className='text-[12px] text-slate-400 bg-violet-500/[0.06] border border-violet-500/[0.14] px-4 py-2 rounded-xl hover:bg-violet-500/[0.16] hover:text-violet-200 hover:border-violet-500/40 transition-all duration-150 cursor-pointer active:scale-95'
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className='space-y-5'>
          {messages.map((msg, i) => (
            <div key={i}>
              <MessageBubble
                role={msg?.role}
                content={msg?.content}
                images={msg?.images || []}
              />
            </div>
          ))}

          {isLoading && <LoadingAnimation />}
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}

export default MessageList
