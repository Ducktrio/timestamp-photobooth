import { ReactNode, useEffect } from 'react';
import ErrorPage from 'renderer/pages/ErrorPage';

interface ErrorHandlerProps {
  error: Error;
  customChildren?: ReactNode;
}
export const ErrorHandler = ({
  error,
  customChildren = null,
}: ErrorHandlerProps) => {
  useEffect(() => {
    console.error(error);
  });

  if (customChildren) return <>{customChildren}</>;

  return (
    <>
      <ErrorPage error={error} />
    </>
  );
};
