import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TechniqueSelect.css";

const TechniqueSelect = () => {
  const navigate = useNavigate();
  const [selectedTechnique, setSelectedTechnique] = useState("flashcards");
  const [userLevel, setUserLevel] = useState(1);

  useEffect(() => {
    // Get user level from localStorage (you'll sync this with backend later)
    const storedLevel = parseInt(localStorage.getItem("userLevel") || "1");
    setUserLevel(storedLevel);
  }, []);

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
  ];

  const isUnlocked = (technique) => {
    return userLevel >= technique.requiredLevel;
  };

  const handleContinue = () => {
    localStorage.setItem("studyTechnique", selectedTechnique);
    navigate("/study");
  };

  return (
    <div className="technique-select">
      <div className="technique-select-container">
        <h1 className="page-title">Choose Your Study Technique! ⚡</h1>

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
