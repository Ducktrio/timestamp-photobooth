import Icon from 'renderer/components/Icon';
import Page from 'renderer/components/Page';
import { usePhase } from 'renderer/contexts/PhaseContext';

export default function WelcomePage() {
  const phase = usePhase();

  const handleLaunch = () => {
    localStorage.setItem('hasUserInteracted', 'true');
    phase.next();
  };

  return (
    <div onClick={() => handleLaunch()}>
      <Page className="flex flex-col justify-between items-center gap-8">
        <Icon type="camera" size="8rem"></Icon>
        <div className="flex flex-col justify-center items-center gap-4">
          <h1 className="font-bold text-on-surface text-8xl">Hi Welcome!</h1>
          <span className="text-4xl">Let's make some memories :)</span>
          <span className="text-lg">Press the screen to start</span>
        </div>

        <span className="text-lg">@Timestamp</span>
      </Page>
    </div>
  );
}
