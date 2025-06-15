import { useEffect, useState } from 'react';
import Button from 'renderer/components/Button';
import CaptureGallery from 'renderer/components/CaptureGallery';
import Page from 'renderer/components/Page';
import Viewfinder from 'renderer/components/Viewfinder';
import { sessionData } from 'renderer/contexts/DataContext';
import { usePhase } from 'renderer/contexts/PhaseContext';
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
  const MAX_STAGE = data.count * 2;
  const [stage, setStage] = useState<number>(1);
  const [state, setState] = useState<State>(State.READY);
  const [timer, trigger] = useCountdown(INTERVAL, state === State.COUNTING);
  const camera = useCameraTrigger();
  const srcs = useFetchCaptures(stage);
  const phase = usePhase();
  const [onStream, setOnStream] = useState(false);
  const [hasCaptured, setHasCaptured] = useState(false);

  /**
   * Effect runs when timer runs out
   */
  useEffect(() => {
    if (state === State.READY) return;
    (async () => {
      setState(State.CAPTURING);
      setHasCaptured(false);

      // trigger camera capture
      await camera.trigger();

      setStage(stage + 1);

      if (stage >= MAX_STAGE) {
        setState(State.FINISH);
        return;
      }

      setHasCaptured(true);
    })();
  }, [trigger]);

  useEffect(() => {
    if (timer <= 3 && timer > 0) {
      const beep = new Audio('beep.mp3');

      beep.play();
    }
  }, [timer]);

  useEffect(() => {
    if (onStream && hasCaptured) handleStart();
  }, [onStream, hasCaptured]);

  /**
   * Start counting (the timer hook starts)
   */
  const handleStart = () => {
    setState(State.COUNTING);
  };

  if (state === State.FINISH) {
    phase.next();
  }
  return (
    <>
      {
        // record attribute only when its counting to capture}
        <Viewfinder
          pause={state === State.CAPTURING || state === State.FINISH}
          onStream={setOnStream}
        />
      }
      <Page className="flex flex-col justify-between items-center z-[1] overflow-y-hidden">
        <h1 className="text-4xl z-[1] text-surface font-bold">Make a Pose!</h1>
        <div className="flex flex-row w-full justify-evenly items-center z-[1] p-8">
          <CaptureGallery
            className={`flex-1 space-x-4 ${
              state === State.COUNTING ? 'hidden' : ''
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
              ? 'Start'
              : state === State.CAPTURING
              ? 'Processing'
              : timer}
          </Button>
        </div>
      </Page>
    </>
  );
}
