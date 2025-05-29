import { useEffect, useState } from 'react';
import Button from 'renderer/components/Button';
import CaptureGallery from 'renderer/components/CaptureGallery';
import Page from 'renderer/components/Page';
import ViewfinderPage from 'renderer/components/ViewfinderPage';
import { sessionData } from 'renderer/contexts/DataContext';
import useCountdown from 'renderer/hooks/useCountdown';

enum State {
  BEGIN,
  ONGOING,
  GAP,
  FINISH,
}

export default function PhaseFivePage() {
  const data = sessionData();

  const INTERVAL = 5;
  const MAX_STAGE = 2 * 2;

  const srcs = [
    'file:///home/wakugumi/Project/timestamp-photobooth/release/app/test_1.png',
    'file:///home/wakugumi/Project/timestamp-photobooth/release/app/test_2.png',

    'file:///home/wakugumi/Project/timestamp-photobooth/release/app/test_3.png',
  ];

  const [stage, setStage] = useState<number>(0);
  const [state, setState] = useState<State>(State.BEGIN);

  const [timer, trigger] = useCountdown(INTERVAL, state === State.ONGOING);

  useEffect(() => {
    setStage(stage + 1);

    if (stage >= MAX_STAGE) {
      setState(State.FINISH);
      return;
    }
    setState(State.GAP);

    console.log('TRIGGER');
  }, [trigger]);

  const handleStart = () => {
    setState(State.ONGOING);
  };

  if (state === State.FINISH)
    return (
      <>
        <Page className="flex flex-col justify-between items-center">
          <CaptureGallery sources={srcs} />
        </Page>
      </>
    );

  return (
    <>
      <ViewfinderPage />
      <Page className="flex flex-col justify-between items-center">
        <h1 className="text-4xl">Make a Pose!</h1>
        <div className="flex flex-row w-full justify-evenly items-center">
          <CaptureGallery sources={srcs} />
          <Button
            disabled={state === State.ONGOING}
            onClick={() => {
              handleStart();
            }}
          >
            {state === State.GAP ? 'Continue' : timer}
          </Button>
        </div>
      </Page>
    </>
  );
}
