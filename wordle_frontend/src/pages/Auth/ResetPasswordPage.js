import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button, Card, Input } from "../../components/common/UI";

// PUBLIC_INTERFACE
export default function ResetPasswordPage() {
  const { confirmPasswordReset } = useAuth();
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const uid = sp.get("uid") || "";
  const token = sp.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setOk("");
    setLoading(true);
    try {
      await confirmPasswordReset({ uid: Number(uid), token, new_password: newPassword });
      setOk("Password updated. You can now log in.");
      setTimeout(()=>nav("/login"), 1200);
    } catch (error) {
      setErr("Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-auth">
      <Card>
        <h2>Choose a new password</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
          <Input label="New password" value={newPassword} onChange={setNewPassword} name="new-password" type="password" required />
          {ok && <div style={{ color: "var(--color-primary)", fontWeight: 700 }}>{ok}</div>}
          {err && <div style={{ color: "var(--color-error)", fontWeight: 700 }}>{err}</div>}
          <Button type="submit" full disabled={loading || !uid || !token}>{loading ? "Updating..." : "Update password"}</Button>
        </form>
      </Card>
    </div>
  );
}
