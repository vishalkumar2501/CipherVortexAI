import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import MessageBubble from './MessageBubble'
import LoadingAnimation from './LoadingAnimation'

function MessageList() {
    const {selectedConversation}=useSelector(state=>state.conversation)
    const {messages,isLoading}=useSelector(state=>state.message)
    const bottemRef=useRef(null)
   
   useEffect(()=>{
       requestAnimationFrame(()=>{
        bottemRef?.current?.scrollIntoView({
          behavior:"smooth",
          block:"end"
        })
       })
   },[messages?.length,isLoading])


  return (
    <div className='flex-1 overflow-y-auto px-6 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden relative'>
      
      {messages.length==0 || !selectedConversation ?(
        <div className="h-full flex flex-col items-center justify-center gap-6 text-center relative">
          {/* Purple spotlight glow like Echo AI */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
          </div>
           <div className='flex flex-col items-center gap-3 relative z-10'>
               {/* Logo */}
               <div className="w-14 h-14 rounded-2xl overflow-hidden border border-violet-500/30 shadow-lg shadow-violet-500/20">
                 <img src="/logo.png" alt="CipherVortexAI" className="w-full h-full object-cover" />
               </div>
               <p className='text-[14px] text-violet-300 tracking-wide'>Welcome to CipherVortexAI</p>
               <h1 className='text-[28px] font-bold text-white tracking-tight leading-tight'>How Can I Assist You?</h1>
           </div>
           <div className='flex flex-wrap justify-center gap-3 mt-2 relative z-10'>
            {["Write a Netflix clone", "Explain Redis in simple terms", "Build a dashboard UI"].map((s)=>(
              <button key={s} className='text-[12px] text-slate-400 bg-white/[0.04] border border-violet-500/[0.15] px-4 py-2.5 rounded-xl hover:bg-violet-500/10 hover:border-violet-500/30 hover:text-violet-300 transition-all duration-150 cursor-pointer backdrop-blur-sm'>
                {s}
              </button>
            ))}
           </div>
        </div>
      ):
      <div className='space-y-5'>

        {messages?.map((msg,i)=>(
            <div key={i}>
               <MessageBubble role={msg?.role} content={msg?.content} images={msg.images || []} /> 
            </div>
        ))}

        {isLoading && <LoadingAnimation/>}

        
      </div>
      }
      <div ref={bottemRef}/>
    </div>
  )
}

export default MessageList
