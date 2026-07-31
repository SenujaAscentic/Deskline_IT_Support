import { useState } from "react";
import type { Category, Priority } from "../types";

type FormValues = {
  title: string;
  description: string;
  category: Category | "";
  priority: Priority | "";
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (values.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters.";
  }
  if (values.description.trim().length < 10) {
    errors.description = "Please describe the issue in at least 10 characters.";
  }
  if (values.category === "") {
    errors.category = "Please choose a category.";
  }
  if (values.priority === "") {
    errors.priority = "Please choose a priority.";
  }
  return errors;
}

type Props = {
  submitting: boolean;
  onSubmit: (values: { title: string; description: string; category: Category; priority: Priority }) => void;
};

export function NewRequestForm({ submitting, onSubmit }: Props) {
  const [values, setValues] = useState<FormValues>({
    title: "",
    description: "",
    category: "",
    priority: "",
  });
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});

  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;

  function markTouched(field: keyof FormValues) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ title: true, description: true, category: true, priority: true });
    if (!isValid) return;
    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      category: values.category as Category,
      priority: values.priority as Priority,
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={values.title}
          onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
          onBlur={() => markTouched("title")}
        />
        {touched.title && errors.title && <p className="field-error">{errors.title}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          onBlur={() => markTouched("description")}
        />
        {touched.description && errors.description && <p className="field-error">{errors.description}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={values.category}
          onChange={(e) => setValues((v) => ({ ...v, category: e.target.value as Category }))}
          onBlur={() => markTouched("category")}
        >
          <option value="">Select a category…</option>
          <option value="hardware">Hardware</option>
          <option value="software">Software</option>
          <option value="facilities">Facilities</option>
          <option value="access">Access</option>
        </select>
        {touched.category && errors.category && <p className="field-error">{errors.category}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={values.priority}
          onChange={(e) => setValues((v) => ({ ...v, priority: e.target.value as Priority }))}
          onBlur={() => markTouched("priority")}
        >
          <option value="">Select a priority…</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        {touched.priority && errors.priority && <p className="field-error">{errors.priority}</p>}
      </div>

      <button type="submit" disabled={!isValid || submitting}>
        {submitting ? "Creating…" : "Create request"}
      </button>
    </form>
  );
}