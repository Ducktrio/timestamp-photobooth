import { useEffect, useRef } from 'react';
import useViewfinder from 'renderer/hooks/useViewfinder';

export default function ViewfinderPage({}: { className?: string }) {
  const screen = useRef<HTMLCanvasElement | null>(null);
  const streams = useViewfinder();

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
      };

    if (!streams)
      canvas?.fillRect(
        0,
        0,
        screen.current?.width as number,
        screen.current?.height as number
      );
  }, [streams]);

  return (
    <canvas
      ref={screen}
      className="min-h-dvh max-h-dvh bg-surface-container-low fixed z-[0] top-0 left-0 object-cover"
    ></canvas>
  );
}
