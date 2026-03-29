import { DashboardLayout } from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

type CognitiveState = 'focus' | 'distracted' | 'confused' | 'fatigued' | 'idle';

const stateFilters: Array<{ label: string; value: CognitiveState | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Focus', value: 'focus' },
  { label: 'Distracted', value: 'distracted' },
  { label: 'Confused', value: 'confused' },
  { label: 'Fatigued', value: 'fatigued' },
  { label: 'Idle', value: 'idle' },
];

const AutomationLogs = () => {
  const [filter, setFilter] = useState<CognitiveState | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  // 🚀 FETCH DATA FROM SUPABASE
  useEffect(() => {
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from("state_logs") // ✅ correct table
        .select("*")
        .order("created_at", { ascending: false }); // ✅ safer than timestamp

      if (error) {
        console.error("❌ Supabase error:", error);
        return;
      }

      console.log("🔥 RAW DATA:", data);

      // 🔥 NORMALIZE DATA (VERY IMPORTANT)
      const normalized = (data || []).map((log) => {
        let state = log.state?.toLowerCase();

        if (state === "focused") state = "focus";
        if (state === "fatigue") state = "fatigued";

        return {
          ...log,
          state,
          time: log.timestamp || log.created_at, // ✅ handle both
        };
      });

      console.log("✅ NORMALIZED:", normalized);

      setLogs(normalized);
    };

    fetchLogs();

    // 🔥 refresh every 10 min
    const interval = setInterval(fetchLogs, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // 🔥 FILTER
  const filtered =
    filter === "all"
      ? logs
      : logs.filter((l) => l.state === filter);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">Automation Logs</h1>
            <p className="text-sm text-gray-500">
              History of triggered actions and system responses
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add Custom Rule
          </button>
        </div>

        {/* STATS */}
        <div className="bg-white p-4 rounded-xl shadow flex gap-4 items-center">
          <div className="w-10 h-10 bg-purple-100 flex items-center justify-center rounded-lg">
            🎯
          </div>
          <div>
            <p className="font-semibold">{logs.length} Automated actions tracked</p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex gap-2">
          {stateFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1 text-xs rounded-full ${
                filter === f.value
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">

            <thead>
              <tr className="bg-gray-100 text-left text-xs">
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">State</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Trigger</th>
                <th className="px-6 py-3">Result</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    🚫 No logs found (check Supabase / n8n)
                  </td>
                </tr>
              ) : (
                filtered.map((log, i) => (
                  <tr key={i} className="border-b">

                    <td className="px-6 py-3 text-xs">
                      {new Date(log.time).toLocaleString()}
                    </td>

                    <td className="px-6 py-3 text-xs">
                      {log.state}
                    </td>

                    <td className="px-6 py-3">
                      {log.action || "AI Action"}
                    </td>

                    <td className="px-6 py-3 text-xs">
                      {log.trigger || "Cognitive Engine"}
                    </td>

                    <td className="px-6 py-3 text-xs">
                      {log.result || "Success"}
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <motion.div className="bg-white p-6 rounded-xl w-96">
              <div className="flex justify-between mb-4">
                <h3>Add Rule</h3>
                <button onClick={() => setShowModal(false)}>
                  <X />
                </button>
              </div>
              <button onClick={() => setShowModal(false)}>Save</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default AutomationLogs;