# app/models/cognitive_engine.py

def predict_state(features, emotion):
    
    # ----------------------------
    # 1. DERIVED SIGNALS
    # ----------------------------

    # Active engagement
    activity_score = (
        features["typing_speed"] * 0.4 +
        features["click_rate"] * 0.3 +
        (1 - features["idle_ratio"]) * 0.3
    )

    # Passive engagement (reading behavior)
    passive_focus_score = (
        (1 - features["typing_speed"]) * 0.3 +
        (1 - features["click_rate"]) * 0.3 +
        (1 - features["tab_switch_rate"]) * 0.4
    )

    # ----------------------------
    # 2. STATE SCORES
    # ----------------------------

    # 🧠 Confusion
    confusion_score = (
        features["error_rate"] * 0.4 +
        features["repeat_ratio"] * 0.3 +
        (1 - features["typing_speed"]) * 0.3
    )

    # 😵 Distraction
    distraction_score = (
        features["tab_switch_rate"] * 0.5 +
        features["idle_ratio"] * 0.2 +
        (1 - features["click_rate"]) * 0.3
    )

    # 😰 Stress
    stress_score = (
        features["error_rate"] * 0.4 +
        features["click_rate"] * 0.3 +
        features["repeat_ratio"] * 0.3
    )

    # 💤 Idle base score
    idle_score = features["idle_ratio"]

    # 🎯 Focus (active + passive)
    focus_score = (
        activity_score * 0.6 +
        passive_focus_score * 0.4
    )

    # ----------------------------
    # 3. EMOTION ADJUSTMENTS
    # ----------------------------

    if emotion == "frustrated":
        stress_score += 0.1
        confusion_score += 0.05

    elif emotion == "happy":
        focus_score += 0.05

    # ----------------------------
    # 4. IDLE OVERRIDE (STRICT)
    # ----------------------------

    if (
        features["idle_ratio"] > 0.8 and
        features["typing_speed"] < 0.1 and
        features["click_rate"] < 0.1 and
        features["tab_switch_rate"] < 0.1
    ):
        scores = {
            "focused": round(focus_score, 3),
            "confused": round(confusion_score, 3),
            "stressed": round(stress_score, 3),
            "distracted": round(distraction_score, 3),
            "idle": round(idle_score, 3)
        }

        # High certainty for true idle
        return "idle", 0.95, scores, 0.95

    # ----------------------------
    # 5. FINAL SCORES
    # ----------------------------

    scores = {
        "focused": round(focus_score, 3),
        "confused": round(confusion_score, 3),
        "stressed": round(stress_score, 3),
        "distracted": round(distraction_score, 3),
        "idle": round(idle_score, 3)
    }

    # Get dominant state
    state = max(scores, key=scores.get)
    confidence = round(scores[state], 2)

    # ----------------------------
    # 6. SESSION CONFIDENCE
    # ----------------------------

    sorted_scores = sorted(scores.values(), reverse=True)

    if len(sorted_scores) > 1:
        session_confidence = round(sorted_scores[0] - sorted_scores[1], 2)
    else:
        session_confidence = sorted_scores[0]

    return state, confidence, scores, session_confidence