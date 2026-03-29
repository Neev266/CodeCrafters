import { useEffect, useState } from "react";
import { sendCognitiveData } from "@/lib/cognitiveApi";

export const useCognitiveEngine = (eyeData: any) => {
  const [response, setResponse] = useState<any>(null);

  useEffect(() => {
    if (!eyeData) return;

    const interval = setInterval(async () => {
      const payload = {
        user_id: 1,

        // 🧠 Replace later with real tracking
        typing_speed: 1.2,
        backspace_rate: 0.3,
        click_rate: 1.5,
        tab_switches: 2,
        idle_time: 30,
        repeated_actions: 5,

        // 👁️ REAL DATA
        eye_state: eyeData.eye_state,
        eye_open_score: eyeData.eye_open_score,

        emotion: "neutral",
        timestamp: new Date().toISOString(),
      };

      const res = await sendCognitiveData(payload);

      if (res) {
        console.log("🔥 Cognitive Response:", res);
        setResponse(res);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [eyeData]);

  return response;
};