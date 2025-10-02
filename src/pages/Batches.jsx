// src/pages/Batches.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/http";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

export default function Batches() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  //  Load batches
  async function loadBatches() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/batches/list");
      setItems(res.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || "❌ Failed to load batches");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBatches();
  }, []);

  //  Remove batch
  async function removeBatch(id) {
    const result = await Swal.fire({
      title: "Delete batch?",
      text: "This will permanently delete the batch. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete("/admin/removeBatch", { data: { batchId: id } });
      setItems((prev) => prev.filter((b) => b.id !== id));
      Swal.fire("Deleted ✅", "Batch deleted successfully.", "success");
    } catch (e) {
      Swal.fire(
        "Error",
        e?.response?.data?.message || "❌ Failed to delete batch",
        "error"
      );
    }
  }

  // --- UI States ---
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  // --- Render ---
  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4 mb-0">📦 Batches</h2>
        {isAdmin && (
          <Link to="/admin/create-batch" className="btn btn-sm btn-primary">
            + New Batch
          </Link>
        )}
      </div>

      {/* Batch List */}
      {items.length === 0 ? (
        <p className="text-muted">No batches created yet.</p>
      ) : (
        <div className="row g-3">
          {items.map((b) => (
            <div className="col-md-4" key={b.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{b.name || `Batch #${b.id}`}</h5>
                  <p className="card-text text-muted small flex-grow-1">
                    {b.description || "No description available."}
                  </p>

                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <small className="text-muted">ID: {b.id}</small>
                    <div>
                      <Link
                        to={`/batches/${b.id}`}
                        className="btn btn-outline-primary btn-sm me-2"
                      >
                        View →
                      </Link>
                      {isAdmin && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeBatch(b.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
