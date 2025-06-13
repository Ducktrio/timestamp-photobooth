import { useState } from 'react';
import Button from 'renderer/components/Button';
import CameraPreview from 'renderer/components/CameraPreview';
import LoadingAnimation from 'renderer/components/LoadingAnimation';
import Page from 'renderer/components/Page';
import { usePhase } from 'renderer/contexts/PhaseContext';

/**
 * Phase four of the session.
 *
 * Machine checks for main functionality.
 * User prepares by viewing the camera viewfinder on the screen.
 * When user ready, they can proceed to next phase, which is the capturin session, by clicking the button below the viewfinder
 */
export default function PhaseFourPage() {
  const phase = usePhase();
  const [isRun, setIsRun] = useState(true);

  const handleNext = async () => {
    setIsRun(false);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    phase.next();
  };

  if (isRun)
    return (
      <Page className="flex flex-col justify-between items-center">
        <h1 className="text-8xl font-bold">Are you ready?</h1>

        <div className="relative rounded-xl">
          <CameraPreview />
        </div>

        <Button
          onClick={() => {
            handleNext();
          }}
        >
          Yeah!
        </Button>
      </Page>
    );

  return (
    <Page className="flex flex-col justify-evenly gap-12 items-center">
      <h1 className="text-4xl font-bold">Get Ready!!!</h1>
      <div className="flex rounded bg-primary p-8">
        <LoadingAnimation />
      </div>
    </Page>
  );
}
