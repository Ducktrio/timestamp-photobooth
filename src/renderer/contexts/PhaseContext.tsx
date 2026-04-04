import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PhaseContextValue {
  currentPhase: number;
  jumpTo: (phase: number) => void;
  next: () => void;
  previous: () => void;
  restart: () => void;
}

const PhaseContext = createContext<PhaseContextValue | undefined>(undefined);

export const PhaseProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [currentPhase, setPhase] = useState(0);
  const navigate = useNavigate();

  const next = () => {

    let nextPhase = currentPhase + 1;

    // Skip payment phase if bypass is enabled
    if (nextPhase === 4 && window.electron.config.BYPASS_PAYMENT === "bypasspayment") {
      nextPhase = 5;
    }

    navigate(`/phase${nextPhase}`);
    setPhase(nextPhase);
  };

  const previous = () => {
    navigate(`/phase${currentPhase - 1}`);
    setPhase(currentPhase - 1);
  };

  const jumpTo = (destination: number) => {
    setPhase(destination);
    navigate(`/phase${destination}`);
  };
  const restart = () => {
    setPhase(0);
  };

  return (
    <PhaseContext.Provider
      value={{ currentPhase, jumpTo, next, previous, restart }}
    >
      {children}
    </PhaseContext.Provider>
  );
};

export const usePhase = () => {
  const context = useContext(PhaseContext);
  if (!context) {
    throw new Error('usePhase must be used within a PhaseProvider');
  }
  return context;
};
