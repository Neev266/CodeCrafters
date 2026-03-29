import React, { useState } from "react";
import { db as firestoreDb } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { ChevronLeft, Rocket, ShieldCheck, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CreateTeamProps {
  onBack: () => void;
  userUid: string;
}

export function CreateTeam({ onBack, userUid }: CreateTeamProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("School");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    
    // Fail-safe ID generation
    const teamId = (typeof window !== 'undefined' && window.crypto && typeof window.crypto.randomUUID === 'function')
      ? window.crypto.randomUUID()
      : `team_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
    
    const teamCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    try {
      console.log("🚀 STARTING TEAM CREATION", { teamId, teamCode, name, category, userUid });
      if (!userUid) throw new Error("User context is not ready. Please refresh.");

      // 1. Create Team Document
      const teamRef = doc(firestoreDb, "teams", teamId);
      const p1 = setDoc(teamRef, {
        teamId,
        teamName: name.trim(),
        teamCode,
        category,
        members: [userUid],
        createdAt: new Date().toISOString(),
      });
      console.log("✅ TEAM DOC CREATED (Local)");

      // 2. Link User to Team (Using setDoc + merge as fail-safe)
      const userRef = doc(firestoreDb, "users", userUid);
      const p2 = setDoc(userRef, {
        teamId,
        role: "admin",
      }, { merge: true });
      console.log("✅ USER DOC UPDATED (Local)");

      // Prevent UI hang by waiting max 1.5s for server sync
      await Promise.race([
        Promise.all([p1, p2]),
        new Promise((resolve) => setTimeout(resolve, 1500))
      ]);

      toast({
        title: "Team Created! 🚀",
        description: `Your team "${name}" is ready. Share code: ${teamCode}`,
      });
    } catch (err: any) {
      console.error("❌ TEAM CREATION FAILED:", err);
      const msg = err.message || "Connection to Firestore failed. Check your network.";
      toast({
        variant: "destructive",
        title: "Creation Error",
        description: msg,
      });
      alert(`Critical Error during Team Creation: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-xl mx-auto bg-white rounded-[40px] p-10 shadow-2xl border border-slate-100"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8 group">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-black uppercase tracking-widest">Back to Lobby</span>
      </button>

      <div className="flex flex-col gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Rocket className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Deployment Phase</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Establish Your Alpha Team</h2>
          <p className="text-sm text-slate-500 leading-relaxed">Define your workspace and rally your teammates for the ultimate focus competition.</p>
        </div>

        <form onSubmit={handleCreate} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase px-1">Team Identity</label>
            <input 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Neurons United"
              className="w-full bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl p-5 text-base font-medium placeholder:text-slate-300 transition-all outline-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase px-1">Sector / Category</label>
            <div className="grid grid-cols-3 gap-3">
              {["School", "College", "Corporate"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    category === cat 
                      ? "bg-primary text-white shadow-xl shadow-primary/30 scale-[1.05]" 
                      : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              disabled={loading || !name.trim()}
              className="w-full bg-slate-900 text-white p-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs shadow-2xl shadow-slate-900/20 hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <Rocket className={`w-4 h-4 ${loading ? 'animate-bounce' : ''}`} />
              {loading ? "Initializing..." : "Launch Team Workspace"}
            </button>
          </div>
        </form>

        <div className="flex items-start gap-4 p-5 bg-amber-50 rounded-3xl border border-amber-100/50">
          <ShieldCheck className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">Alpha Admin Status</p>
            <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
              Creating a team grants you Admin rights. You'll be able to manage members and moderate the real-time focus stream.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
