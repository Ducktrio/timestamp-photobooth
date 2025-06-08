import { useEffect, useRef, useState } from 'react';
import { sessionData } from 'renderer/contexts/DataContext';
import useBorderline from 'renderer/hooks/useBorderline';
import useMotion from 'renderer/hooks/useMotion';
import useViewfinder from 'renderer/hooks/useViewfinder';

export default function ViewfinderPage({
  record = false,
  pause = false,
}: {
  className?: string;
  record: boolean;
  pause: boolean;
}) {
  const screen = useRef<HTMLCanvasElement | null>(null);
  const streams = useViewfinder(pause);
  const motion = useMotion(screen.current!);
  const data = sessionData();
  const [height, setHeight] = useState(0);
  const [bWidth, bHeight] = useBorderline(data.frame!, height);

  useEffect(() => {
    const canvas = screen.current?.getContext('2d');
    if (streams)
      streams!.onload = function render() {
        canvas?.drawImage(
          streams,
          0,
          0,
          screen.current?.width!,
          screen.current?.height!
        );
        URL.revokeObjectURL(streams!.src);
        canvas?.beginPath();
        canvas?.setLineDash([5, 5]);
        canvas!.strokeStyle = 'red';
        canvas!.lineWidth = 2;

        let x = screen.current?.width! / 2 - bWidth / 2;
        let y = 0;
        let w = bWidth;
        let h = bHeight;

        canvas?.strokeRect(x, y, w, h);
      };
    setHeight(screen.current?.height!);
  }, [streams]);

  useEffect(() => {
    if (record) motion.run();
    else motion.stop();

    return () => {
      motion.stop();
    };
  }, [record]);

  return (
    <canvas
      ref={screen}
      className="min-h-dvh max-h-dvh bg-surface-container-low fixed z-[0] top-0 left-0 object-cover"
    ></canvas>
  );
}
