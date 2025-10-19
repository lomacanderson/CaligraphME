import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { StoryListPage } from './pages/StoryListPage';
import { StoryPage } from './pages/StoryPage';
import { ExercisePage } from './pages/ExercisePage';
import { WritingPage } from './pages/WritingPage';
import { ProfilePage } from './pages/ProfilePage';
import { RewardsPage } from './pages/RewardsPage';
import { UserSetupModal } from './components/user/UserSetupModal';
import { useUserStore } from './stores/userStore';

function App() {
  const { user } = useUserStore();
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    // Check if user exists, if not show setup modal
    if (!user) {
      setShowSetup(true);
    }
  }, [user]);

  const handleSetupComplete = () => {
    setShowSetup(false);
  };

  return (
    <Router>
      {showSetup && <UserSetupModal onComplete={handleSetupComplete} />}
      
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/writing" element={<WritingPage />} />
          <Route path="/stories" element={<StoryListPage />} />
          <Route path="/stories/:id" element={<StoryPage />} />
          <Route path="/exercise/:id" element={<ExercisePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/rewards" element={<RewardsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

