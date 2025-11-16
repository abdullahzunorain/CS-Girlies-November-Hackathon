import React, { useState, useEffect } from "react";
import "./CharacterBackground.css";

const CharacterBackground = ({ children }) => {
  const [characterBg, setCharacterBg] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  useEffect(() => {
    const character = JSON.parse(
      localStorage.getItem("selectedCharacter") || "{}"
    );

    setSelectedCharacter(character);

    if (character.name) {
      try {
        const bg = require(`../../assets/images/${character.name.toLowerCase()}.jpg`);
        setCharacterBg(bg);
      } catch (error) {
        console.log("Character background not found, using default");
      }
    }
  }, []);

  return (
    <div
      className="character-background-wrapper"
      style={
        characterBg
          ? {
              backgroundImage: `url(${characterBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }
          : undefined
      }
    >
      {/* Dark overlay for readability */}
      <div className="background-overlay"></div>

      {/* Character badge in top-right */}
      {selectedCharacter?.name && (
        <div
          className="character-badge"
          style={{ borderColor: selectedCharacter.color }}
        >
          <img src={selectedCharacter.image} alt={selectedCharacter.name} />
          <span style={{ color: selectedCharacter.color }}>
            {selectedCharacter.name}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="content-wrapper">{children}</div>
    </div>
  );
};

export default CharacterBackground;
