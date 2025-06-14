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

        window.electron.media.print(
          data.split ? print! : exports!,
          data.split ? data.quantity! / 2 : data.quantity!, // if the frame is split, the quantity obvious to be in multiple of 2 because for one print it will be cut, thus we just have to print half of the number given.
          data.frame?.split!
        );

        const url = await window.electron.media.upload(
          data.pictures.length + 1,
          data.pictures!
        ); // Pictures and the canvas

        data.setPage(url);

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
    <Page className="flex flex-row justify-center gap-12 items-center">
      <div className="flex-1 flex flex-col justify-evenly items-center rounded bg-surface outline shadow-xl p-12 gap-12 min-h-[80vh]">
        <div>
          <h1 className="font-bold text-8xl text-right">
            Are you sure with your picks?
          </h1>
        </div>

        <div className="flex gap-12 items-stretch justify-end">
          <Button variant="outline" onClick={() => handleCancel()}>
            Not yet
          </Button>
          <Button variant="fill" onClick={() => handleConfirm()}>
            Yes
          </Button>
        </div>
      </div>
      <div
        className="flex-1 flex items-center justify-center max-h-[80vh]"
        ref={containerRef}
      >
        <canvas ref={canvasRef} />
      </div>
    </Page>
  );
}
