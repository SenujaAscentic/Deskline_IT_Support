// src/app/features/auth/LoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "./useLoginMutation";
import { ApiError } from "../../shared/api/client";

type FormErrors = { email?: string; password?: string };

export function LoginPage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [authError, setAuthError] = useState<string | null>(null);

  const errors: FormErrors = {};
  if (!email.trim()) errors.email = "Email is required.";
  else if (!email.includes("@")) errors.email = "Enter a valid email address.";
  if (!password) errors.password = "Password is required.";

  const isValid = Object.keys(errors).length === 0;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setAuthError(null);
    if (!isValid) return;

    mutate(
      { email: email.trim(), password },
      {
        onSuccess: () => navigate("/my-requests"),
        onError: (err) => {
          if (err instanceof ApiError && err.status === 401) {
            setAuthError("Incorrect email or password.");
          } else {
            setAuthError("Something went wrong. Please try again.");
          }
        },
      }
    );
  }

  return (
    <section className="login-page">
      <h2>Log in</h2>

      <p className="login-hints">
        Demo accounts (password: <code>password</code>):<br />
        requester — amara@corp.test · technician — devin@corp.test · admin — nadia@corp.test
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          />
          {touched.email && errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          />
          {touched.password && errors.password && <p className="field-error">{errors.password}</p>}
        </div>

        {authError && <p className="field-error">{authError}</p>}

        <button className="btn btn--primary" type="submit" disabled={!isValid || isPending}>
          {isPending ? "Logging in…" : "Log in"}
        </button>
      </form>
    </section>
  );
}