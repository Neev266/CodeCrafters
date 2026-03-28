import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { emotionTimelineBlocks, emotionsInAction, moodCalendar } from "@/lib/mockData";
import { Camera, Calendar } from "lucide-react";

const EmotionAnalysis = () => {
  const emotions = [
    { label: 'Engaged', value: 72, color: 'bg-primary' },
    { label: 'Frustrated', value: 12, color: 'bg-destructive' },
    { label: 'Calm', value: 85, color: 'bg-success' },
    { label: 'Stressed', value: 23, color: 'bg-warning' },
    { label: 'Curious', value: 64, color: 'bg-accent' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Emotion Analysis</h1>
          <p className="text-sm text-muted-foreground mt-1">Inferred emotional state from behavioral patterns</p>
        </div>

        {/* Emotion Timeline Strip */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-display font-semibold text-foreground mb-1">Emotion Timeline</h3>
          <p className="text-xs text-muted-foreground mb-4">Dominant emotional state per 30-minute block</p>
          <div className="flex items-center gap-0.5 h-6 rounded-md overflow-hidden bg-muted/30">
            {emotionTimelineBlocks.map((block, i) => (
              <div 
                key={i} 
                className="flex-1 h-full hover:opacity-80 cursor-help"
                style={{ backgroundColor: block.color }}
                title={`${block.time} - ${block.label}`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-muted-foreground">{emotionTimelineBlocks[0]?.time}</span>
            <span className="text-[10px] text-muted-foreground">{emotionTimelineBlocks[emotionTimelineBlocks.length - 1]?.time}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emotions.map((em, i) => (
            <motion.div
              key={em.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card-hover rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-foreground">{em.label}</span>
                <span className="text-2xl font-display font-bold text-foreground">{em.value}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${em.value}%` }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                  className={`h-full rounded-full ${em.color}`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-display font-semibold text-foreground mb-1">How Emotions Are Detected</h3>
          <p className="text-xs text-muted-foreground mb-4">Emotional states are inferred from combinations of behavioral signals — not from facial recognition or biometrics.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { signal: 'Typing rhythm consistency', inference: 'Calm vs Stressed' },
              { signal: 'Error correction patterns', inference: 'Frustrated vs Engaged' },
              { signal: 'Navigation exploration', inference: 'Curious vs Routine' },
              { signal: 'Response time variance', inference: 'Alert vs Fatigued' },
            ].map((item) => (
              <div key={item.signal} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <span className="text-xs text-muted-foreground">{item.signal}</span>
                <span className="text-xs font-medium text-foreground">{item.inference}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emotions in action */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-display font-semibold text-foreground mb-1">Emotions in Action</h3>
            <p className="text-xs text-muted-foreground mb-4">How detected emotions triggered system responses</p>
            <div className="space-y-4">
              {emotionsInAction.map(ea => (
                <div key={ea.emotion} className="flex flex-col border-b border-border/30 last:border-0 pb-3 last:pb-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ea.color }} />
                    <span className="text-sm font-medium text-foreground">{ea.emotion} ({ea.percent}%)</span>
                  </div>
                  <ul className="pl-4 border-l border-border ml-1 mt-1 space-y-1">
                    {ea.actions.map(act => (
                      <li key={act} className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="text-[10px] text-primary">▸</span> {act}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Webcam Upcoming + Mood Calendar */}
          <div className="flex flex-col gap-6">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }} className="border border-border/40 bg-muted/20 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Camera className="w-16 h-16" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-display font-semibold text-muted-foreground">Webcam Emotion Detection</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">Coming Soon</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4 max-w-[80%]">Opt-in facial expression analysis for higher accuracy emotion detection using face-api.js. No data stored externally.</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-4 bg-border/50 rounded-full cursor-not-allowed" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Currently Disabled</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="glass-card rounded-xl p-6">
               <div className="flex items-center gap-2 mb-1">
                 <Calendar className="w-4 h-4 text-primary" />
                 <h3 className="text-sm font-display font-semibold text-foreground">Mood Calendar</h3>
               </div>
               <p className="text-xs text-muted-foreground mb-4">Your daily dominant emotional state</p>
               
               <div className="grid grid-cols-7 gap-1.5 mb-2">
                 {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                   <span key={i} className="text-[10px] font-medium text-muted-foreground text-center block">{d}</span>
                 ))}
               </div>
               <div className="grid grid-cols-7 gap-1.5">
                 {moodCalendar.map((cell, idx) => (
                   <div 
                     key={idx} 
                     className={`aspect-square rounded-sm ${!cell.hasData ? 'bg-muted/30 border border-border/20' : 'cursor-help border border-black/10'}`}
                     style={{ backgroundColor: cell.color || undefined }}
                     title={cell.hasData ? `Day ${cell.day}: ${cell.emotion}` : 'No data'}
                   />
                 ))}
               </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmotionAnalysis;
