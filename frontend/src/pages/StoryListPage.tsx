import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storyApi } from '@/services/api/story.api';
import { Story } from '@shared/types';

export function StoryListPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    language: 'all',
    level: 'all',
    theme: 'all',
  });

  useEffect(() => {
    loadStories();
  }, [filter]);

  const loadStories = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call
      // const data = await storyApi.getStories(filter);
      // setStories(data);
      setStories([]);
    } catch (error) {
      console.error('Failed to load stories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="story-list-page">
      <h1>Choose a Story</h1>
      
      <div className="filters">
        {/* TODO: Implement filter controls */}
        <select 
          value={filter.language} 
          onChange={(e) => setFilter({ ...filter, language: e.target.value })}
        >
          <option value="all">All Languages</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>

      <div className="story-grid">
        {loading ? (
          <p>Loading stories...</p>
        ) : stories.length === 0 ? (
          <div className="empty-state">
            <p>No stories available yet.</p>
            <button className="btn-primary">Generate New Story</button>
          </div>
        ) : (
          stories.map((story) => (
            <Link key={story.id} to={`/stories/${story.id}`} className="story-card">
              <h3>{story.title}</h3>
              <div className="story-meta">
                <span>📚 {story.level}</span>
                <span>⏱️ {story.estimatedDuration} min</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

