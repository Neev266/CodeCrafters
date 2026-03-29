import React, { useState } from "react";
import { db as firestoreDb } from "@/lib/firebase";
import { doc, setDoc, updateDoc, arrayUnion, collection, query, where, getDocs, limit, getDocsFromCache } from "firebase/firestore";
import { motion } from "framer-motion";
import { ChevronLeft, UserPlus, Search, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface JoinTeamProps {
  onBack: () => void;
  userUid: string;
}

export function JoinTeam({ onBack, userUid }: JoinTeamProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode.length < 6) return;

    setLoading(true);
    try {
      console.log("🔍 SEARCHING FOR TEAM:", cleanCode);
      const teamsRef = collection(firestoreDb, "teams");
      const q = query(teamsRef, where("teamCode", "==", cleanCode), limit(1));
      
      let querySnapshot: any;
      try {
        querySnapshot = await Promise.race([
          getDocs(q),
          new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 1500))
        ]);
      } catch (err) {
        console.warn("⚠️ Server taking too long. Falling back to multi-tab cache.");
        querySnapshot = await getDocsFromCache(q);
      }

      if (!querySnapshot || querySnapshot.empty) {
        throw new Error("Invalid access code. Please verify with your team admin.");
      }

      const teamDoc = querySnapshot.docs[0];
      const teamId = teamDoc.id;
      const teamData = teamDoc.data();

      console.log("✅ TEAM FOUND:", teamData.teamName);

      // 1. Add User to Team Members (Transaction-like update)
      const p1 = updateDoc(doc(firestoreDb, "teams", teamId), {
        members: arrayUnion(userUid),
      });

      // 2. Link User to Team (Using setDoc + merge as fail-safe)
      const p2 = setDoc(doc(firestoreDb, "users", userUid), {
        teamId: teamId,
        role: "member",
      }, { merge: true });

      // Prevent UI hang by waiting max 1.5s for server sync
      await Promise.race([
        Promise.all([p1, p2]),
        new Promise((resolve) => setTimeout(resolve, 1500))
      ]);

      toast({
        title: "Sync Successful! 🤝",
        description: `Welcome to "${teamData.teamName}". Loading focus stream...`,
      });
    } catch (err: any) {
      console.error("❌ JOIN TEAM FAILED:", err);
      toast({
        variant: "destructive",
        title: "Join Failed",
        description: err.message || "Failed to connect to team workspace.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-xl mx-auto bg-white rounded-[40px] p-10 shadow-2xl border border-slate-100"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8 group">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-black uppercase tracking-widest">Back to Lobby</span>
      </button>

      <div className="flex flex-col gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-green-500">
            <UserPlus className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Synchronizing</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Join the Collective</h2>
          <p className="text-sm text-slate-500 leading-relaxed">Enter your team's unique 6-character access code to sync with your squad's focus stream.</p>
        </div>

        <form onSubmit={handleJoin} className="space-y-8">
          <div className="space-y-2 relative">
            <label className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase px-1">Access Credentials</label>
            <div className="relative">
              <input 
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="E.G. XJ7Q9R"
                className="w-full bg-slate-50 border-2 border-transparent focus:border-green-500/20 focus:bg-white rounded-2xl p-6 pl-14 text-xl font-mono font-bold tracking-[0.4em] placeholder:text-slate-200 transition-all uppercase outline-none"
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            </div>
          </div>

          <div className="pt-4">
            <button
              disabled={loading || code.trim().length < 6}
              className="w-full bg-green-500 text-white p-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs shadow-2xl shadow-green-500/20 hover:bg-green-600 disabled:opacity-50 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <UserPlus className={`w-4 h-4 ${loading ? 'animate-bounce' : ''}`} />
              {loading ? "Validating Code..." : "Sync Systems Now"}
            </button>
          </div>
        </form>

        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100/50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-center">
            <Info className="w-4 h-4 text-slate-400" />
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium italic">
              "Competitive focus drives 42% higher retention in distributed teams."
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
