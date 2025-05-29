import { useEffect, useState } from 'react';

export default function useViewfinder() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [chunks, setChunks] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (ws) stream();

    const newWs = new WebSocket('ws://localhost:8080');

    newWs.onerror = (ev: Event) => {
      console.error(ev);
      return;
    };

    newWs.onopen = () => {
      setWs(newWs);
    };
  }, [ws]);

  const stream = () => {
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
  };

  return chunks;
}
