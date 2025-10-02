// src/components/Navbar.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const nav = useNavigate();

  // Logout Handler
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire("Logged out!", "✅ You have been logged out.", "success");
        nav("/login");
      }
    });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      {/* Brand */}
      <Link className="navbar-brand fw-bold" to="/">
        Classroom
      </Link>

      {/* Toggle button for mobile */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navMenu"
        aria-controls="navMenu"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Navbar Menu */}
      <div className="collapse navbar-collapse" id="navMenu">
        {/* Left side links */}
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {user && (
            <>
              {/* Dashboard */}
              <li className="nav-item">
                <NavLink end className="nav-link" to="/">
                  Dashboard
                </NavLink>
              </li>

              {/* Normal User Links */}
              {!isAdmin && (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/videos">
                      My Videos
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/profile">
                      My Profile
                    </NavLink>
                  </li>
                </>
              )}

              {/* Admin Links */}
              {isAdmin && (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/videos">
                      All Videos
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/upload">
                      Upload
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/batches">
                      Batches
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/createBatches">
                      Create Batch
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/createUser">
                      Create User
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/admin-profile">
                      Admin Profile
                    </NavLink>
                  </li>
                </>
              )}
            </>
          )}
        </ul>

        {/* Right side buttons */}
        <div className="d-flex">
          {!user ? (
            <div className="d-flex gap-2">
              <Link className="btn btn-outline-light btn-sm" to="/register">
                Register
              </Link>
              <Link className="btn btn-primary btn-sm" to="/login">
                Login
              </Link>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-3">
              <span className="text-light small">
                {user.name} ({user.role})
              </span>
              <button
                className="btn btn-outline-light btn-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
