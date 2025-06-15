import { useEffect, useId, useRef, useState } from 'react';
import Button from 'renderer/components/Button';
import LoadingAnimation from 'renderer/components/LoadingAnimation';
import Page from 'renderer/components/Page';
import { sessionData } from 'renderer/contexts/DataContext';
import { usePhase } from 'renderer/contexts/PhaseContext';
import useIdle from 'renderer/hooks/useIdle';
import BoothManager from 'renderer/services/BoothManager';
const QRCode = require('../utilities/qrcode') as QRCodeConstructor;

interface QRCodeConstructor {
  new (el: HTMLElement | string, options: any): {
    makeCode: (s: string) => void;
    // add other method typings as needed
  };
  CorrectLevel: {
    H: any;
  };
}

export default function PhaseTenPage() {
  const [video, setVideo] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement | null>(null);
  const data = sessionData();
  const phase = usePhase();

  useEffect(() => {
    window.electron.logger.info('A session has reached its end');
    (async () => {
      const path = await window.electron.file.getVideo();
      setVideo(`file://${path}`);
    })();
  }, []);

  useEffect(() => {
    new QRCode(qrRef.current!, {
      text: data.page!,
      width: 256,
      height: 256,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H,
    });
  }, []);

  const handleEnd = () => {
    BoothManager.end();
  };

  const idle = useIdle(300000, true, handleEnd);

  return (
    <Page fullscreen={true} className="flex w-full h-screen">
      <div className="flex-1 relative overflow-hidden">
        {video ? (
          <video
            autoPlay={true}
            loop={true}
            src={video!}
            className="w-full h-full object-cover"
          />
        ) : (
          <LoadingAnimation />
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-evenly gap-12 p-12">
        <h1 className="font-bold text-4xl">Thank you for the memories :D</h1>

        <div className="flex flex-col items-center justify-evenly p-8 gap-8 rounded bg-surface text-on-surface">
          <h1 className="font-bold text-2xl">Scan to download</h1>
          <div ref={qrRef}></div>
        </div>

        <div className="flex">
          <Button onClick={() => handleEnd()}>Done</Button>
        </div>
      </div>
    </Page>
  );
}
