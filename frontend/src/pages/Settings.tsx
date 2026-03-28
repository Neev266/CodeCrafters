import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";

const SettingsPage = () => {
  const sections = [
    {
      title: 'Detection Sensitivity',
      items: [
        { label: 'Focus detection threshold', value: '75%' },
        { label: 'Distraction trigger delay', value: '2 min' },
        { label: 'Fatigue detection onset', value: '3 min' },
      ],
    },
    {
      title: 'Automation Rules',
      items: [
        { label: 'Auto-enable Focus Mode', value: 'On distraction detected' },
        { label: 'Break suggestion interval', value: 'Every 90 min' },
        { label: 'Notification blocking', value: 'During focus state' },
      ],
    },
    {
      title: 'Privacy',
      items: [
        { label: 'Data retention period', value: '30 days' },
        { label: 'Anonymous mode', value: 'Disabled' },
        { label: 'Export data', value: 'JSON / CSV' },
      ],
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure detection, automation, and privacy preferences</p>
        </div>

        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-sm font-display font-semibold text-foreground mb-4">{section.title}</h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium text-foreground bg-muted px-3 py-1 rounded-md">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
