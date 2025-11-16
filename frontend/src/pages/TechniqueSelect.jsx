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

  return (
    <div
      className="technique-select"
      style={{ backgroundImage: `url(${bg3})` }}
    >
      <div className="technique-select-container">
        <h1 className="page-title">Choose Your Study Technique! ⚡</h1>

        {/* User Progress Display */}
        {userProgress && (
          <div className="user-stats-banner">
            <span className="stat">Level {userProgress.level}</span>
            <span className="stat">•</span>
            <span className="stat">
              {userProgress.xp}/{userProgress.next_level_xp} XP
            </span>
          </div>
        )}

        <div className="user-level-display">Level {userLevel}</div>

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
