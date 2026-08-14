// src/app/features/requests/components/CommentBox.tsx
import { useState } from "react";
import { useAddMessageMutation } from "../hooks/useAddMessageMutation";
import { ApiError } from "../../../shared/api/client";

type Props = {
  requestId: string;
  canComment: boolean; // open/pending only, per spec
};

export function CommentBox({ requestId, canComment }: Props) {
  const [body, setBody] = useState("");
  const { mutate, isPending , error } = useAddMessageMutation(requestId);

  if (!canComment) {
    return null; // thread is read-only when closed/cancelled — no comment box at all
  }

  const errorMessage = 
  error instanceof ApiError 
    ? error.status === 403
      ? "You can't comment on this request."
      : "Couldn't send your comment. Try again."
    : null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;

    mutate(trimmed, {
      onSuccess: () => setBody(""),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="comment-box">
      <div className="form-field">
        <label htmlFor="comment-body">Add a comment</label>
        <textarea
          id="comment-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={isPending}
        />
      </div>
      {errorMessage && <p className="field-error">{errorMessage}</p>}
      <button className="btn btn--primary" type="submit" disabled={isPending || !body.trim()}>
        {isPending ? "Sending…" : "Send"}
      </button>
    </form>
  );
}