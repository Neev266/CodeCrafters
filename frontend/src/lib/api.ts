export interface UserBehaviorPayload {
  user_id: number;

  // 🧠 Behavioral
  typing_speed: number;
  backspace_rate: number;
  click_rate: number;
  tab_switches: number;
  idle_time: number;
  repeated_actions: number;
  session_time: number;

  // 👁️ NEW (VERY IMPORTANT)
  eye_state?: string;           // "focused" | "fatigue" | "unknown"
  eye_open_score?: number;

  // ❤️ Emotion
  emotion: string;

  // ⏱️ Meta
  timestamp?: string;
}

export interface CognitiveStateResponse {
  user_id: number;
  state: 'focused' | 'distracted' | 'fatigued' | 'confused' | 'idle';
  confidence: number;
  session_confidence: number;
  emotion: string;
  features: Record<string, any>;
  timestamp: string;
}

const API_BASE_URL = 'http://localhost:8000';

// 🚀 MAIN API CALL
export async function analyzeUserBehavior(
  payload: UserBehaviorPayload
): Promise<CognitiveStateResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      // 🔥 ALWAYS SEND TIMESTAMP
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Failed to trigger backend analysis:', error);
    throw error;
  }
}

// 🧪 SIMULATION (WITH EYE DATA 🔥)
export function generateSimulatedBehavior(
  baseState: 'focus' | 'distraction' | 'fatigue' | 'confusion'
): UserBehaviorPayload {
  let typing_speed = 5;
  let backspace_rate = 2;
  let click_rate = 1;
  let tab_switches = 1;
  let idle_time = 0;
  let repeated_actions = 0;
  let emotion = 'happy';

  // 👁️ DEFAULT EYE VALUES
  let eye_state = 'focused';
  let eye_open_score = 0.02;

  switch (baseState) {
    case 'focus':
      typing_speed = 6 + Math.random() * 2;
      backspace_rate = 1 + Math.random() * 2;
      click_rate = 0.5 + Math.random();
      tab_switches = Math.floor(Math.random() * 2);
      idle_time = Math.random() * 10;
      emotion = 'happy';

      eye_state = 'focused';
      eye_open_score = 0.02 + Math.random() * 0.01;
      break;

    case 'distraction':
      typing_speed = 2 + Math.random() * 3;
      backspace_rate = 2 + Math.random() * 3;
      click_rate = 3 + Math.random() * 5;
      tab_switches = 5 + Math.floor(Math.random() * 10);
      idle_time = 10 + Math.random() * 30;
      emotion = Math.random() > 0.5 ? 'happy' : 'frustrated';

      eye_state = 'focused';
      eye_open_score = 0.015;
      break;

    case 'fatigue':
      typing_speed = 1 + Math.random() * 2;
      backspace_rate = 5 + Math.random() * 5;
      click_rate = 0.5 + Math.random();
      tab_switches = 2 + Math.floor(Math.random() * 3);
      idle_time = 60 + Math.random() * 100;
      emotion = 'sad';

      eye_state = 'fatigue';
      eye_open_score = 0.005 + Math.random() * 0.003;
      break;

    case 'confusion':
      typing_speed = 3 + Math.random() * 2;
      backspace_rate = 15 + Math.random() * 10;
      click_rate = 2 + Math.random() * 2;
      tab_switches = 3 + Math.floor(Math.random() * 4);
      repeated_actions = 5 + Math.floor(Math.random() * 5);
      idle_time = 20 + Math.random() * 20;
      emotion = 'frustrated';

      eye_state = 'focused';
      eye_open_score = 0.012;
      break;
  }

  return {
    user_id: 1,

    typing_speed: Number(typing_speed.toFixed(2)),
    backspace_rate: Number(backspace_rate.toFixed(2)),
    click_rate: Number(click_rate.toFixed(2)),
    tab_switches,
    idle_time: Number(idle_time.toFixed(2)),
    repeated_actions,
    session_time: 3600,

    // 👁️ NEW DATA
    eye_state,
    eye_open_score,

    emotion,
    timestamp: new Date().toISOString(),
  };
}