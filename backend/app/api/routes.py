from fastapi import APIRouter, Request
from datetime import datetime

from app.schemas.user_behavior import UserBehavior
from app.services.feature_engine import extract_features
from app.models.cognitive_engine import predict_state
from app.services.n8n_service import trigger_n8n

router = APIRouter()

# =========================================================
# 🔹 MAIN ANALYSIS ENDPOINT (Tracker → Backend → n8n)
# =========================================================
@router.post("/analyze")
def analyze_user(data: UserBehavior):
    
    # 1. Feature extraction
    features = extract_features(data)
    
    # 2. Prediction
    state, confidence, scores, session_confidence = predict_state(
        features, data.emotion
    )
    
    # 3. FULL RESULT (for response / storage)
    result = {
        "user_id": data.user_id,
        "state": state,
        "confidence": confidence,
        "session_confidence": session_confidence,
        "emotion": data.emotion,
        "features": features,
        "scores": scores,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    # 4. CLEAN PAYLOAD FOR n8n 🔥
    n8n_payload = {
        "user_id": data.user_id,
        "state": state,
        "confidence": confidence,
        "session_confidence": session_confidence,
        "emotion": data.emotion,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    # 5. Send data to n8n
    trigger_n8n(n8n_payload)
    
    return result


# =========================================================
# 🔹 RECEIVE RESPONSE FROM n8n (n8n → Backend)
# =========================================================
@router.post("/n8n-response")
async def receive_from_n8n(request: Request):
    data = await request.json()

    print("📩 Received from n8n:", data)

    # Extract fields safely
    user_id = data.get("user_id")
    action = data.get("action")
    message = data.get("message")
    recommendation = data.get("recommendation")

    # 🔥 Example decision handling
    if action == "alert":
        print(f"⚠️ ALERT for user {user_id}: {message}")

    elif action == "log":
        print(f"📝 LOG for user {user_id}: {message}")

    elif action == "recommend":
        print(f"💡 Recommendation for user {user_id}: {recommendation}")

    else:
        print(f"ℹ️ Unknown action from n8n: {data}")

    # 👉 Future: store in DB / trigger notifications

    return {
        "status": "received",
        "user_id": user_id,
        "action": action
    }


# =========================================================
# 🔹 HEALTH CHECK (Optional but useful)
# =========================================================
@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "cognitive-backend",
        "timestamp": datetime.utcnow().isoformat()
    }