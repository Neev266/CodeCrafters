
from fastapi import APIRouter, Request
from datetime import datetime
from app.schemas.user_behavior import UserBehavior
from app.services.feature_engine import extract_features
from app.models.cognitive_engine import predict_state
from app.services.n8n_service import trigger_n8n
from sys_monitor import monitor
from pydantic import BaseModel
import requests


router = APIRouter()

# 🔗 Replace with your actual n8n webhook URL
N8N_WEBHOOK_URL = "https://your-n8n-url/webhook/xyz"


# ==============================
# 📦 Pydantic Model (Input Schema)
# ==============================

class CognitiveState(BaseModel):
    user_id: int
    state: str
    confidence: float
    session_confidence: float
    emotion: str
    timestamp: str


# ==============================
# 🚀 /analyze → Send data to n8n
# ==============================

@router.post("/analyze")
def analyze(data: CognitiveState):
    print("📤 Received from client:", data.dict())

    try:
        response = requests.post(
            N8N_WEBHOOK_URL,
            json=data.dict()
        )

        return {
            "status": "sent_to_n8n",
            "n8n_status_code": response.status_code,
            "n8n_response": response.text
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


# ==============================
# 🔁 /n8n-response → Receive from n8n
# ==============================

@router.post("/n8n-response")
def n8n_response(payload: dict):
    print("📥 Received from n8n:", payload)

    # 👇 Extract the string sent by n8n
    message = payload.get("message", "No message received")

    return {
        "status": "received",
        "reply": message
    }