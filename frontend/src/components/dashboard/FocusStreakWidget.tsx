import { motion } from "framer-motion";
import { focusStreak } from "@/lib/mockData";
import { Flame } from "lucide-react";

export function FocusStreakWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 px-4 py-2 rounded-full"
    >
      <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
      <span className="text-sm font-medium text-orange-500">Day {focusStreak.days} streak 🔥</span>
    </motion.div>
  );
}
