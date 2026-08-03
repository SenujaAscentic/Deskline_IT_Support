// src/app/features/requests/pages/NewRequestPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NewRequestForm } from "../components/NewRequestForm";
import type { Category, Priority } from "../types";

export function NewRequestPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  function handleCreate(values: {
  title: string;
  description: string;
  category: Category;
  priority: Priority;
}) {
  console.log("Would create request:", values);
  setSubmitting(true);
  setTimeout(() => {
    setSubmitting(false);
    navigate("/my-requests");
  }, 600);
}

  return (
    <section>
      <h2>New request</h2>
      <NewRequestForm submitting={submitting} onSubmit={handleCreate} />
    </section>
  );
}