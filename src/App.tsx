import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { CoinScanner } from './pages/CoinScanner';
import { Portfolio } from './pages/Portfolio';
import { LearnHub } from './pages/LearnHub';
import { Reports } from './pages/Reports';
import { AIAssistant } from './pages/AIAssistant';
import { Loader2 } from 'lucide-react';

// Protected Route wrapper: requires active MongoDB session
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-void flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
        <span className="text-xs text-text-muted font-mono">Verifying Database Session...</span>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

// Root route: user must create account or login before accessing main page
const RootRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-void flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
        <span className="text-xs text-text-muted font-mono">Loading CryptoGuard...</span>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />;
};

// Auth route: redirects to dashboard if already logged in
const AuthRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-void flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />;
};

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Landing Page as initial root page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth page for Login and Signup */}
        <Route path="/auth" element={<AuthRoute />} />
        
        {/* Protected Dashboard Routes: user must create account or login before accessing */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scanner" element={<CoinScanner />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/learn" element={<LearnHub />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/assistant" element={<AIAssistant />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
