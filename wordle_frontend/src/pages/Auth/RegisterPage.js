import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button, Card, Input } from "../../components/common/UI";

// PUBLIC_INTERFACE
export default function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function setField(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await register(form);
      nav("/");
    } catch (error) {
      const p = error.payload || {};
      const msg = p.username?.[0] || p.password?.[0] || p.email?.[0] || "Failed to register.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-auth">
      <Card>
        <h2>Create your account</h2>
        <p style={{ color: "var(--color-text-muted)" }}>Join the party and play Wordle with style.</p>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
          <Input label="Username" value={form.username} onChange={(v)=>setField("username", v)} name="username" required />
          <Input label="Email (optional)" value={form.email} onChange={(v)=>setField("email", v)} name="email" type="email" />
          <Input label="Password" value={form.password} onChange={(v)=>setField("password", v)} name="new-password" type="password" required />
          {err && <div style={{ color: "var(--color-error)", fontWeight: 700 }}>{err}</div>}
          <Button type="submit" full disabled={loading}>{loading ? "Creating..." : "Sign up"}</Button>
        </form>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
          <span />
          <Link to="/login">Already have an account?</Link>
        </div>
      </Card>
    </div>
  );
}
