import './ErrorFallback.css';

export default function ErrorFallback() {
  return (
    <>
      <div className="error-fallback">
        <div className="error-icon">⚠️</div>
        <h1>our machine broke</h1>
        <p>
          we’re sorry for the inconvenience. our machine run into an issue, and
          for now we're out of service. if you need any assistance, please
          contact us <a>timestamp.photobooth@gmail.com</a>
        </p>
      </div>
    </>
  );
}
