import { DashboardLayout } from "@/components/DashboardLayout";
import { behaviorData } from "@/lib/mockData";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell
} from "recharts";
import { useState } from "react";
import { 
  Youtube, 
  MessageCircle, 
  Instagram, 
  Twitter, 
  Star, 
  Trophy, 
  Zap, 
  Clock, 
  AlertCircle, 
  Inbox,
  Share2,
  TrendingUp,
  Activity
} from "lucide-react";

const chartTooltipStyle = {
  backgroundColor: 'white',
  border: 'none',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  fontSize: '12px',
  color: '#333',
};

const BehaviorAnalytics = () => {
  const [typingWeek, setTypingWeek] = useState<'current'|'last'>('current');
  const typingData = typingWeek === 'current' ? behaviorData.typingPattern : behaviorData.typingPatternLastWeek;

  const heatmapData = [
    { label: "Hot", color: "bg-red-100/50", text: "text-red-500" },
    { label: "Warm", color: "bg-orange-100/50", text: "text-orange-500" },
    { label: "Peak", color: "bg-orange-400/80", text: "text-white" },
    { label: "Warm", color: "bg-orange-100/50", text: "text-orange-500" },
    { label: "Cool", color: "bg-slate-100/50", text: "text-slate-500" },
    { label: "", color: "bg-transparent", text: "" },
    { label: "", color: "bg-transparent", text: "" },
    { label: "High", color: "bg-yellow-400/80", text: "text-white" },
    { label: "", color: "bg-red-50/30", text: "" },
    { label: "", color: "bg-transparent", text: "" },
    { label: "", color: "bg-transparent", text: "" },
    { label: "", color: "bg-transparent", text: "" },
    { label: "", color: "bg-yellow-50/50", text: "" },
    { label: "", color: "bg-transparent", text: "" },
    { label: "", color: "bg-transparent", text: "" },
  ];

  const focusData = [
    { hour: "8am", score: 20, color: "#e6fffa" },
    { hour: "9am", score: 35, color: "#e6fffa" },
    { hour: "10am", score: 95, color: "#8a70ff", star: true },
    { hour: "11am", score: 90, color: "#8a70ff", star: true },
    { hour: "12pm", score: 15, color: "#fff5f5" },
    { hour: "1pm", score: 25, color: "#fff5f5" },
    { hour: "2pm", score: 40, color: "#e6fffa" },
    { hour: "3pm", score: 65, color: "#2ecc71", star: true },
    { hour: "4pm", score: 30, color: "#e6fffa" },
    { hour: "5pm", score: 20, color: "#f3f4f6" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-display font-bold text-slate-900">Behavior Analytics</h1>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-slate-500 mt-1">Deep dive into your digital behavior patterns</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Data
            </div>
            <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
              <Activity className="h-5 w-5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Golden Focus Window */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                Your Golden Focus Window <span className="text-sm">⏳</span>
              </h3>
              <p className="text-sm text-slate-400">Peak focus hours based on last 30 days</p>
            </div>
          </div>

          <div className="h-32 mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={focusData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <Bar dataKey="score" radius={[8, 8, 8, 8]}>
                  {focusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
                <XAxis 
                  dataKey="hour" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }}
                  interval={0}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stars under bars */}
          <div className="flex justify-between px-2 mb-6">
            {focusData.map((d, i) => (
              <div key={i} className="flex justify-center flex-1 px-1">
                {d.star && (
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-indigo-50/50 border border-indigo-100 px-4 py-2 rounded-xl">
              <span className="text-sm shrink-0">⌛ Best: 10am–12pm (Score 91)</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50/50 border border-emerald-100 px-4 py-2 rounded-xl">
              <span className="text-sm shrink-0">🥈 Runner-up: 3pm–4pm (Score 84)</span>
            </div>
          </div>
        </motion.div>

        {/* Grid for Heatmap and Typing */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Heatmap */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight mb-1">Mouse Movement Heatmap</h3>
            <p className="text-sm text-slate-400 mb-8">Cursor density zones</p>
            
            <div className="grid grid-cols-5 gap-2 mb-6">
              {heatmapData.map((item, i) => (
                <div key={i} className={`h-12 rounded-lg flex items-center justify-center text-[10px] font-bold uppercase tracking-wider ${item.color} ${item.text}`}>
                  {item.label}
                </div>
              ))}
            </div>

            <div className="flex justify-between text-[10px] font-bold text-indigo-400 uppercase tracking-widest px-1">
              <span>Far Left</span>
              <span>Left</span>
              <span className="text-indigo-600">Center</span>
              <span>Right</span>
              <span>Far Right</span>
            </div>
          </motion.div>

          {/* Typing Pattern */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight mb-1">Typing Pattern</h3>
                <p className="text-sm text-slate-400">Keys/sec over time</p>
              </div>
              <div className="flex p-1 bg-slate-50 border border-slate-100 rounded-xl">
                <button 
                  onClick={() => setTypingWeek('current')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${typingWeek === 'current' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200' : 'text-slate-400'}`}
                >
                  This Week
                </button>
                <button 
                  onClick={() => setTypingWeek('last')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${typingWeek === 'last' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200' : 'text-slate-400'}`}
                >
                  Last Week
                </button>
              </div>
            </div>
            
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={typingData}>
                  <defs>
                    <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8a70ff" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#8a70ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                  />
                  <YAxis hide />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Area 
                    type="monotone" 
                    dataKey="speed" 
                    stroke="#8a70ff" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorSpeed)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </motion.div>
        </div>

        {/* Top Distractions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight mb-1">Top Distraction Sources</h3>
              <p className="text-sm text-slate-400">Apps pulling focus away this week</p>
            </div>
            <div className="bg-red-50 text-red-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-red-100">
              Watch out
            </div>
          </div>

          <div className="space-y-6">
            {[
              { name: "YouTube", value: 34, color: "bg-red-400", icon: <Youtube className="h-5 w-5 text-slate-700" /> },
              { name: "WhatsApp", value: 28, color: "bg-orange-400", icon: <MessageCircle className="h-5 w-5 text-slate-700" /> },
              { name: "Instagram", value: 18, color: "bg-pink-300", icon: <Instagram className="h-5 w-5 text-slate-700" /> },
              { name: "Twitter/X", value: 12, color: "bg-red-200", icon: <Twitter className="h-5 w-5 text-slate-700" /> },
            ].map((app) => (
              <div key={app.name} className="flex items-center gap-6">
                <div className="w-32 flex items-center gap-3">
                  {app.icon}
                  <span className="text-sm font-bold text-slate-700">{app.name}</span>
                </div>
                <div className="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${app.value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${app.color}`}
                  />
                </div>
                <div className="w-12 text-sm font-bold text-slate-800 text-right">
                  {app.value}%
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Avg Focus Score", value: "74", unit: "/100", icon: <Zap className="h-4 w-4" />, color: "border-l-indigo-500" },
            { label: "Focus Hours", value: "5.4", unit: "hrs", icon: <Clock className="h-4 w-4" />, color: "border-l-emerald-500" },
            { label: "Distraction Events", value: "18", unit: "today", icon: <AlertCircle className="h-4 w-4" />, color: "border-l-rose-500" },
            { label: "Sessions Completed", value: "7", unit: "sessions", icon: <Inbox className="h-4 w-4" />, color: "border-l-blue-500" },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 border-l-[6px] ${stat.color} flex flex-col justify-between`}
            >
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{stat.label}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-800 tracking-tighter">{stat.value}</span>
                <span className="text-xs font-medium text-slate-400">{stat.unit}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BehaviorAnalytics;
