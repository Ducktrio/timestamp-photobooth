import { useRef, useState, useEffect } from 'react';
import BoothManager from 'renderer/services/BoothManager';

/**
 * Custom hooks to reset phase when idle for some time
 * @param {number} timeout - timeout in miliseconds
 * @param {boolean} isActive - Trigger activation of the timer
 */
export default function useIdle(
  timeout: number,
  isActive: boolean,
  callback?: () => void
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    if (!isActive) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setRemaining(null);
      return;
    }

    // When IDLE timer runs out, everything called here
    const handleIdle = async () => {
      if (!callback) {
        try {
          await BoothManager.end();
          window.electron.logger.info('A session is ended because inactivity');
        } catch (error) {
          throw error;
        }
      } else callback();
    };

    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setRemaining(timeout); // Reset remaining time

      timeoutRef.current = setTimeout(() => {
        handleIdle();
      }, timeout);
    };

    resetTimer(); // Start timer when component mounts

    const events: (keyof DocumentEventMap)[] = [
      'mousemove',
      'keydown',
      'scroll',
      'click',
      'touchstart',
    ];
    events.forEach((event) =>
      window.addEventListener(event, resetTimer, { passive: true })
    );

    const interval = setInterval(() => {
      setRemaining((prev) => (prev !== null ? Math.max(prev - 1000, 0) : null)); // Decrease remaining time every second
    }, 1000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      clearInterval(interval);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [isActive, timeout]);

  return remaining !== null && remaining <= 5000
    ? `Exitting this session in ${remaining / 1000}...`
    : null;
}
