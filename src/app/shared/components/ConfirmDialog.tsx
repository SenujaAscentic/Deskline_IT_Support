// ConfirmDialog.tsx
type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open, title, description,
  confirmLabel = "Confirm", cancelLabel = "Cancel",
  onConfirm, onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="dialog-backdrop" onClick={onCancel}>
      <div
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="dialog-title">{title}</h3>
        {description && <p>{description}</p>}
        <div className="dialog-actions">
          <button  className="btn" onClick={onCancel}>{cancelLabel}</button>
          <button onClick={onConfirm} className="btn btn--danger">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}