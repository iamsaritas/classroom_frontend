// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Videos from "./pages/Videos";
import Upload from "./pages/Upload";
import Batches from "./pages/Batches";
import BatchDetail from "./pages/BatchDetail";
import AdminVideos from "./pages/AdminVideos";
import Register from "./pages/Register";
import CreateUser from "./pages/CreateUser";
import CreateBatch from "./pages/CreateBatch";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminProfile from "./pages/AdminProfile";
import UserProfile from "./pages/UserProfile";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/videos"
          element={
            <PrivateRoute>
              <Videos />
            </PrivateRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <PrivateRoute roles={["admin"]}>
              <Upload />
            </PrivateRoute>
          }
        />

        <Route
          path="/batches"
          element={
            <PrivateRoute>
              <Batches />
            </PrivateRoute>
          }
        />

        <Route
          path="/batches/:id"
          element={
            <PrivateRoute>
              <BatchDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/videos"
          element={
            <PrivateRoute roles={["admin"]}>
              <AdminVideos />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/createUser"
          element={
            <PrivateRoute roles={["admin"]}>
              <CreateUser />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/createBatches"
          element={
            <PrivateRoute roles={["admin"]}>
              <CreateBatch />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/admin-profile"
          element={
            <PrivateRoute roles={["admin"]}>
              <AdminProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
