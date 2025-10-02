// src/pages/AdminProfile.jsx
import { useEffect, useState } from "react";
import api from "../api/http";

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch Admin Profile
  useEffect(() => {
    api
      .get("/admin/admin-profile")
      .then((res) => setProfile(res.data))
      .catch((e) =>
        setErr(e?.response?.data?.message || "❌ Failed to load profile")
      )
      .finally(() => setLoading(false));
  }, []);

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
      <div className="container py-5">
        <div className="alert alert-danger">{err}</div>
      </div>
    );
  }

  // Profile Data
  return (
    <div className="container py-4">
      <h2 className="h4 mb-4">👤 Admin Profile</h2>

      {/* Profile Card */}
      <div className="card shadow-sm p-3 mb-4">
        <h5>{profile.name}</h5>
        <p className="text-muted">{profile.email}</p>
        <p>
          <strong>Role:</strong> {profile.role}
        </p>
        <p>
          <strong>Joined:</strong>{" "}
          {new Date(profile.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Stats Section */}
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card text-center shadow-sm p-3">
            <h6>Total Users</h6>
            <h3>{profile.stats.users}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow-sm p-3">
            <h6>Total Batches</h6>
            <h3>{profile.stats.batches}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow-sm p-3">
            <h6>Total Videos</h6>
            <h3>{profile.stats.videos}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
