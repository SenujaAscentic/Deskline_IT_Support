// src/app/features/requests/pages/NewRequestPage.tsx
import { useNavigate } from "react-router-dom";
import { NewRequestForm } from "../components/NewRequestForm";
import { useCreateRequestMutation, type CreateRequestInput } from "../hooks/useCreateRequestMutation";

export function NewRequestPage() {
  const navigate = useNavigate();
  const {mutate, isPending} = useCreateRequestMutation();

    function handleCreate(values: CreateRequestInput) {
      mutate(values, {
        onSuccess: () => navigate("/my-requests"),
      });
    }
  
    

  return (
    <section>
      <h2>New request</h2>
      <NewRequestForm submitting={isPending} onSubmit={handleCreate} />
    </section>
  );
}