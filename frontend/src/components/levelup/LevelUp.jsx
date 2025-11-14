import React from 'react';
import './LevelUp.css';

/**
 * PERSON 4: Level Up Celebration Screen
 * 
 * Build this Saturday afternoon after basic study flow works.
 * This is your "money shot" for the demo video!
 */

const LevelUp = ({ newLevel, unlockedFeature, onContinue }) => {
  return (
    <div className="levelup-overlay">
      <div className="levelup-container">
        {/* Sparkles and stars (you'll add these as background elements) */}
        <div className="sparkles">✨✨✨</div>

        {/* Main level up message */}
        <h1 className="levelup-title">LEVEL UP!</h1>
        
        <div className="level-display">
          <div className="level-number">{newLevel}</div>
        </div>

        {/* What they unlocked */}
        <div className="unlocked-section">
          <h2 className="unlocked-label">🎉 You Unlocked:</h2>
          <div className="unlocked-item">
            {unlockedFeature.icon} {unlockedFeature.name}
          </div>
          <p className="unlocked-description">
            {unlockedFeature.description}
          </p>
        </div>

        {/* Continue button */}
        <button className="continue-button" onClick={onContinue}>
          Continue Studying! ⭐
        </button>

        {/* More sparkles */}
        <div className="sparkles-bottom">⭐💫✨⭐💫</div>
      </div>
    </div>
  );
};

// Example usage in parent component:
// <LevelUp 
//   newLevel={3}
//   unlockedFeature={{
//     icon: "⏱️",
//     name: "Pomodoro Timer",
//     description: "Study in focused 25-minute sprints with 5-minute breaks!"
//   }}
//   onContinue={() => setShowLevelUp(false)}
// />

export default LevelUp;
