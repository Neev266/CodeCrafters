import { DashboardLayout } from "@/components/DashboardLayout";
import { detectionStates } from "@/lib/mockData";
import { motion } from "framer-motion";

const DetectionDetails = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Detection Details</h1>
          <p className="text-sm text-muted-foreground mt-1">How each cognitive state is identified and classified</p>
        </div>

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
