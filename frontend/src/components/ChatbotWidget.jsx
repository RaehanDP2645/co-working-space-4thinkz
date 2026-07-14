import React, { useState, useRef, useEffect } from 'react';
import { IconChat, IconClose, IconSend, IconSparkles } from './Icons';
import { getAIResponse, getBasePrompt, getSuggestions } from '../utils/aiEngine';

export default function ChatbotWidget({ rooms, reservations, onPickRoom }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { from: 'bot', text: getBasePrompt() },
  ]);
  const [typing, setTyping] = useState(false);
  const [suggestions] = useState(getSuggestions());
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const send = (text) => {
    const value = (text ?? input).trim();
    if (!value) return;

    const userMsg = { from: 'user', text: value };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    // Simulate "thinking" delay for a more natural feel
    setTimeout(() => {
      const reply = getAIResponse(value, { rooms, reservations });
      setTyping(false);
      setMessages((prev) => [...prev, { from: 'bot', text: reply }]);
    }, 500);
  };

  return (
    <>
      <button
        className={`ai-fab ${open ? 'hidden' : ''}`}
        onClick={() => setOpen(true)}
        aria-label="Buka Asisten AI"
        title="Asisten AI RuangKita"
      >
        <IconChat size={24} />
        <span className="ai-fab-badge">AI</span>
      </button>

      {open && (
        <div className="ai-chat" role="dialog" aria-label="Asisten AI">
          <div className="ai-chat-head">
            <div className="ai-chat-title">
              <span className="ai-chat-avatar"><IconSparkles size={18} /></span>
              <div>
                <div className="ai-chat-name">Asisten AI RuangKita</div>
                <div className="ai-chat-status"><span className="ai-dot" /> Online</div>
              </div>
            </div>
            <button className="ai-chat-close" onClick={() => setOpen(false)} aria-label="Tutup">
              <IconClose />
            </button>
          </div>

          <div className="ai-chat-body" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`ai-msg ${m.from}`}>
                {m.text.split('\n').map((line, j) => (
                  <React.Fragment key={j}>
                    {line.startsWith('• ') || /^\d+\./.test(line) ? (
                      <span className="ai-bullet">{line}</span>
                    ) : (
                      <span>{line}</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ))}

            {typing && (
              <div className="ai-msg bot">
                <span className="ai-typing"><i /><i /><i /></span>
              </div>
            )}

            {messages.length <= 1 && (
              <div className="ai-chips">
                {suggestions.map((s, i) => (
                  <button key={i} className="ai-chip" onClick={() => send(s)}>{s}</button>
                ))}
              </div>
            )}
          </div>

          <div className="ai-chat-foot">
            <input
              ref={inputRef}
              className="ai-input"
              placeholder="Tanya asisten AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
            />
            <button className="ai-send" onClick={() => send()} aria-label="Kirim">
              <IconSend size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
