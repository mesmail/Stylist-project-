
import React, { useState, useRef, useEffect } from 'react';
import { chatWithStylist } from '../services/geminiService';
import { ChatMessage } from '../types';

const FashionChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am your personal AI fashion consultant. Ask me anything about trends, styling tips, or how to build a capsule wardrobe.', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatWithStylist(input, messages);
      const botMessage: ChatMessage = { role: 'model', text: response || "I'm sorry, I couldn't process that.", timestamp: Date.now() };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] max-w-4xl mx-auto bg-white rounded-3xl border border-zinc-100 shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
            <i className="fas fa-sparkles text-white"></i>
          </div>
          <div>
            <h3 className="font-bold">AI Style Assistant</h3>
            <p className="text-xs text-green-600 font-medium">Online & Ready</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-black text-white rounded-tr-none' 
                : 'bg-zinc-100 text-zinc-800 rounded-tl-none'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-zinc-100 p-4 rounded-2xl rounded-tl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-zinc-100 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about dress codes, color theory, or seasonal trends..."
            className="flex-1 bg-zinc-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all"
          />
          <button 
            type="submit"
            disabled={isTyping}
            className="bg-black text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default FashionChat;
