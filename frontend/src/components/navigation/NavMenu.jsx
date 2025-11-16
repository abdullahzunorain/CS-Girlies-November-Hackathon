import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserProgress } from "../../services/api";
import "./NavMenu.css";

const NavMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userProgress, setUserProgress] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadProgress = async () => {
      const progress = await getUserProgress();
      setUserProgress(progress);
    };
    loadProgress();
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigateTo = (path) => {
    navigate(path);
    setIsOpen(false); // Close menu after navigation
  };

  // Don't show menu on homepage
  if (location.pathname === "/") {
    return null;
  }

  return (
    <>
      {/* Hamburger Button */}
      <button className="nav-menu-button" onClick={toggleMenu}>
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Overlay when menu is open */}
      {isOpen && <div className="nav-overlay" onClick={toggleMenu} />}

      {/* Sliding Menu */}
      <div className={`nav-menu ${isOpen ? "open" : ""}`}>
        <div className="nav-menu-header">
          <h2>Bratz Study </h2>
          <button className="nav-close" onClick={toggleMenu}>
            ✕
          </button>
        </div>

        <nav className="nav-menu-items">
          <button className="nav-item" onClick={() => navigateTo("/")}>
            🏠 Home
          </button>

          <button
            className="nav-item"
            onClick={() => navigateTo("/character-select")}
          >
            👤 Change Character
          </button>

          <button
            className="nav-item"
            onClick={() => navigateTo("/topic-input")}
          >
            📚 New Study Session
          </button>

          <button
            className="nav-item"
            onClick={() => navigateTo("/technique-select")}
          >
            ⚡ Choose Technique
          </button>

          <div className="nav-divider" />

          <div className="nav-info">
            <h3>Your Progress</h3>
            {userProgress ? (
              <>
                <p>Level: {userProgress.level}</p>
                <p>
                  XP: {userProgress.xp} / {userProgress.next_level_xp}
                </p>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>

          <div className="nav-divider" />

          <button
            className="nav-item nav-item-danger"
            onClick={() => {
              if (window.confirm("Reset all progress?")) {
                localStorage.clear();
                navigateTo("/");
              }
            }}
          >
            🔄 Reset Progress
          </button>
        </nav>

        <div className="nav-footer">
          <p>CS Girlies Hackathon 2025</p>
        </div>
      </div>
    </>
  );
};

export default NavMenu;
