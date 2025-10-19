import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { StoryGenerationModal } from '@/components/story/StoryGenerationModal';
import { storyApi } from '@/services/api/story.api';
import { StoryGenerationRequest, SupportedLanguage } from '@shared/types';
import logoFull from '@/components/icons/CalligraphMELogoFull-removebg.png';

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
        <img src={logoFull} alt="CalligraphME Logo" className="home-logo" />
        {user && <h2 className="greeting">Hi {user.username}! 👋</h2>}
        <h1 className="big-title">What do you want to do today?</h1>
      </section>

      <section className="main-options">
        <button className="home-button create-button" onClick={() => setShowModal(true)}>
          ✨ Create New Story
        </button>

        <Link to="/stories" className="home-button practice-button">
          📚 Practice Stories
        </Link>
      </section>

      <StoryGenerationModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onGenerate={handleGenerateStory}
        userLanguage={user?.targetLanguage as SupportedLanguage}
        userLevel={user?.level}
      />
    </div>
  );
}

