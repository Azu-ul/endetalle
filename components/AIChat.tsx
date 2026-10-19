import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { ConstructionDetail, ChatMessage } from '../types';
import { askArchitectAI } from '../services/gemini';

interface AIChatProps {
  currentDetail: ConstructionDetail | null;
}

const AIChat: React.FC<AIChatProps> = ({ currentDetail }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hola. Soy tu asistente técnico de obra. ¿En qué detalle estás trabajando?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const apiHistory = messages.map(m => ({ role: m.role, text: m.text }));
    const responseText = await askArchitectAI(userMsg.text, currentDetail, apiHistory);
    
    const aiMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-transparent ${
          isOpen 
            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' 
            : 'bg-primary-400 text-slate-900 border-slate-900/10 hover:bg-primary-300'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} fill="currentColor" className="text-slate-900" />}
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 right-6 z-40 w-[90vw] md:w-[380px] bg-white dark:bg-dark-surface rounded-2xl shadow-2xl border border-slate-200 dark:border-dark-border flex flex-col transition-all duration-300 origin-bottom-right overflow-hidden ${
          isOpen 
            ? 'h-[600px] max-h-[80vh] scale-100 opacity-100 translate-y-0' 
            : 'h-0 scale-95 opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-slate-900 dark:bg-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-400 flex items-center justify-center">
              <Sparkles size={16} className="text-slate-900 fill-slate-900" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Arquitecto IA</h3>
              <p className="text-[11px] text-primary-400 font-medium">En línea</p>
            </div>
          </div>
          {currentDetail && (
            <span className="text-[10px] bg-white/10 text-white px-2 py-1 rounded font-mono border border-white/20">
              ID: {currentDetail.id}
            </span>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-dark-bg/50">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-br-none' 
                    : 'bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-200 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-primary-500" />
                <span className="text-xs text-slate-500 dark:text-slate-400">Analizando detalle...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-3 bg-white dark:bg-dark-surface border-t border-slate-100 dark:border-dark-border flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregunta sobre materiales, normas..."
            className="flex-1 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all dark:text-white placeholder:text-slate-400"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 bg-primary-400 text-slate-900 rounded-xl hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
};

export default AIChat;