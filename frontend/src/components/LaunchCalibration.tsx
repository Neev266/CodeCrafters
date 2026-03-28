import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, MousePointer2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface CalibrationProps {
  onComplete: (data: any) => void;
}

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog";

export const LaunchCalibration = ({ onComplete }: CalibrationProps) => {
  const [phase, setPhase] = useState<'typing' | 'mouse'>('typing');
  const [userInput, setUserInput] = useState('');
  const [backspaces, setBackspaces] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [mouseClicks, setMouseClicks] = useState(0);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [kps, setKps] = useState(0);

  // Typing logic
  useEffect(() => {
    if (userInput.length > 0 && !startTime) {
      setStartTime(Date.now());
    }

    if (startTime) {
      const elapsed = (Date.now() - startTime) / 1000;
      setKps(userInput.length / elapsed);
    }

    if (userInput === SAMPLE_TEXT) {
      setTimeout(() => setPhase('mouse'), 800);
    }
  }, [userInput, startTime]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      setBackspaces(prev => prev + 1);
    }
  };

  // Mouse logic
  const handleTargetClick = () => {
    setMouseClicks(prev => prev + 1);
    if (mouseClicks >= 4) {
      onComplete({
        kps: kps.toFixed(2),
        backspaces,
        clicks: mouseClicks + 1
      });
    } else {
      setTargetPos({
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10
      });
    }
  };

  return (
    <div className="space-y-8 py-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-display font-bold text-slate-800">
          {phase === 'typing' ? 'Sensor Calibration: Typing' : 'Sensor Calibration: Precision'}
        </h3>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
          {phase === 'typing' ? 'Verify keystroke latency' : 'Verify mouse tracking variance'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'typing' ? (
          <motion.div
            key="typing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
              <p className="text-sm font-mono text-slate-400 mb-2 select-none">{SAMPLE_TEXT}</p>
              <input
                autoFocus
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Start typing..."
                className="w-full bg-transparent border-none focus:ring-0 text-slate-800 font-mono text-sm p-0"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-slate-100 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold text-slate-500">SPEED (KPS)</span>
                </div>
                <span className="text-sm font-mono font-bold text-primary">{kps.toFixed(1)}</span>
              </div>
              <div className="bg-white border border-slate-100 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span className="text-[10px] font-bold text-slate-500">ERRORS</span>
                </div>
                <span className="text-sm font-mono font-bold text-rose-500">{backspaces}</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="mouse"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-48 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden cursor-crosshair"
          >
            <motion.button
              animate={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
              onClick={handleTargetClick}
              className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30"
            >
              <MousePointer2 className="w-4 h-4 text-white fill-current" />
            </motion.button>
            <div className="absolute inset-x-0 bottom-4 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Capture Sample: {mouseClicks} / 5
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-50">
        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
        <span className="text-[10px] text-slate-400 font-medium">System is learning your unique interaction patterns...</span>
      </div>
    </div>
  );
};
