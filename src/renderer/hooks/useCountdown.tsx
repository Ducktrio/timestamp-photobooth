import { useEffect, useState } from 'react';

/**
 * Hooks on countdown in {duration} seconds
 * returns [countdown, trigger], countdown as a number reducing each second, and trigger changes on duration ended
 * @param {number} duration - how long the timer counts
 * @param {boolean} start? - The hook listen to reset changes in value, and if true then the countdown starts and resets
 */
export default function useCountdown(duration: number, start?: boolean) {
  const [timer, setTimer] = useState<number>(duration);
  const [trigger, setTrigger] = useState<boolean>(false);

  useEffect(() => {
    if (!start) return;
    const interval = setInterval(async () => {
      if (timer <= 1) {
        setTrigger(!trigger);
        clearInterval(interval);
      }
      setTimer(timer - 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [duration, timer, start]);

  useEffect(() => {
    if (!start) return;
    setTimer(duration);
  }, [start]);

  return [timer, trigger];
}
