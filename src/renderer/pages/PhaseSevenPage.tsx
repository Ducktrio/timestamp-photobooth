import { useEffect, useRef } from 'react';
import Button from 'renderer/components/Button';
import LazyImage from 'renderer/components/LazyImage';
import Page from 'renderer/components/Page';
import Stepper from 'renderer/components/Stepper';
import { sessionData } from 'renderer/contexts/DataContext';
import { usePhase } from 'renderer/contexts/PhaseContext';
import { useFetchFrames } from 'renderer/hooks/useFetchFrames';
import Canvasor from 'renderer/modules/Canvasor';

export default function PhaseSevenPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasor = useRef<Canvasor | null>(null);
  const data = sessionData();
  const frames = useFetchFrames(data.count!);
  const phase = usePhase();

  useEffect(() => {
    if (!canvasRef.current) return;

    (async () => {
      if (canvasor.current) {
        await canvasor.current.dispose();
        canvasor.current = null;
      }

      canvasor.current = new Canvasor(
        containerRef.current!,
        canvasRef.current!,
        data.frame!
      );

      await canvasor.current.create();

      data.pictures.map((picture, index) => {
        canvasor.current?.addPicture(
          data.frame!.layouts[index],
          `file://${picture}`
        );
      });
    })();
  }, [data.frame!]);

  const handlePick = (index: number) => {
    data.setFrame(frames[index]);
  };

  const handleBack = () => {
    phase.previous();
  };

  const handleNext = async () => {
    data.saveCanvas(canvasor.current?.serialize()!);
    phase.next();
  };

  return (
    <Page className="flex items-stretch justify-center">
      <Stepper stage={2} className="flex-none my-auto" />

      {/** Preview */}
      <div
        className="flex-1 flex items-center justify-center max-h-[80vh]"
        ref={containerRef}
      >
        <canvas ref={canvasRef} />
      </div>

      {/** Panel */}
      <div className="flex-1 flex flex-col items-center justify-between">
        <h1 className="font-bold text-4xl">Choose the frame!</h1>

        <div
          className="flex-1 flex flex-wrap rounded-xl bg-surface-container max-h-[60vh] max-w-[40vw] p-12 overflow-y-auto overflow-x-hidden scroll-smooth gap-12 items-start justify-start
            scrollbar-hide"
        >
          {frames.map((frame, index) => (
            <button
              key={index}
              onClick={() => {
                handlePick(index);
              }}
              disabled={frame === data.frame!}
              className={`${
                frame === data.frame!
                  ? 'p-8 bg-surface-container-high shadow-inset rounded'
                  : ''
              } h-[24rem]`}
            >
              <LazyImage
                src={frame.url!}
                className="h-full w-auto object-cover"
              />
            </button>
          ))}
        </div>

        <div className="flex gap-12">
          <Button
            variant="outline"
            onClick={() => {
              handleBack();
            }}
          >
            Back
          </Button>

          <Button
            variant="fill"
            onClick={() => {
              handleNext();
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </Page>
  );
}
