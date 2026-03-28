import { motion } from "framer-motion";
import { metrics as mockMetrics } from "@/lib/mockData";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { useEngine } from "@/context/EngineContext";

const statusColors: Record<string, string> = {
  good: 'bg-success',
  warning: 'bg-warning',
  critical: 'bg-destructive',
};

const statusChartColors: Record<string, string> = {
  good: 'hsl(142, 71%, 45%)',
  warning: 'hsl(38, 92%, 50%)',
  critical: 'hsl(0, 72%, 51%)',
};

export function MetricsPanel() {
  const { cogniflowActive, metrics: liveMetrics } = useEngine();

  const activeMetrics = cogniflowActive ? [
    { id: 'typing', label: 'Typing Speed', value: liveMetrics.typingSpeed, unit: 'kps', status: 'good' as const, trend: [5, 6, 5, 7, liveMetrics.typingSpeed] },
    { id: 'backspace', label: 'Backspace Rate', value: liveMetrics.backspaceRate, unit: 'err', status: 'good' as const, trend: [3, 4, 3, 5, liveMetrics.backspaceRate] },
    { id: 'mouse', label: 'Mouse Variance', value: liveMetrics.mouseVariance, unit: 'px/s', status: liveMetrics.mouseVariance > 50 ? 'warning' : 'good' as const, trend: [20, 40, 30, 60, liveMetrics.mouseVariance] },
    { id: 'tabs', label: 'Tab Switching', value: liveMetrics.tabSwitches, unit: 'ops', status: 'good' as const, trend: [1, 2, 1, 3, liveMetrics.tabSwitches] },
    { id: 'idle', label: 'Idle Time', value: liveMetrics.idleTime, unit: 'sec', status: liveMetrics.idleTime > 10 ? 'warning' : 'good' as const, trend: [5, 8, 4, 12, liveMetrics.idleTime] },
    { id: 'errors', label: 'Focus Score', value: liveMetrics.focusScore, unit: 'pts', status: 'good' as const, trend: [80, 85, 90, 88, liveMetrics.focusScore] },
  ] : mockMetrics;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {activeMetrics.map((metric, i) => (
        <motion.div
          key={metric.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="glass-card-hover rounded-xl p-4 border border-white/5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{metric.label}</span>
            <div className={`h-2 w-2 rounded-full ${statusColors[metric.status]} shadow-[0_0_8px_currentColor]`} />
          </div>
          <div className="flex items-baseline gap-1 mb-3">
            <motion.span 
              key={metric.value}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-display font-bold text-foreground"
            >
              {metric.value}
            </motion.span>
            <span className="text-xs text-muted-foreground font-medium">{metric.unit}</span>
          </div>
          <div className="h-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metric.trend.map((v, j) => ({ v, i: j }))}>
                <defs>
                  <linearGradient id={`grad-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={statusChartColors[metric.status]} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={statusChartColors[metric.status]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={statusChartColors[metric.status]}
                  fill={`url(#grad-${metric.id})`}
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
