import { DashboardLayout } from "@/components/DashboardLayout";
import { automationLogs, type CognitiveState } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, X } from "lucide-react";

const stateFilters: Array<{ label: string; value: CognitiveState | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Focus', value: 'focus' },
  { label: 'Distracted', value: 'distracted' },
  { label: 'Confused', value: 'confused' },
  { label: 'Fatigued', value: 'fatigued' },
  { label: 'Idle', value: 'idle' },
];

const AutomationLogs = () => {
  const [filter, setFilter] = useState<CognitiveState | 'all'>('all');
  const [showModal, setShowModal] = useState(false);

  const filtered = filter === 'all' ? automationLogs : automationLogs.filter(l => l.state === filter);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Automation Logs</h1>
            <p className="text-sm text-muted-foreground mt-1">History of triggered actions and system responses</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-glow-primary"
          >
            <Plus className="w-4 h-4" />
            Add Custom Rule
          </button>
        </div>

        {/* Effectiveness Stat Bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-primary/20 flex flex-shrink-0 items-center justify-center">
            <span className="text-lg">🎯</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">8 of 11 automated actions improved focus within 3 minutes</h3>
            <p className="text-xs text-muted-foreground mt-0.5">73% overall automation effectiveness this week</p>
          </div>
        </motion.div>

        <div className="flex items-center gap-2 flex-wrap">
          {stateFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`text-xs px-3 py-1.5 rounded-full transition-all duration-200 font-medium ${
                filter === f.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Timestamp</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">State</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Action</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Trigger</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Result</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, i) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/20 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-3 text-xs text-muted-foreground font-mono">{log.timestamp}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-cognitive-${log.state}/10 text-cognitive-${log.state} font-medium capitalize`}>
                        {log.state}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-foreground font-medium">
                      <div className="flex items-center justify-between">
                        {log.action}
                        {(log as any).via_n8n && (
                          <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-400 border border-teal-500/30">
                            n8n
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-xs text-muted-foreground">{log.trigger}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-medium ${log.result === 'Success' ? 'text-success' : log.result === 'Dismissed' ? 'text-muted-foreground' : 'text-warning'}`}>
                        {log.result}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-md rounded-2xl border border-border shadow-lg overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
                <h3 className="font-display font-semibold text-foreground">Add Custom Rule</h3>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">Trigger Condition</label>
                  <select className="w-full bg-muted border border-border/50 rounded-lg p-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none">
                    <option>When state is Distracted</option>
                    <option>When state is Fatigued</option>
                    <option>When Focus drops below 50%</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">Duration</label>
                  <input type="text" placeholder="e.g. 5 mins" className="w-full bg-muted border border-border/50 rounded-lg p-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">Action</label>
                  <select className="w-full bg-muted border border-border/50 rounded-lg p-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none">
                    <option>Trigger n8n Webhook</option>
                    <option>Send Slack Message</option>
                    <option>Block URLs</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">Notification Target</label>
                  <input type="text" placeholder="Webhook URL or #channel" className="w-full bg-muted border border-border/50 rounded-lg p-2 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none" />
                </div>
                <button onClick={() => setShowModal(false)} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium p-2 rounded-lg mt-2 transition-colors">
                  Save Rule
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default AutomationLogs;
