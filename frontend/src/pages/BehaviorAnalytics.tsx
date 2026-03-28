import { DashboardLayout } from "@/components/DashboardLayout";
import { behaviorData } from "@/lib/mockData";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ZAxis, Cell
} from "recharts";
import { useState } from "react";

const chartTooltipStyle = {
  backgroundColor: 'hsl(220, 25%, 10%)',
  border: '1px solid hsl(220, 20%, 16%)',
  borderRadius: '8px',
  fontSize: '12px',
  color: 'hsl(220, 15%, 90%)',
};

const BehaviorAnalytics = () => {
  const [typingWeek, setTypingWeek] = useState<'current'|'last'>('current');
  const typingData = typingWeek === 'current' ? behaviorData.typingPattern : behaviorData.typingPatternLastWeek;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Behavior Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Deep dive into raw behavioral signals</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-sm font-display font-semibold text-foreground mb-1">Typing Pattern</h3>
                <p className="text-xs text-muted-foreground">Speed and error rate over time</p>
              </div>
              <div className="flex bg-muted rounded-md p-1">
                <button onClick={() => setTypingWeek('current')} className={`text-[10px] px-2 py-1 rounded-sm ${typingWeek==='current' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}>This Week</button>
                <button onClick={() => setTypingWeek('last')} className={`text-[10px] px-2 py-1 rounded-sm ${typingWeek==='last' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}>Last Week</button>
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={typingData}>
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
                  <XAxis dataKey="x" type="number" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 55%)' }} tickLine={false} axisLine={false} domain={[0, 100]} ticks={[10, 30, 50, 70, 90]} tickFormatter={(val) => {
                    if (val === 10) return 'Far Left';
                    if (val === 30) return 'Left';
                    if (val === 50) return 'Center';
                    if (val === 70) return 'Right';
                    if (val === 90) return 'Far Right';
                    return '';
                  }} />
                  <YAxis dataKey="y" type="number" tick={false} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <ZAxis dataKey="intensity" range={[50, 400]} />
                  <Tooltip contentStyle={chartTooltipStyle} cursor={{ strokeDasharray: '3 3' }} />
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

        {/* Peak Focus Hours & Distractions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 glass-card rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">🏆</div>
            <h3 className="text-sm font-display font-semibold text-foreground mb-1">Your Golden Focus Window 🏆</h3>
            <p className="text-xs text-muted-foreground mb-4">Peak hours where cognitive performance is highest</p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={behaviorData.peakFocusHours}>
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 55%)' }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'hsl(220, 20%, 16%)' }}/>
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {behaviorData.peakFocusHours.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isPeak ? 'hsl(199, 89%, 48%)' : 'hsl(220, 20%, 20%)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-display font-semibold text-foreground mb-1">Top Distraction Sources</h3>
            <p className="text-xs text-muted-foreground mb-4">Apps pulling focus away</p>
            <div className="space-y-4">
              {behaviorData.topDistractions.map(item => (
                <div key={item.name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-foreground">{item.name}</span>
                    <span className="text-muted-foreground">{item.value}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BehaviorAnalytics;
