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

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Cognitive Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Real-time cognitive state monitoring and analysis</p>
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
