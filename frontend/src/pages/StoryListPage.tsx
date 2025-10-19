import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storyApi } from '@/services/api/story.api';
import { Story, StoryGenerationRequest, StoryTheme, LanguageLevel, SupportedLanguage } from '@shared/types';
import { StoryGenerationModal } from '@/components/story/StoryGenerationModal';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { useUserStore } from '@/stores/userStore';
import './StoryListPage.css';

export function StoryListPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    language: 'all',
    level: 'all',
    theme: 'all',
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    storyId: string | null;
    storyTitle: string | null;
  }>({
    isOpen: false,
    storyId: null,
    storyTitle: null,
  });
  
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    loadStories();
  }, [filter]);

  const loadStories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await storyApi.getStories({
        language: filter.language !== 'all' ? filter.language : undefined,
        level: filter.level !== 'all' ? filter.level : undefined,
        theme: filter.theme !== 'all' ? filter.theme : undefined,
      });
      setStories(data);
    } catch (error: any) {
      console.error('Failed to load stories:', error);
      setError('Failed to load stories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStory = async (request: StoryGenerationRequest) => {
    try {
      const response = await storyApi.generateStory(request);
      // Add the new story to the list
      setStories(prev => [response.story, ...prev]);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Failed to generate story:', error);
      throw error;
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, storyId: string, storyTitle: string) => {
    e.preventDefault(); // Prevent navigation to story page
    e.stopPropagation();
    
    setDeleteConfirmation({
      isOpen: true,
      storyId,
      storyTitle,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.storyId) return;

    try {
      await storyApi.deleteStory(deleteConfirmation.storyId);
      // Remove from list
      setStories(prev => prev.filter(story => story.id !== deleteConfirmation.storyId));
      console.log(`✅ Story "${deleteConfirmation.storyTitle}" deleted successfully`);
      
      // Close modal
      setDeleteConfirmation({
        isOpen: false,
        storyId: null,
        storyTitle: null,
      });
    } catch (error: any) {
      console.error('Failed to delete story:', error);
      alert(`Failed to delete story: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({
      isOpen: false,
      storyId: null,
      storyTitle: null,
    });
  };

  const getThemeEmoji = (theme: string) => {
    const emojiMap: Record<string, string> = {
      [StoryTheme.ADVENTURE]: '🗺️',
      [StoryTheme.ANIMALS]: '🐾',
      [StoryTheme.FAMILY]: '👨‍👩‍👧‍👦',
      [StoryTheme.FRIENDSHIP]: '🤝',
      [StoryTheme.NATURE]: '🌿',
      [StoryTheme.FOOD]: '🍕',
      [StoryTheme.SPORTS]: '⚽',
      [StoryTheme.SCHOOL]: '🏫',
    };
    return emojiMap[theme] || '📖';
  };

  return (
    <div className="story-list-page">
      <div className="page-header">
        <h1>Story Library</h1>
        <button 
          className="btn-primary" 
          onClick={() => setIsModalOpen(true)}
        >
          ✨ Generate New Story
        </button>
      </div>

      <div className="filters">
        <select 
          value={filter.language} 
          onChange={(e) => setFilter({ ...filter, language: e.target.value })}
          className="filter-select"
        >
          <option value="all">All Languages</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="pt">Portuguese</option>
          <option value="zh">Chinese</option>
          <option value="ja">Japanese</option>
          <option value="ko">Korean</option>
          <option value="ar">Arabic</option>
        </select>

        <select 
          value={filter.level} 
          onChange={(e) => setFilter({ ...filter, level: e.target.value })}
          className="filter-select"
        >
          <option value="all">All Levels</option>
          <option value={LanguageLevel.BEGINNER}>Beginner</option>
          <option value={LanguageLevel.INTERMEDIATE}>Intermediate</option>
          <option value={LanguageLevel.ADVANCED}>Advanced</option>
        </select>

        <select 
          value={filter.theme} 
          onChange={(e) => setFilter({ ...filter, theme: e.target.value })}
          className="filter-select"
        >
          <option value="all">All Themes</option>
          <option value={StoryTheme.ADVENTURE}>Adventure</option>
          <option value={StoryTheme.ANIMALS}>Animals</option>
          <option value={StoryTheme.FAMILY}>Family</option>
          <option value={StoryTheme.FRIENDSHIP}>Friendship</option>
          <option value={StoryTheme.NATURE}>Nature</option>
          <option value={StoryTheme.FOOD}>Food</option>
          <option value={StoryTheme.SPORTS}>Sports</option>
          <option value={StoryTheme.SCHOOL}>School</option>
        </select>
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <div className="story-grid">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading stories...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h2>No stories found</h2>
            <p>Create your first story by clicking the button above!</p>
            <button 
              className="btn-primary" 
              onClick={() => setIsModalOpen(true)}
            >
              Generate Your First Story
            </button>
          </div>
        ) : (
          stories.map((story) => (
            <div key={story.id} className="story-card-wrapper">
              <Link to={`/stories/${story.id}`} className="story-card">
                <div className="story-card-header">
                  <span className="story-theme-emoji">{getThemeEmoji(story.theme)}</span>
                  <span className={`story-level level-${story.level}`}>
                    {story.level}
                  </span>
                </div>
                <h3 className="story-title">{story.title}</h3>
                <div className="story-meta">
                  <span className="meta-item">
                    📖 {story.sentences?.length || 0} sentences
                  </span>
                  <span className="meta-item">
                    ⏱️ {story.estimatedDuration} min
                  </span>
                </div>
                <div className="story-footer">
                  <span className="story-language">
                    {story.language.toUpperCase()}
                  </span>
                  <button 
                    className="btn-delete-story"
                    onClick={(e) => handleDeleteClick(e, story.id, story.title)}
                    title="Delete story"
                  >
                    🗑️
                  </button>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>

      <StoryGenerationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerate={handleGenerateStory}
        userLanguage={user?.targetLanguage as SupportedLanguage}
        userLevel={user?.level}
      />

      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        title="Delete Story?"
        message={`Are you sure you want to delete "${deleteConfirmation.storyTitle}"?\n\nThis action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDangerous={true}
      />
    </div>
  );
}

