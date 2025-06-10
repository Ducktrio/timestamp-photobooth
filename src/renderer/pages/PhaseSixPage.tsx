import { useEffect, useRef, useState } from 'react';
import Button from 'renderer/components/Button';
import LazyImage from 'renderer/components/LazyImage';
import Page from 'renderer/components/Page';
import { sessionData } from 'renderer/contexts/DataContext';
import useFetchCaptures from 'renderer/hooks/useFetchCaptures';
import { Layout } from 'renderer/interfaces/Frame';
import Canvasor from 'renderer/modules/Canvasor';

export default function PhaseSixPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasor = useRef<Canvasor | null>(null);
  const data = sessionData();

  const pictures = useFetchCaptures();
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
  };
  const handleReset = async () => {
    await canvasor.current?.dispose();
    await canvasor.current?.create();
    setSlots(data.frame?.layouts.flat()!);
  };

  return (
    <>
      <Page className="flex items-stretch justify-center">
        {/** Preview */}
        <div
          className="flex-1 flex items-center justify-center max-h-[80vh]"
          ref={containerRef}
        >
          <canvas ref={canvasRef} />
        </div>

        {/** Panel */}
        <div className="flex-1 flex flex-col items-center justify-evenly">
          <h1 className="font-bold text-4xl">Choose your photos!</h1>
          <div
            className="flex-1 flex flex-wrap rounded-xl bg-surface-container-highest max-h-[60vh] max-w-[40vw] p-12 overflow-y-auto overflow-x-hidden scroll-smooth gap-4 items-start justify-start
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
          <div className="flex">
            <Button
              type="tertiary"
              variant="outline"
              onClick={() => handleReset()}
            >
              Reset
            </Button>
          </div>
        </div>
      </Page>
    </>
  );
}
