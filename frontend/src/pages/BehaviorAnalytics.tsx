import { DashboardLayout } from "@/components/DashboardLayout";
import { behaviorData } from "@/lib/mockData";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const chartTooltipStyle = {
  backgroundColor: 'hsl(220, 25%, 10%)',
  border: '1px solid hsl(220, 20%, 16%)',
  borderRadius: '8px',
  fontSize: '12px',
  color: 'hsl(220, 15%, 90%)',
};

const BehaviorAnalytics = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Behavior Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Deep dive into raw behavioral signals</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-display font-semibold text-foreground mb-1">Typing Pattern</h3>
            <p className="text-xs text-muted-foreground mb-4">Speed and error rate over time</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={behaviorData.typingPattern}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 16%)" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 55%)' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(220, 10%, 55%)' }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <defs>
                    <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="speed" stroke="hsl(199, 89%, 48%)" fill="url(#speedGrad)" strokeWidth={2} name="Speed (keys/s)" />
                  <Area type="monotone" dataKey="errors" stroke="hsl(0, 72%, 51%)" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" name="Errors (%)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-display font-semibold text-foreground mb-1">Mouse Movement Heatmap</h3>
            <p className="text-xs text-muted-foreground mb-4">Activity density across screen regions</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 16%)" />
                  <XAxis dataKey="x" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 55%)' }} tickLine={false} axisLine={false} name="X" />
                  <YAxis dataKey="y" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 55%)' }} tickLine={false} axisLine={false} name="Y" />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Scatter data={behaviorData.mouseHeatmap} fill="hsl(172, 66%, 50%)" opacity={0.6} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-display font-semibold text-foreground mb-1">Tab Switching Frequency</h3>
            <p className="text-xs text-muted-foreground mb-4">Context switches per hour</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={behaviorData.tabSwitching}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 16%)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 55%)' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(220, 10%, 55%)' }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="count" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} opacity={0.8} name="Switches" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-display font-semibold text-foreground mb-1">Idle Time Distribution</h3>
            <p className="text-xs text-muted-foreground mb-4">Duration of inactive periods</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={behaviorData.idleDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 16%)" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 55%)' }} tickLine={false} axisLine={false} />
                  <YAxis dataKey="range" type="category" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 55%)' }} tickLine={false} axisLine={false} width={70} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="count" fill="hsl(280, 67%, 55%)" radius={[0, 4, 4, 0]} opacity={0.8} name="Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BehaviorAnalytics;
