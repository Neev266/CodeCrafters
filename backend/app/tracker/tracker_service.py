import time
import requests
from pynput import keyboard, mouse
import pygetwindow as gw
import win32gui

# ==============================
# CONFIG
# ==============================
API_URL = "http://127.0.0.1:8000/analyze"

# ==============================
# GLOBAL VARIABLES
# ==============================
keystroke_times = []
click_times = []
last_activity = time.time()

tab_switches = 0
last_window = None

# ==============================
# KEYBOARD TRACKING
# ==============================
def on_press(key):
    global keystroke_times, last_activity
    keystroke_times.append(time.time())
    last_activity = time.time()

# ==============================
# MOUSE TRACKING
# ==============================
def on_click(x, y, button, pressed):
    global click_times, last_activity
    if pressed:
        click_times.append(time.time())
        last_activity = time.time()

# ==============================
# WINDOW TRACKING (FIXED)
# ==============================
def track_window():
    global last_window, tab_switches

    try:
        hwnd = win32gui.GetForegroundWindow()
        current_window = win32gui.GetWindowText(hwnd)

        if not current_window:
            return

        if last_window and current_window != last_window:
            tab_switches += 1
            print("🔄 Switched to:", current_window)

        last_window = current_window

    except Exception as e:
        print("Window tracking error:", e)

# ==============================
# CALCULATIONS (FIXED 🔥)
# ==============================
def get_typing_speed():
    global keystroke_times

    current_time = time.time()

    # KEEP only last 5 sec keystrokes
    keystroke_times = [t for t in keystroke_times if current_time - t <= 5]

    return len(keystroke_times) / 5


def get_click_rate():
    global click_times

    current_time = time.time()

    # KEEP only last 5 sec clicks
    click_times = [t for t in click_times if current_time - t <= 5]

    return len(click_times) / 5


def get_idle_time():
    return time.time() - last_activity

# ==============================
# START LISTENERS
# ==============================
keyboard_listener = keyboard.Listener(on_press=on_press)
mouse_listener = mouse.Listener(on_click=on_click)

keyboard_listener.start()
mouse_listener.start()

print("🚀 Tracker started...")

# ==============================
# MAIN LOOP
# ==============================
while True:
    try:
        track_window()

        typing_speed = get_typing_speed()
        click_rate = get_click_rate()
        idle_time = get_idle_time()

        # DEBUG (IMPORTANT)
        print(f"⌨️ Typing Speed Raw: {typing_speed}")
        print(f"🖱️ Click Rate Raw: {click_rate}")

        data = {
            "user_id": 1,
            "typing_speed": typing_speed,
            "backspace_rate": 0.2,
            "click_rate": click_rate,
            "tab_switches": tab_switches,
            "idle_time": idle_time,
            "repeated_actions": 0,
            "session_time": 120,
            "emotion": "neutral"
        }

        print("\n📤 Sending Data:", data)

        response = requests.post(API_URL, json=data)
        res_json = response.json()

        print(f"📥 State: {res_json['state']} | Confidence: {res_json['confidence']}")

        # RESET only tab switches
        tab_switches = 0

        time.sleep(5)

    except Exception as e:
        print("❌ Error:", e)
        time.sleep(5)