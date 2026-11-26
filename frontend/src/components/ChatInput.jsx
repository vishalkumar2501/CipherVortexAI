import { Code2, FileText, Globe, ImageIcon, MessageSquare, Mic, MicOff, Paperclip, Presentation, Send, X, Zap } from 'lucide-react'
import React, { useEffect, useState, useRef } from 'react'
import sendMessage from '../features/sendMessage'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage, setArtifacts, setIsLoading, setMessages } from '../redux/messageSlice'
import { createConversation } from '../features/createConversation'
import { addConversation, setConvTitle, setSelectedConversation } from '../redux/conversationSlice'
import { updateConversation } from '../features/updateConversation'
import { showToast } from './Toast'

function ChatInput() {
  const [value, setValue] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("Auto")
  const { selectedConversation } = useSelector(state => state.conversation)
  const { messages, isLoading } = useSelector(state => state.message)
  const [selectedFile, setSelectedFile] = useState(null)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)
  const fileRef = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const handleSetPrompt = (e) => {
      if (e.detail?.prompt) {
        setValue(e.detail.prompt)
      }
    }
    window.addEventListener("ciphervortex:set_prompt", handleSetPrompt)
    return () => window.removeEventListener("ciphervortex:set_prompt", handleSetPrompt)
  }, [])

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.interimResults = true
    recognition.continuous = true

    recognition.onresult = (event) => {
      let transcript = ""
      for (let index = event.resultIndex; index < event.results.length; index++) {
        transcript += event.results[index][0].transcript
      }
      setValue(transcript)
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognitionRef.current = recognition
  }, [])

  const toggleMic = () => {
    if (!recognitionRef.current) {
      showToast("Speech recognition is not supported in this browser.", "error")
      return
    }
    if (listening) {
      recognitionRef.current.stop()
      setListening(false)
    } else {
      recognitionRef.current.start()
      setListening(true)
    }
  }

  const handleSendMessage = async () => {
    if (!value.trim() && !selectedFile) return
    if (isLoading) return

    const promptText = value.trim()
    dispatch(setIsLoading(true))
    let conversation = selectedConversation

    if (!conversation) {
      dispatch(setMessages([]))
      const conv = await createConversation()
      dispatch(setSelectedConversation(conv))
      dispatch(addConversation(conv))
      conversation = conv
    }

    if (conversation.title === "New Chat" && promptText) {
      await updateConversation({ id: conversation?._id, title: promptText })
      dispatch(setConvTitle({ conversationId: conversation?._id, title: promptText.slice(0, 40) }))
    }

    const formData = new FormData()
    formData.append("prompt", promptText)
    formData.append("conversationId", conversation?._id)
    formData.append("agent", selectedAgent.toLowerCase())
    if (selectedFile) {
      formData.append("file", selectedFile)
    }

    dispatch(addMessage({ role: "user", content: promptText }))
    setValue("")
    const currentFile = selectedFile
    setSelectedFile(null)

    try {
      const data = await sendMessage(formData)
      dispatch(setIsLoading(false))
      dispatch(setArtifacts(data?.artifacts || []))
      dispatch(addMessage({ role: "assistant", content: data?.answer, images: data?.images }))
    } catch (error) {
      console.error("Failed to send message:", error)
      dispatch(setIsLoading(false))
      dispatch(addMessage({ role: "assistant", content: "Something went wrong while communicating with the AI agent. Please check backend services." }))
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const agents = [
    { id: "auto", icon: Zap, label: "Auto" },
    { id: "chat", icon: MessageSquare, label: "Chat" },
    { id: "coding", icon: Code2, label: "Coding" },
    { id: "pdf", icon: FileText, label: "PDF" },
    { id: "ppt", icon: Presentation, label: "PPT" },
    { id: "vision", icon: ImageIcon, label: "Vision" },
    { id: "search", icon: Globe, label: "Search" }
  ]

  return (
    <div className='w-full overflow-hidden px-3 md:px-5 py-3 border-t border-violet-500/[0.10] bg-[#09090f]'>
      <div className='flex flex-col gap-2 bg-[#12131d]/60 border border-violet-500/[0.14] rounded-2xl px-4 pt-3 pb-2.5 shadow-lg shadow-black/40'>

        {/* Agent selector tabs */}
        <div className='flex w-full gap-2 pr-2 flex-wrap items-center'>
          {agents.map((agent) => {
            const isActive = selectedAgent === agent.label
            const Icon = agent.icon
            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent.label)}
                className={`
                  flex-shrink-0
                  cursor-pointer
                  inline-flex
                  items-center
                  gap-1.5
                  px-3
                  py-1.5
                  rounded-full
                  text-xs
                  font-medium
                  border
                  transition-all duration-150
                  ${isActive
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-transparent shadow-[0_1px_8px_rgba(139,92,246,.35)]"
                    : "bg-white/[0.03] text-slate-400 border-violet-500/[0.10] hover:bg-white/[0.06] hover:text-slate-300"
                  }
                `}>
                <Icon size={13} className={isActive ? "text-white" : "text-violet-400/70"} />
                {agent.label}
              </div>
            )
          })}
        </div>

        {/* Selected file preview */}
        {selectedFile && (
          <div className='my-2'>
            <div className='inline-flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-1.5'>
              {selectedFile?.type === "application/pdf" ? (
                <FileText size={16} className="text-red-400" />
              ) : selectedFile.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  className="h-9 w-9 rounded-lg object-cover"
                  alt="preview"
                />
              ) : (
                <FileText size={16} className="text-violet-300" />
              )}

              <div>
                <p className='text-xs text-white max-w-[200px] truncate'>{selectedFile?.name}</p>
                <p className='text-[10px] text-slate-400'>{Math.ceil(selectedFile.size / 1024)} KB</p>
              </div>
              <button
                className='ml-2 text-slate-400 hover:text-white cursor-pointer bg-transparent border-none'
                onClick={() => {
                  setSelectedFile(null)
                  if (fileRef.current) fileRef.current.value = ""
                }}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Prompt Textarea with Enter to submit */}
        <textarea
          placeholder='Ask CipherVortex anything... (Press Enter to send, Shift+Enter for new line)'
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          value={value}
          disabled={isLoading}
          className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-500 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50 min-h-[56px]"
          rows={2}
        />

        {/* Actions bar */}
        <div className='flex items-center justify-between pt-1 border-t border-white/[0.04]'>
          <div className='flex items-center gap-1.5'>
            <input
              type="file"
              accept='.pdf,image/*'
              hidden
              ref={fileRef}
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) setSelectedFile(file)
              }}
            />

            <button
              title='Attach PDF or image'
              className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-violet-300 hover:bg-white/[0.05] border border-transparent hover:border-violet-500/20 transition-all duration-150 bg-transparent cursor-pointer'
              onClick={() => fileRef.current?.click()}
            >
              <Paperclip size={15} />
            </button>

            <button
              title={listening ? "Stop listening" : "Start voice input"}
              onClick={toggleMic}
              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 cursor-pointer border-none ${listening ? "bg-red-500 text-white animate-pulse" : "text-slate-400 hover:text-violet-300 hover:bg-white/[0.05]"}`}
            >
              {listening ? <Mic size={15} /> : <MicOff size={15} />}
            </button>

            <span className='hidden sm:inline-block text-[11px] text-slate-500 ml-2'>
              Enter ↵ to send
            </span>
          </div>

          <div className='flex items-center gap-2'>
            {value.length > 0 && (
              <span className='text-[11px] text-slate-500 font-mono'>
                {value.length} chars
              </span>
            )}

            <button
              disabled={(!value.trim() && !selectedFile) || isLoading}
              onClick={handleSendMessage}
              className={`flex items-center justify-center w-8 h-8 rounded-lg border-none cursor-pointer transition-all duration-150 ${
                (value.trim() || selectedFile) && !isLoading
                  ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 hover:opacity-90 text-white shadow-md shadow-violet-600/30"
                  : "bg-white/[0.05] text-slate-600 cursor-not-allowed"
              }`}
            >
              <Send size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ChatInput
