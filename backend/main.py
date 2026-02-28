from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json

from agent_engine import AgentEngine
from mock_apis import clear_state

app = FastAPI(title="FinAgent MCP Simulator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global set of connected websocket clients
connected_clients = set()

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        # Broadcasts a standard payload
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

# The global agent instance (in a real app, this might be per-session)
agent = None

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    global agent
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            action = payload.get("action")
            
            if action == "start":
                # Start the agentic loop
                clear_state()
                prompt = payload.get("prompt", "Book a swap")
                
                # Re-initialize the agent with the websocket manager
                agent = AgentEngine(manager)
                
                await manager.broadcast({"type": "status", "data": "Agent started."})
                
                # Start loop in background
                asyncio.create_task(agent.run_loop(prompt))
                
            elif action == "approve":
                # Human approved from UI
                if agent:
                    agent.set_approval(True)
                    await manager.broadcast({"type": "notification", "data": "Approved by Human."})
                    
            elif action == "reject":
                # Human rejected from UI
                if agent:
                    agent.set_approval(False)
                    await manager.broadcast({"type": "notification", "data": "Rejected by Human."})

    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
