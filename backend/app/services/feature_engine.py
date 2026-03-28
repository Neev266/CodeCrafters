# app/services/feature_engine.py

def extract_features(data):
    features = {}

    # Normalize values (clamped between 0 and 1)
    features["typing_speed"] = min(data.typing_speed / 5, 1)  # assume max ~5 wps
    features["error_rate"] = min(data.backspace_rate, 1)
    features["click_rate"] = min(data.click_rate / 5, 1)

    features["tab_switch_rate"] = min(data.tab_switches / 10, 1)
    features["idle_ratio"] = min(data.idle_time / 60, 1)
    features["repeat_ratio"] = min(data.repeated_actions / 10, 1)

    return features