import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { createPortal } from 'react-dom';
import { MiniEngineController } from '@/components/MiniEngineController';

interface EngineContextType {
  cogniflowActive: boolean;
  launchEngine: () => void;
  stopEngine: () => void;
  requestPiP: () => Promise<void>;
  isPiped: boolean;
  metrics: {
    typingSpeed: number;
    tabSwitches: number;
    mouseVariance: number;
    backspaceRate: number;
    idleTime: number;
    focusScore: number;
    backendMetrics: {
      kps: number;
      backspaces: number;
      mouse_distance: number;
    };
  };
}

const EngineContext = createContext<EngineContextType | undefined>(undefined);

export const EngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cogniflowActive, setCogniflowActive] = useState(() => {
    return localStorage.getItem('cogniflow_active') === 'true';
  });
  
  const [metrics, setMetrics] = useState({
    typingSpeed: 0,
    tabSwitches: 0,
    mouseVariance: 0,
    backspaceRate: 0,
    idleTime: 0,
    focusScore: 0,
    backendMetrics: {
      kps: 0,
      backspaces: 0,
      mouse_distance: 0,
    }
  });

  const [isPiped, setIsPiped] = useState(false);
  const [pipContainer, setPipContainer] = useState<HTMLElement | null>(null);
  
  const navigate = useNavigate();
  const lastActivityRef = useRef(Date.now());
  const mousePositionsRef = useRef<{ x: number; y: number; t: number }[]>([]);
  const keystrokeCountRef = useRef(0);
  const backspaceCountRef = useRef(0);
  const tabSwitchesRef = useRef(0);

  // Backend Metrics Polling
  useEffect(() => {
    const pollBackend = async () => {
      try {
        const response = await fetch('http://localhost:8000/metrics');
        if (response.ok) {
          const data = await response.json();
          setMetrics(prev => ({
            ...prev,
            backendMetrics: {
              kps: data.kps,
              backspaces: data.backspaces,
              mouse_distance: data.mouse_distance
            }
          }));
        }
      } catch (e) {
        // Backend offline, skip
      }
    };
    const interval = setInterval(pollBackend, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('cogniflow_active', cogniflowActive.toString());
    
    if (!cogniflowActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      keystrokeCountRef.current++;
      if (e.key === 'Backspace') backspaceCountRef.current++;
      lastActivityRef.current = Date.now();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePositionsRef.current.push({ x: e.clientX, y: e.clientY, t: Date.now() });
      if (mousePositionsRef.current.length > 100) mousePositionsRef.current.shift();
      lastActivityRef.current = Date.now();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) tabSwitchesRef.current++;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const interval = setInterval(() => {
      let variance = 0;
      if (mousePositionsRef.current.length > 1) {
        const dx = mousePositionsRef.current[mousePositionsRef.current.length - 1].x - mousePositionsRef.current[0].x;
        const dy = mousePositionsRef.current[mousePositionsRef.current.length - 1].y - mousePositionsRef.current[0].y;
        variance = Math.sqrt(dx * dx + dy * dy) / 10;
      }

      const now = Date.now();
      const idle = Math.floor((now - lastActivityRef.current) / 1000);
      
      setMetrics(prev => ({
        ...prev,
        typingSpeed: Math.min(keystrokeCountRef.current * 2, 120),
        tabSwitches: tabSwitchesRef.current,
        mouseVariance: Math.round(variance),
        backspaceRate: backspaceCountRef.current,
        idleTime: idle,
        focusScore: Math.max(0, 100 - (tabSwitchesRef.current * 5) - (idle > 30 ? 20 : 0)),
      }));
    }, 3000);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [cogniflowActive]);

  const requestPiP = async () => {
    if (!('documentPictureInPicture' in window)) {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Your browser does not support Document PiP.",
      });
      return;
    }

    try {
      // @ts-ignore
      const pipWindow = await window.documentPictureInPicture.requestWindow({
        width: 320,
        height: 420,
      });

      // Copy styles
      [...document.styleSheets].forEach((styleSheet) => {
        try {
          const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
          const style = document.createElement('style');
          style.textContent = cssRules;
          pipWindow.document.head.appendChild(style);
        } catch (e) {
          const link = document.createElement('link');
          if (styleSheet.href) {
            link.rel = 'stylesheet';
            link.href = styleSheet.href;
            pipWindow.document.head.appendChild(link);
          }
        }
      });

      const container = document.createElement('div');
      pipWindow.document.body.appendChild(container);
      setPipContainer(container);
      setIsPiped(true);

      pipWindow.addEventListener('pagehide', () => {
        setIsPiped(false);
        setPipContainer(null);
      });
    } catch (err) {
      console.error('Failed to open PiP:', err);
    }
  };

  const launchEngine = () => {
    setCogniflowActive(true);
    toast({ title: "Engine Active", description: "Tracking is now live." });
  };

  const stopEngine = () => {
    setCogniflowActive(false);
    localStorage.removeItem('cogniflow_active');
    navigate('/');
    toast({ variant: "destructive", title: "Engine Stopped", description: "Tracking disabled." });
  };

  return (
    <EngineContext.Provider value={{ 
      cogniflowActive, 
      launchEngine, 
      stopEngine, 
      requestPiP, 
      isPiped, 
      metrics 
    }}>
      {children}
      {isPiped && pipContainer && createPortal(
        <MiniEngineController 
          engineActive={cogniflowActive}
          onLaunch={launchEngine}
          onStop={stopEngine}
          metrics={metrics.backendMetrics}
        />,
        pipContainer
      )}
    </EngineContext.Provider>
  );
};

export const useEngine = () => {
  const context = useContext(EngineContext);
  if (context === undefined) throw new Error('useEngine must be used within an EngineProvider');
  return context;
};
