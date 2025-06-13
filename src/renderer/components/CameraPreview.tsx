import { useEffect, useRef } from 'react';

interface CameraPreviewProps {
  width?: string;
  height?: string;
  pause?: boolean;
}
const CameraPreview = ({
  width = (window.innerWidth / 2).toString(),
  height = (window.innerHeight / 2).toString(),
  pause = false,
}: CameraPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (pause && wsRef.current) {
      wsRef.current?.close();
      const ctx = canvasRef.current?.getContext('2d');
      ctx?.clearRect(
        0,
        0,
        canvasRef.current?.width as number,
        canvasRef.current?.height as number
      );
    } else if (!pause) _videoStream();

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
      throw new Error('Error on connecting to websocket server');
    };

    wsRef.current.onmessage = (ev) => {
      if (ev.data instanceof Error) throw ev.data as Error;
    };

    wsRef.current.binaryType = 'blob';

    let imageBuffer: Uint8Array[] = [];
    const canvas = canvasRef.current?.getContext('2d', {
      willReadFrequently: true,
    });

    window.electron?.onStream((chunk: Uint8Array) => {
      if (chunk === undefined || chunk === null) return;
      imageBuffer.push(chunk);

      if (imageBuffer.length > 10) imageBuffer.shift();

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
      };
      img.src = url;
      imageBuffer = [];
    });
    wsRef.current.onclose = () => console.log('socket disconnected');
  };

  return (
    <>
      <div className="rounded-lg shadow outline outline-outline-variant">
        <canvas ref={canvasRef} width={width} height={height} />
      </div>
    </>
  );
};
export default CameraPreview;
