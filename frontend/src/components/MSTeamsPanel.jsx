import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

const MSTeamsPanel = ({ messages, sendAction }) => {
    const bottomRef = useRef(null);
    const [displayedMessages, setDisplayedMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
            // Show user message immediately in chat
            setDisplayedMessages(prev => [...prev, { channel: "You", message: input, isUser: true }]);
            sendAction('start', { prompt: input });
            setInput('');
        }
    };

    useEffect(() => {
        // Only process new messages coming from backend (not our optimistic user ones)
        const backendMessages = messages.map(m => ({ ...m, isUser: false }));
        const newBackendCount = backendMessages.length;
        const currentBackendCount = displayedMessages.filter(m => !m.isUser).length;

        if (newBackendCount > currentBackendCount) {
            const newMessage = backendMessages[backendMessages.length - 1];

            setIsTyping(true);

            const timer = setTimeout(() => {
                setIsTyping(false);
                setDisplayedMessages(prev => [...prev, newMessage]);
            }, 1500); // reduced delay slightly for better UX

            return () => clearTimeout(timer);
        }
    }, [messages, displayedMessages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [displayedMessages, isTyping]);

    return (
        <div className="bg-[#1F1F1F] border border-gray-800 rounded-lg flex-1 shadow-lg flex flex-col max-h-[500px]">
            <div className="bg-[#2D2C2C] p-3 border-b border-[#3B3B3B] flex items-center space-x-2">
                <MessageSquare size={18} className="text-[#5B5FC7]" />
                <span className="text-[#E0E0E0] font-semibold text-sm">FinAgent - MS Teams Integration</span>
            </div>

            <div className="p-4 overflow-y-auto custom-scrollbar flex flex-col space-y-3 flex-1">
                {displayedMessages.length === 0 && !isTyping ? (
                    <div className="text-gray-500 text-xs text-center mt-6">Welcome. Enter a booking request below.</div>
                ) : (
                    displayedMessages.map((msg, idx) => (
                        <div key={idx} className={`rounded-md p-3 text-sm shadow flex flex-col transition-all duration-300 animate-fade-in-up max-w-[85%] ${msg.isUser ? 'bg-[#5B5FC7] border-none text-white self-end' : 'bg-[#2B2B2B] text-[#E0E0E0] border-l-4 border-[#5B5FC7] self-start'}`}>
                            <span className={`text-xs font-semibold mb-1 ${msg.isUser ? 'text-blue-200' : 'text-[#8A8886]'}`}>{msg.channel || "Agent"}</span>
                            <span className="leading-relaxed">{msg.message || msg}</span>
                        </div>
                    ))
                )}

                {/* Mock Typing Indicator */}
                {isTyping && (
                    <div className="bg-[#2B2B2B] rounded-md p-3 text-sm text-[#E0E0E0] border-l-4 border-[#5B5FC7] shadow flex items-center space-x-1 w-20 h-10 animate-fade-in-up self-start">
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-[#2D2C2C] border-t border-[#3B3B3B] flex space-x-2">
                <input
                    className="flex-1 bg-[#1F1F1F] text-white border border-[#4B4B4B] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#5B5FC7] transition"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a new booking request in Teams..."
                />
                <button
                    onClick={handleSend}
                    className="bg-[#5B5FC7] hover:bg-[#4a4ea8] text-white rounded-md px-4 py-2 transition flex items-center justify-center"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
};

export default MSTeamsPanel;
