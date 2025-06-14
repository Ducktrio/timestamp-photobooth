import { useEffect, useRef, useState } from 'react';
import Button from 'renderer/components/Button';
import LazyImage from 'renderer/components/LazyImage';
import Page from 'renderer/components/Page';
import Stepper from 'renderer/components/Stepper';
import { sessionData } from 'renderer/contexts/DataContext';
import { usePhase } from 'renderer/contexts/PhaseContext';
import useFetchCaptures from 'renderer/hooks/useFetchCaptures';
import { Layout } from 'renderer/interfaces/Frame';
import Canvasor from 'renderer/modules/Canvasor';

export default function PhaseSixPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasor = useRef<Canvasor | null>(null);
  const data = sessionData();
  const phase = usePhase();

  const pictures = useFetchCaptures();
  const [selected, setSelected] = useState<string[]>([]);
  const [slots, setSlots] = useState<Layout[]>([]);

  useEffect(() => {
    (async () => {
      canvasor.current = new Canvasor(
        containerRef.current!,
        canvasRef.current!,
        data.frame!
      );
      setSlots(data.frame?.layouts.flat()!);

      await canvasor.current.create();
    })();

    return () => {
      (async () => {
        await canvasor.current?.dispose();
      })();
    };
  }, []);

  const handlePick = async (layout: Layout, src: string) => {
    canvasor.current?.addPicture(layout, `file://${src}`);
    setSelected([...selected.flat(), src]);
  };
  const handleReset = async () => {
    setSelected([]);
    await canvasor.current?.dispose();
    await canvasor.current?.create();
    setSlots(data.frame?.layouts.flat()!);
  };

  const handleConfirm = () => {
    data.setPictures(selected);
    phase.next();
  };

  return (
    <>
      <Page className="flex items-stretch justify-center">
        <Stepper stage={1} className="my-auto" />
        {/** Preview */}
        <div
          className="flex-1 flex items-center justify-center max-h-[80vh]"
          ref={containerRef}
        >
          <canvas ref={canvasRef} />
        </div>

        {/** Panel */}
        <div className="flex-1 flex flex-col items-center justify-between">
          <h1 className="font-bold text-4xl">Choose your photos!</h1>
          <div
            className="flex-1 w-full flex flex-wrap rounded-xl gap-16 outline outline-4 outline-outline bg-surface max-h-[60vh] max-w-[40vw] p-[4rem]
            overflow-y-auto overflow-x-hidden scroll-smooth items-start justify-between
            scrollbar-hide"
          >
            {pictures.map((pict, index) => (
              <button
                key={index}
                className={`rounded-lg`}
                onClick={() => {
                  if (slots.length <= 0) return;
                  handlePick(slots.shift()!, pict);
                }}
              >
                <LazyImage
                  src={`file://${pict}`}
                  className="h-[12rem] w-auto rounded-lg object-cover"
                />
              </button>
            ))}
          </div>
          <div className="flex flex-row gap-12 justify-between">
            <Button
              type="primary"
              variant="outline"
              onClick={() => handleReset()}
              className="mx-auto"
            >
              Reset
            </Button>
            <Button
              type="primary"
              variant="fill"
              disabled={slots.length > 0}
              onClick={() => handleConfirm()}
              className="mx-auto"
            >
              Confirm
            </Button>
          </div>
        </div>
      </Page>
    </>
  );
}
