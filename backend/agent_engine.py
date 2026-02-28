import asyncio
import json
import httpx
import os

from mock_apis import (
    mock_create_summit_booking,
    mock_consult_codeminer,
    mock_request_dice_update,
    mock_send_ms_teams_message
)

# You can configure Ollama Host
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")

SYSTEM_PROMPT = """You are FinAgent, a Senior Principal AI Engineer & DevOps Architect Agent.
You handle complex financial booking workflows. You use tools (functions) to act on the environment.
Your goal is to parse user requests, use the Summit API to book trades, use CodeMiner if errors occur,
update DICE referential data if missing, and notify MS Teams. 
Whenever you need human approval, call ask_human_approval and Wait.

CRITICAL INSTRUCTION: You MUST follow this exact semantic sequence of actions, do not skip any:
1. create_summit_booking (initial attempt)
2. consult_codeminer (if booking fails with reference data error)
3. request_dice_update (to fix the reference data)
4. ask_human_approval (to approve the dice update)
5. create_summit_booking (retry, which will now succeed)
6. visualize_data (to show the final booking)
7. send_ms_teams (send the FINAL confirmation with booking ID to the user)
8. done

DO NOT output "done" until you have successfully executed all 7 steps including send_ms_teams.
If you output "done" early, you will be penalized.

Available tools:
1. create_summit_booking(client: str, fee: int)
2. consult_codeminer(error_msg: str)
3. request_dice_update(client: str)
4. send_ms_teams(channel: str, message: str)
5. ask_human_approval(reason: str)
6. visualize_data(chart_data: str)

Always respond with a JSON block containing your thought process and the tool call you want to make, like this:
{
  "thought": "I need to book the trade...",
  "tool": "create_summit_booking",
  "tool_args": {"client": "X", "fee": 50000}
}
If no more actions are needed, use tool "done".
"""

class AgentEngine:
    def __init__(self, ws_manager):
        self.ws_manager = ws_manager
        self.history = [{"role": "system", "content": SYSTEM_PROMPT}]
        self.human_approval_event = asyncio.Event()
        self.approval_result = False

    async def _call_ollama(self):
        # Truncate history if too long to fit small context (mock truncation for now)
        if len(self.history) > 20:
            self.history = [self.history[0]] + self.history[-19:]
            
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{OLLAMA_HOST}/api/chat",
                    json={
                        "model": "llama3.2",
                        "messages": self.history,
                        "stream": False,
                        "format": "json" # Enforce JSON format output from Llama 3.2
                    },
                    timeout=300.0
                )
                response.raise_for_status()
                return response.json()["message"]["content"]
            except Exception as e:
                return json.dumps({"thought": f"Error calling Ollama: {str(e)}", "tool": "done", "tool_args": {}})

    async def broadcast_log(self, msg: str, log_type: str = "info"):
        await self.ws_manager.broadcast({
            "type": "log",
            "logType": log_type,
            "data": msg
        })

    def set_approval(self, status: bool):
        self.approval_result = status
        self.human_approval_event.set()

    async def run_loop(self, user_prompt: str):
        self.history.append({"role": "user", "content": user_prompt})
        await self.broadcast_log(f"User Request: {user_prompt}", "user")
        
        # Immediate teams response simulation
        await self.ws_manager.broadcast({"type": "teams_msg", "data": {"channel": "Agent Bot", "message": f"Thinking about: '{user_prompt}'"}})
        
        step_mapping = {
            "create_summit_booking": 3,
            "consult_codeminer": 5,
            "request_dice_update": 7,
            "ask_human_approval": 8,
            "send_ms_teams": 12,
            "visualize_data": 14,
            "done": 17
        }
        
        loop_counter = 0
        current_ui_step = 1
        await self.ws_manager.broadcast({"type": "step", "data": current_ui_step})
        
        while loop_counter < 25: # Safe upper limit
            loop_counter += 1
            
            await self.broadcast_log(f"Agent Loop #{loop_counter} evaluating...", "info")
            # Simulate processing time for realistic UI updates
            await asyncio.sleep(2)
            
            llm_response = await self._call_ollama()
            self.history.append({"role": "assistant", "content": llm_response})
            
            try:
                action = json.loads(llm_response)
            except json.JSONDecodeError:
                await self.broadcast_log(f"Invalid JSON from LLM: {llm_response}", "error")
                break
                
            thought = action.get("thought", "")
            tool = action.get("tool", "done")
            args = action.get("tool_args", {})
            
            await self.broadcast_log(f"Thought: {thought}", "thought")
            
            if tool == "done":
                await self.broadcast_log("Workflow Complete.", "success")
                break
                
            await self.broadcast_log(f"Calling Tool: {tool} with {json.dumps(args)}", "action")
            
            tool_result = ""
            if tool == "create_summit_booking":
                tool_result = mock_create_summit_booking(args.get("client", ""), args.get("fee", 0))
                await self.ws_manager.broadcast({"type": "summit_update", "data": tool_result})
            elif tool == "consult_codeminer":
                tool_result = mock_consult_codeminer(args.get("error_msg", ""))
            elif tool == "request_dice_update":
                tool_result = mock_request_dice_update(args.get("client", ""))
            elif tool == "send_ms_teams":
                tool_result = mock_send_ms_teams_message(args.get("channel", ""), args.get("message", ""))
                await self.ws_manager.broadcast({"type": "teams_msg", "data": tool_result})
            elif tool == "visualize_data":
                tool_result = "Visualization payload sent to UI."
                await self.ws_manager.broadcast({"type": "chart_data", "data": args.get("chart_data", {})})
            elif tool == "ask_human_approval":
                self.human_approval_event.clear()
                await self.ws_manager.broadcast({
                    "type": "require_approval", 
                    "data": args.get("reason", "Human approval required.")
                })
                await self.broadcast_log("Waiting for human approval...", "warning")
                await self.human_approval_event.wait()
                
                if self.approval_result:
                    tool_result = "Human APPROVED."
                else:
                    tool_result = "Human REJECTED."
                await self.broadcast_log(f"Approval Result: {tool_result}", "system")
            else:
                tool_result = f"Unknown tool: {tool}"
                
            if tool in step_mapping:
                target_step = step_mapping[tool]
                while current_ui_step < target_step:
                    current_ui_step += 1
                    await self.ws_manager.broadcast({"type": "step", "data": current_ui_step})
                    await asyncio.sleep(0.5) # Quick animation catch up

            await self.broadcast_log(f"Tool Result: {tool_result}", "result")
            self.history.append({"role": "user", "content": f"Tool execution result: {tool_result}. Decide the next step."})
            
            # Rate limit
            await asyncio.sleep(1)
