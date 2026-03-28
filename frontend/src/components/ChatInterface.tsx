import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Camera, X } from "lucide-react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";

// import AIVatar from "./AIVatar";
// import VoiceModal from "./VoiceModal";

// Note: Using placeholders for missing assets
const avatar1 = "/placeholder.svg";
const avatar2 = "/placeholder.svg";
const avatar3 = "/placeholder.svg";

interface Message {
  id: number;
  text: string;
  sender: "user" | "aura";
}

interface Avatar {
  id: number;
  name: string;
  image: string;
  modelUrl: string;
  sarvamModel: string;
}

interface Game {
  id: string;
  name: string;
  description: string;
  emotion: string[];
  icon: string;
  route: string;
}

const ChatInterface = () => {
  const webcamRef = useRef<Webcam>(null);
  const navigate = useNavigate();

  // avatars configuration - each object carries required metadata
  const avatars: Avatar[] = [
    {
      id: 0,
      name: "Calm Aura",
      image: avatar1, // adjust to real paths
      modelUrl: "https://models.readyplayer.me/69a279d84d98c76821c317a1.glb",
      sarvamModel: "sarvam-therapy-v1anushkamaleshubhanushka",
    },
    {
      id: 1,
      name: "Joy Aura",
      image: avatar2,
      modelUrl: "https://models.readyplayer.me/69a26c875f0ce8d116ba5d5b.glb",
      sarvamModel: "sarvam-energetic-v1hubhrya",
    },
    {
      id: 2,
      name: "Zen Aura",
      image: avatar3,
      modelUrl: "https://models.readyplayer.me/69a27a2a2b9bcc76d538bf8a.glb",
      sarvamModel: "sarvam-meditation-v1ituidya",
    },
    // add more avatars as needed
  ];

  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState<number>(0);

  // map avatarId -> { sessionId, messages }
  const [avatarSessions, setAvatarSessions] = useState<{
    [key: number]: { sessionId: string; messages: Message[] };
  }>(() => {
    const firstId = avatars[0].id;
    return {
      [firstId]: {
        sessionId: crypto.randomUUID(),
        messages: [
          {
            id: 1,
            text: "Hello! I'm AURA, your AI wellness companion.",
            sender: "aura",
          },
        ],
      },
    };
  });

  // derive current avatar & messages/session
  const currentAvatar = avatars[selectedAvatarIndex];
  const currentSessionId =
    avatarSessions[currentAvatar.id]?.sessionId ||
    crypto.randomUUID();

  const [messages, setMessages] = useState<Message[]>(
    avatarSessions[currentAvatar.id]?.messages || []
  );

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [latestBlob, setLatestBlob] = useState<Blob | null>(null);

  const [currentEmotion, setCurrentEmotion] = useState<string>("neutral");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [hasStartedConversation, setHasStartedConversation] = useState(false);

  // Game recommendation state
  const [gameRecommendationShown, setGameRecommendationShown] = useState<{ [key: number]: boolean }>({});
  const [suggestedGames, setSuggestedGames] = useState<Game[]>([]);
  const [userDeclinedGames, setUserDeclinedGames] = useState<{ [key: number]: boolean }>({});

  // Game data - matches the 6 games in pages/games
  const games: Game[] = [
    { id: "breathing", name: "Breathing", description: "Calm your mind with guided breathing", emotion: ["sad", "angry", "fear"], icon: "🌬️", route: "/app/games/breathing" },
    { id: "color", name: "Color Game", description: "Relax with calming colors", emotion: ["sad", "neutral"], icon: "🎨", route: "/app/games/color" },
    { id: "gratitude", name: "Gratitude", description: "Count your blessings", emotion: ["sad", "neutral", "happy"], icon: "🙏", route: "app/games/gratitude" },
    { id: "maze", name: "Maze", description: "Challenge your mind", emotion: ["neutral", "happy"], icon: "🎯", route: "/app/games/maze" },
    { id: "memory", name: "Memory", description: "Train your memory", emotion: ["neutral", "happy"], icon: "🧠", route: "/app/games/memory" },
    { id: "zen", name: "Zen", description: "Find inner peace", emotion: ["sad", "angry", "fear"], icon: "☮️", route: "/app/games/zen" },
  ];

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  /* ===================== */
  /* 🎮 GAME RECOMMENDATION */
  /* ===================== */
  const getRecommendedGames = (emotion: string): Game[] => {
    const emotionLower = emotion.toLowerCase();
    return games.filter(game => game.emotion.includes(emotionLower)).slice(0, 3);
  };

  const shouldShowGameRecommendation = (): boolean => {
    const sessionId = avatarSessions[currentAvatar.id]?.sessionId;
    if (!sessionId || gameRecommendationShown[currentAvatar.id] || userDeclinedGames[currentAvatar.id]) {
      return false;
    }
    // Count AI responses (messages from "aura")
    const auraResponseCount = messages.filter(msg => msg.sender === "aura").length;
    // Show on 2nd or 3rd response (trigger when we reach 2 or 3 AI messages)
    return auraResponseCount === 2 || auraResponseCount === 3;
  };

  // Trigger game recommendation when conditions are met
  useEffect(() => {
    if (shouldShowGameRecommendation()) {
      const recommendedGames = getRecommendedGames(currentEmotion);
      setSuggestedGames(recommendedGames);
      setGameRecommendationShown(prev => ({
        ...prev,
        [currentAvatar.id]: true
      }));

      // Add a human-friendly AI message suggesting games
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: `By the way, based on how you're feeling right now, you might enjoy trying one of these games. Want to give any a shot?`,
          sender: "aura"
        }
      ]);
    }
  }, [messages, currentEmotion, currentAvatar.id]);

  /* ===================== */
  /* 🔊 AUDIO + LIP SYNC  */
  /* ===================== */
  const playAudioFromBase64 = (base64Audio: string) => {
    const byteCharacters = atob(base64Audio);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "audio/wav" });

    // 🔥 Drives lip sync ONLY
    setLatestBlob(blob);
  };

  /* ===================== */
  /* 🧠 EMOTION DETECTION  */
  /* ===================== */
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const detectEmotion = async () => {
      if (!webcamRef.current) return;
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      try {
        const response = await fetch("http://127.0.0.1:8000/emotion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imageSrc }),
        });

        const data = await response.json();

        if (data.results?.length > 0) {
          const result = data.results[0];
          setCurrentEmotion(result.emotion);
          setConfidence(result.confidence);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const timeout = setTimeout(() => {
      detectEmotion();
      interval = setInterval(detectEmotion, 2000);
    }, 2000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  /* ================================= */
  /* 🔁 AVATAR SESSION MANAGEMENT     */
  /* ================================= */
  // when messages change for the current avatar, persist them
  useEffect(() => {
    setAvatarSessions((prev) => ({
      ...prev,
      [currentAvatar.id]: {
        sessionId: prev[currentAvatar.id]?.sessionId || currentSessionId,
        messages,
      },
    }));
  }, [messages, currentAvatar.id]);

  // when user switches avatars, load that avatar's messages
  useEffect(() => {
    const stored = avatarSessions[currentAvatar.id];
    if (stored) {
      setMessages(stored.messages);
    } else {
      // initialize a blank conversation for new avatar
      setMessages([]);
      setAvatarSessions((prev) => ({
        ...prev,
        [currentAvatar.id]: {
          sessionId: currentSessionId,
          messages: [],
        },
      }));
    }
  }, [selectedAvatarIndex]);

  // Reset game recommendations when switching avatars
  useEffect(() => {
    setSuggestedGames([]);
  }, [selectedAvatarIndex]);

  /* ===================== */
  /* 🧠 SEND TEXT MESSAGE  */
  /* ===================== */
  const sendTextMessage = async (text: string) => {
    setLoading(true);

    const response = await fetch("http://127.0.0.1:8000/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        emotion: currentEmotion,
        avatar_name: currentAvatar.name,
        avatar_model: currentAvatar.sarvamModel,
        session_id: currentSessionId,
      }),
    });

    const data = await response.json();

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: data.reply, sender: "aura" },
    ]);

    if (data.audio) {
      console.log("✅ Backend audio received");
      playAudioFromBase64(data.audio);
    } else {
      console.log("❌ No audio returned from backend");
    }
    setLoading(false);
  };

  /* ===================== */
  /* 🎤 SEND VOICE MESSAGE */
  /* ===================== */
  const sendVoiceMessage = async (audioBlob: Blob) => {
    setLoading(true);

    // setLatestBlob(audioBlob);

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");
    formData.append("emotion", currentEmotion);
    formData.append("avatar_name", currentAvatar.name);
    formData.append("avatar_model", currentAvatar.sarvamModel);
    formData.append("session_id", currentSessionId);

    const response = await fetch("http://127.0.0.1:8000/assistant", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: data.user_text, sender: "user" },
      { id: Date.now() + 1, text: data.reply, sender: "aura" },
    ]);

    if (data.audio) playAudioFromBase64(data.audio);

    setLoading(false);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;
    audioChunks.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.start();
  };

  const stopRecording = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunks.current, {
          type: "audio/mpeg",
        });
        resolve(blob);
      };

      mediaRecorderRef.current.stop();
    });
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: input, sender: "user" },
    ]);

    sendTextMessage(input);
    setInput("");
  };

  /* ===================== */
  /* 🎨 UI LAYOUT          */
  /* ===================== */
  return (
    <div className="flex h-[600px] overflow-hidden glass-card rounded-2xl">

      {/* LEFT PANEL */}
      <div className="w-[260px] flex flex-col items-center p-6 border-r border-border/50 bg-background/50">

        {/* Camera */}
        <div className="flex flex-col items-center w-full">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-primary/20 bg-black/10">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-4 w-full space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Emotion</span>
              <span className="font-semibold capitalize text-primary">{currentEmotion}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-semibold">{confidence ? confidence.toFixed(1) + "%" : "--"}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto w-full mt-6 scrollbar-none">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-4 text-center">Switch Aura</p>
          <div className="space-y-4">
            {avatars.map((avatar, index) => (
              <button
                key={avatar.id}
                onClick={() => setSelectedAvatarIndex(index)}
                className={`w-full p-2 rounded-xl transition-all flex items-center gap-3 border ${selectedAvatarIndex === index
                    ? "bg-primary/10 border-primary/30"
                    : "bg-transparent border-transparent hover:bg-muted/50"
                  }`}
              >
                <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                  <img src={avatar.image} alt={avatar.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold">{avatar.name}</p>
                  <p className="text-[10px] text-muted-foreground">Active Session</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CENTER AVATAR/VISUALS */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-primary/5 to-transparent relative">
        <div className="scale-125">
          <AIVatar audioBlob={latestBlob} modelUrl={currentAvatar.modelUrl} />
        </div>

        {/* Visual feedback for voice */}
        {latestBlob && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1 items-end h-8">
            {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((h, i) => (
              <motion.div
                key={i}
                animate={{ height: [8, h * 4, 8] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                className="w-1 bg-primary/40 rounded-full"
              />
            ))}
          </div>
        )}
      </div>

      {/* RIGHT PANEL - CHAT */}
      <div className="w-[400px] flex flex-col bg-background/30 backdrop-blur-sm">
        <div className="h-14 flex items-center px-6 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <h3 className="text-sm font-bold uppercase tracking-wider opacity-60">Live Conversation</h3>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-4 py-4 scrollbar-thin">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${msg.sender === "user"
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-white border border-border/50 text-foreground"
                    }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Game Recommendation Card */}
          {suggestedGames.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-4 bg-muted/30 border border-primary/10 rounded-2xl backdrop-blur-md"
            >
              <div className="flex items-center justify-between mb-4 px-1">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Recommended Recovery</p>
                <button
                  onClick={() => {
                    setUserDeclinedGames(prev => ({ ...prev, [currentAvatar.id]: true }));
                    setSuggestedGames([]);
                  }}
                  className="p-1 hover:bg-muted rounded-full transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {suggestedGames.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => navigate(game.route)}
                    className="flex items-center gap-3 p-3 bg-white/50 hover:bg-white rounded-xl border border-transparent hover:border-primary/20 transition-all text-left"
                  >
                    <span className="text-xl">{game.icon}</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold">{game.name}</p>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">{game.description}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/10">Play</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div className="p-4 bg-white/50 border-t border-border/50">
          <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-2 py-1 border border-border/30">
            <button
              onClick={() => {
                setShowVoiceModal(true);
                startRecording();
              }}
              className="p-3 text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <Mic className="w-4 h-4" />
            </button>
            <input
              className="flex-1 bg-transparent text-sm outline-none px-2 h-10"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className={`p-3 rounded-lg transition-all ${input.trim() ? "text-primary hover:bg-primary/10" : "text-muted-foreground opacity-50 cursor-not-allowed"}`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showVoiceModal && (
        <VoiceModal
          onStop={async () => {
            const blob = await stopRecording();
            setShowVoiceModal(false);
            if (blob) sendVoiceMessage(blob);
          }}
          onCancel={() => {
            mediaRecorderRef.current?.stop();
            setShowVoiceModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ChatInterface;
