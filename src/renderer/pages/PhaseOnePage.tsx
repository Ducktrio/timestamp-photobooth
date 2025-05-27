import { useEffect, useState } from 'react';
import ExitButton from 'renderer/components/ExitButton';
import LazyImage from 'renderer/components/LazyImage';
import NextButton from 'renderer/components/NextButton';
import Page from 'renderer/components/Page';
import Selector from 'renderer/components/Selector';
import { sessionData } from 'renderer/contexts/DataContext';
import { usePhase } from 'renderer/contexts/PhaseContext';
import { useFramePreview } from 'renderer/hooks/useFramePreview';
import Frame from 'renderer/interfaces/Frame';

interface Options {
  label: string;
  split: boolean;
}

export default function PhaseOnePage() {
  const [selected, setSelected] = useState<number>(-1);
  const phase = usePhase();
  const data = sessionData();
  const [options] = useState<Options[]>([
    {
      label: 'Wide',
      split: false,
    },
    {
      label: 'Strip',
      split: true,
    },
  ]);
  const [category, setCategory] = useState<Options>(options[0]);

  const rawFrames = useFramePreview(category.split);
  const [frames, setFrames] = useState<Frame[]>([]);

  useEffect(() => {
    data.setSplit(frames[selected]?.split);
    data.setCount(frames[selected]?.count);
    data.setFrame(frames[selected]);
  }, [selected]);

  useEffect(() => {
    setFrames(rawFrames.filter((x) => x.split === category?.split));
  }, [category, rawFrames]);

  const handleNext = () => {
    phase.next();
  };

  return (
    <Page className="flex flex-col justify-between items-center">
      <ExitButton />
      {selected != -1 && (
        <NextButton
          onClick={() => {
            handleNext();
          }}
        />
      )}

      <h1 className="text-8xl font-bold">Choose a Template</h1>

      <div className="flex flex-row">
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => {
              setCategory(option);
              setSelected(-1);
            }}
            className={`px-24 py-4 text-2xl ${
              option === category ? 'border-b-8 border-on-surface' : ''
            }`}
          >
            {option.label}
          </div>
        ))}
      </div>

      <Selector
        onSelected={(index) => {
          setSelected(index);
        }}
        reset={category}
      >
        {frames.map((value, index) => (
          <div key={index}>
            <LazyImage
              src={value.url!}
              className="object-fit h-[24rem] mx-auto"
            />
          </div>
        ))}
      </Selector>
    </Page>
  );
}
