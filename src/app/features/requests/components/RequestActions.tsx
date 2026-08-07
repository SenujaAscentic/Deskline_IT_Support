// src/app/features/requests/components/RequestActions.tsx
import { useState } from "react";
import type { Request } from "../types";
import type { Session } from "../../auth/session";
import { useUpdateRequestMutation } from "../hooks/useUpdateRequestMutation";
import { useStaffList } from "../hooks/useStaffList";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";

type Props = {
  request: Request;
  session: Session;
};

type ConfirmKind = "cancel" | "close" | null;

export function RequestActions({ request, session }: Props) {
  const [confirmKind, setConfirmKind] = useState<ConfirmKind>(null);
  const { mutate, isPending } = useUpdateRequestMutation(request.id);
  const staffList = useStaffList();

  const isStaff = session.role === "technician" || session.role === "admin";
  const isAdmin = session.role === "admin";
  const isOwner = session.role === "requester" && request.requesterId === session.userId;
  const isActive = request.status === "open" || request.status === "pending";

  const canCancel = isOwner && request.status === "open";
  const canSetPending = isStaff && request.status === "open";
  const canReopen = isStaff && request.status === "pending";
  const canAssignToMe = isStaff && isActive && request.assigneeId !== session.userId;
  const canReassign = isAdmin && isActive;
  const canClose = isAdmin && isActive;

  function handleConfirm() {
    if (confirmKind === "cancel") {
      mutate({ status: "cancelled" }, { onSuccess: () => setConfirmKind(null) });
    } else if (confirmKind === "close") {
      mutate({ status: "closed" }, { onSuccess: () => setConfirmKind(null) });
    }
  }

  const hasAnyAction = canCancel || canSetPending || canReopen || canAssignToMe || canReassign || canClose;
  if (!hasAnyAction) return null;

  return (
    <div className="request-actions">
      {canSetPending && (
        <button className="btn" disabled={isPending} onClick={() => mutate({ status: "pending" })}>
          Set pending
        </button>
      )}
      {canReopen && (
        <button className="btn" disabled={isPending} onClick={() => mutate({ status: "open" })}>
          Reopen
        </button>
      )}
      {canAssignToMe && (
        <button className="btn" disabled={isPending} onClick={() => mutate({ assigneeId: session.userId })}>
          Assign to me
        </button>
      )}
      {canReassign && (
        <select
          className="reassign-select"
          value={request.assigneeId ?? ""}
          disabled={isPending}
          onChange={(e) => mutate({ assigneeId: e.target.value || null })}
        >
          <option value="">Unassigned</option>
          {staffList.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      )}
      {canCancel && (
        <button className="btn btn--danger" disabled={isPending} onClick={() => setConfirmKind("cancel")}>
          Cancel request
        </button>
      )}
      {canClose && (
        <button className="btn btn--danger" disabled={isPending} onClick={() => setConfirmKind("close")}>
          Close request
        </button>
      )}

      <ConfirmDialog
        open={confirmKind !== null}
        title={confirmKind === "cancel" ? "Cancel this request?" : "Close this request?"}
        description={
          confirmKind === "cancel"
            ? "This can't be undone — the request will be marked as cancelled."
            : "This can't be undone — the request will be marked as closed."
        }
        confirmLabel={confirmKind === "cancel" ? "Yes, cancel it" : "Yes, close it"}
        cancelLabel="Go back"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmKind(null)}
      />
    </div>
  );
}