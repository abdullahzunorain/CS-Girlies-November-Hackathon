import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopicInput.css';

/**
 * Topic Input Page
 * User enters what they want to study
 * Then triggers Person 1's flashcard generation API
 */

const TopicInput = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [cardCount, setCardCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  // Get selected character from localStorage
  const selectedCharacter = JSON.parse(localStorage.getItem('selectedCharacter') || '{}');

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic to study!');
      return;
    }

    setIsGenerating(true);

    // TODO Person 5: Connect to Person 1's API here
    // For now, simulate API delay
    setTimeout(() => {
      // Save topic to localStorage
      localStorage.setItem('currentTopic', topic);
      localStorage.setItem('cardCount', cardCount);
      
      // Navigate to study session
      navigate('/study');
    }, 2000);
  };

  return (
    <div className="topic-input">
      <div className="topic-input-container">
        {/* Character greeting */}
        {selectedCharacter.name && (
          <div className="character-greeting">
            <div 
              className="character-mini-avatar"
              style={{ background: `linear-gradient(135deg, ${selectedCharacter.color} 0%, #764ba2 100%)` }}
            >
              👤
            </div>
            <p>
              Hey! I'm <strong>{selectedCharacter.name}</strong>. 
              What do you want to study today?
            </p>
          </div>
        )}

        <h1 className="page-title">Ready to Level Up? 📚</h1>
        <p className="page-subtitle">Tell me what you're studying and I'll generate flashcards!</p>

        <div className="input-section">
          {/* Topic input */}
          <div className="input-group">
            <label htmlFor="topic">What are you studying?</label>
            <input
              id="topic"
              type="text"
              placeholder="e.g., Spanish verbs, Photosynthesis, World War 2..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="topic-input-field"
              disabled={isGenerating}
            />
          </div>

          {/* Card count selector */}
          <div className="input-group">
            <label htmlFor="cardCount">Number of flashcards</label>
            <div className="card-count-selector">
              {[5, 10, 15, 20].map((count) => (
                <button
                  key={count}
                  className={`count-option ${cardCount === count ? 'selected' : ''}`}
                  onClick={() => setCardCount(count)}
                  disabled={isGenerating}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Popular topics suggestions */}
          <div className="suggestions">
            <p className="suggestions-label">Popular topics:</p>
            <div className="suggestion-chips">
              {[
                'Biology 101',
                'Spanish Vocabulary',
                'US History',
                'JavaScript Basics',
                'SAT Math'
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  className="suggestion-chip"
                  onClick={() => setTopic(suggestion)}
                  disabled={isGenerating}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate button */}
        <button
          className="generate-button"
          onClick={handleGenerate}
          disabled={isGenerating || !topic.trim()}
        >
          {isGenerating ? (
            <>
              <span className="spinner">⏳</span> Generating Flashcards...
            </>
          ) : (
            <>Generate Flashcards! ✨</>
          )}
        </button>

        <button 
          className="back-button" 
          onClick={() => navigate('/character-select')}
          disabled={isGenerating}
        >
          ← Change Character
        </button>
      </div>
    </div>
  );
};

export default TopicInput;