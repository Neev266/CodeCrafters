import { motion } from "framer-motion";
import { todayFocusScore } from "@/lib/mockData";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function FocusScoreCard() {
  const isPositive = todayFocusScore.delta > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-hover rounded-xl p-6"
    >
      <h3 className="text-sm font-display font-semibold text-foreground mb-1">Today's Focus Score</h3>
      <div className="flex items-baseline gap-3 mt-4">
        <span className="text-4xl font-display font-bold text-foreground">{todayFocusScore.score}</span>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${isPositive ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(todayFocusScore.delta)}% vs yesterday
        </div>
      </div>
    </motion.div>
  );
}
