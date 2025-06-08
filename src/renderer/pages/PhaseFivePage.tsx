import { useEffect, useState } from 'react';
import Button from 'renderer/components/Button';
import CaptureGallery from 'renderer/components/CaptureGallery';
import Page from 'renderer/components/Page';
import ViewfinderPage from 'renderer/components/ViewfinderPage';
import { sessionData } from 'renderer/contexts/DataContext';
import useCameraTrigger from 'renderer/hooks/useCameraTrigger';
import useCountdown from 'renderer/hooks/useCountdown';
import useFetchCaptures from 'renderer/hooks/useFetchCaptures';

enum State {
  COUNTING,
  CAPTURING,
  READY,
  FINISH,
}

export default function PhaseFivePage() {
  const data = sessionData();
  const INTERVAL = 5;

  //const MAX_STAGE = 2 * 2;
  const MAX_STAGE = data.count;
  const [stage, setStage] = useState<number>(0);
  const [state, setState] = useState<State>(State.READY);
  const [timer, trigger] = useCountdown(INTERVAL, state === State.COUNTING);
  const camera = useCameraTrigger();
  const srcs = useFetchCaptures(stage);

  /**
   * Effect runs when timer runs out
   */
  useEffect(() => {
    if (state === State.READY) return;
    (async () => {
      setState(State.CAPTURING);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // trigger camera capture
      await camera.trigger();

      setStage(state + 1);

      if (stage >= MAX_STAGE) {
        setState(State.FINISH);
        return;
      }

      setState(State.READY);
    })();
  }, [trigger]);

  /**
   * Start counting (the timer hook starts)
   */
  const handleStart = () => {
    setState(State.COUNTING);
  };

  if (state === State.FINISH) return <></>;
  return (
    <>
      {
        // record attribute only when its counting to capture}
        <ViewfinderPage
          record={state === State.COUNTING}
          pause={state === State.CAPTURING}
        />
      }
      <Page className="flex flex-col justify-between items-center z-[1]">
        <h1 className="text-4xl z-[1] text-surface font-bold">Make a Pose!</h1>
        <div className="flex flex-row w-full justify-evenly items-center z-[1] p-8">
          <CaptureGallery
            className={`flex-1 space-x-4 ${
              state === State.COUNTING ? 'relative bottom-[-20rem]' : ''
            }`}
            sources={srcs}
          />
          <Button
            className="flex-none"
            disabled={state === State.COUNTING || state === State.CAPTURING}
            variant="fill"
            onClick={() => {
              handleStart();
            }}
          >
            {state === State.READY
              ? 'Continue'
              : state === State.CAPTURING
              ? 'Processing'
              : timer}
          </Button>
        </div>
      </Page>
    </>
  );
}
