import { ReactNode, useEffect, useState } from 'react';
import { usePhase } from 'renderer/contexts/PhaseContext';
import BoothManager from 'renderer/services/BoothManager';
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
    window.electron.ipcRenderer.once('throw', (arg) => {
      throw arg as Error;
    });

    if (state === State.LOADING) {
      (async () => {
        try {
          await BoothManager.boot();
          setState(State.RUNNING);
        } catch (error) {
          setState(State.ERROR);
          setError(error as Error);
          throw error;
        }
      })();
    }
    console.log('App initiate', state);
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

  if (state === State.ERROR) throw error;

  if (state === State.LOADING) return <>Loading...</>;

  return <>None</>;
}
