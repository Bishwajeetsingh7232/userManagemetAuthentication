import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import Software from './components/Software';
import RequestAccess from './components/RequestAccess';
import ManageRequests from './components/ManageRequests';

function AppRoutes() {
  const { user, isAuthenticated } = useAuth();

  const ProtectedRoute = ({ children, roles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user?.role)) {
      return <Navigate to="/" />;
    }

    return children;
  };

  return (
    <div className="app">
      {isAuthenticated && <Navbar />}
      <div className="container fade-in">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/software"
            element={
              <ProtectedRoute roles={['admin']}>
                <Software />
              </ProtectedRoute>
            }
          />
          <Route
            path="/request-access"
            element={
              <ProtectedRoute roles={['employee']}>
                <RequestAccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-requests"
            element={
              <ProtectedRoute roles={['manager']}>
                <ManageRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate
                  to={
                    user?.role === 'admin'
                      ? '/admin'
                      : user?.role === 'manager'
                      ? '/manage-requests'
                      : '/request-access'
                  }
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App; 