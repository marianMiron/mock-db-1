import random
import uuid

# In-memory storage for mock status
STATE = {
    "force_error": False,
    "allocations": []
}

def clear_state():
    STATE["allocations"] = []

def mock_create_summit_booking(client: str, fee: int):
    # Simulates creating a booking in Summit
    if STATE["force_error"]:
        return {"status": "error", "message": "ERR-SUMMIT-099: Referential Data Missing for Client."}
        
    # Logic for Client Fee, CPM Books, Mirror Fee
    allocation_id = str(uuid.uuid4())[:8]
    client_fee = fee * 0.8
    mirror_fee = fee * 0.2
    
    booking_data = {
        "status": "success",
        "booking_id": f"BKG-{allocation_id}",
        "allocations": [
            {"type": "Client Fee", "amount": client_fee, "book": "CPM_BOOK_1"},
            {"type": "Mirror Fee", "amount": mirror_fee, "book": "CPM_BOOK_2"}
        ]
    }
    STATE["allocations"].append(booking_data)
    return booking_data


def mock_consult_codeminer(error_msg: str):
    # Simulates CodeMiner
    if "Referential" in error_msg:
        return {"status": "success", "analysis": "DICE referential sync issue. Call request_dice_update to fix."}
    return {"status": "success", "analysis": "Unknown error, please review manually."}


def mock_request_dice_update(client: str):
    # Simulates updating reference data
    # Will allow summit booking to pass
    STATE["force_error"] = False 
    return {"status": "success", "message": f"DICE data updated for client {client}. Approval pending."}


def mock_send_ms_teams_message(channel: str, message: str):
    # Simulates sending a MS Teams message webhook
    return {"status": "success", "channel": channel, "message": message, "timestamp": "Now"}
