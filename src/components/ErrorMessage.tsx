interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export default function ErrorMessage({ message, onRetry, onDismiss }: ErrorMessageProps) {
  return (
    <div className="alert" role="alert">
      <span>{message}</span>
      <div className="alert__actions">
        {onRetry && (
          <button type="button" className="button button--small" onClick={onRetry}>
            Retry
          </button>
        )}
        {onDismiss && (
          <button type="button" className="button button--small" onClick={onDismiss}>
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
