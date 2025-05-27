import { usePopup } from '../contexts/PopupContext';
import Icon from './Icon';
import { ConfirmPopup } from './Popup';
import { usePhase } from '../contexts/PhaseContext';

export default function ExitButton() {
  const { showPopup, hidePopup } = usePopup();
  const phase = usePhase();
  const exit = () => {
    phase.restart();
  };
  const styles =
    'absolute top-0 left-0 m-8 rounded-full p-4 gap-2 flex flex-row items-center justify-center text-on-surface';
  const handle = () => {
    console.log('handle exit');
    showPopup(
      <ConfirmPopup
        message="Are you sure to cancel?"
        onReject={() => {
          hidePopup();
        }}
        onConfirm={() => {
          exit();
          hidePopup();
        }}
      ></ConfirmPopup>
    );
  };

  return (
    <div className={styles} onClick={() => handle()}>
      <Icon type="close" size="4rem"></Icon>
    </div>
  );
}
