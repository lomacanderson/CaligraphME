import React, { useState, useEffect } from 'react';
import { CustomVoiceAPI, CustomVoice } from '../../services/api/custom-voice.api';
import './CustomVoiceManager.css';

interface CustomVoiceManagerProps {
  onVoiceSelect?: (voiceId: string) => void;
  selectedVoiceId?: string;
}

export const CustomVoiceManager: React.FC<CustomVoiceManagerProps> = ({
  onVoiceSelect,
  selectedVoiceId,
}) => {
  const [voices, setVoices] = useState<CustomVoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingVoice, setEditingVoice] = useState<CustomVoice | null>(null);

  useEffect(() => {
    loadVoices();
  }, []);

  const loadVoices = async () => {
    try {
      setLoading(true);
      const customVoices = await CustomVoiceAPI.getCustomVoices();
      setVoices(customVoices);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVoice = async (voiceId: string) => {
    if (!confirm('Are you sure you want to delete this custom voice?')) {
      return;
    }

    try {
      await CustomVoiceAPI.deleteCustomVoice(voiceId);
      setVoices(voices.filter(v => v.id !== voiceId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleTestVoice = async (voice: CustomVoice, testText: string = 'Hello, this is a test of my custom voice.') => {
    try {
      const audioBlob = await CustomVoiceAPI.generateAudioWithCustomVoice(voice.id, testText);
      await CustomVoiceAPI.playAudio(audioBlob);
    } catch (err: any) {
      setError(`Failed to test voice: ${err.message}`);
    }
  };

  const handleVoiceSelect = (voiceId: string) => {
    if (onVoiceSelect) {
      onVoiceSelect(voiceId);
    }
  };

  if (loading) {
    return (
      <div className="custom-voice-manager">
        <div className="loading">Loading custom voices...</div>
      </div>
    );
  }

  return (
    <div className="custom-voice-manager">
      <div className="voice-manager-header">
        <h3>🎤 Custom Voices</h3>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          + Create New Voice
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {voices.length === 0 ? (
        <div className="no-voices">
          <p>No custom voices yet. Create your first voice to get started!</p>
        </div>
      ) : (
        <div className="voices-grid">
          {voices.map((voice) => (
            <div 
              key={voice.id} 
              className={`voice-card ${selectedVoiceId === voice.id ? 'selected' : ''}`}
            >
              <div className="voice-card-header">
                <h4>{voice.name}</h4>
                <span className={`category-badge ${voice.category}`}>
                  {voice.category}
                </span>
              </div>
              
              {voice.description && (
                <p className="voice-description">{voice.description}</p>
              )}

              <div className="voice-stats">
                <span>📁 {voice.audio_samples.length} samples</span>
                <span>📅 {new Date(voice.created_at).toLocaleDateString()}</span>
              </div>

              <div className="voice-actions">
                {onVoiceSelect && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleVoiceSelect(voice.id)}
                  >
                    {selectedVoiceId === voice.id ? 'Selected' : 'Select'}
                  </button>
                )}
                
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => handleTestVoice(voice)}
                >
                  🔊 Test
                </button>
                
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setEditingVoice(voice)}
                >
                  ⚙️ Settings
                </button>
                
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteVoice(voice.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateVoiceModal
          onClose={() => setShowCreateModal(false)}
          onVoiceCreated={(voice) => {
            setVoices([voice, ...voices]);
            setShowCreateModal(false);
          }}
        />
      )}

      {editingVoice && (
        <EditVoiceModal
          voice={editingVoice}
          onClose={() => setEditingVoice(null)}
          onVoiceUpdated={(updatedVoice) => {
            setVoices(voices.map(v => v.id === updatedVoice.id ? updatedVoice : v));
            setEditingVoice(null);
          }}
        />
      )}
    </div>
  );
};

// Create Voice Modal Component
interface CreateVoiceModalProps {
  onClose: () => void;
  onVoiceCreated: (voice: CustomVoice) => void;
}

const CreateVoiceModal: React.FC<CreateVoiceModalProps> = ({
  onClose,
  onVoiceCreated,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'personal' as const,
  });
  //const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  //const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordings, setRecordings] = useState<{ blob: Blob; url: string }[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);

  // Check for microphone permissions
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        console.log('Microphone permission granted');
      })
      .catch((error) => {
        setError('Microphone access is required to record voice samples. Please allow microphone access and refresh the page.');
        console.error('Microphone permission denied:', error);
      });
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
        const url = URL.createObjectURL(blob);
        setRecordings(prev => [...prev, { blob, url }]);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setRecordingInterval(interval);
      
    } catch (error) {
      setError('Failed to start recording. Please check microphone permissions.');
      console.error('Recording error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      
      if (recordingInterval) {
        clearInterval(recordingInterval);
        setRecordingInterval(null);
      }
    }
  };

  const deleteRecording = (index: number) => {
    setRecordings(prev => {
      const newRecordings = prev.filter((_, i) => i !== index);
      // Revoke the URL to free memory
      URL.revokeObjectURL(prev[index].url);
      return newRecordings;
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (recordings.length === 0) {
      setError('Please record at least one voice sample');
      return;
    }

    try {
      setLoading(true);
      
      // Convert recordings to Files
      const files = recordings.map((recording, index) => {
        const file = new File([recording.blob], `voice_sample_${index + 1}.webm`, {
          type: 'audio/webm;codecs=opus'
        });
        return file;
      });
      
      const response = await CustomVoiceAPI.createCustomVoice({
        ...formData,
        audioFiles: files,
      });
      
      // Clean up recordings
      recordings.forEach(recording => URL.revokeObjectURL(recording.url));
      
      onVoiceCreated(response.customVoice);
    } catch (err: any) {
      console.error('Voice creation error:', err);
      
      // Parse and display user-friendly error messages
      let errorMessage = 'Failed to create custom voice. Please try again.';
      
      if (err.message) {
        if (err.message.includes('Cannot find module')) {
          errorMessage = 'Server configuration error. Please contact support.';
        } else if (err.message.includes('Unauthorized') || err.message.includes('401')) {
          errorMessage = 'Authentication error. Please refresh the page and try again.';
        } else if (err.message.includes('Failed to clone voice') || err.message.includes('fetch failed')) {
          errorMessage = 'Unable to connect to voice cloning service. Please check your internet connection and try again.';
        } else if (err.message.includes('ElevenLabsError')) {
          errorMessage = 'Voice cloning service error. Please try again in a few minutes.';
        } else if (err.message.includes('Audio file too')) {
          errorMessage = 'Audio quality issue. Please record again with clearer audio.';
        } else if (err.message.includes('Invalid audio format')) {
          errorMessage = 'Audio format not supported. Please try recording again.';
        } else {
          errorMessage = `Error: ${err.message}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>🎤 Create Custom Voice</h3>
          <button onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Voice Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., My Voice, Mom's Voice"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe this voice..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            >
              <option value="personal">Personal</option>
              <option value="family">Family</option>
              <option value="teacher">Teacher</option>
              <option value="character">Character</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Voice Recording *</label>
            <div className="recording-section">
              <div className="recording-controls">
                {!isRecording ? (
                  <button
                    type="button"
                    className="btn btn-primary record-btn"
                    onClick={startRecording}
                  >
                    🎤 Start Recording
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-danger record-btn"
                    onClick={stopRecording}
                  >
                    ⏹️ Stop Recording ({formatTime(recordingTime)})
                  </button>
                )}
              </div>
              
              <div className="recording-instructions">
                <h4>Recording Instructions:</h4>
                <ol>
                  <li>Click "Start Recording" and speak clearly</li>
                  <li>Read a short paragraph or story (30-60 seconds)</li>
                  <li>Speak naturally and at a normal pace</li>
                  <li>Ensure you're in a quiet environment</li>
                  <li>Record 2-3 different samples for best results</li>
                </ol>
                
                <div className="recording-prompt">
                  <h5>Suggested text to read:</h5>
                  <blockquote>
                    "Hello, my name is [Your Name]. I am creating a custom voice for my stories. 
                    This is a sample recording to train my voice. I will speak clearly and naturally 
                    so that my voice can be used to read stories aloud. Thank you for helping me 
                    create this personalized voice experience."
                  </blockquote>
                </div>
              </div>
              
              {recordings.length > 0 && (
                <div className="recordings-list">
                  <h4>Recorded Samples ({recordings.length})</h4>
                  {recordings.map((recording, index) => (
                    <div key={index} className="recording-item">
                      <audio controls src={recording.url} />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteRecording(index)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <small>
              Record 30-60 seconds of clear speech. Multiple samples improve voice quality.
            </small>
          </div>

          {error && (
            <div className="error-message">
              <div className="error-icon">⚠️</div>
              <div className="error-content">
                <strong>Voice Creation Failed</strong>
                <p>{error}</p>
                <div className="error-actions">
                  <button 
                    type="button" 
                    className="btn btn-sm btn-secondary"
                    onClick={() => setError(null)}
                  >
                    Dismiss
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-primary"
                    onClick={() => window.location.reload()}
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Voice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Voice Modal Component
interface EditVoiceModalProps {
  voice: CustomVoice;
  onClose: () => void;
  onVoiceUpdated: (voice: CustomVoice) => void;
}

const EditVoiceModal: React.FC<EditVoiceModalProps> = ({
  voice,
  onClose,
  onVoiceUpdated,
}) => {
  const [formData, setFormData] = useState({
    name: voice.name,
    description: voice.description || '',
    category: voice.category,
    voice_settings: voice.voice_settings,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const updatedVoice = await CustomVoiceAPI.updateCustomVoice(voice.id, formData);
      onVoiceUpdated(updatedVoice);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>⚙️ Voice Settings</h3>
          <button onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Voice Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            >
              <option value="personal">Personal</option>
              <option value="family">Family</option>
              <option value="teacher">Teacher</option>
              <option value="character">Character</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="voice-settings">
            <h4>Voice Settings</h4>
            
            <div className="form-group">
              <label>Stability: {formData.voice_settings.stability}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={formData.voice_settings.stability}
                onChange={(e) => setFormData({
                  ...formData,
                  voice_settings: {
                    ...formData.voice_settings,
                    stability: parseFloat(e.target.value),
                  },
                })}
              />
            </div>

            <div className="form-group">
              <label>Similarity Boost: {formData.voice_settings.similarity_boost}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={formData.voice_settings.similarity_boost}
                onChange={(e) => setFormData({
                  ...formData,
                  voice_settings: {
                    ...formData.voice_settings,
                    similarity_boost: parseFloat(e.target.value),
                  },
                })}
              />
            </div>

            <div className="form-group">
              <label>Style: {formData.voice_settings.style}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={formData.voice_settings.style}
                onChange={(e) => setFormData({
                  ...formData,
                  voice_settings: {
                    ...formData.voice_settings,
                    style: parseFloat(e.target.value),
                  },
                })}
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.voice_settings.use_speaker_boost}
                  onChange={(e) => setFormData({
                    ...formData,
                    voice_settings: {
                      ...formData.voice_settings,
                      use_speaker_boost: e.target.checked,
                    },
                  })}
                />
                Use Speaker Boost
              </label>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Voice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
