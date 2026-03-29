import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Bot, User, Loader2, X } from "lucide-react";

export default function ChatBox() {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "ai"; timestamp: string }[]>([
    { text: "Hello! I'm your AI Companion. I can understand any language — type or speak to me.", sender: "ai", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
  ]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // 🎤 Recording helpers
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, sampleRate: 44100, channelCount: 1 } });
    const recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus", audioBitsPerSecond: 128000 });
    mediaRecorderRef.current = recorder;
    audioChunks.current = [];
    recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunks.current.push(e.data); };
    recorder.start();
  };

  const stopRecording = async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) return resolve(null);
      mediaRecorderRef.current.onstop = () => {
        resolve(new Blob(audioChunks.current, { type: "audio/webm;codecs=opus" }));
      };
      mediaRecorderRef.current.stop();
    });
  };

  // 💬 Text send
  const sendText = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages(prev => [...prev, { text: trimmed, sender: "user", timestamp: now() }]);
    setInput("");
    setIsLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, session_id: "user-1" }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      setMessages(prev => [...prev, { text: data.reply, sender: "ai", timestamp: now() }]);
    } catch (e: any) {
      const msg = e.name === "AbortError"
        ? "⚠️ Request timed out. The AI may be slow — please try again."
        : "⚠️ Could not reach the AI. Make sure the backend is running on port 8000.";
      setMessages(prev => [...prev, { text: msg, sender: "ai", timestamp: now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendText(); } };

  // 🎤 Voice start
  const startVoiceRecording = async () => {
    try {
      setIsRecording(true);
      setSeconds(0);
      await startRecording();
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } catch { setIsRecording(false); }
  };

  // 🛑 Cancel
  const cancelRecording = async () => {
    clearInterval(timerRef.current);
    setIsRecording(false);
    await stopRecording();
  };

  // ✅ Finish voice
  const finishRecording = async () => {
    clearInterval(timerRef.current);
    setIsRecording(false);
    setIsLoading(true);
    try {
      const blob = await stopRecording();
      if (!blob) return;
      const formData = new FormData();
      formData.append("audio", blob, "audio.webm");
      formData.append("session_id", "user-1");
      const res = await fetch("http://127.0.0.1:8000/chat", { method: "POST", body: formData });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { text: data.user_text || "🎤 voice message", sender: "user", timestamp: now() },
        { text: data.reply, sender: "ai", timestamp: now() },
      ]);
    } catch {
      setMessages(prev => [...prev, { text: "⚠️ Voice send failed.", sender: "ai", timestamp: now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-h-[780px] bg-white rounded-[32px] shadow-2xl shadow-primary/5 border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b border-slate-100 bg-gradient-to-r from-white to-primary/5">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900 text-lg tracking-tight">AI Companion</h2>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-slate-400 font-medium">Powered by Sarvam AI · Multilingual</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
        {messages.map((m, i) => (
          <div key={i} className={`flex items-end gap-3 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center ${m.sender === "user" ? "bg-primary/10" : "bg-primary"}`}>
              {m.sender === "user" ? <User className="w-4 h-4 text-primary" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
            <div className={`max-w-[72%] flex flex-col gap-1 ${m.sender === "user" ? "items-end" : "items-start"}`}>
              <div className={`px-5 py-3.5 rounded-[20px] text-sm leading-relaxed ${
                m.sender === "user"
                  ? "bg-primary text-white rounded-br-md shadow-lg shadow-primary/20"
                  : "bg-white text-slate-700 rounded-bl-md shadow-md shadow-slate-100 border border-slate-100"
              }`}>
                {m.text}
              </div>
              <span className="text-[10px] text-slate-400 px-1">{m.timestamp}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-end gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-slate-100 rounded-[20px] rounded-bl-md px-5 py-4 shadow-md">
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.15s]" />
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.3s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-5 border-t border-slate-100 bg-white">
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-primary/30 focus-within:bg-white transition-all">
          <input
            className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-300"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type in any language... (Enter to send)"
            disabled={isLoading}
          />
          <button
            onClick={startVoiceRecording}
            disabled={isLoading}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-30"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            onClick={sendText}
            disabled={isLoading || !input.trim()}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 disabled:opacity-40 transition-all active:scale-95"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Recording popup */}
      {isRecording && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] shadow-2xl px-8 py-8 flex flex-col items-center gap-5 w-[300px]">
            <div className="w-16 h-16 rounded-2xl bg-red-500 flex items-center justify-center shadow-xl shadow-red-500/30">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <div className="flex items-end gap-1 h-8">
              {[3, 5, 7, 4, 6].map((h, i) => (
                <div key={i} className="w-2 bg-red-400 rounded-full animate-bounce" style={{ height: `${h * 4}px`, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-800 text-lg">Listening...</p>
              <p className="text-xs text-slate-400 mt-1">{seconds}s · Speak clearly in any language</p>
            </div>
            <div className="flex gap-3 w-full">
              <button onClick={cancelRecording} className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-600 rounded-2xl py-3 text-sm font-semibold hover:bg-slate-200 transition-all">
                <X className="w-4 h-4" /> Cancel
              </button>
              <button onClick={finishRecording} className="flex-1 flex items-center justify-center gap-2 bg-primary text-white rounded-2xl py-3 text-sm font-semibold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95">
                <Send className="w-4 h-4" /> Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
