import cv2
import mediapipe as mp
import numpy as np

# -------------------------------
# 🧠 MEDIA PIPE SETUP
# -------------------------------
mp_face_mesh = mp.solutions.face_mesh


class IrisDetector:
    def __init__(self):
        self.face_mesh = mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

    def analyze_frame(self, frame):
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb_frame)

        if not results.multi_face_landmarks:
            return {
                "eye_state": "no_face",
                "eye_open_value": 0.0,
                "confidence": 0.0
            }

        landmarks = results.multi_face_landmarks[0].landmark

        # 👁️ LEFT EYE LANDMARKS
        top = landmarks[159]
        bottom = landmarks[145]

        eye_open_value = abs(top.y - bottom.y)

        # 🧠 CLASSIFICATION LOGIC
        if eye_open_value < 0.01:
            return {
                "eye_state": "fatigue",
                "eye_open_value": float(eye_open_value),
                "confidence": float(1 - eye_open_value)
            }
        else:
            return {
                "eye_state": "focused",
                "eye_open_value": float(eye_open_value),
                "confidence": float(eye_open_value)
            }


# -------------------------------
# ⚙️ FEATURE EXTRACTION (MAIN)
# -------------------------------
def extract_features(data, iris_data=None):
    """
    Combines behavioral + iris features
    """

    features = {
        # 🧠 BEHAVIORAL FEATURES
        "typing_speed": min(data.typing_speed / 6, 1),
        "error_rate": min(data.backspace_rate, 1),
        "click_rate": min(data.click_rate / 4, 1),
        "tab_switch_rate": min(data.tab_switches / 10, 1),
        "idle_ratio": min(data.idle_time / 60, 1),
        "repeat_ratio": min(data.repeated_actions / 10, 1),
    }

    # 👁️ ADD IRIS FEATURES IF AVAILABLE
    if iris_data:
        features.update({
            "eye_state": iris_data.get("eye_state", "unknown"),
            "eye_open_score": iris_data.get("eye_open_value", 0.0),
            "eye_confidence": iris_data.get("confidence", 0.0)
        })
    else:
        features.update({
            "eye_state": "unknown",
            "eye_open_score": 0.0,
            "eye_confidence": 0.0
        })

    return features


# -------------------------------
# 🧪 HELPER (FOR API USE)
# -------------------------------
def process_image_and_extract(frame, data):
    """
    Full pipeline:
    Image → Iris → Features
    """

    detector = IrisDetector()
    iris_result = detector.analyze_frame(frame)

    features = extract_features(data, iris_result)

    return features