import { motion } from "framer-motion";
import { PlayCircle, Coffee, CalendarRange } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-4 mt-6"
    >
      <button 
        onClick={() => toast.success("Focus session started! Deep work engaged.")}
        className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-6 py-4 rounded-xl border border-primary/20 font-medium transition-all hover:scale-[1.02]"
      >
        <PlayCircle className="w-5 h-5" />
        Start Focus Session
      </button>

      <button 
        onClick={() => {
          toast.info("Taking a break now. Notifications are silenced.");
        }}
        className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 text-foreground px-6 py-4 rounded-xl border border-border/50 font-medium transition-all hover:scale-[1.02]"
      >
        <Coffee className="w-5 h-5" />
        Take Break Now
      </button>

      <button 
        onClick={() => navigate('/report')}
        className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-secondary/50 hover:bg-secondary text-foreground px-6 py-4 rounded-xl border border-border/50 font-medium transition-all hover:scale-[1.02]"
      >
        <CalendarRange className="w-5 h-5" />
        View My Week
      </button>
    </motion.div>
  );
}
