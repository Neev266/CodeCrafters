import { DashboardLayout } from "@/components/DashboardLayout";
import ChatBox from "@/components/ui/ChatBot";

export default function ChatBotPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">AI Companion</h1>
          </div>
          <p className="text-sm text-muted-foreground ml-1">Multilingual conversation and cognitive assistance.</p>
        </header>

        <ChatBox />
      </div>
    </DashboardLayout>
  );
}
