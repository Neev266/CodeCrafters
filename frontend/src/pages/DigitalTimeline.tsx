import { DashboardLayout } from "@/components/DashboardLayout";
import { timelineStories, screenTimeSummary, topAppsToday } from "@/lib/mockData";
import { motion } from "framer-motion";
import { Clock, Play, Brain, Coffee, ShieldAlert, Sparkles, Activity } from "lucide-react";

export default function DigitalTimeline() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Your Digital Story</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-narrated insights into how you spend your screen time</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Timeline Feed */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2 uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-primary" /> Today's Narrative
            </h2>
            
            <div className="relative pl-6 ml-2 space-y-10 border-l border-border/50 before:absolute before:inset-0 before:w-px before:bg-gradient-to-b before:from-primary/50 before:to-transparent before:-left-[1px]">
              {timelineStories.map((story, idx) => {
                const isFocus = story.state === 'focus';
                const isDistracted = story.state === 'distracted';
                const Icon = isFocus ? Brain : isDistracted ? Activity : story.state === 'idle' ? Coffee : ShieldAlert;
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={story.id} 
                    className="relative group"
                  >
                    {/* Timeline Node */}
                    <div className={`absolute -left-[35px] w-6 h-6 rounded-full border-4 border-background flex items-center justify-center bg-cognitive-${story.state} shadow-glow-${isFocus ? 'primary' : 'muted'}`}>
                      <Icon className="w-3 h-3 text-background" />
                    </div>

                    <div className="glass-card-hover rounded-xl p-5 border border-border/40 ml-2 group-hover:border-primary/30 transition-colors">
                      <div className="flex items-center justify-between mb-3 border-b border-border/30 pb-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cognitive-${story.state}/10 text-cognitive-${story.state}`}>
                            {story.state}
                          </span>
                          <span className="text-xs font-medium text-muted-foreground">{story.start} - {story.end}</span>
                        </div>
                        <div className="flex items-center gap-1.5" title="Detected Emotion">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: story.emotion.color }} />
                          <span className="text-[10px] text-muted-foreground">{story.emotion.label}</span>
                        </div>
                      </div>

                      <p className="text-sm text-foreground/90 font-medium leading-relaxed mb-4">
                        "{story.narrative}"
                      </p>

                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-1.5 h-1.5 rounded-full w-full overflow-hidden bg-muted/40">
                          {story.apps.map((app, i) => (
                            <div 
                              key={app.name} 
                              className={`h-full ${i===0 ? 'bg-primary' : i===1 ? 'bg-secondary' : 'bg-muted-foreground'}`}
                              style={{ width: `${app.percent}%`, opacity: 1 - (i * 0.2) }}
                              title={`${app.name} (${app.percent}%)`}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            {story.apps.map((app) => (
                              <span key={app.name} className="text-[10px] text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded">
                                {app.name}
                              </span>
                            ))}
                          </div>
                          {story.automation && (
                            <span className="text-[10px] text-primary/80 flex items-center gap-1 font-medium bg-primary/5 px-2 py-0.5 border border-primary/10 rounded-full">
                              <Play className="w-2.5 h-2.5" /> {story.automation}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: App Usage Summary */}
          <div className="space-y-6 lg:sticky lg:top-6">
             <div className="glass-card rounded-xl p-6">
                <h3 className="text-sm font-semibold text-foreground mb-4">App Usage Distribution</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-muted/30 border border-border/40 rounded-lg p-3 text-center">
                     <p className="text-xl font-display font-bold text-foreground">{screenTimeSummary.productive}%</p>
                     <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Productive</p>
                  </div>
                  <div className="bg-muted/30 border border-border/40 rounded-lg p-3 text-center">
                     <p className="text-xl font-display font-bold text-foreground">{screenTimeSummary.distraction}%</p>
                     <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Distraction</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {topAppsToday.map((app) => (
                    <div key={app.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                       <div className="flex items-center gap-3">
                          <span className="text-lg bg-background border border-border/50 rounded-md w-8 h-8 flex items-center justify-center shadow-sm">{app.emoji}</span>
                          <div>
                            <p className="text-sm font-medium text-foreground">{app.name}</p>
                            <p className="text-[10px] text-muted-foreground">{app.time}</p>
                          </div>
                       </div>
                       <div className="text-right">
                         <span className={`text-xs font-semibold ${app.type === 'productive' ? 'text-primary' : 'text-warning'}`}>{app.percent}%</span>
                       </div>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 text-center">
               <ShieldAlert className="w-6 h-6 text-primary mx-auto mb-2" />
               <h4 className="text-sm font-semibold text-primary mb-1">Privacy First</h4>
               <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">Screenshots and window titles are analyzed locally. Narratives are generated via local LLM or secure API.</p>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
