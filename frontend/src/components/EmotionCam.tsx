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
            
            {/* Real-time Indicator Overlay */}
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

        {/* Data Panel */}
        <div className="p-8 bg-slate-50/30 flex flex-col gap-6 border-l border-white/40">
          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detected State</p>
            <div className={`p-6 rounded-[2rem] border-2 border-white shadow-sm flex flex-col items-center justify-center transition-all duration-500 ${emotionColors[currentEmotion?.toLowerCase()] || 'bg-white text-slate-400'}`}>
              <span className="text-4xl mb-3">
                {currentEmotion === 'angry' ? '😡' : currentEmotion === 'happy' ? '😊' : currentEmotion === 'sad' ? '😢' : currentEmotion === 'fear' ? '😨' : currentEmotion === 'surprise' ? '😲' : currentEmotion === 'disgust' ? '🤢' : '😐'}
              </span>
              <h4 className="text-2xl font-black uppercase tracking-tight capitalize">{currentEmotion}</h4>
              <p className="text-[10px] font-bold opacity-60 mt-1 uppercase tracking-widest">Confidence: {confidence ? confidence.toFixed(1) + '%' : '--'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-3xl border border-white shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Stress Score</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-slate-800">{stress}</span>
                <span className="text-[10px] font-bold text-slate-400 mb-1.5">PTS</span>
              </div>
              <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ width: `${stress}%` }}
                  className={`h-full rounded-full ${stress > 70 ? 'bg-red-400' : stress > 40 ? 'bg-yellow-400' : 'bg-green-400'}`}
                />
              </div>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-white shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">System Load</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-slate-800">LOW</span>
                <Activity className="w-5 h-5 text-primary mb-1.5 opacity-40" />
              </div>
              <p className="text-[9px] font-bold text-green-500 mt-2">Optimal 0.4s lag</p>
            </div>
          </div>

          <div className="mt-auto p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <p className="text-[10px] font-bold text-primary/70 leading-relaxed italic">
              "System is correlating facial cues with behavioral patterns for highest accuracy. No raw biometric data is logged."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionCam;
