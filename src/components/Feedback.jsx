export function Spinner({ label = "Loading…" }) {
  return (
    <div className="spinner-block" role="status">
      <span className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorBox({ message, onRetry }) {
  return (
    <div className="error-box" role="alert">
      <strong>Something went wrong</strong>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="secondary-btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
