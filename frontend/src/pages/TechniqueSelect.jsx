import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./TechniqueSelect.css";
import { getUserProgress } from "../services/api";
import bg3 from "../assets/images/bg3.png";

const TechniqueSelect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTechnique, setSelectedTechnique] = useState("flashcards");
  const [userLevel, setUserLevel] = useState(1);
  const [userProgress, setUserProgress] = useState(null);

  useEffect(() => {
    const loadProgress = async () => {
      const progress = await getUserProgress();
      if (progress) {
        setUserProgress(progress);
        setUserLevel(progress.level);
      }
    };
    loadProgress();
  }, [location]);

  const selectedCharacter = JSON.parse(
    localStorage.getItem("selectedCharacter") || "{}"
  );

  const techniques = [
    {
      id: "flashcards",
      name: "Flashcards",
      icon: "📇",
      description: "Classic Q&A cards with flip animation",
      requiredLevel: 1,
    },
    {
      id: "multiple-choice",
      name: "Multiple Choice Quiz",
      icon: "❓",
      description: "Test yourself with 4-option questions",
      requiredLevel: 2,
    },
    {
      id: "pomodoro",
      name: "Pomodoro Mode",
      icon: "⏱️",
      description: "Study in 25-minute focused sprints",
      requiredLevel: 3,
    },
    {
      id: "spaced-repetition",
      name: "Spaced Repetition",
      icon: "🔁",
      description: "Smart algorithm shows weak cards more",
      requiredLevel: 4,
    },
    {
      id: "active-recall",
      name: "Active Recall",
      icon: "✍️",
      description: "Write answers before revealing",
      requiredLevel: 5,
    },
    {
      id: "study-buddy",
      name: "Study Buddy Mode",
      icon: "👥",
      description: "Challenge a friend to study sessions",
      requiredLevel: 6,
    },
    {
      id: "mind-mapping",
      name: "Mind Mapping",
      icon: "🧠",
      description: "Visualize connections between concepts",
      requiredLevel: 7,
    },
    {
      id: "feynman",
      name: "Feynman Technique",
      icon: "🎓",
      description: "Teach concepts in simple terms",
      requiredLevel: 8,
    },
  ];

  const isUnlocked = (technique) => {
    return userLevel >= technique.requiredLevel;
  };

  const handleContinue = () => {
    localStorage.setItem("studyTechnique", selectedTechnique);
    navigate("/study");
  };

  const hasBonus = (techniqueId) => {
    return selectedCharacter.specialties?.includes(techniqueId);
  };

  const getBonusText = (techniqueId) => {
    if (hasBonus(techniqueId)) {
      return `${selectedCharacter.name}'s Specialty! +50% XP ⭐`;
    }
    return null;
  };

  return (
    <div
      className="technique-select"
      style={{ backgroundImage: `url(${bg3})` }}
    >
      {/* Top-left user stats */}
      <div className="top-left-stats">
        <div className="user-level-display">
          <div className="level-line">Level {userLevel}</div>
          <div className="xp-line">
            {userProgress
              ? `${userProgress.xp}/${userProgress.next_level_xp} XP`
              : "—/— XP"}
          </div>
        </div>
      </div>

      <div className="technique-select-container">
        <h1 className="page-title">Choose Your Study Technique! ⚡</h1>
        {/* Show character info */}
        {selectedCharacter.name && (
          <div className="character-info-banner">
            <div
              className="mini-avatar"
              style={{
                background: `linear-gradient(135deg, ${selectedCharacter.color} 0%, #764ba2 100%)`,
              }}
            >
              <img src={selectedCharacter.image} alt={selectedCharacter.name} />
            </div>
            <p>
              <strong>{selectedCharacter.name}</strong> earns bonus XP with
              certain techniques!
            </p>
          </div>
        )}

        {/* user-level-display moved to top-right stats */}

        <div className="techniques-grid">
          {techniques.map((technique) => {
            const unlocked = isUnlocked(technique);

            return (
              <div
                key={technique.id}
                className={`technique-card ${
                  selectedTechnique === technique.id ? "selected" : ""
                } ${!unlocked ? "locked" : ""}`}
                onClick={() => unlocked && setSelectedTechnique(technique.id)}
              >
                <div className="technique-icon">{technique.icon}</div>
                <h3 className="technique-name">{technique.name}</h3>
                <p className="technique-description">{technique.description}</p>
                {/* Show bonus badge */}
                {hasBonus(technique.id) && unlocked && (
                  <div className="bonus-badge">⭐ +50% XP</div>
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

        <button
          className="back-button"
          onClick={() => navigate("/topic-input")}
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default TechniqueSelect;
