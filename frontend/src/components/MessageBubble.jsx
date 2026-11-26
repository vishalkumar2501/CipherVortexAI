import { Check, Copy, ExternalLink, Sparkles, X } from 'lucide-react'
import React, { useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

function MessageBubble({ role, content, images }) {
  const isUser = role === "user"
  const [lightBox, setLightBox] = useState(null)
  const [copiedCode, setCopiedCode] = useState("")
  const [copiedMessage, setCopiedMessage] = useState(false)

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => {
      setCopiedCode("")
    }, 2000)
  }

  const copyFullMessage = async () => {
    if (!content) return
    await navigator.clipboard.writeText(content)
    setCopiedMessage(true)
    setTimeout(() => {
      setCopiedMessage(false)
    }, 2000)
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} group`}>
      <div className={`w-fit max-w-[92vw] md:max-w-[75%]
        px-4 py-3 rounded-2xl
        break-words overflow-hidden
        leading-relaxed
        ${isUser
          ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-tr-sm shadow-md shadow-violet-900/25"
          : "bg-white/[0.03] border border-violet-500/[0.12] text-slate-200 rounded-tl-sm shadow-sm"
        }`}>

        {images && images.length > 0 && (
          <div className='flex flex-wrap gap-3 mb-3'>
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setLightBox(img)}
                loading="lazy"
                onError={(e) => e.currentTarget.remove()}
                className="w-40 h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition"
                alt="attachment"
              />
            ))}
          </div>
        )}

        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className='text-2xl font-bold mt-4 mb-2 text-violet-200'>{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className='text-xl font-semibold mt-3 mb-2 text-violet-300'>{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className='text-lg font-semibold mt-2 mb-1 text-slate-100'>{children}</h3>
            ),
            p: ({ children }) => (
              <p className='mb-2.5 whitespace-pre-wrap break-words text-[14px] leading-relaxed'>{children}</p>
            ),
            ul: ({ children }) => (
              <ul className='list-disc pl-5 space-y-1 my-2'>{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className='list-decimal pl-5 space-y-1 my-2'>{children}</ol>
            ),
            table: ({ children }) => (
              <div className='overflow-x-auto my-4'>
                <table className='min-w-full border border-violet-500/20 text-xs'>
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className='border border-violet-500/20 bg-violet-500/10 px-3 py-2 text-left text-violet-300 font-semibold'>
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className='border border-violet-500/10 px-3 py-2'>
                {children}
              </td>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-violet-400 hover:text-violet-300 underline inline-flex items-center gap-1 transition-colors"
              >
                {children}
                <ExternalLink size={13} />
              </a>
            ),
            code: ({ className, children }) => {
              const value = String(children).trim()

              if (!className) {
                return (
                  <code className='px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-200 font-mono text-[13px] border border-violet-500/20'>
                    {value}
                  </code>
                )
              }

              const language = className.replace("language-", "")

              return (
                <div className='my-3 overflow-hidden rounded-xl border border-violet-500/20 bg-[#0c0d14]'>
                  <div className='flex items-center justify-between bg-[#13141f] border-b border-violet-500/15 px-4 py-1.5'>
                    <span className='uppercase text-[11px] font-semibold tracking-wider text-violet-400'>
                      {language || "code"}
                    </span>
                    <button
                      className='flex items-center gap-1 text-[11px] text-slate-400 hover:text-violet-300 cursor-pointer bg-transparent border-none transition-colors'
                      onClick={() => copyCode(value)}
                    >
                      {copiedCode === value ? (
                        <>
                          <Check size={13} className="text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <SyntaxHighlighter
                    language={language}
                    style={oneDark}
                    wrapLongLines
                    showLineNumbers
                    customStyle={{
                      margin: 0,
                      padding: "14px",
                      background: "#08090f",
                      fontSize: "13px",
                    }}
                  >
                    {value}
                  </SyntaxHighlighter>
                </div>
              )
            },
            img: ({ src }) => {
              if (!src) return null
              return (
                <img
                  src={src}
                  onClick={() => setLightBox(src)}
                  loading="lazy"
                  onError={(e) => e.currentTarget.remove()}
                  className="w-40 h-28 rounded-xl object-cover border border-violet-500/20 cursor-zoom-in hover:opacity-90 transition"
                  alt="content preview"
                />
              )
            }
          }}
        >
          {content}
        </Markdown>

        {/* Assistant Footer Actions */}
        {!isUser && content && (
          <div className='flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04] text-[11px] text-slate-500'>
            <div className='flex items-center gap-1.5 text-violet-400/80'>
              <Sparkles size={11} />
              <span className='text-[10px] tracking-wide'>CipherVortex</span>
            </div>
            <button
              onClick={copyFullMessage}
              className='flex items-center gap-1 text-slate-400 hover:text-violet-300 bg-transparent border-none cursor-pointer transition-colors py-0.5 px-1.5 rounded'
              title='Copy response'
            >
              {copiedMessage ? (
                <>
                  <Check size={12} className="text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>

      {lightBox && (
        <div className='fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6'>
          <button
            className='absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 rounded-full p-2 cursor-pointer border-none'
            onClick={() => setLightBox(null)}
          >
            <X size={20} />
          </button>
          <img
            src={lightBox}
            className="max-w-[90vw] max-h-[85vh] rounded-2xl border border-violet-500/30 shadow-2xl object-contain"
            alt="expanded preview"
          />
        </div>
      )}
    </div>
  )
}

export default MessageBubble
