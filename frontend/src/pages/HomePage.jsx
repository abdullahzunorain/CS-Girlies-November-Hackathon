import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import bg2 from '../assets/images/bg2.jpg';
import title1 from '../assets/images/title1.png';

/**
 * Landing Page - First thing users see
 * Y2K themed welcome screen
 */

const HomePage = () => {
  const navigate = useNavigate();

  const handleStartStudying = () => {
    navigate('/character-select');
  };

  return (
    <div className="homepage" style={{ backgroundImage: `url(${bg2})` }}>
      <div className="homepage-content">
        {/* Main title */}
        <img src={title1} alt="Y2K Study RPG" className="homepage-title-img" />

        {/* Subtitle */}
        <p className="homepage-subtitle">
          Level Up Your Brain! 🧠✨
        </p>

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