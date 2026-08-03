
type Props = { onRetry: () => void };
export function ErrorState({ onRetry }: Props) {
  return (
    <div className="state-message state-error">
      <p>Something went wrong loading requests.</p>
      <button onClick={onRetry}>Retry</button>
    </div>
  );
}