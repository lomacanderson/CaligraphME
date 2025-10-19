import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { StoryGenerationModal } from '@/components/story/StoryGenerationModal';
import { storyApi } from '@/services/api/story.api';
import { StoryGenerationRequest } from '@shared/types';

export function HomePage() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleGenerateStory = async (request: StoryGenerationRequest) => {
    try {
      console.log('🎨 Generating story with request:', request);
      const response = await storyApi.generateStory(request);
      console.log('✅ Story generated successfully:', response.story.id);
      
      // Navigate to the new story
      navigate(`/stories/${response.story.id}`);
    } catch (error: any) {
      console.error('❌ Failed to generate story:', error);
      throw error; // Let the modal handle the error display
    }
  };

  return (
    <div className="home-page">
      <section className="hero">
        {user && <h2 className="greeting">Hi {user.username}! 👋</h2>}
        <h1 className="big-title">What do you want to do today?</h1>
      </section>

      <section className="main-options">
        <div className="fun-option-card create-card" onClick={() => setShowModal(true)}>
          <div className="big-emoji">✨</div>
          <h2>Create New Story</h2>
          <div className="action-button">Let's Go!</div>
        </div>

        <Link to="/stories" className="fun-option-card browse-card">
          <div className="big-emoji">📚</div>
          <h2>Practice Stories</h2>
          <div className="action-button">Start Now!</div>
        </Link>
      </section>

      <StoryGenerationModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onGenerate={handleGenerateStory}
        userLanguage={user?.targetLanguage}
        userLevel={user?.level}
      />
    </div>
  );
}

