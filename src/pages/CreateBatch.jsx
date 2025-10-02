import { useState } from "react";
import api from "../api/http";
import { useAuth } from "../context/AuthContext";

export default function CreateBatch() {
  const { isAdmin } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  //  Handle form submit
  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setErr("");

    if (!isAdmin) {
      setErr("❌ Access denied: Only admin can create batches.");
      return;
    }

    try {
      await api.post("/admin/createBatches", { name, description });
      setMsg("✅ Batch created successfully!");
      setName("");
      setDescription("");
    } catch (error) {
      setErr(error?.response?.data?.message || "❌ Failed to create batch");
    }
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "#f8f9fa" }}
    >
      <div className="card shadow-sm p-4 w-100" style={{ maxWidth: "420px" }}>
        <h2 className="h5 mb-3 text-center">➕ Create New Batch</h2>

        {/* Success / Error Messages */}
        {msg && <div className="alert alert-success">{msg}</div>}
        {err && <div className="alert alert-danger">{err}</div>}

        {/* Form */}
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Batch Name *</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter batch name"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter batch description (optional)"
            />
          </div>

          <button className="btn btn-primary w-100">Create Batch</button>
        </form>
      </div>
    </div>
  );
}
