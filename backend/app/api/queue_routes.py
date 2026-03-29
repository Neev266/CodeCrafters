from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

# temporary in-memory (later replace with DB)
queue = []
focus_state = {}


class Notification(BaseModel):
    user_id: int
    message: str
    type: str


# 🔹 ADD NOTIFICATION (main logic)
@router.post("/notify")
def notify(data: Notification):
    user_id = data.user_id

    if focus_state.get(user_id) == "focused":
        # 👉 QUEUE
        queue.append({
            "user_id": user_id,
            "message": data.message,
            "type": data.type,
            "created_at": str(datetime.now())
        })
        return {"status": "queued"}

    else:
        # 👉 SEND DIRECTLY
        return {"status": "sent", "data": data}


# 🔹 UPDATE USER STATE
@router.post("/state")
def update_state(data: dict):
    focus_state[data["user_id"]] = data["state"]
    return {"status": "updated"}


# 🔹 FLUSH QUEUE
@router.post("/flush")
def flush(data: dict):
    global queue  # ✅ FIX: move to top

    user_id = data["user_id"]

    user_queue = [q for q in queue if q["user_id"] == user_id]

    # remove from queue
    queue = [q for q in queue if q["user_id"] != user_id]

    return {
        "status": "flushed",
        "notifications": user_queue
    }