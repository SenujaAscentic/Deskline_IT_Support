import type { Message } from "../types"



type Props ={
    messages : Message[];
    userNames: Map<string,string>;
};

export function MessageThread({ messages, userNames }: Props) {
  if (messages.length === 0) {
    return <p className="state-message">No messages yet.</p>;
  }

  return (
    <ul className="message-thread">
      {messages.map((m) => (
        <li key={m.id} className="message">
          <div className="message__meta">
            <span className="message__author">{userNames.get(m.authorId) ?? "Unknown user"}</span>
            <span className="message__time">{new Date(m.createdAt).toLocaleString()}</span>
          </div>
          <p className="message__body">{m.body}</p>
        </li>
      ))}
    </ul>
  );
}