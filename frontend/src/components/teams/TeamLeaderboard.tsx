import React, { useState, useEffect } from "react";
import { db as firestoreDb } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, orderBy } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Share2, TrendingUp, Globe, Award, Copy, Check, Activity } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TeamLeaderboardProps {
  teamId: string;
  user: any;
}

export function TeamLeaderboard({ teamId, user }: TeamLeaderboardProps) {
  const [team, setTeam] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<"daily" | "weekly" | "all">("all");

  useEffect(() => {
    if (!teamId) return;

    // 1. Listen to Team Document
    const unsubTeam = onSnapshot(doc(firestoreDb, "teams", teamId), (docSnap) => {
      if (docSnap.exists()) setTeam(docSnap.data());
    }, (err) => console.error("Leaderboard Team Listener Error:", err));

    // 2. Listen to Members (Users in this team)
    const q = query(
      collection(firestoreDb, "users"),
      where("teamId", "==", teamId),
      orderBy("attentionScore", "desc")
    );

    const unsubMembers = onSnapshot(q, (querySnapshot) => {
      const mbrs = querySnapshot.docs.map(d => ({ ...d.data(), id: d.id }));
      setMembers(mbrs);
      setLoading(false);
    }, (err) => {
      console.error("Leaderboard Members Listener Error:", err);
      setLoading(false);
    });

    return () => {
      unsubTeam();
      unsubMembers();
    };
  }, [teamId]);

  const copyCode = () => {
    if (!team?.teamCode) return;
    navigator.clipboard.writeText(team.teamCode);
    setCopied(true);
    toast({ title: "Code Copied!", description: "Share it with your teammates." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFlex = (member: any) => {
    const rank = members.findIndex(m => m.uid === member.uid) + 1;
    const text = `🎯 My Attention Score is ${member.attentionScore} on CogniFlow! Currently Rank #${rank} in team "${team?.teamName}". Join the focus revolution!`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Score Flexed! 💪",
      description: "Rank status copied to clipboard.",
    });
  };

  if (loading) return (
    <div className="py-20 text-center">
      <div className="animate-pulse text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Loading Squad Intelligence...</div>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Team Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 rounded-[48px] border-none bg-gradient-to-br from-white via-white to-primary/5 shadow-2xl shadow-primary/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="flex flex-col gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
              {team?.category || "Sector Alpha"}
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Globe className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Global Node #266</span>
            </div>
          </div>
          <h2 className="text-4xl font-display font-bold text-slate-900 tracking-tight">{team?.teamName}</h2>
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                  {i === 4 ? "+" : ""}
                </div>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-400">{members.length} Members Active</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 relative z-10">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mr-2">Access Credentials</span>
          <button 
            onClick={copyCode}
            className="flex items-center gap-4 bg-slate-50/50 backdrop-blur-md border border-slate-100 p-3 pl-6 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all group"
          >
            <span className="font-mono font-bold text-2xl tracking-[0.3em] text-primary">{team?.teamCode}</span>
            <div className="p-2.5 bg-white rounded-2xl group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </div>
          </button>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-500/10 rounded-xl flex items-center justify-center">
                <Trophy className="w-4 h-4 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Team Rankings</h3>
            </div>
            <div className="flex gap-1.5 bg-slate-100/50 p-1.5 rounded-2xl backdrop-blur-sm">
              {["daily", "weekly", "all"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] transition-all ${
                    filter === f ? "bg-white text-primary shadow-md shadow-primary/5" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[40px] overflow-hidden border-none shadow-2xl shadow-slate-200/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rank</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operator</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Focus Delta</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence>
                    {members.map((member, index) => (
                      <motion.tr 
                        key={member.uid}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`group hover:bg-primary/[0.02] transition-colors ${member.uid === user.uid ? 'bg-primary/[0.04]' : ''}`}
                      >
                        <td className="px-10 py-7">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                            index === 0 ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' :
                            index === 1 ? 'bg-slate-200 text-slate-600' :
                            index === 2 ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30' :
                            'bg-slate-50 text-slate-400'
                          }`}>
                            {index === 0 ? <Award className="w-5 h-5" /> : index + 1}
                          </div>
                        </td>
                        <td className="px-10 py-7">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                              <span className="font-bold text-sm text-primary">{member.displayName?.[0] || "?"}</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-base font-bold text-slate-900">{member.displayName} {member.uid === user.uid && "★"}</span>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Streak: {member.streak || 0} Cycles</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-7 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-2xl font-mono font-black text-primary">{member.attentionScore}</span>
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${member.attentionScore}%` }}
                                className="h-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-7 text-right">
                          <button 
                            onClick={() => handleFlex(member)}
                            className="p-3.5 rounded-2xl bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Analytics Card */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center gap-3 px-4">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Team Pulse</h3>
          </div>

          <div className="glass-card p-8 rounded-[40px] border-none shadow-2xl shadow-primary/5 space-y-10 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mb-16 -mr-16 blur-2xl" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Collective Focus</span>
                <span className="text-4xl font-display font-black text-primary">84%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-primary rounded-full w-[84%] shadow-[0_0_12px_hsl(var(--primary))]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 rounded-3xl space-y-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active nodes</span>
                <p className="text-xl font-bold text-slate-900">12/15</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-3xl space-y-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Daily Goal</span>
                <p className="text-xl font-bold text-slate-900">92%</p>
              </div>
            </div>

            <div className="pt-2">
              <button className="w-full py-5 rounded-[24px] bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all hover:-translate-y-1 active:scale-95">
                Export Session Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
