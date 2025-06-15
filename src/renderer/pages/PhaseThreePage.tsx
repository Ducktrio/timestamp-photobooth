import { useEffect, useState } from 'react';
import Button from 'renderer/components/Button';
import LoadingAnimation from 'renderer/components/LoadingAnimation';
import Page from 'renderer/components/Page';
import { sessionData } from 'renderer/contexts/DataContext';
import { usePhase } from 'renderer/contexts/PhaseContext';
import useIdle from 'renderer/hooks/useIdle';
import useScript from 'renderer/hooks/useScript';
import PaymentCallback from 'renderer/interfaces/PaymentCallback';
import PaymentErrorCallback from 'renderer/interfaces/PaymentErrorCallback';
import BoothManager from 'renderer/services/BoothManager';
import PaymentService from 'renderer/services/PaymentService';

enum State {
  LOADING,
  RUNNING,
  ABORT,
  ERROR,
}

/**
 * Payment phase
 */
export default function PhaseThreePage() {
  const data = sessionData();
  const phase = usePhase();
  const [isIdling, setIsIdling] = useState(false);
  const idle = useIdle(60000, isIdling); // 1 minute
  const [state, setState] = useState<State>(State.LOADING);
  const [error, setError] = useState<Error | null>(null);
  const [token, setToken] = useState('');
  useScript(window.electron.config.SNAP_SCRIPT, {
    'data-client-key': BoothManager.Booth.clientKey,
  });

  useEffect(() => {
    if (!data.frame || !data.quantity)
      throw new Error(
        'Unable to make payment, somehow data for payment is missing'
      );
    console.log(
      window.electron.config.SNAP_SCRIPT,
      BoothManager.Booth.clientKey
    );
    if (token) return;
    (async () => {
      const token = await PaymentService.pay(data.frame!.id, data.quantity);
      setToken(token!);

      window.electron.logger.info('New transaction opened', { token: token });

      setState(State.RUNNING);
    })().catch((error) => {
      setState(State.ERROR);
      setError(error);
      window.electron.logger.error(
        'Cannot request payment from backend',
        error
      );
    });
  }, []);

  const handleNext = () => {
    phase.next();
  };

  useEffect(() => {
    if (state === State.ABORT || state === State.ERROR) setIsIdling(true);
    else setIsIdling(false);

    if (state === State.RUNNING && token)
      window.snap.pay(token, {
        onSuccess: function (result: PaymentCallback) {
          data.setPayment(result);
          window.electron.logger.info('A transaction has been settled', result);
          handleNext();
        },
        onPending: function () {
          window.electron.logger.info(
            'A payment request is closed or left pending'
          );
          setState(State.ABORT);
        },
        onError: function (result: PaymentErrorCallback) {
          window.electron.logger.warn(
            `Error occured on an attempt of payment: ${result.status_message[0]}`,
            result
          );
          setState(State.ERROR);
          setError(new Error(result.status_message[0]));
        },
        onClose: function () {
          window.electron.logger.info('A payment request is closed by user');
          setState(State.ABORT);
        },
      });
  }, [state]);

  if (state === State.LOADING)
    return (
      <Page className="flex flex-col justify-center items-center">
        <LoadingAnimation />
      </Page>
    );

  if (state === State.ERROR)
    return (
      <Page className="flex flex-col justify-center gap-12 items-center">
        <h1 className="text-4xl">
          Your payment failed, we're very sorry for this
        </h1>
        <h2 className="text-xl">{error?.message}</h2>

        <div className="flex flex-row gap-12">
          <Button variant="outline" onClick={() => BoothManager.end()}>
            Retry
          </Button>
        </div>
      </Page>
    );

  if (state === State.ABORT) {
    return (
      <Page className="flex flex-col justify-center gap-12 items-center">
        <h1 className="text-4xl">Seems like you close or ran out time</h1>
        <h2 className="text-xl">Are you willing to continue?</h2>

        <div className="flex flex-row gap-12">
          <Button variant="outline" onClick={() => BoothManager.end()}>
            Cancel
          </Button>
          <Button variant="fill" onClick={() => setState(State.RUNNING)}>
            Pay again
          </Button>
        </div>
      </Page>
    );
  }
  return (
    <Page className="flex justify-center items-center">
      <div className="w-[80rem] h-[70rem]" id="snap-container"></div>
    </Page>
  );
}
