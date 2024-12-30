import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import RegisterSuperAdmin from "./pages/RegisterSuperAdmin";
import RegisterSubAdmin from "./pages/RegisterSubAdmin";
import LoginSuperAdmin from "./pages/LoginSuperAdmin";
import LoginSubAdmin from "./pages/LoginSubAdmin"; // Import LoginSubAdmin
import MainLayout from "./pages/MainLayout"; // Import MainLayout
import SubAdmin from "./pages/SubAdmin";
import OrderPage from "./pages/OrderPage";
import WithDrawReview from "./pages/WithDrawReview";
import UserRecharge from "./pages/UserRecharge";
import ReputationPoints from "./pages/ReputationPoints";

const SuperAdminProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user && user.role === "superadmin" ? (
    children
  ) : (
    <Navigate to="/loginSuperAdmin" />
  );
};

const SubAdminProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user && (user.role === "superadmin" || user.role === "subadmin") ? (
    children
  ) : (
    <Navigate to="/loginSubAdmin" />
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route
              path="/registerSuperAdmin"
              element={<RegisterSuperAdmin />}
            />
            <Route path="/loginSuperAdmin" element={<LoginSuperAdmin />} />
            {/* Register Sub-admin */}
            <Route path="/loginSubAdmin" element={<LoginSubAdmin />} />
            {/* Login Sub-admin */}
            <Route
              path="/dashboard"
              element={
                <SubAdminProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </SubAdminProtectedRoute>
              }
            />

            <Route
              path="/create-subadmin"
              element={
                <SuperAdminProtectedRoute>
                  <MainLayout>
                  <RegisterSubAdmin />
                  </MainLayout>
                </SuperAdminProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <SubAdminProtectedRoute>
                  <MainLayout>
                    <Users />
                  </MainLayout>
                </SubAdminProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <SubAdminProtectedRoute>
                  <MainLayout>
                    <OrderPage />
                  </MainLayout>
                </SubAdminProtectedRoute>
              }
            />
            <Route
              path="/withdrawal-review"
              element={
                <SubAdminProtectedRoute>
                  <MainLayout>
                    <WithDrawReview />
                  </MainLayout>
                </SubAdminProtectedRoute>
              }
            />
            <Route
              path="/user-recharge"
              element={
                <SubAdminProtectedRoute>
                  <MainLayout>
                    <UserRecharge />
                  </MainLayout>
                </SubAdminProtectedRoute>
              }
            />
            <Route
              path="/reputation-points"
              element={
                <SubAdminProtectedRoute>
                  <MainLayout>
                    <ReputationPoints />
                  </MainLayout>
                </SubAdminProtectedRoute>
              }
            />
            <Route
              path="/view-subadmins"
              element={
                <SuperAdminProtectedRoute>
                  <MainLayout>
                    <SubAdmin />
                  </MainLayout>
                </SuperAdminProtectedRoute>
              }
            />
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
