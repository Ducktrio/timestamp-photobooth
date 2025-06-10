import { useEffect, useState } from 'react';

export default function useMotion(canvas: HTMLCanvasElement) {
  const [isRun, setIsRun] = useState(false);

  const run = () => {
    setIsRun(true);
  };
  const stop = () => {
    setIsRun(false);
  };

  useEffect(() => {
    let interval = setInterval(() => {
      window.electron.media.saveMotion(canvas.toDataURL('image/jpeg', 0.5));
    }, 500);

    if (!isRun) {
      clearInterval(interval);
      return;
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRun]);

  return { run, stop };
}
