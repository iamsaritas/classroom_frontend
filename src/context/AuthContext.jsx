// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/http";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on first load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Login
  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  }

  // Logout
  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  // Role check
  const isAdmin = user?.role === "admin";

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthCtx.Provider>
  );
}

// Custom hook for easy access
export const useAuth = () => useContext(AuthCtx);
