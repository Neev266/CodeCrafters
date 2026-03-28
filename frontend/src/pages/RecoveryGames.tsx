import { DashboardLayout } from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Activity, BrainCircuit } from "lucide-react";
import { recoveryGamesHistory, gamesThisWeek } from "@/lib/mockData";

export default function RecoveryGames() {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Cognitive Recovery Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">Science-backed 90-second minimum resets for your brain</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {activeGame === 'breathing' ? (
                <BreathingPacer key="breathing" onClose={() => setActiveGame(null)} />
              ) : activeGame === 'memory' ? (
                <MemoryPattern key="memory" onClose={() => setActiveGame(null)} />
              ) : activeGame === 'reaction' ? (
                <ReactionTap key="reaction" onClose={() => setActiveGame(null)} />
              ) : (
                <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GameCard 
                    title="Breathing Pacer" 
                    desc="Box breathing technique to lower cortisol and reset autonomic nervous system."
                    icon="🌬️" 
                    duration="90s+"
                    color="hsl(142, 71%, 45%)"
                    onClick={() => setActiveGame('breathing')}
                  />
                  <GameCard 
                    title="Memory Pattern" 
                    desc="Working memory flush using spatial sequence recall to break tunnel vision."
                    icon="🧠" 
                    duration="60s"
                    color="hsl(199, 89%, 48%)"
                    onClick={() => setActiveGame('memory')}
                  />
                  <GameCard 
                    title="Reaction Tap" 
                    desc="Visuomotor speed test to evaluate cognitive fatigue levels."
                    icon="⚡" 
                    duration="30s"
                    color="hsl(38, 92%, 50%)"
                    onClick={() => setActiveGame('reaction')}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <BrainCircuit className="w-24 h-24" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Impact</h3>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-5xl font-display font-bold text-primary">{gamesThisWeek.avgStressReduction}%</span>
              </div>
              <p className="text-xs text-muted-foreground">Average stress reduction after playing a mini-game this week.</p>
              <div className="mt-6 pt-6 border-t border-border/50">
                <p className="text-sm font-medium text-foreground mb-1">{gamesThisWeek.count} sessions completed</p>
                <p className="text-xs text-muted-foreground">Top game: Breathing Pacer</p>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Past Sessions</h3>
              <div className="space-y-4">
                {recoveryGamesHistory.map(h => (
                  <div key={h.id} className="flex flex-col gap-1 pb-3 border-b border-border/30 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{h.game}</span>
                      <span className="text-xs text-muted-foreground">{h.duration}</span>
                    </div>
                    <div className="flex items-center justify-between pointer-events-none">
                       <span className="text-[10px] text-muted-foreground">{h.datetime.split(' ')[1]}</span>
                       <div className="flex items-center gap-1.5 text-[10px] font-medium">
                         <Activity className="w-3 h-3 text-muted-foreground" />
                         <span className="text-destructive">{h.stressBefore}</span>
                         <span className="text-muted-foreground">→</span>
                         <span className="text-success">{h.stressAfter}</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function GameCard({ title, desc, icon, duration, color, onClick }: any) {
  return (
    <motion.button 
      whileHover={{ y: -4, scale: 1.02 }} 
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="text-left glass-card-hover rounded-xl p-6 flex flex-col h-full border border-border/50 bg-card/40"
    >
      <div className="text-3xl mb-4 p-3 bg-muted/30 rounded-lg w-fit" style={{ boxShadow: `0 4px 20px ${color}10` }}>{icon}</div>
      <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-xs text-muted-foreground flex-1 mb-4 leading-relaxed">{desc}</p>
      <div className="flex items-center gap-2 mt-auto">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground bg-muted px-2 py-1 rounded">Duration: {duration}</span>
      </div>
    </motion.button>
  );
}

// Mini Game Components Below
function BreathingPacer({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<'Inhale'|'Hold'|'Exhale'|'Hold '>('Inhale');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPhase(p => {
        if (p === 'Inhale') return 'Hold';
        if (p === 'Hold') return 'Exhale';
        if (p === 'Exhale') return 'Hold ';
        return 'Inhale';
      });
    }, 4000); // 4 seconds per phase
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card rounded-xl border border-primary/20 p-8 h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
      <button onClick={onClose} className="absolute top-4 left-4 text-xs font-medium text-muted-foreground hover:text-foreground">← Back</button>
      
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="w-[400px] h-[400px] border-[1px] border-primary rounded-full" />
      </div>

      <h2 className="text-xl font-display font-semibold text-foreground mb-2 z-10">Box Breathing</h2>
      <p className="text-sm text-muted-foreground mb-16 z-10 text-center max-w-sm">Synchronize your breath with the expanding circle to reset your nervous system.</p>

      <div className="relative w-48 h-48 flex items-center justify-center mb-16">
         <motion.div 
           animate={isPlaying ? {
             scale: phase === 'Inhale' ? 1.5 : phase === 'Exhale' ? 1 : (phase === 'Hold' ? 1.5 : 1),
             opacity: phase.includes('Hold') ? 0.7 : 1
           } : { scale: 1, opacity: 0.5 }}
           transition={{ duration: 4, ease: "easeInOut" }}
           className="absolute w-32 h-32 bg-primary/20 rounded-full blur-xl"
         />
         <motion.div 
           animate={isPlaying ? {
             scale: phase === 'Inhale' ? 1.5 : phase === 'Exhale' ? 1 : (phase === 'Hold' ? 1.5 : 1),
           } : { scale: 1 }}
           transition={{ duration: 4, ease: "easeInOut" }}
           className="w-32 h-32 bg-primary/40 rounded-full border border-primary flex items-center justify-center z-10 backdrop-blur-sm shadow-glow-primary"
         >
           <span className="text-xl font-bold text-primary-foreground tracking-widest">{isPlaying ? phase : 'Ready'}</span>
         </motion.div>
      </div>

      <div className="flex items-center gap-4 z-10">
        <button onClick={() => setIsPlaying(!isPlaying)} className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
          {isPlaying ? <Pause className="w-6 h-6 ml-0.5" /> : <Play className="w-6 h-6 ml-1" />}
        </button>
        <button onClick={() => { setIsPlaying(false); setPhase('Inhale'); }} className="w-12 h-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center hover:text-foreground transition-colors">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}

function MemoryPattern({ onClose }: { onClose: () => void }) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSeq, setPlayerSeq] = useState<number[]>([]);
  const [status, setStatus] = useState<'idle'|'showing'|'playing'|'won'|'lost'>('idle');
  const [activeSq, setActiveSq] = useState<number | null>(null);

  const startLevel = () => {
    const newSeq = [...sequence, Math.floor(Math.random() * 9)];
    setSequence(newSeq);
    setPlayerSeq([]);
    setStatus('showing');
    
    // Play sequence
    let i = 0;
    const interval = setInterval(() => {
      if (i < newSeq.length) {
        setActiveSq(newSeq[i]);
        setTimeout(() => setActiveSq(null), 400);
        i++;
      } else {
        clearInterval(interval);
        setStatus('playing');
      }
    }, 800);
  };

  const handleTap = (index: number) => {
    if (status !== 'playing') return;
    
    const newPlayerSeq = [...playerSeq, index];
    setPlayerSeq(newPlayerSeq);
    setActiveSq(index);
    setTimeout(() => setActiveSq(null), 200);

    const isCorrect = newPlayerSeq.every((val, i) => val === sequence[i]);
    
    if (!isCorrect) {
      setStatus('lost');
    } else if (newPlayerSeq.length === sequence.length) {
      setStatus('won');
      setTimeout(startLevel, 1000);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card rounded-xl p-8 h-[500px] flex flex-col items-center justify-center relative bg-card">
      <button onClick={onClose} className="absolute top-4 left-4 text-xs font-medium text-muted-foreground hover:text-foreground">← Back</button>
      
      <div className="text-center mb-8">
        <h2 className="text-xl font-display font-semibold text-foreground mb-1">Spatial Recall</h2>
        <p className="text-sm text-muted-foreground">Score: {Math.max(0, sequence.length - 1)}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8 p-4 bg-muted/10 rounded-2xl border border-border/30">
        {Array.from({length: 9}).map((_, i) => (
          <button
            key={i}
            onClick={() => handleTap(i)}
            disabled={status !== 'playing'}
            className={`w-20 h-20 rounded-xl transition-all duration-200 ${activeSq === i ? 'bg-primary shadow-glow-primary scale-95' : 'bg-muted/50 hover:bg-muted border border-border/50'} ${status === 'lost' && sequence[playerSeq.length-1] === i ? 'bg-destructive shadow-glow-destructive' : ''}`}
          />
        ))}
      </div>

      {status === 'idle' || status === 'lost' ? (
        <button onClick={() => { setSequence([]); startLevel(); }} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-medium shadow-lg transition-transform hover:scale-105">
          {status === 'lost' ? 'Try Again' : 'Start Sequence'}
        </button>
      ) : (
        <p className="text-sm font-medium text-muted-foreground h-10 flex items-center">
          {status === 'showing' ? 'Watch carefully...' : 'Your turn!'}
        </p>
      )}
    </motion.div>
  );
}

function ReactionTap({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<'idle'|'waiting'|'ready'|'done'>('idle');
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);

  const startTest = () => {
    setStatus('waiting');
    setTimeout(() => {
      setStatus('ready');
      setStartTime(Date.now());
    }, 1500 + Math.random() * 3000);
  };

  const handleTap = () => {
    if (status === 'waiting') {
      setStatus('idle'); // Jumped the gun
      alert("Too early! Wait for GREEN.");
    } else if (status === 'ready') {
      const rt = Date.now() - startTime;
      setReactionTime(rt);
      setStatus('done');
    } else if (status === 'idle' || status === 'done') {
      startTest();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card rounded-xl p-8 h-[500px] flex flex-col items-center justify-center relative">
      <button onClick={onClose} className="absolute top-4 left-4 text-xs font-medium text-muted-foreground hover:text-foreground">← Back</button>
      
      <div className="text-center mb-8 pointer-events-none">
        <h2 className="text-xl font-display font-semibold text-foreground mb-1">Visuomotor Speed</h2>
        <p className="text-sm text-muted-foreground">Tap as fast as you can when it turns green.</p>
      </div>

      <button 
        onClick={handleTap}
        className={`w-64 h-64 rounded-full flex flex-col items-center justify-center shadow-lg transition-all active:scale-95 border-4 \
          ${status === 'idle' || status === 'done' ? 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20' : 
            status === 'waiting' ? 'bg-destructive/10 border-destructive line-through decoration-destructive text-destructive' : 
            'bg-success border-success text-success-foreground shadow-glow-success'}`}
      >
        {status === 'idle' && <span className="font-display font-bold text-2xl tracking-wide">START</span>}
        {status === 'waiting' && <span className="font-display font-bold text-xl opacity-50">WAIT...</span>}
        {status === 'ready' && <span className="font-display font-bold text-4xl">TAP!</span>}
        {status === 'done' && (
          <>
            <span className="font-display font-bold text-4xl mb-1">{reactionTime}</span>
            <span className="text-sm font-medium opacity-80 uppercase tracking-widest">ms</span>
          </>
        )}
      </button>

      {status === 'done' && (
        <p className="mt-8 text-sm text-muted-foreground font-medium animate-pulse">Tap the circle to go again</p>
      )}
    </motion.div>
  );
}
