// src/pages/UserProfile.jsx
import { useEffect, useState } from "react";
import api from "../api/http";

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  //  Fetch user profile
  useEffect(() => {
    api
      .get("/auth/profile")
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
      <h2 className="h4 mb-4">👤 My Profile</h2>

      <div className="card shadow-sm p-3">
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
    </div>
  );
}
