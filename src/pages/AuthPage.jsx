import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import Field from "../components/Field.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { validateAuth } from "../utils/helpers.js";

export default function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const { user, login, register } = useAuth();
  const toast = useToast();
  const location = useLocation();

  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  // already signed in: go back to where the visitor was heading
  if (user) return <Navigate to={location.state?.from?.pathname || "/"} replace />;

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const found = validateAuth(mode, values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setBusy(true);
    try {
      const result = await (isRegister ? register(values) : login(values));
      if (!result.ok) setFormError(result.error);
      else toast(`Welcome, ${result.user.name.split(" ")[0]}!`);
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <Brand />
        <div>
          <h1>Make every rupee count.</h1>
          <p>Record income and expenses, set a monthly budget, and print a clean financial report whenever you need one.</p>
        </div>
      </section>

      <section className="auth-panel">
        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <h2>{isRegister ? "Create your account" : "Sign in"}</h2>
          <p className="auth-subtitle">
            {isRegister ? "Start tracking your money in under a minute." : "Welcome back. Enter your details to continue."}
          </p>

          {isRegister && (
            <Field label="Full name" id="auth-name" name="name" type="text" autoComplete="name"
              value={values.name} onChange={handleChange} error={errors.name} />
          )}

          <Field label="Email" id="auth-email" name="email" type="email" autoComplete="email"
            placeholder="you@example.com" value={values.email} onChange={handleChange} error={errors.email} />

          <Field label="Password" id="auth-password" name="password" type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            value={values.password} onChange={handleChange} error={errors.password} />

          {isRegister && (
            <Field label="Confirm password" id="auth-confirm" name="confirm" type="password"
              autoComplete="new-password" value={values.confirm} onChange={handleChange} error={errors.confirm} />
          )}

          {formError && <p className="auth-error" role="alert">{formError}</p>}

          <button type="submit" className="primary-btn auth-submit" disabled={busy}>
            {busy ? "Please wait…" : isRegister ? "Create account" : "Sign in"}
          </button>

          <p className="auth-switch">
            {isRegister ? "Already have an account?" : "New to Spendly?"}{" "}
            <Link className="text-btn" to={isRegister ? "/login" : "/register"}>
              {isRegister ? "Sign in" : "Create an account"}
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}
