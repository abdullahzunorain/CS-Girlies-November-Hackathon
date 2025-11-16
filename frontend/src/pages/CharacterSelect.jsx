import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CharacterSelect.css";
import char1 from "../assets/images/char1.jpg";
import char2 from "../assets/images/char2.jpg";
import char3 from "../assets/images/char3.jpg";
import char4 from "../assets/images/char4.jpg";
import bg1 from "../assets/images/bg3.png";
import { saveCharacter } from "../services/api";

/**
 * Character Selection Page
 * Person 3 will build the full character system
 * This is a placeholder so navigation works
 */

const CharacterSelect = () => {
  const navigate = useNavigate();
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Placeholder characters - Person 3 will replace with full system
  const characters = [
    {
      id: "bratz-pink",
      name: "Yasmin",
      style: "Creative Explorer",
      color: "#ff69b4",
      image: char2,
      description:
        "Learns best through visual connections and creative thinking",
    },
    {
      id: "bratz-purple",
      name: "Jade",
      style: "Strategic Planner",
      color: "#9b59b6",
      image: char1,
      description: "Masters concepts through structured study and organization",
    },
    {
      id: "bratz-blue",
      name: "Sasha",
      style: "Active Learner",
      color: "#3498db",
      image: char3,
      description: "Thrives on practice problems and hands-on experimentation",
    },
    {
      id: "bratz-orange",
      name: "Cloe",
      style: "Social Studier",
      color: "#e67e22",
      image: char4,
      description: "Best at learning through discussion and teaching others",
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
      style={{ backgroundImage: `url(${bg1})` }}
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
