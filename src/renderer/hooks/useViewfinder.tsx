import { useEffect, useRef, useState } from 'react';

export default function useViewfinder(pause: boolean = false) {
  const [chunks, setChunks] = useState<HTMLImageElement | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!ws.current && !pause) stream();
    if (pause)
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }

    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [pause]);

  const stream = () => {
    ws.current = new WebSocket('ws://localhost:8080');
    ws.current.binaryType = 'blob';

    let imageBuffer: Uint8Array[] = [];
    window.electron.onStream((chunk) => {
      if (chunk === undefined || chunk === null) return;

      imageBuffer.push(chunk);
      if (imageBuffer.length > 10) imageBuffer.shift();
      if (!imageBuffer.length) return;

      const latest = imageBuffer[imageBuffer.length - 1];

      const blob = new Blob([latest], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.src = url;
      setChunks(img);
      imageBuffer = [];
    });
    ws.current.onclose = () => {
      ws.current = null;
    };
  };

  return chunks;
}
