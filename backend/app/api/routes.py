# app/api/routes.py

from fastapi import APIRouter
from datetime import datetime

from app.schemas.user_behavior import UserBehavior
from app.services.feature_engine import extract_features
from app.models.cognitive_engine import predict_state
from app.services.n8n_service import trigger_n8n

router = APIRouter()

@router.post("/analyze")
def analyze_user(data: UserBehavior):
    
    # 1. Feature extraction
    features = extract_features(data)
    
    # 2. Prediction ✅ FIXED
    state, confidence, scores, session_confidence = predict_state(features, data.emotion)
    
    # 3. FULL RESULT (for response / Firebase later)
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
    
    # 5. Send CLEAN data to n8n
    trigger_n8n(n8n_payload)
    
    return result