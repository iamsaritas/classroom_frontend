// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/http";

export default function Register() {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  //  Handle Form Submit
  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    try {
      await api.post("/auth/register", { name, email, password });
      setMsg("✅ Registered successfully! Redirecting to login...");
      setTimeout(() => nav("/login"), 1500);
    } catch (e) {
      setErr(e?.response?.data?.message || " Registration failed");
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h1 className="h4 mb-3 text-center"> Register</h1>

              {/* Alerts */}
              {err && <div className="alert alert-danger">{err}</div>}
              {msg && <div className="alert alert-success">{msg}</div>}

              {/* Form */}
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your full name"
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
                    placeholder="Enter your email"
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
                    placeholder="Enter a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button className="btn btn-primary w-100">Register</button>
              </form>

              {/* Link to login */}
              <p className="text-muted mt-3 small text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-decoration-none">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
