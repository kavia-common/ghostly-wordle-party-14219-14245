import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button, Card, Input } from "../../components/common/UI";

// PUBLIC_INTERFACE
export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setInfo("");
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setInfo("If an account exists, a reset email has been sent.");
    } catch (error) {
      setErr("Unable to process request at the moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-auth">
      <Card>
        <h2>Reset your password</h2>
        <p style={{ color: "var(--color-text-muted)" }}>Enter your email address to receive a reset link.</p>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
          <Input label="Email" value={email} onChange={setEmail} name="email" type="email" required />
          {info && <div style={{ color: "var(--color-primary)", fontWeight: 700 }}>{info}</div>}
          {err && <div style={{ color: "var(--color-error)", fontWeight: 700 }}>{err}</div>}
          <Button type="submit" full disabled={loading}>{loading ? "Sending..." : "Send reset link"}</Button>
        </form>
      </Card>
    </div>
  );
}
