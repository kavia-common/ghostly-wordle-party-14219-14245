import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button, Card, Input } from "../../components/common/UI";

// PUBLIC_INTERFACE
export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(username, password);
      nav("/");
    } catch (error) {
      setErr(error.payload?.non_field_errors?.[0] || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-auth">
      <Card>
        <h2>Welcome back</h2>
        <p style={{ color: "var(--color-text-muted)" }}>Log in to continue your ghostly streak.</p>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
          <Input label="Username" value={username} onChange={setUsername} name="username" required autoComplete="username" />
          <Input label="Password" type="password" value={password} onChange={setPassword} name="current-password" required autoComplete="current-password" />
          {err && <div style={{ color: "var(--color-error)", fontWeight: 700 }}>{err}</div>}
          <Button type="submit" full disabled={loading}>{loading ? "Logging in..." : "Log in"}</Button>
        </form>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
          <Link to="/register">Create an account</Link>
          <Link to="/forgot">Forgot password?</Link>
        </div>
      </Card>
    </div>
  );
}
