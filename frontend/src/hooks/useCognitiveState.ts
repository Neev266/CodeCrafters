import { useState, useEffect, useRef } from 'react';
import { analyzeUserBehavior, generateSimulatedBehavior, CognitiveStateResponse, UserBehaviorPayload } from '@/lib/api';
import { currentState as mockFallbackState, type CognitiveState } from '@/lib/mockData';

const POLLING_INTERVAL = 3000; // 3 seconds

// Maps backend states (focus, distraction, fatigue, confusion) to frontend strict types
export function mapBackendToFrontendState(backendState: string): CognitiveState {
  if (['focus', 'distracted', 'confused', 'fatigued', 'idle'].includes(backendState)) {
    return backendState as CognitiveState;
  }
  
  if (backendState === 'distraction') return 'distracted';
  if (backendState === 'fatigue') return 'fatigued';
  if (backendState === 'confusion') return 'confused';
  
  return 'idle'; // fallback
}

export function useCognitiveState() {
  const [liveState, setLiveState] = useState<{
    state: CognitiveState;
    confidence: number;
    explanation: string;
    payload?: UserBehaviorPayload;
  }>(mockFallbackState);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // We simulate switching base states over time just for the demo to see it change naturally
    let simulationPhase: 'focus' | 'distraction' | 'fatigue' | 'confusion' = 'focus';
    let ticks = 0;

    const pollBackend = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Every 10 ticks (30s), randomly change the phase to show different states
        if (ticks > 0 && ticks % 10 === 0) {
           const phases: Array<'focus' | 'distraction' | 'fatigue' | 'confusion'> = ['focus', 'focus', 'distraction', 'fatigue', 'confusion'];
           simulationPhase = phases[Math.floor(Math.random() * phases.length)];
        }
        ticks++;

        // 1. Generate the payload strictly conforming to backend requirements
        const payload = generateSimulatedBehavior(simulationPhase);

        // 2. Call the REAL backend POST /analyze
        const result: CognitiveStateResponse = await analyzeUserBehavior(payload);
        
        setIsConnected(true);

        // 3. Update the frontend UI using the backend's response!
        setLiveState({
          state: mapBackendToFrontendState(result.state),
          confidence: Math.round(result.confidence * 100), // backend returns 0-1 usually
          explanation: `System determined state based on real-time typing (${payload.typing_speed} kps) and ${payload.tab_switches} tab switches.`,
          payload
        });
        
      } catch (err: any) {
        setIsConnected(false);
        setError(err.message || 'Failed to connect to backend');
        // Fallback gracefully so UI doesn't break
        setLiveState(mockFallbackState);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial poll
    pollBackend();

    // Setup polling
    intervalRef.current = setInterval(pollBackend, POLLING_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { liveState, isLoading, error, isConnected };
}
