export interface UserBehaviorPayload {
  user_id: number;
  typing_speed: number;
  backspace_rate: number;
  click_rate: number;
  tab_switches: number;
  idle_time: number;
  repeated_actions: number;
  session_time: number;
  emotion: string; // 'happy', 'sad', 'frustrated'
}

export interface CognitiveStateResponse {
  user_id: number;
  state: 'focus' | 'distraction' | 'fatigue' | 'confusion' | 'idle';
  confidence: number;
  session_confidence: number;
  emotion: string;
  features: Record<string, any>;
  scores: Record<string, number>;
  timestamp: string;
}

const API_BASE_URL = 'http://localhost:8000';

export async function analyzeUserBehavior(payload: UserBehaviorPayload): Promise<CognitiveStateResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to trigger backend analysis:', error);
    throw error;
  }
}

// Helper to generate a realistic mock payload matching the backend schema
export function generateSimulatedBehavior(baseState: 'focus' | 'distraction' | 'fatigue' | 'confusion'): UserBehaviorPayload {
  let typing_speed = 5;
  let backspace_rate = 2;
  let click_rate = 1;
  let tab_switches = 1;
  let idle_time = 0;
  let repeated_actions = 0;
  let emotion = 'happy';

  switch (baseState) {
    case 'focus':
      typing_speed = 6 + Math.random() * 2;
      backspace_rate = 1 + Math.random() * 2;
      click_rate = 0.5 + Math.random();
      tab_switches = Math.floor(Math.random() * 2);
      idle_time = Math.random() * 10;
      emotion = 'happy';
      break;
    case 'distraction':
      typing_speed = 2 + Math.random() * 3;
      backspace_rate = 2 + Math.random() * 3;
      click_rate = 3 + Math.random() * 5;
      tab_switches = 5 + Math.floor(Math.random() * 10);
      idle_time = 10 + Math.random() * 30;
      emotion = Math.random() > 0.5 ? 'happy' : 'frustrated';
      break;
    case 'fatigue':
      typing_speed = 1 + Math.random() * 2;
      backspace_rate = 5 + Math.random() * 5;
      click_rate = 0.5 + Math.random();
      tab_switches = 2 + Math.floor(Math.random() * 3);
      idle_time = 60 + Math.random() * 100;
      emotion = 'sad';
      break;
    case 'confusion':
      typing_speed = 3 + Math.random() * 2;
      backspace_rate = 15 + Math.random() * 10;
      click_rate = 2 + Math.random() * 2;
      tab_switches = 3 + Math.floor(Math.random() * 4);
      repeated_actions = 5 + Math.floor(Math.random() * 5);
      idle_time = 20 + Math.random() * 20;
      emotion = 'frustrated';
      break;
  }

  return {
    user_id: 1, // Default user
    typing_speed: Number(typing_speed.toFixed(2)),
    backspace_rate: Number(backspace_rate.toFixed(2)),
    click_rate: Number(click_rate.toFixed(2)),
    tab_switches,
    idle_time: Number(idle_time.toFixed(2)),
    repeated_actions,
    session_time: 3600, // 1 hour session simulated
    emotion,
  };
}
