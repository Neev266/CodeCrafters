import { DashboardLayout } from "@/components/DashboardLayout";
import { weeklyReport } from "@/lib/mockData";
import { Download, Share2, Flame, Heart, Brain, Clock } from "lucide-react";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { toast } from "sonner";

export default function WeeklyReport() {
  const reportRef = useRef<HTMLDivElement>(null);

  const downloadReport = async () => {
    if (!reportRef.current) return;
    try {
      toast.success("Generating infographic...");
      const canvas = await html2canvas(reportRef.current, { backgroundColor: '#0f172a' }); // Match tailwind slate-900 / background
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.download = `CogniFlow-Weekly-${weeklyReport.weekRange.replace(/ /g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch(err) {
      toast.error("Failed to generate image.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Weekly Wellness Report</h1>
            <p className="text-sm text-muted-foreground mt-1">Your cognitive performance summary for {weeklyReport.weekRange}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
               onClick={downloadReport}
               className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-border/50"
            >
              <Download className="w-4 h-4" />
              Save as Image
            </button>
            <button onClick={() => toast("Share link copied to clipboard")} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-glow-primary">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {/* Infographic Container */}
        <div ref={reportRef} className="bg-background border border-border/30 rounded-2xl p-8 space-y-8 relative overflow-hidden" style={{ minWidth: '800px' }}>
          {/* Header */}
          <div className="flex justify-between items-end border-b border-border/30 pb-6">
             <div>
               <h2 className="text-3xl font-display font-bold text-foreground tracking-tight">{weeklyReport.userName}'s Week in Flow</h2>
               <p className="text-muted-foreground mt-1">{weeklyReport.weekRange}</p>
             </div>
             <div className="text-right">
               <div className="flex items-center gap-2 justify-end text-success mb-1">
                 <span className="text-xl font-bold">+{weeklyReport.productivityDelta}%</span>
                 <span className="text-sm font-medium">more productive</span>
               </div>
               <p className="text-xs text-muted-foreground">compared to last week</p>
             </div>
          </div>

          {/* Highlights Row */}
          <div className="grid grid-cols-4 gap-4">
             <div className="glass-card rounded-xl p-5 border-l-2 border-primary">
               <Clock className="w-5 h-5 text-primary mb-3" />
               <p className="text-2xl font-display font-bold text-foreground mb-1">{weeklyReport.totalFocusHours}h</p>
               <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Deep Focus Time</p>
             </div>
             <div className="glass-card rounded-xl p-5 border-l-2 border-orange-500">
               <Flame className="w-5 h-5 text-orange-500 mb-3" />
               <p className="text-2xl font-display font-bold text-foreground mb-1">{weeklyReport.streak} Days</p>
               <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Streak</p>
             </div>
             <div className="glass-card rounded-xl p-5 border-l-2" style={{ borderColor: weeklyReport.dominantEmotion.color }}>
               <Heart className="w-5 h-5 mb-3" style={{ color: weeklyReport.dominantEmotion.color }} />
               <p className="text-2xl font-display font-bold text-foreground mb-1">{weeklyReport.dominantEmotion.label}</p>
               <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Top Emotion</p>
             </div>
             <div className="glass-card rounded-xl p-5 border-l-2 border-secondary">
               <Brain className="w-5 h-5 text-secondary mb-3" />
               <p className="text-2xl font-display font-bold text-foreground mb-1">{weeklyReport.bestFocusWindow}</p>
               <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Golden Window</p>
             </div>
          </div>

          {/* Daily Breakdown */}
          <div className="glass-card rounded-xl p-6 border border-border/20">
             <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider text-center">Daily Focus Scores</h3>
             <div className="flex items-end justify-between h-40 gap-2 mb-2">
                {weeklyReport.weeklyBreakdown.map((day) => (
                  <div key={day.day} className="flex flex-col items-center flex-1 gap-2 group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-card border border-border text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10 w-max text-center">
                      <span className="font-semibold text-foreground">{day.emotion}</span>
                      <br />
                      <span className="text-muted-foreground text-[10px]">{day.automationNote}</span>
                    </div>

                    <div className="w-full flex justify-center h-28 items-end relative overflow-hidden rounded-t-md bg-muted/20 pb-1">
                      <div 
                        className="w-8 rounded-full transition-all duration-700 ease-out"
                        style={{ 
                          height: `${day.focusScore}%`, 
                          backgroundColor: day.focusScore > 80 ? 'hsl(142, 71%, 45%)' : day.focusScore > 65 ? 'hsl(199, 89%, 48%)' : 'hsl(38, 92%, 50%)',
                          opacity: 0.8
                        }}
                      />
                    </div>
                    <span className="text-sm font-display font-bold text-foreground">{day.focusScore}</span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase">{day.day}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Bottom Summary */}
          <div className="text-center pt-8 opacity-80">
            <p className="text-xs text-muted-foreground inline-flex items-center gap-2">
              <span className="w-8 h-[1px] bg-border" />
              Generated by CogniFlow OS — {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}
              <span className="w-8 h-[1px] bg-border" />
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
