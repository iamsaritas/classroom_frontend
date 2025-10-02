import { useState } from "react";
import api from "../api/http";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(""); setErr("");

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMsg(res.data.message);
    } catch (error) {
      setErr(error?.response?.data?.message || "Failed to send reset link");
    }
  }

  return (
    <div className="container py-5">
      <h2 className="h4 mb-3">Forgot Password</h2>
      {msg && <div className="alert alert-success">{msg}</div>}
      {err && <div className="alert alert-danger">{err}</div>}

      <form onSubmit={onSubmit} className="card p-3 shadow-sm" style={{ maxWidth: "400px" }}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary w-100">Send Reset Link</button>
      </form>
    </div>
  );
}
