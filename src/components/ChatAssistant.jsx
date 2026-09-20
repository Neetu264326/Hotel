import { useEffect, useRef, useState } from 'react'
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react'
import { aiAPI } from '../api'

const QUICK_PROMPTS = [
  'Recommend me something good',
  'Any offers today?',
  'Show veg options',
  'Best biryani',
  'How do I order?',
]

const renderInline = (text, key) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)
  return (
    <span key={key}>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  )
}

const renderBlocks = (text) => {
  const lines = String(text).split('\n')
  const blocks = []
  let current = []
  let kind = 'p'
  const flush = () => {
    if (current.length) {
      blocks.push({ kind, lines: current })
      current = []
    }
  }
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) {
      flush()
      continue
    }
    const isBullet = /^[-•*]\s+/.test(line)
    const isNumbered = /^\d+\.\s+/.test(line)
    const itemKind = isBullet ? 'bullet' : isNumbered ? 'numbered' : null
    if (itemKind && kind !== itemKind && current.length) {
      flush()
    }
    if (itemKind) {
      if (kind !== 'p' && itemKind !== kind) flush()
      current.push(line.replace(/^[-•*]\s+/, '').replace(/^\d+\.\s+/, ''))
      kind = itemKind
    } else {
      flush()
      current.push(line)
      kind = line.startsWith('##') ? 'heading' : 'p'
      flush()
    }
  }
  flush()
  return blocks
}

const ChatAssistant = () => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bodyRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [messages, loading, open])

  const send = async (raw) => {
    const text = (raw ?? input).trim()
    if (!text || loading) return
    const history = messages.slice(-8).map((m) => ({ role: m.role, content: m.content }))
    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setError('')
    setLoading(true)
    try {
      const result = await aiAPI.chat(text, history)
      setMessages([...next, { role: 'assistant', content: result.reply, meta: result.provider }])
    } catch {
      setError('Sorry, I ran into a problem. Please try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  const bubble = (rows, side) => (
    <div style={{ display: 'flex', justifyContent: side === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
      <div
        style={{
          maxWidth: '82%',
          padding: '10px 13px',
          borderRadius: 14,
          fontSize: 13.5,
          lineHeight: 1.55,
          color: side === 'user' ? '#fff' : '#2b2118',
          background: side === 'user' ? '#e8590c' : '#ffffff',
          border: side === 'user' ? 'none' : '1px solid #f1e4d5',
          boxShadow: '0 1px 3px rgba(60,40,20,0.08)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {rows.map((blk, i) => {
          if (blk.kind === 'p') return renderInline(blk.lines.join(' '), i)
          if (blk.kind === 'bullet' || blk.kind === 'numbered') {
            return (
              <div key={i} style={{ margin: '2px 0' }}>
                {blk.lines.map((l, j) => {
                  const sep = l.indexOf('—')
                  const isColon = l.includes(': ')
                  let body = l
                  let lead = ''
                  if (sep > 0) {
                    lead = l.slice(0, sep)
                    body = l.slice(sep)
                  } else if (isColon && l.split(': ')[0].split(' ').length <= 4) {
                    const idx = l.indexOf(': ')
                    lead = l.slice(0, idx)
                    body = l.slice(idx)
                  }
                  return (
                    <div key={j} style={{ display: 'flex', gap: 6 }}>
                      <span>{blk.kind === 'bullet' ? '•' : `${j + 1}.`}</span>
                      <span>
                        {lead ? (
                          <>
                            {renderInline(lead, 'l')}
                            {renderInline(body, 'b')}
                          </>
                        ) : (
                          renderInline(l, 'x')
                        )}
                      </span>
                    </div>
                  )
                })}
              </div>
            )
          }
          return renderInline(blk.lines.join(' '), i)
        })}
      </div>
    </div>
  )

  return (
    <>
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 84,
            right: 18,
            width: 372,
            maxWidth: 'calc(100vw - 36px)',
            height: 'min(560px, calc(100vh - 120px))',
            background: '#fffdf9',
            borderRadius: 18,
            boxShadow: '0 18px 50px rgba(60,40,20,0.28)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 999,
            border: '1px solid #f3e6d3',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 14px',
              background: 'linear-gradient(135deg, #e8590c, #fb8b3c)',
              color: '#fff',
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Delishful Assistant</div>
              <div style={{ fontSize: 11, opacity: 0.9 }}>AI food concierge, online</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}
            >
              <X size={18} />
            </button>
          </div>

          <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 12px' }}>
            {messages.length === 0 && (
              <div style={{ marginBottom: 6 }}>
                {bubble(
                  [
                    {
                      kind: 'p',
                      lines: [
                        "Hi! I'm your AI food concierge. I can find restaurants, recommend dishes, compare prices and veg options, share offers, and help you order.",
                      ],
                    },
                  ],
                  'assistant'
                )}
              </div>
            )}
            {messages.map((m) => bubble(renderBlocks(m.content), m.role))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#a08a70', fontSize: 13, marginBottom: 10 }}>
                <Loader2 size={15} className="assistant-spin" style={{ animation: 'assistant-spin 1s linear infinite' }} />
                Delishful is thinking...
              </div>
            )}
            {error && (
              <div
                style={{
                  background: '#fff0ee',
                  color: '#c0392b',
                  padding: '9px 12px',
                  borderRadius: 10,
                  fontSize: 12.5,
                  border: '1px solid #ffd6d0',
                  marginBottom: 10,
                }}
              >
                {error}
              </div>
            )}
          </div>

          {messages.length === 0 && !loading && (
            <div style={{ padding: '0 12px 8px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 999,
                    border: '1px solid #f0d9bd',
                    background: '#fff7ee',
                    color: '#9a4a12',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
            style={{
              display: 'flex',
              gap: 8,
              padding: 10,
              borderTop: '1px solid #f3e6d3',
              background: '#fff',
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about restaurants, food, offers..."
              disabled={loading}
              style={{
                flex: 1,
                border: '1px solid #ead9c2',
                borderRadius: 12,
                padding: '9px 12px',
                fontSize: 13,
                outline: 'none',
                background: '#fffdf9',
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                border: 'none',
                background: loading || !input.trim() ? '#f3d8be' : '#e8590c',
                color: '#fff',
                cursor: loading || !input.trim() ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open Delishful Assistant"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 18,
          width: 60,
          height: 60,
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg, #e8590c, #fb8b3c)',
          color: '#fff',
          boxShadow: '0 10px 30px rgba(232,89,12,0.45)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          transition: 'transform 0.15s ease',
        }}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  )
}

export default ChatAssistant