import React, { useState, useEffect } from "react";
import CharacterBackground from "./CharacterBackground";
import XPNotification from "./XPNotification";
import { calculateXPWithBonus, awardXP } from "../../services/api";
import "./ActiveRecallSession.css";

const ActiveRecallSession = ({ flashcards, onSessionComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionXP, setSessionXP] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showXP, setShowXP] = useState(false);
  const [lastXP, setLastXP] = useState(0);
  const [showBonusText, setShowBonusText] = useState(false);
  const [bonusMessage, setBonusMessage] = useState("");

  if (!flashcards || flashcards.length === 0) {
    return (
      <CharacterBackground>
        <div className="active-recall-session">
          <div className="loading">No flashcards available</div>
        </div>
      </CharacterBackground>
    );
  }

  const currentCard = flashcards[currentIndex];

  const handleSubmitAnswer = () => {
    if (userAnswer.trim().length < 3) {
      alert("Please write at least 3 characters");
      return;
    }
    setShowAnswer(true);
  };

  const handleNext = (correct) => {
    const technique = "active-recall";
    const xpAmount = correct ? 20 : 10;
    const xpResult = calculateXPWithBonus(xpAmount, technique);

    setSessionXP((prev) => prev + xpResult.totalXP);
    if (correct) {
      setCorrectCount((prev) => prev + 1);
    }

    // Award XP
    awardXP("active_recall", xpAmount);

    // Show XP notification
    setLastXP(xpResult.totalXP);
    setShowXP(true);

    if (xpResult.hasBonus) {
      setBonusMessage(
        `${xpResult.characterName}'s Specialty! +${xpResult.bonus} bonus XP! 🌟`
      );
      setShowBonusText(true);
      setTimeout(() => setShowBonusText(false), 3000);
    }

    setTimeout(() => setShowXP(false), 2000);

    // Move to next card
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer("");
      setShowAnswer(false);
    } else {
      // Session complete
      const sessionData = {
        xp: sessionXP + xpResult.totalXP + 60,
        completed: correctCount + (correct ? 1 : 0),
        total: flashcards.length,
      };
      onSessionComplete(sessionData);
    }
  };

  const wordCount = userAnswer
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  return (
    <CharacterBackground>
      <div className="active-recall-session">
        <div className="ar-container">
          {/* Header */}
          <div className="ar-header">
            <div className="stat">
              <span className="stat-label">📋 Card</span>
              <span className="stat-value">
                {currentIndex + 1}/{flashcards.length}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">✅ Correct</span>
              <span className="stat-value">{correctCount}</span>
            </div>
            <div className="stat">
              <span className="stat-label">⭐ Session XP</span>
              <span className="stat-value">{sessionXP}</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="ar-instructions">
            <h3>✍️ Active Recall</h3>
            <p>Write your answer before revealing the correct one</p>
          </div>

          {/* Question */}
          <div className="ar-question">
            <h2>{currentCard.question}</h2>
          </div>

          {/* Answer Input */}
          {!showAnswer && (
            <div className="ar-input-section">
              <textarea
                className="ar-textarea"
                placeholder="Type your answer here... Write as much detail as you can remember!"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                rows={6}
              />
              <div className="word-count">
                {wordCount} words {wordCount >= 5 ? "✅" : "(try for 5+)"}
              </div>
              <button
                className="submit-answer-btn"
                onClick={handleSubmitAnswer}
                disabled={userAnswer.trim().length < 3}
              >
                {userAnswer.trim().length < 3
                  ? "🔒 Write at least 3 characters"
                  : "Check Answer →"}
              </button>
            </div>
          )}

          {/* Answer Comparison */}
          {showAnswer && (
            <div className="ar-comparison">
              <div className="comparison-grid">
                <div className="answer-box user-answer-box">
                  <h3>Your Answer</h3>
                  <div className="answer-content">{userAnswer}</div>
                </div>

                <div className="answer-box correct-answer-box">
                  <h3>Correct Answer</h3>
                  <div className="answer-content">{currentCard.answer}</div>
                </div>
              </div>

              {/* Self-Assessment */}
              <div className="ar-assessment">
                <p>Did you get it right?</p>
                <div className="assessment-buttons">
                  <button
                    className="assessment-btn btn-incorrect"
                    onClick={() => handleNext(false)}
                  >
                    ❌ Not Quite
                  </button>
                  <button
                    className="assessment-btn btn-correct"
                    onClick={() => handleNext(true)}
                  >
                    ✅ Got It Right!
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* XP notifications */}
          <XPNotification xp={lastXP} show={showXP} />
          {showBonusText && <div className="bonus-message">{bonusMessage}</div>}
        </div>
      </div>
    </CharacterBackground>
  );
};

export default ActiveRecallSession;
