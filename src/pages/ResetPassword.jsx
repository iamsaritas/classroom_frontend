import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/http";

export default function ResetPassword() {
  const { token } = useParams();
  const nav = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(""); setErr("");

    try {
      const res = await api.post("/auth/reset-password", { token, newPassword });
      setMsg(res.data.message);
      setTimeout(() => nav("/login"), 2000);
    } catch (error) {
      setErr(error?.response?.data?.message || "Failed to reset password");
    }
  }

  return (
    <div className="container py-5">
      <h2 className="h4 mb-3">Reset Password</h2>
      {msg && <div className="alert alert-success">{msg}</div>}
      {err && <div className="alert alert-danger">{err}</div>}

      <form onSubmit={onSubmit} className="card p-3 shadow-sm" style={{ maxWidth: "400px" }}>
        <div className="mb-3">
          <label>New Password</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary w-100">Reset Password</button>
      </form>
    </div>
  );
}
