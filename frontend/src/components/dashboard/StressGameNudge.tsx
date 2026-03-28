import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { stressActiveSince } from "@/lib/mockData";
import { X, Gamepad2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function StressGameNudge() {
  const [isVisible, setIsVisible] = useState(stressActiveSince > 30);
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-warning/10 border border-warning/20 rounded-xl p-4 flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/20 rounded-lg text-warning">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-warning-foreground">You've been stressed for {stressActiveSince} min.</p>
              <p className="text-xs text-muted-foreground mt-0.5">Take a 90s cognitive reset?</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/games')}
              className="text-xs font-semibold bg-warning text-primary-foreground px-4 py-2 rounded-md hover:bg-warning/90 transition-colors shadow-glow-warning"
            >
              Play Now
            </button>
            <button onClick={() => setIsVisible(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
