interface ErrorPageProps {
  error: Error;
}

export default function ErrorPage({ error }: ErrorPageProps) {
  return (
    <>
      <div
        className="m-8 p-8 rounded-lg bg-error w-[40vw] flex flex-col items-start
    justify-ed text-wrap text-on-error text-[4rem] font-bold"
      >
        We're very sorry for the inconvenient, our machine is not working at the
        moment. :(
        <small className="text-sm">{error.message}</small>
      </div>
    </>
  );
}
