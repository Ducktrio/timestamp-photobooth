import { useEffect, useRef } from 'react';
import useViewfinder from 'renderer/hooks/useViewfinder';

export default function ViewfinderPage({}: { className?: string }) {
  const screen = useRef<HTMLCanvasElement | null>(null);
  const streams = useViewfinder();

  useEffect(() => {
    const canvas = screen.current?.getContext('2d');
    if (streams)
      streams!.onload = function render() {
        canvas?.drawImage(streams!, 0, 0);
        URL.revokeObjectURL(streams!.src);
      };

    if (!streams)
      canvas?.fillRect(
        0,
        0,
        screen.current?.width as number,
        screen.current?.height as number
      );
  });

  return (
    <canvas
      ref={screen}
      className="min-h-dvh bg-surface-container-low fixed top-0 left-0 z-[-1] object-cover"
    ></canvas>
  );
}
