import { useEffect, useRef, useState } from 'react';
import Button from 'renderer/components/Button';
import LoadingAnimation from 'renderer/components/LoadingAnimation';
import Page from 'renderer/components/Page';
import { sessionData } from 'renderer/contexts/DataContext';
import { usePhase } from 'renderer/contexts/PhaseContext';
import Canvasor from 'renderer/modules/Canvasor';

enum State {
  PROMPT,
  PROCESSING,
  PROCEED,
}

export default function PhaseNinePage() {
  const [state, setState] = useState<State>(State.PROMPT);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasor = useRef<Canvasor | null>(null);

  const data = sessionData();
  const phase = usePhase();

  useEffect(() => {
    if (!canvasRef.current) return;

    (async () => {
      if (canvasor.current) {
        canvasor.current.dispose();
        canvasor.current = null;
      }

      canvasor.current = new Canvasor(
        containerRef.current!,
        canvasRef.current!,
        data.frame!
      );

      await canvasor.current.create();

      await canvasor.current.deserialize(data.canvas!);
    })();
  }, []);

  useEffect(() => {
    if (state === State.PROCEED) {
      phase.next();
    }
    if (state !== State.PROCESSING) return;

    (async () => {
      await window.electron.media.renderVideo();

      const image = new Image();
      image.src = data.frame!.url!;

      image.onload = async () => {
        const exports = await canvasor.current?.export(
          image.naturalWidth,
          image.naturalHeight
        );

        window.electron.media.saveCanvas(exports!);

        const print = await canvasor.current?.replicateAndExport(
          exports!,
          image.naturalWidth,
          image.naturalHeight
        );

        window.electron.media.print(print!, data.quantity!, data.frame?.split!);

        setState(State.PROCEED);
      };
    })();
  }, [state]);

  const handleCancel = () => {
    phase.previous();
  };

  const handleConfirm = () => {
    setState(State.PROCESSING);
  };

  if (state === State.PROCESSING)
    return (
      <Page className="flex items-center justify-center gap-12">
        <LoadingAnimation />
        <h1 className="font-bold text-xl">
          Please wait while we prepare your items
        </h1>
      </Page>
    );

  return (
    <Page>
      <div className="flex flex-col justify-evenly items-center rounded bg-surface outline shadow-xl p-8">
        <div>
          <h1 className="font-bold text-4xl">Are you sure with your picks?</h1>
        </div>

        <div className="flex flex-row justify-evenly">
          <Button variant="outline" onClick={() => handleCancel()}>
            Not yet, go back
          </Button>
          <Button variant="fill" onClick={() => handleConfirm()}>
            Yes, I'm sure
          </Button>
        </div>
      </div>
      <div
        className="flex-1 flex items-center justify-center"
        ref={containerRef}
      >
        <canvas ref={canvasRef} />
      </div>
    </Page>
  );
}
