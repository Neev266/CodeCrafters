import { DashboardLayout } from "@/components/DashboardLayout";
import { automationLogs, type CognitiveState } from "@/lib/mockData";
import { motion } from "framer-motion";
import { useState } from "react";

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

  const filtered = filter === 'all' ? automationLogs : automationLogs.filter(l => l.state === filter);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Automation Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">History of triggered actions and system responses</p>
        </div>

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
                    <td className="px-6 py-3 text-sm text-foreground font-medium">{log.action}</td>
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
    </DashboardLayout>
  );
};

export default AutomationLogs;
