import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StoryListPage } from './pages/StoryListPage';
import { StoryPage } from './pages/StoryPage';
import { ExercisePage } from './pages/ExercisePage';
import { WritingPage } from './pages/WritingPage';
import { ProfilePage } from './pages/ProfilePage';
import { RewardsPage } from './pages/RewardsPage';
import { WalletPage } from './pages/WalletPage';
import { ParentDashboard } from './pages/ParentDashboard';
import { useUserStore } from './stores/userStore';

function App() {
  const { initializeAuth, isLoading } = useUserStore();

  useEffect(() => {
    // Initialize authentication on app start
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return (
      <div className="loading-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <HomePage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/writing" element={
          <ProtectedRoute>
            <Layout>
              <WritingPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/stories" element={
          <ProtectedRoute>
            <Layout>
              <StoryListPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/stories/:id" element={
          <ProtectedRoute>
            <Layout>
              <StoryPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/exercise/:id" element={
          <ProtectedRoute>
            <Layout>
              <ExercisePage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/rewards" element={
          <ProtectedRoute>
            <Layout>
              <RewardsPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/wallet" element={
          <ProtectedRoute>
            <Layout>
              <WalletPage />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/parent-dashboard" element={
          <ProtectedRoute>
            <Layout>
              <ParentDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

