
import React, { useState } from 'react';
import { MESSAGES } from '../data/content';
import { InternalMessage } from '../types';
import { Search, MoreHorizontal, Phone, Video, Paperclip, Send, CheckCheck } from 'lucide-react';

const MessagesPanel = () => {
  const [selectedMessage, setSelectedMessage] = useState<InternalMessage | null>(MESSAGES[0]);
  const [replyText, setReplyText] = useState('');

  return (
    <div className="h-[calc(100vh-140px)] max-w-7xl mx-auto px-4 md:px-8 py-6 flex gap-6 animate-in fade-in duration-500">
        
        {/* Sidebar List */}
        <div className="w-full md:w-80 bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border flex flex-col overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-dark-border">
                <h2 className="font-bold text-xl mb-4 dark:text-white">Mensajes</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input className="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" placeholder="Buscar..." />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {MESSAGES.map(msg => (
                    <div 
                        key={msg.id} 
                        onClick={() => setSelectedMessage(msg)}
                        className={`p-4 border-b border-slate-100 dark:border-dark-border/50 cursor-pointer hover:bg-slate-50 dark:hover:bg-dark-bg transition-colors ${selectedMessage?.id === msg.id ? 'bg-primary-50 dark:bg-primary-900/10' : ''}`}
                    >
                        <div className="flex gap-3">
                            <img src={msg.avatar} className="w-10 h-10 rounded-full object-cover" />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`text-sm truncate dark:text-white ${msg.unread ? 'font-bold' : 'font-medium'}`}>{msg.sender}</h4>
                                    <span className="text-xs text-slate-400">{msg.time}</span>
                                </div>
                                <p className={`text-xs truncate ${msg.unread ? 'text-slate-900 dark:text-slate-200 font-medium' : 'text-slate-500'}`}>{msg.text}</p>
                            </div>
                            {msg.unread && <div className="w-2.5 h-2.5 bg-primary-500 rounded-full mt-2"></div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border hidden md:flex flex-col shadow-sm">
            {selectedMessage ? (
                <>
                    {/* Header */}
                    <div className="p-4 border-b border-slate-200 dark:border-dark-border flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <img src={selectedMessage.avatar} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">{selectedMessage.sender}</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-xs text-slate-500">En línea</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 text-slate-400">
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-dark-bg rounded-lg"><Phone size={20}/></button>
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-dark-bg rounded-lg"><Video size={20}/></button>
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-dark-bg rounded-lg"><MoreHorizontal size={20}/></button>
                        </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50 dark:bg-dark-bg/50">
                        <div className="flex justify-center">
                            <span className="text-xs text-slate-400 bg-slate-100 dark:bg-dark-bg px-3 py-1 rounded-full">Hoy</span>
                        </div>
                        
                        {/* Received */}
                        <div className="flex gap-3">
                            <img src={selectedMessage.avatar} className="w-8 h-8 rounded-full object-cover self-end" />
                            <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-2xl rounded-bl-none max-w-md shadow-sm">
                                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{selectedMessage.text}</p>
                                <span className="text-[10px] text-slate-400 mt-2 block text-right">{selectedMessage.time}</span>
                            </div>
                        </div>

                        {/* Sent (Mock) */}
                        <div className="flex gap-3 justify-end">
                            <div className="bg-primary-400 p-4 rounded-2xl rounded-br-none max-w-md shadow-sm">
                                <p className="text-sm text-slate-900 leading-relaxed font-medium">¡Gracias! Ya estoy revisando los documentos.</p>
                                <div className="flex justify-end items-center gap-1 mt-1">
                                    <span className="text-[10px] text-slate-700/70">10:05 AM</span>
                                    <CheckCheck size={12} className="text-slate-700/70" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white dark:bg-dark-surface border-t border-slate-200 dark:border-dark-border">
                        <div className="flex gap-2 items-end">
                            <button className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-bg rounded-xl transition-colors">
                                <Paperclip size={20} />
                            </button>
                            <div className="flex-1 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl flex items-center p-1">
                                <textarea 
                                    rows={1}
                                    value={replyText}
                                    onChange={e => setReplyText(e.target.value)}
                                    placeholder="Escribe un mensaje..."
                                    className="w-full bg-transparent border-none focus:ring-0 text-sm px-3 py-2 resize-none max-h-32 dark:text-white"
                                />
                            </div>
                            <button className="p-3 bg-primary-400 text-slate-900 rounded-xl hover:bg-primary-500 transition-colors shadow-lg shadow-primary-400/20">
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-dark-bg rounded-full flex items-center justify-center mb-4">
                        <Search size={32} />
                    </div>
                    <p>Selecciona un mensaje para leerlo</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default MessagesPanel;
