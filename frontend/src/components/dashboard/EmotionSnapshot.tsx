import { motion } from "framer-motion";
import { topEmotion } from "@/lib/mockData";

export function EmotionSnapshot() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-hover rounded-xl p-6"
    >
      <h3 className="text-sm font-display font-semibold text-foreground mb-1">Current Emotion</h3>
      <div className="flex items-center gap-3 mt-4">
        <div className={`w-4 h-4 rounded-full ${topEmotion.dotClass} animate-pulse-glow`} />
        <span className="text-xl font-display font-bold text-foreground">{topEmotion.label} — {topEmotion.value}%</span>
      </div>
    </motion.div>
  );
}
