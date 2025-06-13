import { useEffect, useState } from 'react';
import ExitButton from 'renderer/components/ExitButton';
import NextButton from 'renderer/components/NextButton';
import Page from 'renderer/components/Page';
import Selector from 'renderer/components/Selector';
import { sessionData } from 'renderer/contexts/DataContext';
import { usePhase } from 'renderer/contexts/PhaseContext';
import useIdle from 'renderer/hooks/useIdle';

/**
 * Phase two of the session.
 *
 * User select number of prints
 */
export default function PhaseTwoPage() {
  const data = sessionData();
  const idle = useIdle(60000, true);

  const [selected, setSelected] = useState(-1);

  const [options, setOptions] = useState<number[]>([]);

  const phase = usePhase();

  useEffect(() => {
    if (data.split) setOptions([2, 4, 6, 8, 10]);
    else setOptions([1, 2, 3, 4, 5]);
  }, []);

  useEffect(() => {
    data.setQuantity(options[selected]);
  }, [selected]);

  const handleNext = () => {
    phase.jumpTo(4);
  };

  return (
    <Page className="flex flex-col justify-between items-center">
      <ExitButton />
      {selected >= 0 && (
        <NextButton
          onClick={() => {
            handleNext();
          }}
        />
      )}
      <h1 className="text-8xl font-bold">How many prints?</h1>

      <Selector
        onSelected={(index) => {
          setSelected(index);
          console.log(index);
        }}
      >
        {options.map((opt, index) => (
          <div key={index}>
            <span className="text-[8rem] font-thin mx-auto">{opt}</span>
          </div>
        ))}
      </Selector>

      <div className="w-full flex justify-start items-center">
        <small className="text-4xl">
          estimated price: Rp. {data.frame!.price * options[selected]}
        </small>
      </div>
    </Page>
  );
}
