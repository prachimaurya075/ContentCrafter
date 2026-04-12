import { Routes, Route } from 'react-router-dom';
import Login from './module/pages/Login';
import Signup from './module/pages/Signup';
import DashboardPage from './module/pages/Dashbord';
import UserDashboard from './module/pages/Userdashboard';
import Documentation from './module/pages/Documentation';
import Terms from './module/pages/Terms';
import Features from './module/pages/Features';
import UserCentric from './module/pages/UserCentric';
import InnovationFocus from './module/pages/InnovationFocus';
import EthicalAI from './module/pages/EthicalAI';
import ContentStudio from './module/pages/ContentStudio';
import Pricing from './module/pages/Pricing';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from './module/context/AuthContext';
import { ProtectedRoute, PublicRoute, ConditionalHomeRoute } from './module/components/ProtectedRoute';
import { Toaster } from './components/ui/sonner';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <div className="min-h-screen bg-white text-black dark:bg-[#0f0f0f] dark:text-white transition-colors">
          <Routes>
            {/* Default route - redirects based on auth status */}
            <Route path="/" element={<ConditionalHomeRoute />} />

            {/* Auth routes - only accessible if not logged in */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              } 
            />

            {/* Dashboard - accessible to everyone */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Protected routes - only accessible if logged in */}
            <Route 
              path="/user-dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Public documentation page */}
            <Route path="/documentation" element={<Documentation />} />

            {/* Public terms page */}
            <Route path="/terms" element={<Terms />} />

            {/* Public features page */}
            <Route path="/features" element={<Features />} />

            {/* Public pricing page */}
            <Route path="/pricing" element={<Pricing />} />

            {/* Content studio overview page */}
            <Route path="/content-studio" element={<ContentStudio />} />

            {/* Principles pages */}
            <Route path="/user-centric" element={<UserCentric />} />
            <Route path="/innovation-focus" element={<InnovationFocus />} />
            <Route path="/ethical-ai" element={<EthicalAI />} />
          </Routes>
          <Toaster />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
