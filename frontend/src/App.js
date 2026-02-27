import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import UpdatePassword from './pages/Auth/UpdatePassword';
import AdminDashboard from './pages/Admin/AdminDashboard';
import StoreDashboard from './pages/Owner/StoreDashboard';
import StoreList from './pages/User/StoreList';
import './index.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="loading">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

            {/* Protected Routes */}
            <Route path="/update-password" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Store Owner Routes */}
            <Route path="/owner" element={
              <ProtectedRoute allowedRoles={['store_owner']}>
                <StoreDashboard />
              </ProtectedRoute>
            } />

            {/* Normal User Routes */}
            <Route path="/user/stores" element={
              <ProtectedRoute allowedRoles={['user']}>
                <StoreList />
              </ProtectedRoute>
            } />

            {/* Default Route handling based on role */}
            <Route path="/" element={
              <ProtectedRoute>
                <DefaultRoute />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

// Component to handle default redirect cleanly
const DefaultRoute = () => {
  const { user } = useContext(AuthContext);
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'store_owner') return <Navigate to="/owner" replace />;
  return <Navigate to="/user/stores" replace />;
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
