import { motion, AnimatePresence } from "framer-motion";
import { X, Mic } from "lucide-react";

interface VoiceModalProps {
  onStop: () => void;
  onCancel: () => void;
}

const VoiceModal = ({ onStop, onCancel }: VoiceModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-6"
      >
        <div className="flex justify-between items-center w-full">
          <h3 className="text-lg font-bold">AURA Listening...</h3>
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative w-40 h-40 flex items-center justify-center">
          <motion.div
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-primary/20 rounded-full"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.2, 0.5]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="absolute inset-4 bg-primary/30 rounded-full"
          />
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white shadow-xl">
            <Mic className="w-10 h-10" />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground animate-pulse">Speak now, I'm listening to you</p>
          <div className="flex gap-1 mt-2">
            {[1,2,3,4,5].map(i => (
              <motion.div
                key={i}
                animate={{ height: [4, 16, 4] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                className="w-1 bg-primary/40 rounded-full"
              />
            ))}
          </div>
        </div>
        
        <button
          onClick={onStop}
          className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          Stop and Send
        </button>
      </motion.div>
    </div>
  );
};

export default VoiceModal;
