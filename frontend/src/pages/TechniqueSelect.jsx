import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TechniqueSelect.css';

const TechniqueSelect = () => {
  const navigate = useNavigate();
  const [selectedTechnique, setSelectedTechnique] = useState('flashcards');
  const [userLevel, setUserLevel] = useState(1);
  const selectedCharacter = JSON.parse(localStorage.getItem('selectedCharacter') || '{}');

  useEffect(() => {
    // TODO: Fetch real user level from backend
    const mockLevel = parseInt(localStorage.getItem('userLevel') || '1');
    setUserLevel(mockLevel);
  }, []);

  const techniques = [
    {
      id: 'flashcards',
      name: 'Flashcards',
      icon: '📇',
      description: 'Classic Q&A cards with flip animation',
      requiredLevel: 1,
      characterBonus: null, // Available to all
    },
    {
      id: 'multiple-choice',
      name: 'Multiple Choice Quiz',
      icon: '❓',
      description: 'Test yourself with 4-option questions',
      requiredLevel: 2,
      characterBonus: 'Sasha', // Sasha (Active Learner) unlocks first
    },
    {
      id: 'pomodoro',
      name: 'Pomodoro Mode',
      icon: '⏱️',
      description: 'Study in 25-minute focused sprints',
      requiredLevel: 2,
      characterBonus: 'Jade', // Jade (Strategic Planner) unlocks first
    },
    {
      id: 'spaced-repetition',
      name: 'Spaced Repetition',
      icon: '🔁',
      description: 'Smart algorithm shows weak cards more',
      requiredLevel: 4,
      characterBonus: null,
    },
    {
      id: 'active-recall',
      name: 'Active Recall',
      icon: '✍️',
      description: 'Write answers before revealing',
      requiredLevel: 5,
      characterBonus: null,
    },
  ];

  const isUnlocked = (technique) => {
    if (userLevel >= technique.requiredLevel) return true;
    if (technique.characterBonus === selectedCharacter.name && userLevel >= technique.requiredLevel - 1) {
      return true; // Character gets 1 level early access
    }
    return false;
  };

  const handleContinue = () => {
    localStorage.setItem('studyTechnique', selectedTechnique);
    navigate('/study');
  };

  return (
    <div className="technique-select">
      <div className="technique-select-container">
        <h1 className="page-title">Choose Your Study Technique! ⚡</h1>
        
        {selectedCharacter.name && (
          <p className="character-bonus">
            As <strong>{selectedCharacter.name}</strong>, you get early access to certain techniques!
          </p>
        )}

        <div className="techniques-grid">
          {techniques.map((technique) => {
            const unlocked = isUnlocked(technique);
            const hasBonus = technique.characterBonus === selectedCharacter.name;

            return (
              <div
                key={technique.id}
                className={`technique-card ${selectedTechnique === technique.id ? 'selected' : ''} ${!unlocked ? 'locked' : ''}`}
                onClick={() => unlocked && setSelectedTechnique(technique.id)}
              >
                <div className="technique-icon">{technique.icon}</div>
                <h3 className="technique-name">{technique.name}</h3>
                <p className="technique-description">{technique.description}</p>

                {hasBonus && unlocked && (
                  <div className="character-bonus-badge">
                    {selectedCharacter.name}'s Specialty! ⭐
                  </div>
                )}

                {!unlocked && (
                  <div className="lock-overlay">
                    🔒 Unlock at Level {technique.requiredLevel}
                  </div>
                )}

                {selectedTechnique === technique.id && unlocked && (
                  <div className="selected-badge">Selected ✓</div>
                )}
              </div>
            );
          })}
        </div>

        <button
          className="continue-button"
          onClick={handleContinue}
          disabled={!selectedTechnique}
        >
          Start Session →
        </button>

        <button className="back-button" onClick={() => navigate('/topic-input')}>
          ← Back
        </button>
      </div>
    </div>
  );
};

export default TechniqueSelect;