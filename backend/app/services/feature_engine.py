def extract_features(data):
    return {
        "typing_speed": min(data.typing_speed / 6, 1),
        "error_rate": min(data.backspace_rate, 1),
        "click_rate": min(data.click_rate / 4, 1),
        "tab_switch_rate": min(data.tab_switches / 10, 1),
        "idle_ratio": min(data.idle_time / 60, 1),
        "repeat_ratio": min(data.repeated_actions / 10, 1)
    }