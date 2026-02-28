import React, { useState } from 'react';
import { Send, Settings } from 'lucide-react';

const Chat = ({ sendAction }) => {
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
            sendAction('start', { prompt: input });
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 border border-gray-800 rounded-lg overflow-hidden flex-1 shadow-lg">
            <div className="bg-gray-800 p-3 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-md font-semibold text-gray-200">Desk MD Chat</h2>
                <Settings size={18} className="text-gray-400 cursor-pointer hover:text-white" />
            </div>

            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col space-y-4">
                <div className="bg-gray-800 border border-gray-700 p-3 rounded-tr-lg rounded-tl-lg rounded-br-lg text-sm self-start max-w-[85%] text-gray-300">
                    Welcome to FinAgent. Enter your booking request, e.g. "Book a swap for Client X with a fee of 50k".
                </div>
            </div>

            <div className="p-3 bg-gray-800 border-t border-gray-700 flex space-x-2">
                <input
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Enter booking request..."
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-md px-4 py-2 transition flex items-center justify-center"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
};

export default Chat;
