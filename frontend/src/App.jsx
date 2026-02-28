import React, { useState, useEffect, useRef } from 'react';
import Dashboard from './components/Dashboard';

function App() {
    const [socket, setSocket] = useState(null);
    const [logs, setLogs] = useState([]);
    const [stepData, setStepData] = useState(0);
    const [summitData, setSummitData] = useState(null);
    const [teamsMsgs, setTeamsMsgs] = useState([]);
    const [requireApproval, setRequireApproval] = useState(null);
    const [chartData, setChartData] = useState(null);

    // Create WS connection
    useEffect(() => {
        // Use relative path for production to hit NGINX proxy, else fallback to 8000
        const isProd = import.meta.env.PROD;
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        const defaultWsUrl = isProd ? `${protocol}//${host}/ws` : "ws://localhost:8000/ws";

        const ws = new WebSocket(import.meta.env.VITE_WS_URL || defaultWsUrl);

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'log') {
                setLogs(prev => [...prev, message]);
            } else if (message.type === 'step') {
                setStepData(message.data);
            } else if (message.type === 'summit_update') {
                setSummitData(message.data);
            } else if (message.type === 'teams_msg') {
                setTeamsMsgs(prev => [...prev, message.data]);
            } else if (message.type === 'require_approval') {
                setRequireApproval(message.data);
            } else if (message.type === 'chart_data') {
                setChartData(message.data);
            } else if (message.type === 'status' || message.type === 'notification') {
                // toast or generic logs
                setLogs(prev => [...prev, { logType: 'system', data: message.data }]);
            }
        };

        setSocket(ws);
        return () => ws.close();
    }, []);

    const sendAction = (action, payload = {}) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ action, ...payload }));
        }
    };

    return (
        <div className="h-screen w-full flex flex-col p-4 space-y-4">
            <header className="flex items-center justify-between px-4 py-2 bg-gray-900 rounded-lg border border-gray-800 shadow-lg">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold">F</div>
                    <h1 className="text-xl font-semibold tracking-tight">FinAgent MCP Simulator</h1>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-sm text-green-500 font-medium">Agent Ready</span>
                </div>
            </header>

            <Dashboard
                sendAction={sendAction}
                logs={logs}
                step={stepData}
                summitData={summitData}
                teamsMsgs={teamsMsgs}
                requireApproval={requireApproval}
                setRequireApproval={setRequireApproval}
                chartData={chartData}
            />
        </div>
    );
}

export default App;
