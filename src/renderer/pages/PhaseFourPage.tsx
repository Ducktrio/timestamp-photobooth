import Button from 'renderer/components/Button';
import CameraPreview from 'renderer/components/CameraPreview';
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

  const handleNext = () => {
    phase.next();
  };

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
}
