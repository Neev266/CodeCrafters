import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { emotionTimelineBlocks, emotionsInAction, moodCalendar, emotionDistribution } from "@/lib/mockData";
import EmotionCam from "@/components/EmotionCam";

const EmotionAnalysis = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black tracking-tight text-slate-800 uppercase">Emotion Analysis</h2>
          <p className="text-sm font-medium text-slate-400">Real-time facial analysis and behavioral inference</p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          
          {/* Live Emotion Engine */}
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="w-full"
          >
            <EmotionCam />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Emotion Distribution */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8 pb-10 glass-card rounded-[2.5rem] border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-slate-800">EMOTION BREAKDOWN</h3>
                  <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">Distribution today</p>
                </div>
              </div>
              
              <div className="space-y-7">
                {emotionDistribution.map((item) => (
                  <div key={item.label} className="group">
                    <div className="flex justify-between items-center mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg group-hover:scale-125 transition-transform duration-300">{item.emoji}</span>
                        <span className="text-sm font-bold text-slate-600 tracking-tight">{item.label}</span>
                      </div>
                      <span className="text-sm font-black text-slate-800" style={{ color: item.color }}>{item.value}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100/50 rounded-full overflow-hidden border border-slate-50">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.05)]"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Emotions in Action */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8 pb-10 glass-card rounded-[2.5rem] border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-slate-800">EMOTIONS IN ACTION</h3>
                  <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">What each emotion triggered</p>
                </div>
              </div>

              <div className="space-y-4">
                {emotionsInAction.map((action, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-2xl border border-white/60 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-300"
                    style={{ backgroundColor: action.bgColor }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-xs font-black px-3 py-1.5 rounded-full bg-white/80 shadow-sm border border-white" style={{ color: action.color }}>
                        {action.emotion} ({action.percent}%)
                      </div>
                      <p className="text-xs font-bold text-slate-600 tracking-tight">
                        → <span className="opacity-80 group-hover:opacity-100 transition-opacity">{action.action}</span>
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Mood Calendar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 glass-card rounded-[2.5rem] border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/50"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-slate-800 uppercase">Mood Calendar — March 2025</h3>
                <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">Daily dominant emotional state</p>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-6 max-w-4xl mx-auto">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
                <div key={day} className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">{day}</div>
              ))}
              {moodCalendar.map((cell, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ scale: 1.1, rotate: [0, -2, 2, 0] }}
                  className={`aspect-square rounded-2xl flex items-center justify-center relative shadow-sm border transition-all duration-300 ${!cell.hasData ? 'bg-slate-50/30 border-slate-100/50' : 'cursor-help border-white/20'}`}
                  style={{ backgroundColor: cell.bgColor || undefined }}
                  title={cell.hasData ? `Day ${cell.day}: ${cell.emotion}` : 'No data'}
                >
                  <span className={`text-[11px] font-black ${cell.hasData ? 'text-slate-600/70' : 'text-slate-200'}`}>{cell.day}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.8 }} 
          className="pt-4 border-t border-slate-100 flex items-center gap-2 opacity-50"
        >
          <p className="text-[10px] text-muted-foreground italic">Note: Inferred states are combined with real-time facial analysis for highest accuracy.</p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default EmotionAnalysis;
