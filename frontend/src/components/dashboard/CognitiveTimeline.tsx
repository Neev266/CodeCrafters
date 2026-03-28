import { motion } from "framer-motion";
import { timelineData } from "@/lib/mockData";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const stateColors: Record<string, string> = {
  focus: 'bg-cognitive-focus',
  distracted: 'bg-cognitive-distracted',
  confused: 'bg-cognitive-confused',
  fatigued: 'bg-cognitive-fatigued',
  idle: 'bg-cognitive-idle',
};

export function CognitiveTimeline() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card rounded-xl p-6"
    >
      <h3 className="text-sm font-display font-semibold text-foreground mb-1">Cognitive Timeline</h3>
      <p className="text-xs text-muted-foreground mb-4">State changes throughout the day</p>

      <div className="flex items-center gap-0.5 h-8 rounded-lg overflow-hidden">
        {timelineData.map((segment, i) => (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4 + i * 0.03 }}
                className={`flex-1 h-full ${stateColors[segment.state]} cursor-pointer transition-opacity hover:opacity-80`}
                style={{ originX: 0 }}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-card border-border">
              <p className="text-xs font-medium">{segment.label}</p>
              <p className="text-xs text-muted-foreground">{segment.time}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      <div className="flex justify-between mt-2">
        <span className="text-[10px] text-muted-foreground">{timelineData[0]?.time}</span>
        <span className="text-[10px] text-muted-foreground">{timelineData[timelineData.length - 1]?.time}</span>
      </div>

      <div className="flex items-center gap-4 mt-4 flex-wrap">
        {Object.entries(stateColors).map(([state, color]) => (
          <div key={state} className="flex items-center gap-1.5">
            <div className={`h-2 w-2 rounded-full ${color}`} />
            <span className="text-[10px] text-muted-foreground capitalize">{state}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
