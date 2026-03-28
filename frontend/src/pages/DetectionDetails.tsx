import { DashboardLayout } from "@/components/DashboardLayout";
import { detectionStates, liveStateSignals } from "@/lib/mockData";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const DetectionDetails = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Detection Details</h1>
          <p className="text-sm text-muted-foreground mt-1">How each cognitive state is identified and classified</p>
        </div>

        {/* Live State Banner */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`glass-card rounded-xl p-4 border-l-4 border-${detectionStates.find(s => s.state.toLowerCase() === liveStateSignals.state)?.color}`}>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold text-foreground">Live Detection active</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full bg-cognitive-${liveStateSignals.state}/10 text-cognitive-${liveStateSignals.state} font-medium capitalize`}>
              Currently in {liveStateSignals.state}
            </span>
          </div>
          <div className="flex gap-4 flex-wrap">
            {liveStateSignals.signals.map((sig, idx) => (
              <div key={idx} className={`flex items-center gap-1.5 text-xs ${sig.firing ? 'text-primary' : 'text-muted-foreground'}`}>
                {sig.firing ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-current opacity-50" />}
                {sig.label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* State Transition Diagram */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-display font-semibold text-foreground mb-4">State Transition Flow</h3>
          <div className="flex flex-wrap items-center justify-center gap-4 py-4 md:gap-8">
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs px-3 py-1.5 rounded-full bg-cognitive-idle/10 text-cognitive-idle border border-cognitive-idle/20 font-medium">Idle</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs px-3 py-1.5 rounded-full bg-cognitive-focus/10 text-cognitive-focus border border-cognitive-focus/20 font-medium shadow-glow-primary">Focus</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs px-3 py-1.5 rounded-full bg-cognitive-distracted/10 text-cognitive-distracted border border-cognitive-distracted/20 font-medium">Distracted</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs px-3 py-1.5 rounded-full bg-cognitive-confused/10 text-cognitive-confused border border-cognitive-confused/20 font-medium">Confused</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs px-3 py-1.5 rounded-full bg-cognitive-fatigued/10 text-cognitive-fatigued border border-cognitive-fatigued/20 font-medium">Fatigued</span>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {detectionStates.map((item, i) => (
            <motion.div
              key={item.state}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-3 w-3 rounded-full bg-${item.color}`} />
                <h3 className="text-lg font-display font-semibold text-foreground">{item.state}</h3>
              </div>

              <p className="text-sm text-muted-foreground mb-5">{item.definition}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Detection Signals</h4>
                  <ul className="space-y-2">
                    {item.signals.map((signal) => (
                      <li key={signal} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5 text-xs">▸</span>
                        <span className="text-xs text-muted-foreground">{signal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Thresholds</h4>
                  <div className="space-y-2">
                    {Object.entries(item.thresholds).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
                        <span className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-xs font-medium text-foreground">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Example Scenario</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed bg-muted/50 p-3 rounded-lg">{item.scenario}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DetectionDetails;
