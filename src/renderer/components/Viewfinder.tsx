import { useEffect, useRef } from 'react';
import { sessionData } from 'renderer/contexts/DataContext';
import useBorderline from 'renderer/hooks/useBorderline';
import useMotion from 'renderer/hooks/useMotion';

interface ViewfinderProps {
  width?: string;
  height?: string;
  pause?: boolean;
}
const Viewfinder = ({
  width = window.innerWidth.toString(),
  height = window.innerHeight.toString(),
  pause = false,
}: ViewfinderProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const motion = useMotion(canvasRef.current!);
  let [bWidth, bHeight] = [0, 0];
  const data = sessionData();

  useEffect(() => {
    console.log('VIEWFINDER CALL');

    if (pause && wsRef.current) {
      motion.stop();
      wsRef.current?.close();
      const ctx = canvasRef.current?.getContext('2d');
      ctx?.clearRect(
        0,
        0,
        canvasRef.current?.width as number,
        canvasRef.current?.height as number
      );
    } else if (!pause) {
      _videoStream();
      motion.run();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [pause]);

  /** Video stream hander */
  const _videoStream = () => {
    console.log('Video stream called');
    if (!canvasRef.current) return;

    wsRef.current = new WebSocket('ws://localhost:8080');

    wsRef.current.onerror = (ev: Event) => {
      console.error(ev);
      return;
    };

    console.log('[CameraPreview] Websocket opens');
    wsRef.current.binaryType = 'blob';

    let imageBuffer: Uint8Array[] = [];
    const canvas = canvasRef.current?.getContext('2d', {
      willReadFrequently: true,
    });

    [bWidth, bHeight] = useBorderline(data.frame!, canvasRef.current!);

    window.electron?.onStream((chunk: Uint8Array) => {
      if (chunk === undefined || chunk === null) return;
      imageBuffer.push(chunk);

      if (imageBuffer.length > 32) imageBuffer.shift();

      if (!imageBuffer.length) return;
      const latestChunk = imageBuffer[imageBuffer.length - 1];

      const blob = new Blob([latestChunk], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = function render() {
        canvas?.drawImage(
          img,
          0,
          0,
          canvasRef.current?.width as number,
          canvasRef.current?.height as number
        );
        URL.revokeObjectURL(img.src);

        // draw borderline
        canvas?.beginPath();
        canvas?.setLineDash([2, 2]);
        canvas!.strokeStyle = 'white';
        canvas!.lineWidth = 0.25;

        let x = (canvasRef.current?.width! - bWidth) / 2;
        let y = (canvasRef.current?.height! - bHeight) / 2;
        let w = bWidth;
        let h = bHeight;
        canvas?.strokeRect(x, y, w, h);
      };
      img.src = url;
      imageBuffer = [];
    });
    wsRef.current.onclose = () => console.log('socket disconnected');
  };

  return (
    <>
      <div className="fixed z-[0] top-0 left-0 flex items-center justify-center h-screen w-screen">
        <canvas ref={canvasRef} width={width} height={height} />
      </div>
    </>
  );
};
export default Viewfinder;
