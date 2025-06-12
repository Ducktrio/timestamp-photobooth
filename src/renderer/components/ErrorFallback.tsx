import './ErrorFallback.css';

export default function ErrorFallback() {
  return (
    <>
      <div className="error-fallback">
        <div className="error-icon">⚠️</div>
        <h1>Our machine broke</h1>
        <p>
          We’re sorry for the inconvenience. Our machine run into an issue, and
          for now we're out of service. If you need any assistance, please
          contact us <a>timestamp.photobooth@gmail.com</a>
        </p>
      </div>
    </>
  );
}
