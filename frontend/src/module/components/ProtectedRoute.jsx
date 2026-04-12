import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Route that requires authentication
export const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;
  
  return isAuthenticated ? children : <Navigate to={redirectTo} />;
};

// Route that requires user to be unauthenticated (like login page)
export const PublicRoute = ({ children, redirectTo = '/user-dashboard' }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Check if we're coming from a page that might be redirecting after logout
  const isFromLogout = location.state && location.state.fromLogout;

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;
  
  // If user is authenticated and this is not coming from logout, redirect
  // Otherwise, render the children (login/signup pages)
  return !isAuthenticated || isFromLogout ? children : <Navigate to={redirectTo} />;
};

// Conditional route for homepage that:
// - Shows the regular dashboard for first-time/unauthenticated users
// - Shows user dashboard for authenticated users
export const ConditionalHomeRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;
  
  return isAuthenticated ? <Navigate to="/user-dashboard" /> : <Navigate to="/dashboard" />;
};
