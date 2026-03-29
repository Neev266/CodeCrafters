import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db as firestoreDb } from "@/lib/firebase";
import { CreateTeam } from "@/components/teams/CreateTeam";
import { JoinTeam } from "@/components/teams/JoinTeam";
import { TeamLeaderboard } from "@/components/teams/TeamLeaderboard";
import { Users, Plus, UserPlus } from "lucide-react";

export default function Teams() {
  const user = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"lobby" | "create" | "join">("lobby");

  useEffect(() => {
    if (!user) return;

    // Use a robust listener that handles document creation on the fly
    const unsub = onSnapshot(doc(firestoreDb, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        // Essential: Initialize user doc if missing to avoid downstream write failures
        setDoc(doc(firestoreDb, "users", user.uid), {
          uid: user.uid,
          displayName: user.displayName || user.email?.split("@")[0] || "User",
          attentionScore: Math.floor(Math.random() * 20) + 70, 
          streak: 0,
        }, { merge: true }).catch(console.error);
      }
      setLoading(false);
    }, (err) => {
      console.error("Firestore User Hook Error:", err);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="animate-pulse text-primary font-bold tracking-widest uppercase text-xs">Syncing Alpha Workspace...</div>
        </div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-2xl">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">Community Leaderboard</h1>
          </div>
          <p className="text-sm text-muted-foreground ml-1">Compete with your team and flex your cognitive focus score.</p>
        </header>

        <AnimatePresence mode="wait">
          {userData?.teamId ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <TeamLeaderboard teamId={userData.teamId} user={userData} />
            </motion.div>
          ) : (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="pt-8"
            >
              {view === "lobby" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <button 
                    onClick={() => setView("create")}
                    className="glass-card p-12 flex flex-col items-center justify-center text-center gap-8 group rounded-[40px] border-2 border-dashed border-slate-200 hover:border-primary/50 transition-all hover:bg-white active:scale-95 shadow-xl shadow-transparent hover:shadow-primary/5"
                  >
                    <div className="w-24 h-24 bg-primary rounded-[30px] flex items-center justify-center shadow-2xl shadow-primary/40 group-hover:rotate-6 transition-transform">
                      <Plus className="w-12 h-12 text-white" />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold text-slate-900">Create Team</h2>
                      <p className="text-sm text-slate-500 max-w-xs leading-relaxed">Establish a new focus workspace for your school, college, or corporate squad.</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setView("join")}
                    className="glass-card p-12 flex flex-col items-center justify-center text-center gap-8 group rounded-[40px] border-2 border-dashed border-slate-200 hover:border-green-500/50 transition-all hover:bg-white active:scale-95 shadow-xl shadow-transparent hover:shadow-green-500/5"
                  >
                    <div className="w-24 h-24 bg-green-500 rounded-[30px] flex items-center justify-center shadow-2xl shadow-green-500/40 group-hover:-rotate-6 transition-transform">
                      <UserPlus className="w-12 h-12 text-white" />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold text-slate-900">Join Existing</h2>
                      <p className="text-sm text-slate-500 max-w-xs leading-relaxed">Enter a 6-character access code to instantly sync with your teammates.</p>
                    </div>
                  </button>
                </div>
              ) : view === "create" ? (
                <div className="max-w-2xl mx-auto w-full">
                  <CreateTeam onBack={() => setView("lobby")} userUid={user?.uid!} />
                </div>
              ) : (
                <div className="max-w-2xl mx-auto w-full">
                  <JoinTeam onBack={() => setView("lobby")} userUid={user?.uid!} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
