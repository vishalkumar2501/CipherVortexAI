import React, { useState, useEffect } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export const showToast = (message, type = 'info') => {
  window.dispatchEvent(
    new CustomEvent('ciphervortex:toast', {
      detail: { message, type, id: Date.now() }
    })
  )
}

function Toast() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const handleToast = (e) => {
      const { message, type, id } = e.detail || {}
      if (!message) return

      setToasts((prev) => [...prev, { message, type: type || 'info', id }])

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 3500)
    }

    window.addEventListener('ciphervortex:toast', handleToast)
    return () => window.removeEventListener('ciphervortex:toast', handleToast)
  }, [])

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  if (toasts.length === 0) return null

  return (
    <div className='fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-[360px] pointer-events-none'>
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success'
        const isError = toast.type === 'error'

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${
              isSuccess
                ? 'bg-[#0f1d16]/90 border-emerald-500/30 text-emerald-200'
                : isError
                ? 'bg-[#221015]/90 border-rose-500/30 text-rose-200'
                : 'bg-[#121324]/90 border-violet-500/30 text-violet-200'
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 size={16} className='text-emerald-400 shrink-0' />
            ) : isError ? (
              <AlertCircle size={16} className='text-rose-400 shrink-0' />
            ) : (
              <Info size={16} className='text-violet-400 shrink-0' />
            )}

            <p className='text-xs font-medium leading-relaxed flex-1'>{toast.message}</p>

            <button
              onClick={() => removeToast(toast.id)}
              className='text-slate-400 hover:text-white bg-transparent border-none cursor-pointer p-0 shrink-0'
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default Toast
