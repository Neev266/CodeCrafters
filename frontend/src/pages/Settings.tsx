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
    {
      title: 'Integrations & Webhooks',
      items: [
        { label: 'n8n Webhook URL', isInput: true, value: 'https://n8n.example.com/webhook/focus-events', isVerified: true },
        { label: 'Block WhatsApp Notifications', isToggle: true, checked: true },
        { label: 'Mute Slack during Focus Mode', isToggle: true, checked: true },
        { label: 'Disconnect Gmail', isToggle: false, isAction: true, value: 'Revoke Access' },
      ],
    },
    {
      title: 'Focus Goals & Gamification',
      items: [
        { label: 'Daily Focus Goal (hours)', isInput: true, value: '4' },
        { label: 'Streak Reminder Time', isInput: true, type: 'time', value: '09:00' },
        { label: 'Show Streak On Dashboard', isToggle: true, checked: true },
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
              {section.items.map((item: any) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0 min-h-[56px]">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  
                  {item.isToggle ? (
                    <div className={`w-9 h-5 rounded-full flex items-center px-0.5 cursor-pointer ${item.checked ? 'bg-primary' : 'bg-muted border border-border'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${item.checked ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                  ) : item.isInput ? (
                    <div className="flex items-center gap-2">
                       <input 
                         type={item.type || "text"} 
                         defaultValue={item.value} 
                         className="bg-background border border-border rounded-md px-3 py-1 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none max-w-[250px]"
                       />
                       {item.isVerified && <div className="w-2 h-2 rounded-full bg-success" title="Verified connection" />}
                       {item.label.includes('Webhook') && (
                         <button className="text-[10px] bg-secondary text-foreground px-2 py-1 rounded border border-border hover:bg-muted">Test</button>
                       )}
                    </div>
                  ) : item.isAction ? (
                    <button className="text-xs text-destructive hover:underline px-2 py-1">{item.value}</button>
                  ) : (
                    <span className="text-sm font-medium text-foreground bg-muted px-3 py-1 rounded-md">{item.value}</span>
                  )}
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
