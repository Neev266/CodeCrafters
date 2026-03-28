import { motion } from "framer-motion";
import { contributions } from "@/lib/mockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export function ContributionBreakdown() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card rounded-xl p-6"
    >
      <h3 className="text-sm font-display font-semibold text-foreground mb-1">Signal Contribution</h3>
      <p className="text-xs text-muted-foreground mb-4">Why the system classified this state</p>

      <div className="flex items-center gap-6">
        <div className="w-32 h-32 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={contributions}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={55}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {contributions.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(220, 25%, 10%)',
                  border: '1px solid hsl(220, 20%, 16%)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'hsl(220, 15%, 90%)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2.5">
          {contributions.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <div className="flex-1 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{item.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                  <span className="text-xs font-medium text-foreground w-8 text-right">{item.value}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
