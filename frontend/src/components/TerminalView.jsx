import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

const TerminalView = ({ logs }) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const getColor = (type) => {
        switch (type) {
            case 'user': return 'text-green-400';
            case 'thought': return 'text-blue-400 font-mono text-xs';
            case 'action': return 'text-yellow-400 font-bold';
            case 'result': return 'text-purple-400 italic';
            case 'error': return 'text-red-500 font-bold';
            case 'success': return 'text-emerald-400 font-bold text-lg';
            case 'warning': return 'text-orange-400 border border-orange-400 p-1 rounded inline-block';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="bg-black border border-gray-700 rounded-lg flex flex-col flex-1 shadow-lg overflow-hidden font-mono text-sm max-h-[500px]">
            <div className="bg-gray-800 p-2 px-4 text-gray-300 flex items-center space-x-2 border-b border-gray-700">
                <Terminal size={16} />
                <span className="font-semibold text-xs tracking-wider">AGENT_STDOUT_STREAM</span>
            </div>
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-2">
                {logs.map((log, idx) => (
                    <div key={idx} className={`${getColor(log.logType)} break-words leading-relaxed`}>
                        <span className="opacity-50 text-xs mr-3">[{new Date().toISOString().split('T')[1].slice(0, 8)}]</span>
                        {log.logType === 'thought' ? `> THOUGHT: ${log.data}` : log.data}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default TerminalView;
