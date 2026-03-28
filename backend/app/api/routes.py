from fastapi import APIRouter
from pydantic import BaseModel
import requests

router = APIRouter()

# 🔗 Production n8n webhook URL
N8N_WEBHOOK_URL = "https://codecrafterai.app.n8n.cloud/webhook/cognitive-state"


# ==============================
# 📦 Input Schema
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
    payload = data.dict()

    print("\n==============================")
    print("📤 RECEIVED FROM CLIENT:")
    print(payload)
    print("==============================\n")

    try:
        print("🚀 Sending data to n8n...")
        print("🔗 URL:", N8N_WEBHOOK_URL)

        response = requests.post(
            N8N_WEBHOOK_URL,
            json=payload,
            timeout=10
        )

        print("\n✅ RESPONSE FROM n8n:")
        print("Status Code:", response.status_code)
        print("Raw Response:", response.text)

        # 🔥 Convert response safely to JSON
        try:
            response_json = response.json()
        except Exception:
            response_json = {"raw": response.text}

        print("Parsed Response:", response_json)
        print("==============================\n")

        return {
            "status": "success",
            "n8n_status_code": response.status_code,
            "n8n_response": response_json
        }

    except requests.exceptions.Timeout:
        print("⏰ ERROR: Request to n8n timed out")
        return {
            "status": "error",
            "message": "n8n request timed out"
        }

    except requests.exceptions.ConnectionError:
        print("❌ ERROR: Could not connect to n8n")
        return {
            "status": "error",
            "message": "failed to connect to n8n"
        }

    except Exception as e:
        print("🔥 ERROR:", str(e))
        return {
            "status": "error",
            "message": str(e)
        }


# ==============================
# 🔁 /n8n-response → Optional (if n8n calls back)
# ==============================

@router.post("/n8n-response")
def n8n_response(payload: dict):
    print("\n==============================")
    print("📥 RECEIVED FROM n8n:")
    print(payload)
    print("==============================\n")

    message = payload.get("message", "No message received")

    print("💬 Extracted Message:", message)

    return {
        "status": "received",
        "reply": message
    }