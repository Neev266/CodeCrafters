import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Square, Activity, MousePointer2, Keyboard, AlertCircle } from 'lucide-react';

interface MiniControllerProps {
  engineActive: boolean;
  onLaunch: () => void;
  onStop: () => void;
  metrics: {
    kps: number;
    backspaces: number;
    mouse_distance: number;
  };
}

export const MiniEngineController = ({ engineActive, onLaunch, onStop, metrics }: MiniControllerProps) => {
  return (
    <div className="w-full h-full bg-white p-4 flex flex-col items-center justify-center gap-4 overflow-hidden select-none">
      <div className="flex flex-col items-center text-center -mt-2">
        <h1 className="text-sm font-display font-bold text-slate-800">CogniFlow</h1>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${engineActive ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
            {engineActive ? 'System Live' : 'Piped Standby'}
          </span>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-2">
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-col items-center justify-center gap-1">
          <Keyboard className="w-3 h-3 text-slate-400" />
          <span className="text-[14px] font-mono font-bold text-primary">{metrics.kps.toFixed(1)}</span>
          <span className="text-[8px] font-bold text-slate-400">KPS</span>
        </div>
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-col items-center justify-center gap-1">
          <MousePointer2 className="w-3 h-3 text-slate-400" />
          <span className="text-[14px] font-mono font-bold text-slate-700">{Math.round(metrics.mouse_distance / 100)}</span>
          <span className="text-[8px] font-bold text-slate-400">VAR</span>
        </div>
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-col items-center justify-center gap-1 col-span-2">
          <div className="flex items-center gap-1.5 w-full justify-center">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            <div className="flex flex-col">
              <span className="text-[12px] font-mono font-bold text-rose-500">{metrics.backspaces}</span>
              <span className="text-[8px] font-bold text-slate-400 leading-none uppercase">Errors</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={engineActive ? onStop : onLaunch}
        className={`w-full py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
          engineActive 
            ? 'bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-500 hover:text-white' 
            : 'bg-primary text-white shadow-lg shadow-primary/25'
        }`}
      >
        {engineActive ? 'Stop Engine' : '⚡ Launch Engine'}
      </button>

      <div className="flex items-center gap-1 opacity-40">
        <Activity className="w-2.5 h-3 text-primary" />
        <span className="text-[7px] font-bold tracking-tighter uppercase">Real-time Biometric Stream</span>
      </div>
    </div>
  );
};
