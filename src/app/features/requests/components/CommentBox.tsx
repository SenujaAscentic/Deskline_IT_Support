// src/app/features/requests/components/CommentBox.tsx
import { useState } from "react";
import { useAddMessageMutation } from "../hooks/useAddMessageMutation";

type Props = {
  requestId: string;
  canComment: boolean; // open/pending only, per spec
};

export function CommentBox({ requestId, canComment }: Props) {
  const [body, setBody] = useState("");
  const { mutate, isPending, isError } = useAddMessageMutation(requestId);

  if (!canComment) {
    return null; // thread is read-only when closed/cancelled — no comment box at all
  }

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
      {isError && <p className="field-error">Couldn't send your comment. Try again.</p>}
      <button className="btn btn--primary" type="submit" disabled={isPending || !body.trim()}>
        {isPending ? "Sending…" : "Send"}
      </button>
    </form>
  );
}