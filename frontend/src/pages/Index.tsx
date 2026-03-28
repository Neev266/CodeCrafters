import { CognitiveStateHero } from "@/components/dashboard/CognitiveStateHero";
import { MetricsPanel } from "@/components/dashboard/MetricsPanel";
import { ContributionBreakdown } from "@/components/dashboard/ContributionBreakdown";
import { CognitiveTimeline } from "@/components/dashboard/CognitiveTimeline";
import { SystemActionsPanel, NotificationBuffer } from "@/components/dashboard/ActionsPanels";
import { DashboardLayout } from "@/components/DashboardLayout";
import { FocusStreakWidget } from "@/components/dashboard/FocusStreakWidget";
import { FocusScoreCard } from "@/components/dashboard/FocusScoreCard";
import { EmotionSnapshot } from "@/components/dashboard/EmotionSnapshot";
import { StressGameNudge } from "@/components/dashboard/StressGameNudge";
import { QuickActions } from "@/components/dashboard/QuickActions";

import { useEngine } from "@/context/EngineContext";
import { motion } from "framer-motion";
const Dashboard = () => {
  const { cogniflowActive } = useEngine();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-display font-bold text-foreground">Cognitive Dashboard</h1>
              {cogniflowActive && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.15)] transition-all">
                  <motion.div 
                    className="w-2 h-2 bg-green-500 rounded-full"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-green-500">System Active — Tracking</span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Real-time cognitive state monitoring and analysis</p>
          </div>
          <FocusStreakWidget />
        </div>

        <StressGameNudge />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <CognitiveStateHero />
          </div>
          <div className="flex flex-col gap-6">
            <FocusScoreCard />
            <EmotionSnapshot />
          </div>
        </div>

        <QuickActions />

        <MetricsPanel />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ContributionBreakdown />
          <CognitiveTimeline />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SystemActionsPanel />
          <NotificationBuffer />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
