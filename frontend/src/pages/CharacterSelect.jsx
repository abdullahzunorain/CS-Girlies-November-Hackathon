import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CharacterSelect.css";
import char1 from "../assets/images/char1.jpg";
import char2 from "../assets/images/char2.jpg";
import char3 from "../assets/images/char3.jpg";
import char4 from "../assets/images/char4.jpg";
import bg4 from "../assets/images/bg4.jpg";
import { saveCharacter } from "../services/api";

/**
 * Character Selection Page
 */

const CharacterSelect = () => {
  const navigate = useNavigate();
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const characters = [
    {
      id: "bratz-pink",
      name: "Yasmin",
      style: "Creative Explorer",
      color: "#ff69b4",
      image: char2,
      description:
        "Learns best through visual connections and creative thinking",
      specialties: ["flashcards", "mind-mapping"],
      bonusMultiplier: 1.5,
    },
    {
      id: "bratz-purple",
      name: "Jade",
      style: "Strategic Planner",
      color: "#9b59b6",
      image: char1,
      description: "Masters concepts through structured study and organization",
      specialties: ["pomodoro", "spaced-repetition"],
      bonusMultiplier: 1.5,
    },
    {
      id: "bratz-blue",
      name: "Sasha",
      style: "Active Learner",
      color: "#3498db",
      image: char3,
      description: "Thrives on practice problems and hands-on experimentation",
      specialties: ["multiple-choice", "active-recall"],
      bonusMultiplier: 1.5,
    },
    {
      id: "bratz-orange",
      name: "Cloe",
      style: "Social Studier",
      color: "#e67e22",
      image: char4,
      description: "Best at learning through discussion and teaching others",
      specialties: ["feynman", "study-buddy"],
      bonusMultiplier: 1.5,
    },
  ];

  const handleSelectCharacter = (character) => {
    setSelectedCharacter(character);
  };

  const handleContinue = async () => {
    if (selectedCharacter) {
      setIsSaving(true);
      try {
        // Save to backend
        await saveCharacter(selectedCharacter);
        // Save to localStorage
        localStorage.setItem(
          "selectedCharacter",
          JSON.stringify(selectedCharacter)
        );
        navigate("/topic-input");
      } catch (error) {
        console.error("Error saving character:", error);
        // Still navigate even if backend fails, localStorage should work
        navigate("/topic-input");
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div
      className="character-select"
      style={{ backgroundImage: `url(${bg4})` }}
    >
      <div className="character-select-container">
        <h1 className="page-title">Pick Your Study Persona! ✨</h1>
        <p className="page-subtitle">
          Each character has a unique learning style
        </p>

        <div className="characters-grid">
          {characters.map((character) => (
            <div
              key={character.id}
              className={`character-card ${
                selectedCharacter?.id === character.id ? "selected" : ""
              }`}
              onClick={() => handleSelectCharacter(character)}
              style={{
                borderColor:
                  selectedCharacter?.id === character.id
                    ? character.color
                    : "transparent",
              }}
            >
              {/* Person 3: Replace with actual character image/avatar */}
              <div
                className="character-avatar"
                style={{
                  background: `linear-gradient(135deg, ${character.color} 0%, #764ba2 100%)`,
                }}
              >
                <img
                  src={character.image}
                  alt={character.name}
                  className="character-img"
                />
              </div>

              <h3 className="character-name">{character.name}</h3>
              <p className="character-style">{character.style}</p>
              <p className="character-description">{character.description}</p>
              <div className="character-specialties">
                <p className="specialties-label">Specialties:</p>
                <div className="specialty-tags">
                  {character.specialties.map((spec) => (
                    <span key={spec} className="specialty-tag">
                      {spec.replace("-", " ")}
                    </span>
                  ))}
                </div>
              </div>
              {selectedCharacter?.id === character.id && (
                <div className="selected-badge">Selected ✓</div>
              )}
            </div>
          ))}
        </div>

        <button
          className="continue-button"
          onClick={handleContinue}
          disabled={!selectedCharacter || isSaving}
        >
          {isSaving
            ? "Saving..."
            : `Continue ${
                selectedCharacter ? "→" : "(Pick a character first!)"
              }`}
        </button>

        <button className="back-button" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default CharacterSelect;
