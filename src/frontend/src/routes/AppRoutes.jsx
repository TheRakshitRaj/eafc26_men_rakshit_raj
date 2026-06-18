import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import MainLayout from '../layouts/MainLayout';

// Lazy load page components
const Home = lazy(() => import('../pages/Home'));
const Players = lazy(() => import('../pages/Players'));
const PlayerDetails = lazy(() => import('../pages/PlayerDetails'));
const ComparePlayers = lazy(() => import('../pages/ComparePlayers'));
const Analytics = lazy(() => import('../pages/Analytics'));
const TeamBuilder = lazy(() => import('../pages/TeamBuilder'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Profile = lazy(() => import('../pages/Profile'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Loading screen for Suspense
const RouteLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#0A0A0A] text-white">
    <div className="w-12 h-12 border-4 border-[#222] border-t-[#00FF87] rounded-full animate-spin mb-4"></div>
    <p className="font-display font-semibold tracking-wider text-[#A0A0A0] text-sm animate-pulse">
      LOADING PLATFORM DATABASE...
    </p>
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <RouteLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Guest-only route wrapper (prevents logged in users from visiting login/register)
const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <RouteLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          {/* Guest-only routes without layout */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />

          {/* Main platform routes wrapped in MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/players" element={<Players />} />
            <Route path="/players/:id" element={<PlayerDetails />} />
            <Route path="/compare" element={<ComparePlayers />} />
            <Route path="/analytics" element={<Analytics />} />

            {/* Authenticated user routes */}
            <Route
              path="/team-builder"
              element={
                <ProtectedRoute>
                  <TeamBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin-only route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
