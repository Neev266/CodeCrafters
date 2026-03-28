import { Brain, BarChart3, Search, ScrollText, Heart, Settings, ChevronLeft, Gamepad2, FileText, Clock } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const groups = [
  {
    label: "OVERVIEW",
    items: [
      { title: "Dashboard", url: "/", icon: Brain },
      { title: "Behavior Analytics", url: "/analytics", icon: BarChart3 },
      { title: "Detection Details", url: "/detection", icon: Search },
    ]
  },
  {
    label: "INSIGHTS",
    items: [
      { title: "Automation Logs", url: "/logs", icon: ScrollText, badge: "8" },
      { title: "Emotion Analysis", url: "/emotions", icon: Heart },
      { title: "Recovery Games", url: "/games", icon: Gamepad2 },
    ]
  },
  {
    label: "REPORTS",
    items: [
      { title: "Weekly Report", url: "/report", icon: FileText },
      { title: "Digital Timeline", url: "/timeline", icon: Clock },
      { title: "Settings", url: "/settings", icon: Settings },
    ]
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display font-bold text-base text-sidebar-foreground tracking-tight">CogniFlow</span>
              <span className="text-[10px] text-sidebar-foreground/50 font-medium">Adaptive AI</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 gap-6">
        {groups.map((group) => (
          <SidebarGroup key={group.label} className="p-0">
            {!collapsed && (
              <h3 className="text-[10px] font-bold text-sidebar-foreground/30 tracking-widest px-2 mb-2">
                {group.label}
              </h3>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="h-11 rounded-xl transition-all duration-200">
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-white/5 transition-all duration-200"
                        activeClassName="bg-primary text-white font-medium shadow-lg shadow-primary/20"
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && (
                          <div className="flex items-center justify-between flex-1">
                            <span className="text-sm">{item.title}</span>
                            {item.badge && (
                              <span className="bg-white/10 text-[10px] px-1.5 py-0.5 rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto">
        {!collapsed && (
          <div className="bg-white/5 rounded-2xl p-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              V
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-sidebar-foreground truncate">Vaibhav</span>
              <span className="text-[10px] text-sidebar-foreground/50 truncate">Pro Plan - Active</span>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
