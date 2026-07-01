import React, { useState, useEffect, useRef } from 'react';

export default function ChatWidget() {
  // Start with isOpen: true so it appears immediately when page loads
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Halo! Ada yang bisa saya bantu terkait pemesanan ruangan di RoomBook?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const quickMenus = [
    { label: '📅 Cara Pesan', text: 'Bagaimana cara melakukan reservasi ruangan?' },
    { label: '🏢 Daftar Ruangan', text: 'Apa saja ruangan yang tersedia di RuangKita?' },
    { label: '💳 Cara Bayar', text: 'Bagaimana metode pembayaran yang didukung?' },
    { label: '👤 Akun & Profil', text: 'Bagaimana cara mengedit profil akun saya?' },
  ];

  const sendMessageToBot = async (textToSend) => {
    if (isLoading) return;

    // Add user message to history
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSend
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: textToSend }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi server chatbot.');
      }

      const data = await response.json();
      
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: data.reply || 'Maaf, saya tidak mengerti respons dari server.'
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error chatbot:', error);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Maaf, terjadi gangguan koneksi dengan asisten virtual. Silakan coba beberapa saat lagi.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessageText = inputText;
    setInputText('');
    await sendMessageToBot(userMessageText);
  };

  const handleQuickMenuClick = async (text) => {
    await sendMessageToBot(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-all duration-300 hover:bg-emerald-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          aria-label="Buka Chatbot"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 transform rotate-45 -translate-x-0.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="flex h-[500px] w-96 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-150 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between bg-emerald-600 px-4 py-3.5 text-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 font-bold text-white shadow-inner">
                  RB
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-emerald-600 bg-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight">RoomBook AI Assistant</h3>
                <span className="text-xs text-emerald-100">Online</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-emerald-100 transition-colors hover:bg-emerald-700 hover:text-white focus:outline-none"
              aria-label="Tutup Chatbot"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex w-full justify-start">
                <div className="max-w-[75%] rounded-2xl rounded-tl-none bg-emerald-50 border border-emerald-100 px-4 py-3 shadow-sm">
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.3s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.15s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Menu Suggestions */}
          <div className="flex gap-2 overflow-x-auto px-3 py-2 bg-gray-50 border-t border-gray-100 scrollbar-none">
            {quickMenus.map((menu, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleQuickMenuClick(menu.text)}
                disabled={isLoading}
                className="whitespace-nowrap rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 shadow-sm transition-all hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {menu.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-150 p-3 bg-white flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tulis pesan..."
              disabled={isLoading}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-gray-50 disabled:text-gray-400"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white transition-all hover:bg-emerald-700 active:scale-95 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 transform rotate-90">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
