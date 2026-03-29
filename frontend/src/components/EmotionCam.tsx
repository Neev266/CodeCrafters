import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Webcam from "react-webcam";
import { Camera, Activity, AlertTriangle } from "lucide-react";

const EmotionCam = () => {
  const webcamRef = useRef<Webcam>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string>("neutral");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [stress, setStress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(true);

  // 👁️ NEW: Eye Data State
  const [eyeData, setEyeData] = useState({
    eye_state: "unknown",
    eye_open_score: 0,
  });

  // 🧠 NEW: Cognitive Response
  const [cognitiveState, setCognitiveState] = useState<string>("loading");

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const detectEmotion = async () => {
      if (!webcamRef.current || !isCapturing) return;
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      try {
        const response = await fetch("http://127.0.0.1:8000/emotion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imageSrc }),
        });

        const data = await response.json();

        if (data.results?.length > 0) {
          const result = data.results[0];
          setCurrentEmotion(result.emotion);
          setConfidence(result.confidence);
          setStress(result.stress || 0);
          setError(null);

          // 👁️ NEW: Basic Eye Logic (simple approximation)
          if (result.emotion === "sad" || result.emotion === "neutral") {
            setEyeData({
              eye_state: "fatigue",
              eye_open_score: 0.008,
            });
          } else {
            setEyeData({
              eye_state: "focused",
              eye_open_score: 0.02,
            });
          }
        } else if (data.error) {
          setError(data.error);
        } else {
          setCurrentEmotion("No face detected");
          setConfidence(null);
        }
      } catch (err) {
        setError("Backend connection failed. Is the server running?");
      }
    };

    interval = setInterval(detectEmotion, 2000);
    return () => clearInterval(interval);
  }, [isCapturing]);

  // 🚀 NEW: SEND TO /analyze (YOUR MAIN BACKEND)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const payload = {
          user_id: 1,

          typing_speed: 1.2,
          backspace_rate: 0.3,
          click_rate: 1.5,
          tab_switches: 2,
          idle_time: 30,
          repeated_actions: 5,

          eye_state: eyeData.eye_state,
          eye_open_score: eyeData.eye_open_score,

          emotion: currentEmotion,
          timestamp: new Date().toISOString(),
        };

        const res = await fetch("http://127.0.0.1:8000/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (data?.state) {
          setCognitiveState(data.state);
        }

        console.log("🔥 Cognitive:", data);
      } catch (err) {
        console.error("Analyze error:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [eyeData, currentEmotion]);

  const emotionColors: Record<string, string> = {
    happy: "text-green-500 bg-green-50",
    sad: "text-blue-500 bg-blue-50",
    angry: "text-red-500 bg-red-50",
    fear: "text-purple-500 bg-purple-50",
    surprise: "text-yellow-500 bg-yellow-50",
    neutral: "text-slate-500 bg-slate-50",
    disgust: "text-orange-500 bg-orange-50",
  };

  return (
    <div className="glass-card rounded-[2.5rem] border border-white/40 shadow-xl overflow-hidden bg-white/60 backdrop-blur-md">
      <div className="p-8 border-b border-white/40 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-slate-800 uppercase flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Live Emotion Engine
          </h3>
          <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">Real-time facial analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCapturing(!isCapturing)}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isCapturing ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-primary/10 text-primary border border-primary/20'}`}
          >
            {isCapturing ? 'Stop Feed' : 'Start Feed'}
          </button>
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isCapturing ? 'bg-green-50 text-green-500' : 'bg-slate-100 text-slate-400'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isCapturing ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
            {isCapturing ? 'Live Recognition' : 'Paused'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Webcam View */}
        <div className="p-8 relative">
          <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-inner border-4 border-white/80 relative">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
              mirrored={true}
            />

            {/* 🔥 NEW: Cognitive State Overlay */}
            <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-lg text-xs font-bold">
              {cognitiveState}
            </div>

            {!isCapturing && (
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
                <Camera className="w-12 h-12 text-white/50" />
              </div>
            )}

            {error && (
              <div className="absolute top-4 left-4 right-4 bg-red-500/90 text-white p-3 rounded-xl text-[10px] font-bold flex items-center gap-2 backdrop-blur-md border border-red-400">
                <AlertTriangle className="w-3 h-3" />
                {error}
              </div>
            )}

            <div className="absolute bottom-4 left-4 flex gap-1">
              {[1, 2, 3, 4].map(i => (
                <motion.div 
                  key={i}
                  animate={{ height: isCapturing ? [4, 12, 4] : 4 }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                  className="w-1 bg-white/60 rounded-full"
                />
              ))}
                    </div>
                  </div>
                </div>
        
                {/* Stats Panel */}
                <div className="p-8 flex flex-col justify-between border-l border-white/40">
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Emotion</p>
                      <div className={`text-3xl font-black ${emotionColors[currentEmotion] || emotionColors.neutral} px-4 py-3 rounded-2xl inline-block`}>
                        {currentEmotion.toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Confidence</p>
                      <p className="text-2xl font-black text-slate-700">{confidence ? `${(confidence * 100).toFixed(1)}%` : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Stress Level</p>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: `${Math.min(stress * 100, 100)}%` }} />
                      </div>
                      <p className="text-sm font-bold text-slate-600 mt-2">{(stress * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        };
        
        export default EmotionCam;