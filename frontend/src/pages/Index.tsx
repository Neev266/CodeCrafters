import { CognitiveStateHero } from "@/components/dashboard/CognitiveStateHero";
import { MetricsPanel } from "@/components/dashboard/MetricsPanel";
import { ContributionBreakdown } from "@/components/dashboard/ContributionBreakdown";
import { CognitiveTimeline } from "@/components/dashboard/CognitiveTimeline";
import { SystemActionsPanel, NotificationBuffer } from "@/components/dashboard/ActionsPanels";
import { DashboardLayout } from "@/components/DashboardLayout";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Cognitive Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time cognitive state monitoring and analysis</p>
        </div>

        <CognitiveStateHero />
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
