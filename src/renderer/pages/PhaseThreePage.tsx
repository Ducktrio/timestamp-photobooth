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

      setState(State.RUNNING);

      setToken(token!);
    })();
  }, []);

  const handleNext = () => {
    phase.next();
  };

  useEffect(() => {
    if (!token) return;
    console.log(window.snap);

    if (state === State.RUNNING && token)
      window.snap.pay(token, {
        onSuccess: function (result: PaymentCallback) {
          data.setPayment(result);
          handleNext();
        },
        onPending: function () {},
        onClose: function () {
          setState(State.ABORT);
        },
        onError: function (result: PaymentErrorCallback) {
          setState(State.ERROR);
          setError(new Error(result.status_message[0]));
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

  return (
    <>
      <Page className="flex flex-col justify-center items-center">
        <div className="w-[40rem] h-[30rem]" id="snap-container"></div>
      </Page>
    </>
  );
}
