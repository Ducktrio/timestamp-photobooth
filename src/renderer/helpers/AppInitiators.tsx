import { ReactNode, useEffect, useState } from 'react';
import { usePhase } from 'renderer/contexts/PhaseContext';
import BoothManager from 'renderer/services/BoothManager';
import { ErrorHandler } from './ErrorHandler';

interface AppInitiatorProps {
  children: ReactNode;
}
export function AppInitiators({ children }: AppInitiatorProps) {
  enum State {
    LOADING,
    RUNNING,
    ERROR,
  }

  const [state, setState] = useState<State>(State.LOADING);
  const [error, setError] = useState<Error | null>(null);
  const phase = usePhase();

  useEffect(() => {
    if (state === State.LOADING) {
      (async () => {
        try {
          await BoothManager.boot();
          setState(State.RUNNING);
        } catch (error) {
          throw error;
        }
      })();
    }
  }, [state]);

  if (state === State.RUNNING)
    return (
      <div
        className="min-h-lvh max-h-lvh bg-background font-work"
        style={{
          backgroundImage: `url("${BoothManager.Theme.url}")`,
          backgroundSize: 'cover',
        }}
      >
        {children}
      </div>
    );

  if (state === State.ERROR)
    return <ErrorHandler error={error!}></ErrorHandler>;

  if (state === State.LOADING) return <>Loading...</>;

  return <>None</>;
}
