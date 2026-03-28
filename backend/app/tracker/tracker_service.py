import time
import requests
from pynput import keyboard, mouse
import win32gui

API_URL = "https://codecrafters-druq.onrender.com/analyze"
print("🚀 USING API URL:", API_URL)

keystroke_times = []
click_times = []
last_activity = time.time()

tab_switches = 0
last_window = None

# -------------------------
# KEYBOARD
# -------------------------
def on_press(key):
    global keystroke_times, last_activity
    keystroke_times.append(time.time())
    last_activity = time.time()

# -------------------------
# MOUSE
# -------------------------
def on_click(x, y, button, pressed):
    global click_times, last_activity
    if pressed:
        click_times.append(time.time())
        last_activity = time.time()

# -------------------------
# WINDOW TRACKING
# -------------------------
def track_window():
    global last_window, tab_switches

    try:
        hwnd = win32gui.GetForegroundWindow()
        current_window = win32gui.GetWindowText(hwnd)

        if not current_window:
            return

        if last_window and current_window != last_window:
            tab_switches += 1
            print("🔄 Switched:", current_window)

        last_window = current_window

    except Exception as e:
        print("Window error:", e)

# -------------------------
# CALCULATIONS
# -------------------------
def get_typing_speed():
    global keystroke_times
    now = time.time()
    keystroke_times = [t for t in keystroke_times if now - t <= 5]
    return len(keystroke_times) / 5


def get_click_rate():
    global click_times
    now = time.time()
    click_times = [t for t in click_times if now - t <= 5]
    return len(click_times) / 5


def get_idle_time():
    return time.time() - last_activity

# -------------------------
# START LISTENERS
# -------------------------
keyboard.Listener(on_press=on_press).start()
mouse.Listener(on_click=on_click).start()

print("🚀 Tracker started...")

# -------------------------
# LOOP
# -------------------------
while True:
    try:
        track_window()

        data = {
            "user_id": 1,
            "typing_speed": get_typing_speed(),
            "backspace_rate": 0.2,
            "click_rate": get_click_rate(),
            "tab_switches": tab_switches,
            "idle_time": get_idle_time(),
            "repeated_actions": 0,
            "session_time": 120,
            "emotion": "neutral"
        }

        print("📤 Sending:", data)

        res = requests.post(API_URL, json=data)

        if res.status_code == 200:
            out = res.json()
            print(f"📥 {out['state']} | conf={out['confidence']}")
        else:
            print("❌ API Error:", res.status_code, res.text)

        tab_switches = 0
        time.sleep(5)

    except Exception as e:
        print("❌ Error:", e)
        time.sleep(5)