import asyncio
import websockets
import json
import uuid

async def test_agent_flow():
    uri = "ws://localhost:8000/ws"
    
    # We use a context manager to handle connection
    async with websockets.connect(uri) as websocket:
        print("Connected to WebSocket Server.")
        
        # Send start command
        prompt = "Book a swap for Client Test with a fee of 1500. Error is expected so consult CodeMiner, then get Approval."
        start_payload = {
            "action": "start",
            "prompt": prompt,
        }
        await websocket.send(json.dumps(start_payload))
        print(f"Sent: {start_payload}")
        
        steps_seen = set()
        approved = False
        
        while True:
            try:
                # Wait for messages and assert their types
                message_str = await asyncio.wait_for(websocket.recv(), timeout=300.0)
                msg_data = json.loads(message_str)
                type_ = msg_data.get("type")
                
                print(f"Received Type: {type_}")
                if type_ == "step":
                    steps_seen.add(msg_data["data"])
                
                elif type_ == "require_approval" and not approved:
                    print(f"Agent is requiring approval: {msg_data['data']}")
                    # Test Human-in-the-loop: send approval
                    approve_payload = {"action": "approve"}
                    await websocket.send(json.dumps(approve_payload))
                    print("Sent: APPROVE command")
                    approved = True
                
                elif type_ == "log":
                    log_type = msg_data.get("logType")
                    log_data = msg_data.get("data")
                    print(f"[{log_type.upper()}] {log_data}")
                    
                    if log_type == "success" and log_data == "Workflow Complete.":
                        print("Test Passed: Agent reached termination.")
                        break
                        
            except asyncio.TimeoutError:
                print("Test Failed: Agent workflow timed out.")
                break
                
        # Validate that progress went through minimum expected steps
        print(f"Total Workflow Steps traversed: {len(steps_seen)}")
        assert len(steps_seen) > 3, "Workflow did not progress logically."
        
if __name__ == "__main__":
    asyncio.run(test_agent_flow())
