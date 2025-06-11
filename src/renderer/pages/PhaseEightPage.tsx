import { useEffect, useRef, useState } from 'react';
import Button from 'renderer/components/Button';
import Page from 'renderer/components/Page';
import Stepper from 'renderer/components/Stepper';
import { sessionData } from 'renderer/contexts/DataContext';
import { usePhase } from 'renderer/contexts/PhaseContext';
import useFetchFilters from 'renderer/hooks/useFetchFilters';
import Canvasor from 'renderer/modules/Canvasor';

export default function PhaseEightPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasor = useRef<Canvasor | null>(null);
  const data = sessionData();
  const phase = usePhase();
  const filters = useFetchFilters();
  const [selected, setSelected] = useState(0);

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

      await canvasor.current.deserialize(data.canvas!);
    })();
  }, []);

  const handleSelect = async (index: number) => {
    await canvasor.current?.applyFilter(filters[index]);
    setSelected(index);
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
      <Stepper stage={3} className="flex-none my-auto" />

      {/** Preview */}
      <div
        className="flex-1 flex items-center justify-center max-h-[80vh]"
        ref={containerRef}
      >
        <canvas ref={canvasRef}></canvas>
      </div>

      {/** Panel **/}
      <div className="flex-1 flex flex-col items-center justify-between">
        <h1 className="font-bold text-4xl">Choose the filter!</h1>

        <div
          className="flex-1 flex flex-wrap rounded-xl bg-surface-container max-h-[60vh] max-w-[40vw]
          p-12 overflow-y-auto overflow-x-hidden scroll-smooth gap-12
          items-center justify-evenly
            scrollbar-hide"
        >
          {filters.map((filter, index) => (
            <button
              key={index}
              className={`p-12 rounded outline outline-primary w-[18rem] text-xl ${
                index === selected ? 'bg-primary text-on-primary' : ''
              }`}
              onClick={() => handleSelect(index)}
              disabled={index === selected}
            >
              {filter.name}
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
