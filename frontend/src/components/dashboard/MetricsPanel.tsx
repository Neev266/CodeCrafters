import { motion } from "framer-motion";
import { metrics } from "@/lib/mockData";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

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
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass-card-hover rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground font-medium">{metric.label}</span>
            <div className={`h-2 w-2 rounded-full ${statusColors[metric.status]}`} />
          </div>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-2xl font-display font-bold text-foreground">{metric.value}</span>
            <span className="text-xs text-muted-foreground">{metric.unit}</span>
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
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
