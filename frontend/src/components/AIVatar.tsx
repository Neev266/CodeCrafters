import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface AIVatarProps {
  audioBlob: Blob | null;
  modelUrl: string;
}

const AIVatar = ({ audioBlob, modelUrl }: AIVatarProps) => {
  // This is a stub for a 3D Avatar component.
  // In a real implementation, this would use @react-three/fiber and @react-three/drei
  // to load a GLB model and handle lip-sync animations based on the audioBlob.
  
  const isPlaying = !!audioBlob;

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Outer Glow */}
      <motion.div
        animate={{
          scale: isPlaying ? [1, 1.1, 1] : 1,
          opacity: isPlaying ? [0.2, 0.4, 0.2] : 0.2,
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-full bg-primary blur-3xl"
      />
      
      {/* Avatar Placeholder */}
      <div className="relative w-40 h-40 rounded-full border-4 border-primary/20 bg-muted overflow-hidden glass shadow-2xl">
        <img 
          src={modelUrl.includes("avatar1") ? "/avatar1.png" : "/placeholder.svg"} 
          alt="AI Avatar" 
          className="w-full h-full object-cover"
        />
        
        {/* Simple "Speaking" Overlay */}
        {isPlaying && (
          <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="absolute inset-0 bg-primary/10 flex items-center justify-center"
          >
            <div className="w-full h-1 bg-primary/50 absolute bottom-1/3" />
          </motion.div>
        )}
      </div>
      
      {/* Status Badge */}
      <div className="absolute -bottom-2 right-4 px-3 py-1 bg-white rounded-full shadow-md border border-border/50 text-[10px] font-bold text-primary">
        {isPlaying ? "SPEAKING" : "LISTENING"}
      </div>
    </div>
  );
};

export default AIVatar;
