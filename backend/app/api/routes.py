from fastapi import APIRouter
from pydantic import BaseModel
import requests

# 🧠 IMPORT YOUR ENGINES
from app.services.feature_engine import extract_features
from app.models.cognitive_engine import evaluate_state

router = APIRouter()

# 🔗 Production n8n webhook URL
N8N_WEBHOOK_URL = "https://codecrafterai.app.n8n.cloud/webhook/cognitive-state"


# ==============================
# 📦 Input Schema (UPDATED 🔥)
# ==============================

class CognitiveState(BaseModel):
    user_id: int

    # 🧠 Behavioral data
    typing_speed: float
    backspace_rate: float
    click_rate: float
    tab_switches: int
    idle_time: float
    repeated_actions: int

    # 👁️ Iris data (from frontend)
    eye_state: str = "unknown"
    eye_open_score: float = 0.0

    # ❤️ Emotion (optional)
    emotion: str = "neutral"

    # ⏱️ Meta
    timestamp: str


# ==============================
# 🚀 /analyze → FULL PIPELINE
# ==============================

@router.post("/analyze")
def analyze(data: CognitiveState):

    print("\n==============================")
    print("📤 RECEIVED FROM CLIENT:")
    print(data.dict())
    print("==============================\n")

    # ==============================
    # 🧠 STEP 1: FEATURE EXTRACTION
    # ==============================
    features = extract_features(data)

    print("🧠 EXTRACTED FEATURES:")
    print(features)

    # ==============================
    # 🧠 STEP 2: COGNITIVE STATE
    # ==============================
    state, confidence = evaluate_state(features)

    print("\n🎯 FINAL STATE:", state)
    print("📊 CONFIDENCE:", confidence)

    # ==============================
    # 📦 STEP 3: PREPARE PAYLOAD
    # ==============================
    payload = {
        "user_id": data.user_id,
        "state": state,
        "confidence": confidence,
        "session_confidence": confidence,  # (can upgrade later)
        "emotion": data.emotion,
        "timestamp": data.timestamp,
        "eye_state": features.get("eye_state"),
        "eye_score": features.get("eye_open_score")
    }

    print("\n📤 FINAL PAYLOAD TO n8n:")
    print(payload)

    # ==============================
    # 🚀 STEP 4: SEND TO n8n
    # ==============================
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

        try:
            response_json = response.json()
        except Exception:
            response_json = {"raw": response.text}

        print("Parsed Response:", response_json)
        print("==============================\n")

        return {
            "status": "success",
            "state": state,
            "confidence": confidence,
            "features": features,
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
# 🔁 /n8n-response
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