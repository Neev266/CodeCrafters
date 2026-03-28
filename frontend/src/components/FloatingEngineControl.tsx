import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEngine } from '@/context/EngineContext';
import { Zap, Square, Activity, Maximize2 } from 'lucide-react';
import LaunchModal from './LaunchModal';

export const FloatingEngineControl = () => {
  const { cogniflowActive, stopEngine, requestPiP, isPiped } = useEngine();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-3">
        <AnimatePresence>
          {!isPiped && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={requestPiP}
              className="w-10 h-10 bg-white border border-slate-100 rounded-xl shadow-lg flex items-center justify-center text-slate-400 hover:text-primary transition-colors mb-1 group"
            >
              <Maximize2 className="w-4 h-4" />
              <div className="absolute right-full mr-4 px-3 py-1 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Pop Out Engine
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {cogniflowActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="bg-white/80 backdrop-blur-md border border-green-100 p-3 rounded-2xl shadow-xl flex items-center gap-3 mb-1"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-green-600">Engine Live</span>
              </div>
              <div className="h-4 w-[1px] bg-slate-100" />
              <div className="flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-primary animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-slate-500 tracking-tighter">TRACKING</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => cogniflowActive ? stopEngine() : setShowModal(true)}
          className={`group relative flex items-center justify-center w-14 h-14 rounded-2xl shadow-2xl transition-all ${
            cogniflowActive 
              ? 'bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-500 hover:text-white' 
              : 'bg-primary text-white shadow-primary/30 hover:shadow-primary/40'
          }`}
        >
          {cogniflowActive ? (
            <Square className="w-6 h-6 fill-current" />
          ) : (
            <>
              <Zap className="w-6 h-6 fill-current" />
              <motion.div 
                className="absolute inset-0 rounded-2xl bg-primary/20"
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </>
          )}

          {/* Tooltip */}
          <div className="absolute right-full mr-4 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
            {cogniflowActive ? 'Stop Engine' : 'Launch Engine'}
          </div>
        </motion.button>
      </div>

      <LaunchModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
};
