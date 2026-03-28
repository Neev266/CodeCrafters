import { motion } from "framer-motion";
import { cognitiveStateConfig } from "@/lib/mockData";
import { useCognitiveState } from "@/hooks/useCognitiveState";

export function CognitiveStateHero() {
  const { liveState, isLoading, error } = useCognitiveState();
  const config = cognitiveStateConfig[liveState.state] || cognitiveStateConfig.idle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-5" style={{ background: `var(--gradient-primary)` }} />
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`h-16 w-16 rounded-2xl bg-${config.color}/10 flex items-center justify-center text-3xl animate-pulse-glow`}>
              {config.icon}
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Current Cognitive State</p>
              <h2 className={`text-2xl font-display font-bold text-${config.color}`}>
                {config.label}
                {isLoading && <span className="ml-3 text-sm animate-pulse text-muted-foreground">Polling...</span>}
              </h2>
              {error ? (
                <p className="text-sm text-destructive mt-1 max-w-md">{error}</p>
              ) : (
                <p className="text-sm text-muted-foreground mt-1 max-w-md">{liveState.explanation}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-display font-bold text-foreground">{liveState.confidence}</span>
              <span className="text-lg text-muted-foreground">%</span>
            </div>
            <p className="text-xs text-muted-foreground">confidence</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
