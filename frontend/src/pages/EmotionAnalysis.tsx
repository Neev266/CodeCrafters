import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";

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
      </div>
    </DashboardLayout>
  );
};

export default EmotionAnalysis;
