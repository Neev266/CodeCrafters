import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEngine } from '@/context/EngineContext';
import { 
  Cpu, 
  Keyboard, 
  MousePointer, 
  Layout, 
  Smile, 
  Activity,
  CheckCircle2,
  X
} from 'lucide-react';
import { LaunchCalibration } from './LaunchCalibration';
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const bootSteps = [
  { id: 1, label: "Loading cognitive engine", delay: 300, duration: 700, icon: <Cpu className="w-4 h-4" /> },
  { id: 2, label: "Activating keystroke monitor", delay: 1100, duration: 600, icon: <Keyboard className="w-4 h-4" /> },
  { id: 3, label: "Calibrating mouse tracker", delay: 1800, duration: 700, icon: <MousePointer className="w-4 h-4" /> },
  { id: 4, label: "Enabling tab switch detection", delay: 2600, duration: 600, icon: <Layout className="w-4 h-4" /> },
  { id: 5, label: "Connecting emotion layer", delay: 3300, duration: 800, icon: <Smile className="w-4 h-4" /> },
  { id: 6, label: "Arming n8n automation", delay: 4200, duration: 600, icon: <Activity className="w-4 h-4" /> },
];

interface LaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LaunchModal: React.FC<LaunchModalProps> = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState(1);
  const [bootProgress, setBootProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [loadingStep, setLoadingStep] = useState<number | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { launchEngine } = useEngine();

  useEffect(() => {
    if (!isOpen) {
      setPhase(1);
      setBootProgress(0);
      setCompletedSteps([]);
      setLoadingStep(null);
    }
  }, [isOpen]);

  // Phase 1: Particle Field (White Theme)
  useEffect(() => {
    if (phase !== 1 || !isOpen) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let particles: { x: number; y: number; vx: number; vy: number }[] = [];
    
    const resize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      particles = Array.from({ length: 40 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      }));
    };
    
    window.addEventListener('resize', resize);
    resize();
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(59, 139, 212, 0.2)';
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
        
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 60) {
            ctx.strokeStyle = `rgba(59, 139, 212, ${0.1 * (1 - dist / 60)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [phase, isOpen]);

  const startBoot = (data: any = null) => {
    setPhase(2);
    
    // In a real app, we would send 'data' (calibration metrics) to the backend here
    
    bootSteps.forEach((step, index) => {
      setTimeout(() => {
        setLoadingStep(step.id);
        const progressPerStep = 100 / bootSteps.length;
        
        setTimeout(() => {
          setCompletedSteps(prev => [...prev, step.id]);
          setLoadingStep(null);
          setBootProgress((index + 1) * progressPerStep);
          
          if (index === bootSteps.length - 1) {
            setTimeout(() => {
              setPhase(3);
              launchEngine();
              
              setTimeout(() => {
                onClose();
              }, 1500);
            }, 800);
          }
        }, step.duration);
      }, step.delay);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden bg-white border-none shadow-2xl rounded-3xl">
        <div className="relative w-full h-[520px] flex flex-col items-center justify-center p-8 bg-white overflow-hidden">
          {/* Background Canvas */}
          {phase === 1 && <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40" />}
          
          {/* Close Button UI override */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>

          {/* Pulsing Rings (Phase 1) */}
          {phase === 1 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[140, 220, 300].map((size, i) => (
                <motion.div
                  key={size}
                  className="absolute border border-primary/5 rounded-full"
                  initial={{ width: size, height: size, scale: 1 }}
                  animate={{ scale: 1.05 }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.6,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {phase === 1 && (
              <motion.div
                key="phase1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="z-10 flex flex-col items-center text-center"
              >
                {/* Logo Center */}
                <div className="relative w-[64px] h-[64px] mb-6">
                  <motion.div 
                    className="absolute inset-0 border-2 border-primary/30 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      className="w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_rgba(59,139,212,0.4)]"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </div>
                
                <h2 className="text-2xl font-display font-bold text-slate-900 mb-1 tracking-tight">CogniFlow Engine</h2>
                <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-bold mb-10">AI Activation System</p>
                
                <button
                  onClick={() => setPhase(1.5)}
                  className="px-8 py-3.5 rounded-2xl bg-primary text-white text-xs font-bold uppercase tracking-widest shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all"
                >
                  ⚡ Launch Engine
                </button>
              </motion.div>
            )}

            {phase === 1.5 && (
              <motion.div
                key="phase1.5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="z-10 w-full"
              >
                <LaunchCalibration onComplete={startBoot} />
              </motion.div>
            )}

            {phase === 2 && (
              <motion.div
                key="phase2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="z-10 w-full"
              >
                <div className="flex flex-col items-center mb-8">
                  <motion.div 
                    className="w-4 h-4 bg-primary rounded-full mb-3 shadow-[0_0_15px_rgba(59,139,212,0.5)]"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold">Initializing Pipeline</span>
                </div>
                
                <div className="space-y-2 mb-8 px-4">
                  {bootSteps.map((step) => {
                    const isCompleted = completedSteps.includes(step.id);
                    const isLoading = loadingStep === step.id;
                    
                    return (
                      <div 
                        key={step.id} 
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                          isLoading ? "bg-primary/5 border-primary/20 ring-1 ring-primary/10" : 
                          isCompleted ? "bg-green-50/50 border-green-100" : 
                          "bg-slate-50 border-transparent opacity-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={isLoading ? "text-primary" : isCompleted ? "text-green-500" : "text-slate-300"}>
                            {step.icon}
                          </div>
                          <span className="text-[13px] font-semibold text-slate-700">{step.label}</span>
                        </div>
                        <div>
                          {isLoading ? (
                            <motion.span 
                              className="text-[9px] uppercase text-primary font-black"
                              animate={{ opacity: [1, 0, 1] }}
                              transition={{ duration: 0.8, repeat: Infinity }}
                            >
                              loading
                            </motion.span>
                          ) : isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                          ) : (
                            <span className="text-[8px] uppercase text-slate-300 font-bold tracking-tighter">waiting</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="px-6">
                  <div className="flex justify-between text-[9px] uppercase tracking-[0.2em] text-slate-400 font-black mb-2 px-1">
                    <span>Engine Sequence</span>
                    <span>{Math.round(bootProgress)}%</span>
                  </div>
                  <Progress value={bootProgress} className="h-1.5 bg-slate-100 [&>div]:bg-primary shadow-sm" />
                </div>
              </motion.div>
            )}

            {phase === 3 && (
              <motion.div
                key="phase3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-green-50 rounded-3xl flex items-center justify-center mb-6 border border-green-100">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Engine Synchronized</h3>
                <p className="text-sm text-slate-500 mb-8 max-w-[240px]">Live tracking and cognitive analysis are now active.</p>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-green-600">Secure Link Established</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LaunchModal;
