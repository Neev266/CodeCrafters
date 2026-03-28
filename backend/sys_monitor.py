# sys_monitor.py
import time
import threading
from pynput import keyboard, mouse

class SystemMonitor:
    def __init__(self):
        self.keystrokes = 0
        self.backspaces = 0
        self.mouse_movements = 0
        self.last_mouse_pos = (0, 0)
        self.start_time = time.time()
        self.running = False
        
        self.keyboard_listener = keyboard.Listener(on_press=self._on_key_press)
        self.mouse_listener = mouse.Listener(on_move=self._on_mouse_move)

    def _on_key_press(self, key):
        self.keystrokes += 1
        try:
            if key == keyboard.Key.backspace:
                self.backspaces += 1
        except AttributeError:
            pass

    def _on_mouse_move(self, x, y):
        # Calculate simple variance/distance
        dx = x - self.last_mouse_pos[0]
        dy = y - self.last_mouse_pos[1]
        self.mouse_movements += (dx**2 + dy**2)**0.5
        self.last_mouse_pos = (x, y)

    def start(self):
        if not self.running:
            self.running = True
            self.keyboard_listener.start()
            self.mouse_listener.start()
            print("System Monitor Started Globally")

    def stop(self):
        if self.running:
            self.keyboard_listener.stop()
            self.mouse_listener.stop()
            self.running = False
            print("System Monitor Stopped")

    def get_metrics(self):
        uptime = time.time() - self.start_time
        kps = self.keystrokes / uptime if uptime > 0 else 0
        
        # Reset relative metrics for "live" feel if needed, 
        # but here we'll just return cumulative for now and let frontend handle diffs
        return {
            "keystrokes": self.keystrokes,
            "backspaces": self.backspaces,
            "mouse_distance": int(self.mouse_movements),
            "kps": round(kps, 2),
            "uptime": int(uptime)
        }

# Global instance
monitor = SystemMonitor()

if __name__ == "__main__":
    monitor.start()
    try:
        while True:
            time.sleep(1)
            print(f"Metrics: {monitor.get_metrics()}")
    except KeyboardInterrupt:
        monitor.stop()
