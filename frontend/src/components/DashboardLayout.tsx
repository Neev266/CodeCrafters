import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { FloatingEngineControl } from "./FloatingEngineControl";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background font-body relative">
        <AppSidebar />
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {children}
        </main>
        <FloatingEngineControl />
      </div>
    </SidebarProvider>
  );
}
