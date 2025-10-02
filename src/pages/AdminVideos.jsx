// src/pages/AdminVideos.jsx
import { useEffect, useState } from "react";
import api from "../api/http";

export default function AdminVideos() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  //  Load all videos
  function load() {
    setLoading(true);
    api
      .get("/admin/listAllVideos")
      .then((res) => setItems(res.data || []))
      .catch((e) => setErr(e?.response?.data?.message || "Failed to load"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  // ❌ Delete video
  async function onDelete(id) {
    if (!confirm("Delete this video?")) return;
    try {
      await api.delete(`/videos/${id}`);
      load();
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  }

  // Loader
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  // Error
  if (err) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">{err}</div>
      </div>
    );
  }

  // Table
  return (
    <div className="container py-4">
      <h2 className="h4 mb-3">📂 All Videos (Admin)</h2>

      {items.length === 0 ? (
        <p className="text-muted">No videos found.</p>
      ) : (
        <div className="table-responsive shadow-sm">
          <table className="table table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Batch</th>
                <th>Public</th>
                <th>Preview</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((v) => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.title}</td>
                  <td>{v.batchId || "-"}</td>
                  <td>{v.isPublic ? "✅ Yes" : "❌ No"}</td>
                  <td style={{ maxWidth: 240 }}>
                    {v.url ? (
                      <a
                        href={
                          v.url.startsWith("/uploads")
                            ? `${import.meta.env.VITE_API_URL}${v.url}`
                            : v.url
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(v.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
