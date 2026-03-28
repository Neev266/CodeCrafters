import { motion } from "framer-motion";
import { systemActions, queuedNotifications } from "@/lib/mockData";

export function SystemActionsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="glass-card rounded-xl p-6"
    >
      <h3 className="text-sm font-display font-semibold text-foreground mb-1">System Actions</h3>
      <p className="text-xs text-muted-foreground mb-4">Automated responses to state changes</p>
      <div className="space-y-3">
        {systemActions.map((action, i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
            <span className="text-lg">{action.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground font-medium truncate">{action.action}</p>
              <p className="text-xs text-muted-foreground">{action.time}</p>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full bg-cognitive-${action.state}/10 text-cognitive-${action.state} font-medium`}>
              {action.state}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function NotificationBuffer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-display font-semibold text-foreground mb-0.5">Notification Buffer</h3>
          <p className="text-xs text-muted-foreground">Queued during focus mode</p>
        </div>
        <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
          {queuedNotifications.length} queued
        </span>
      </div>
      <div className="space-y-3">
        {queuedNotifications.map((notif, i) => (
          <div key={i} className="flex items-start gap-3 py-2 border-b border-border/30 last:border-0">
            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground flex-shrink-0">
              {notif.app[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground font-medium truncate">{notif.title}</p>
              <p className="text-xs text-muted-foreground truncate">{notif.preview}</p>
            </div>
            <span className="text-[10px] text-muted-foreground flex-shrink-0">{notif.time}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
