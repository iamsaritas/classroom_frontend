import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/http";
import { useAuth } from "../context/AuthContext";

// Video Player helper
function VideoPlayer({ v }) {
  const url = v.url || v.filePath || "";
  const isYouTube = /youtu\.be|youtube\.com/.test(url);

  if (isYouTube) {
    const id = (url.match(/(?:v=|\/)([A-Za-z0-9_-]{11})/) || [])[1];
    return id ? (
      <div className="ratio ratio-16x9">
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title={v.title}
          allowFullScreen
        />
      </div>
    ) : (
      <a href={url} target="_blank" rel="noreferrer">{url}</a>
    );
  }

  return (
    <video className="w-100" controls>
      <source
        src={url.startsWith("/uploads")
          ? `${import.meta.env.VITE_API_URL}${url}`
          : url}
      />
    </video>
  );
}

export default function BatchDetail() {
  const { id } = useParams();
  const { isAdmin } = useAuth();

  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  // User states
  const [userId, setUserId] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  // Video states
  const [videoId, setVideoId] = useState("");
  const [allVideos, setAllVideos] = useState([]);

  // Load batch detail
  async function loadData() {
    try {
      const res = await api.get(`/batches/${id}`);
      setData(res.data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load batch");
    }
  }

  // Load all users
  async function loadUsers() {
    try {
      const res = await api.get("/admin/users");
      setAllUsers(res.data || []);
    } catch {
      console.error("Failed to load users");
    }
  }

  //  Load all videos
  async function loadVideos() {
    try {
      const res = await api.get("/admin/listAllVideos");
      setAllVideos(res.data || []);
    } catch {
      console.error("Failed to load videos");
    }
  }

  useEffect(() => {
    loadData();
    loadUsers();
    loadVideos();
  }, [id]);

  //  Assign user
  async function assignUser(e) {
    e.preventDefault();
    setMsg(""); setErr("");
    try {
      await api.post("/admin/assignBatches", {
        userId: Number(userId),
        batchId: Number(id),
      });
      setMsg("✅ User assigned to batch.");
      setUserId("");
      loadData();
    } catch (e) {
      setErr(e?.response?.data?.message || "Assign failed");
    }
  }

  // Remove user
  async function removeUser(uid) {
    try {
      await api.delete("/admin/removeUserFromBatch", {
        data: { userId: uid, batchId: Number(id) },
      });
      loadData();
    } catch (e) {
      alert(e?.response?.data?.message || "Remove failed");
    }
  }

  //  Assign video
  async function assignVideo(e) {
    e.preventDefault();
    setMsg(""); setErr("");
    try {
      await api.post("/admin/assignVideo", {
        videoId: Number(videoId),
        batchId: Number(id),
      });
      setMsg("✅ Video assigned to batch.");
      setVideoId("");
      loadData();
    } catch (e) {
      setErr(e?.response?.data?.message || "Video assign failed");
    }
  }

  //  Remove video
  async function removeVideo(vid) {
    try {
      await api.delete("/admin/removeVideo", {
        data: { videoId: vid, batchId: Number(id) },
      });
      loadData();
    } catch (e) {
      alert(e?.response?.data?.message || "Remove failed");
    }
  }

  // --- UI Rendering ---
  if (err) {
    return <div className="container py-4">
      <div className="alert alert-danger">{err}</div>
    </div>;
  }

  if (!data) {
    return <div className="container py-4 text-center">
      <div className="spinner-border" />
    </div>;
  }

  const users = data.Users || [];
  const videos = data.Videos || [];

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4">{data.name || `Batch #${data.id}`}</h2>
        <span className="badge bg-secondary">ID: {data.id}</span>
      </div>

      {data.description && <p className="text-muted">{data.description}</p>}
      {msg && <div className="alert alert-success">{msg}</div>}

      {/* Assign User */}
      {isAdmin && (
        <form className="card p-3 mb-4 shadow-sm" onSubmit={assignUser}>
          <h3 className="h6">Assign a User</h3>
          <div className="row g-2">
            <div className="col-md-6">
              <select
                className="form-select"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              >
                <option value="">-- Select User --</option>
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary">Assign</button>
            </div>
          </div>
        </form>
      )}

      {/* Assign Video */}
      {isAdmin && (
        <form className="card p-3 mb-4 shadow-sm" onSubmit={assignVideo}>
          <h3 className="h6">Assign a Video</h3>
          <div className="row g-2">
            <div className="col-md-6">
              <select
                className="form-select"
                value={videoId}
                onChange={(e) => setVideoId(e.target.value)}
                required
              >
                <option value="">-- Select Video --</option>
                {allVideos.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary">Assign</button>
            </div>
          </div>
        </form>
      )}

      <div className="row g-4">
        {/* Users Section */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h3 className="h6 mb-3">👥 Users</h3>
              {users.length === 0 ? (
                <p className="text-muted">No users assigned.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {users.map((u) => (
                    <li key={u.id}
                        className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{u.name}</strong>
                        <div className="small text-muted">{u.email}</div>
                      </div>
                      <div>
                        <span className="badge bg-info text-dark me-2">{u.role}</span>
                        {isAdmin && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeUser(u.id)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Videos Section */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h3 className="h6 mb-3">🎬 Videos</h3>
              {videos.length === 0 ? (
                <p className="text-muted">No videos.</p>
              ) : (
                <div className="vstack gap-3">
                  {videos.map((v) => (
                    <div key={v.id}
                         className="border rounded p-2 d-flex justify-content-between align-items-center">
                      <div className="flex-grow-1 me-3">
                        <div className="fw-semibold mb-2">{v.title}</div>
                        <VideoPlayer v={v} />
                      </div>
                      {isAdmin && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeVideo(v.id)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
