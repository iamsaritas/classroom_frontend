import { useState } from "react";
import api from "../api/http";
import { useAuth } from "../context/AuthContext";

export default function CreateUser() {
  const { isAdmin } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // Handle Form Submit
  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setErr("");

    if (!isAdmin) {
      setErr("❌ Access denied: Only admin can create users.");
      return;
    }

    try {
      await api.post("/admin/createUser", {
        name,
        email,
        password,
        role: "student", // always student by default
      });

      setMsg("User created successfully!");
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setErr(error?.response?.data?.message || "Failed to create user");
    }
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "#f8f9fa" }}
    >
      <div className="card shadow-sm p-4 w-100" style={{ maxWidth: "420px" }}>
        <h2 className="h5 mb-3 text-center">👤 Create New User</h2>

        {/* Success / Error Messages */}
        {msg && <div className="alert alert-success">{msg}</div>}
        {err && <div className="alert alert-danger">{err}</div>}

        {/* Form */}
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter user name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password *</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role Selection Removed → always student */}

          <button className="btn btn-primary w-100">Create User</button>
        </form>
      </div>
    </div>
  );
}
