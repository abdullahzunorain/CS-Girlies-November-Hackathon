import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./HomePage.css";
import bg4 from "../assets/images/bg4.jpg";
import title1 from "../assets/images/title1.png";
import { getUserProgress } from "../services/api";

/**
 * Landing Page - First thing users see
 * Y2K themed welcome screen
 */

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userProgress, setUserProgress] = useState(null);

  useEffect(() => {
    const loadProgress = async () => {
      const progress = await getUserProgress();
      setUserProgress(progress);
    };
    loadProgress();
  }, [location]);

  const handleStartStudying = () => {
    navigate("/character-select");
  };

  return (
    <div className="homepage" style={{ backgroundImage: `url(${bg4})` }}>
      <div className="homepage-content">
        {/* User Progress Bar */}
        {userProgress && (
          <div className="user-progress-banner">
            <span>
              📊 Level {userProgress.level} • {userProgress.xp}/
              {userProgress.next_level_xp} XP
            </span>
          </div>
        )}

        {/* Main title */}
        <img src={title1} alt="Bratz Study " className="homepage-title-img" />

        {/* Subtitle */}
        <p className="homepage-subtitle">Level Up Your Brain! 🧠✨</p>

        {/* Description */}
        <div className="homepage-description">
          <p>📚 Study any topic with AI-generated flashcards</p>
          <p>⭐ Earn XP and level up as you learn</p>
          <p>🎮 Unlock study techniques and cosmetics</p>
          <p>💖 Nostalgic Y2K vibes while you grind!</p>
        </div>

        {/* CTA Button */}
        <button className="start-button" onClick={handleStartStudying}>
          Start Studying! 🚀
        </button>

        {/* Feature badges */}
        <div className="feature-badges">
          <span className="badge">AI Powered</span>
          <span className="badge">Gamified Learning</span>
          <span className="badge">Y2K Aesthetic</span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
