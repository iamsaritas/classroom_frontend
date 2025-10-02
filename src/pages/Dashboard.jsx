// src/pages/Dashboard.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="container py-4">
      {/* Welcome Section */}
      <div className="p-4 bg-light rounded-3 border shadow-sm mb-4">
        <h1 className="h4 mb-2">👋 Welcome, {user?.name || "User"}!</h1>
        <p className="mb-3 text-muted">
          Role: <strong>{user?.role}</strong>
        </p>
      </div>

      {/* Stats Section for Admin */}
      {isAdmin && (
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm border-0 text-center">
              <div className="card-body">
                <h3 className="text-primary">📦</h3>
                <p className="fw-bold mb-0">Manage Batches</p>
                <Link className="btn btn-sm btn-outline-primary mt-2" to="/batches">
                  View Batches →
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0 text-center">
              <div className="card-body">
                <h3 className="text-success">🎬</h3>
                <p className="fw-bold mb-0">Manage Videos</p>
                <Link className="btn btn-sm btn-outline-success mt-2" to="/admin/videos">
                  All Videos →
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0 text-center">
              <div className="card-body">
                <h3 className="text-warning">👤</h3>
                <p className="fw-bold mb-0">Create Users</p>
                <Link className="btn btn-sm btn-outline-warning mt-2" to="/admin/createUser">
                  Add User →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Actions */}
      <div className="card shadow-sm p-3">
        <h5 className="mb-3">⚡ Quick Actions</h5>
        <div className="d-flex flex-wrap gap-2">
          <Link className="btn btn-outline-primary" to="/videos">
            🎬 My Videos
          </Link>

          {isAdmin && (
            <>
              <Link className="btn btn-outline-dark" to="/upload">
                ⬆ Upload Video
              </Link>
              <Link className="btn btn-outline-dark" to="/batches">
                📦 Manage Batches
              </Link>
              <Link className="btn btn-outline-dark" to="/admin/videos">
                🎞 All Videos
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
