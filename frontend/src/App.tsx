import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import BehaviorAnalytics from "./pages/BehaviorAnalytics.tsx";
import DetectionDetails from "./pages/DetectionDetails.tsx";
import AutomationLogs from "./pages/AutomationLogs.tsx";
import EmotionAnalysis from "./pages/EmotionAnalysis.tsx";
import SettingsPage from "./pages/Settings.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/analytics" element={<BehaviorAnalytics />} />
          <Route path="/detection" element={<DetectionDetails />} />
          <Route path="/logs" element={<AutomationLogs />} />
          <Route path="/emotions" element={<EmotionAnalysis />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
