import { useEffect, useState } from 'react';
import LoadingAnimation from 'renderer/components/LoadingAnimation';
import Page from 'renderer/components/Page';
import { sessionData } from 'renderer/contexts/DataContext';
import { usePhase } from 'renderer/contexts/PhaseContext';
import { ErrorHandler } from 'renderer/helpers/ErrorHandler';
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

export default function PhaseThreePage() {
  const data = sessionData();
  const phase = usePhase();
  const [state, setState] = useState<State>(State.LOADING);
  const [error, setError] = useState<Error | null>(null);
  const [token, setToken] = useState('');
  useScript(window.electron.config.SNAP_SCRIPT, {
    'data-client-key': BoothManager.Booth.clientKey,
  });

  useEffect(() => {
    console.log(
      window.electron.config.SNAP_SCRIPT,
      BoothManager.Booth.clientKey
    );
    if (token) return;
    (async () => {
      const token = await PaymentService.pay(data.frame!.id, data.quantity);

      window.electron.logger.info('New transaction opened', { token: token });

      setState(State.RUNNING);

      setToken(token!);
    })().catch((error) => {
      throw error;
    });
  }, []);

  const handleNext = () => {
    phase.next();
  };

  useEffect(() => {
    if (!token) return;

    if (state === State.RUNNING && token)
      window.snap.pay(token, {
        onSuccess: function (result: PaymentCallback) {
          data.setPayment(result);
          window.electron.logger.info('A transaction has been settled', result);
          handleNext();
        },
        onPending: function () {},
        onError: function (result: PaymentErrorCallback) {
          window.electron.logger.warn(
            'Error occured on an attempt of payment',
            result
          );
          setState(State.ERROR);
          setError(new Error(result.status_message[0]));
        },
        onClose: function () {
          window.electron.logger.info('A payment request is closed by user');
          phase.restart();
        },
      });
  }, [token, state]);

  if (state === State.LOADING)
    return (
      <Page className="flex flex-col justify-center items-center">
        <LoadingAnimation />
      </Page>
    );

  if (state === State.ERROR) return <ErrorHandler error={error!} />;

  if (state === State.ABORT) phase.restart();

  return (
    <>
      <Page className="flex flex-col justify-center items-center">
        <div className="w-[40rem] h-[30rem]" id="snap-container"></div>
      </Page>
    </>
  );
}
