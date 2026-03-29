import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { useAuth } from "./hooks/useAuth";

import Index from "./pages/Index";
import BehaviorAnalytics from "./pages/BehaviorAnalytics";
import DetectionDetails from "./pages/DetectionDetails";
import AutomationLogs from "./pages/AutomationLogs";
import EmotionAnalysis from "./pages/EmotionAnalysis";
import SettingsPage from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RecoveryGames from "./pages/RecoveryGames";
import WeeklyReport from "./pages/WeeklyReport";
import DigitalTimeline from "./pages/DigitalTimeline";
import Teams from "./pages/Teams";
import ChatBotPage from "./pages/ChatBotPage";

import { EngineProvider } from "./context/EngineContext";

const queryClient = new QueryClient();

const App = () => {
  const user = useAuth();

  if (user === undefined) return <div>Loading...</div>;

  return (
    <QueryClientProvider client={queryClient}>
      <EngineProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <Routes>
            {/* 🔐 PUBLIC ROUTES */}
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

            {/* 🔒 PROTECTED ROUTES */}
            <Route path="/" element={user ? <Index /> : <Navigate to="/login" />} />
            <Route path="/analytics" element={user ? <BehaviorAnalytics /> : <Navigate to="/login" />} />
            <Route path="/detection" element={user ? <DetectionDetails /> : <Navigate to="/login" />} />
            <Route path="/logs" element={user ? <AutomationLogs /> : <Navigate to="/login" />} />
            <Route path="/emotions" element={user ? <EmotionAnalysis /> : <Navigate to="/login" />} />
            <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/login" />} />
            <Route path="/games" element={user ? <RecoveryGames /> : <Navigate to="/login" />} />
            <Route path="/report" element={user ? <WeeklyReport /> : <Navigate to="/login" />} />
            <Route path="/timeline" element={user ? <DigitalTimeline /> : <Navigate to="/login" />} />
            <Route path="/teams" element={user ? <Teams /> : <Navigate to="/login" />} />
            <Route path="/chatbot" element={user ? <ChatBotPage /> : <Navigate to="/login" />} />

            {/* 🔁 DEFAULT REDIRECT */}
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
          </Routes>

        </TooltipProvider>
      </EngineProvider>
    </QueryClientProvider>
  );
};

export default App;