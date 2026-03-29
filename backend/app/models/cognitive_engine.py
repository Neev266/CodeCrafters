def predict_state(features, emotion):

    activity = (
        features["typing_speed"] * 0.4 +
        features["click_rate"] * 0.3 +
        (1 - features["idle_ratio"]) * 0.3
    )

    passive = (
        (1 - features["typing_speed"]) * 0.3 +
        (1 - features["click_rate"]) * 0.3 +
        (1 - features["tab_switch_rate"]) * 0.4
    )

    focus = activity * 0.6 + passive * 0.4

    confusion = (
        features["error_rate"] * 0.4 +
        features["repeat_ratio"] * 0.3 +
        (1 - features["typing_speed"]) * 0.3
    )

    stress = (
        features["error_rate"] * 0.4 +
        features["click_rate"] * 0.3 +
        features["repeat_ratio"] * 0.3
    )

    distraction = (
        features["tab_switch_rate"] * 0.5 +
        features["idle_ratio"] * 0.2 +
        (1 - features["click_rate"]) * 0.3
    )

    idle = features["idle_ratio"]

    # Emotion boost
    if emotion == "frustrated":
        stress += 0.1
        confusion += 0.05

    scores = {
        "focused": round(focus, 3),
        "confused": round(confusion, 3),
        "stressed": round(stress, 3),
        "distracted": round(distraction, 3),
        "idle": round(idle, 3)
    }

    state = max(scores, key=scores.get)
    confidence = round(scores[state], 2)

    sorted_vals = sorted(scores.values(), reverse=True)
    session_confidence = round(sorted_vals[0] - sorted_vals[1], 2)
    
def evaluate_state(features):
    score = 0

    # 🧠 Behavior scoring
    score += features["typing_speed"] * 0.2
    score += (1 - features["idle_ratio"]) * 0.2
    score += (1 - features["error_rate"]) * 0.1
    score += (1 - features["repeat_ratio"]) * 0.1

    # 👁️ Iris scoring (NEW 🔥)
    if features["eye_state"] == "focused":
        score += 0.4
    elif features["eye_state"] == "fatigue":
        score -= 0.3

    # 🎯 FINAL CLASSIFICATION
    if score > 0.7:
        return "focused", score
    elif score > 0.4:
        return "distracted", score
    else:
        return "fatigued", score
    
    return state, confidence, scores, session_confidence