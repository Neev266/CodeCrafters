import { supabase } from "./supabase";

export const fetchAutomationLogs = async () => {
  const { data, error } = await supabase
    .from("automation_logs") // 🔥 your table name
    .select("*")
    .order("timestamp", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    return [];
  }

  return data;
};