import React from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import "./SessionSummary.css";

const SessionSummary = ({ stats }) => {
  const navigate = useNavigate();
  const { completed, total, xp, technique } = stats;

  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="session-summary">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={200}
      />

      <div className="summary-container">
        <h1 className="summary-title">Session Complete! 🎉</h1>

        <div className="summary-stats">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-value">
              {completed}/{total}
            </div>
            <div className="stat-label">Cards Completed</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">{xp}</div>
            <div className="stat-label">XP Earned</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{percentage}%</div>
            <div className="stat-label">Accuracy</div>
          </div>
        </div>

        <div className="summary-technique">
          Studied with: <strong>{technique || "Flashcards"}</strong>
        </div>

        <div className="summary-buttons">
          <button
            className="summary-btn btn-continue"
            onClick={() => navigate("/topic-input")}
          >
            📚 Study Another Topic
          </button>
          <button
            className="summary-btn btn-technique"
            onClick={() => navigate("/technique-select")}
          >
            ⚡ Try Different Technique
          </button>
          <button
            className="summary-btn btn-home"
            onClick={() => navigate("/")}
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionSummary;
