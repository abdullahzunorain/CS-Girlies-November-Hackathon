import React, { useState } from "react";
import "./FeynmanSession.css";

const FeynmanSession = ({ flashcards, onSessionComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userExplanation, setUserExplanation] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionXP, setSessionXP] = useState(0);
  const [completedCards, setCompletedCards] = useState(0);

  if (!flashcards || flashcards.length === 0) {
    return <div>No questions available</div>;
  }

  const currentCard = flashcards[currentIndex];

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleNext = (understood) => {
    const xpEarned = understood ? 30 : 10; // Higher XP for Feynman
    setSessionXP(sessionXP + xpEarned);
    setCompletedCards(completedCards + 1);

    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserExplanation("");
      setShowAnswer(false);
    } else {
      onSessionComplete({
        completed: completedCards + 1,
        total: flashcards.length,
        xp: sessionXP + xpEarned,
      });
    }
  };

  const wordCount = userExplanation
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  return (
    <div className="feynman-session">
      <div className="feynman-container">
        {/* Header */}
        <div className="feynman-header">
          <div className="feynman-progress">
            Card {currentIndex + 1} of {flashcards.length}
          </div>
          <div className="feynman-stats">
            Completed: {completedCards} • {sessionXP} XP
          </div>
        </div>

        {/* Instructions */}
        <div className="feynman-instructions">
          <h3>🎓 Feynman Technique</h3>
          <p>Explain this concept in simple terms, as if teaching a beginner</p>
        </div>

        {/* Question */}
        <div className="feynman-question">
          <h2>{currentCard.question}</h2>
        </div>

        {/* Explanation Input */}
        {!showAnswer && (
          <div className="feynman-input-section">
            <textarea
              className="feynman-textarea"
              placeholder="Type your explanation here... Aim for simple, clear language!"
              value={userExplanation}
              onChange={(e) => setUserExplanation(e.target.value)}
              rows={8}
            />
            <div className="word-count">
              {wordCount} words {wordCount >= 20 ? "✅" : "(aim for 20+)"}
            </div>
            <button
              className="feynman-reveal-button"
              onClick={handleShowAnswer}
              disabled={wordCount < 10}
            >
              {wordCount < 10
                ? "🔒 Write at least 10 words"
                : "Compare with Answer →"}
            </button>
          </div>
        )}

        {/* Show Answer Comparison */}
        {showAnswer && (
          <div className="feynman-comparison">
            <div className="comparison-section">
              <h3>Your Explanation</h3>
              <div className="explanation-box user-explanation">
                {userExplanation || "No explanation provided"}
              </div>
            </div>

            <div className="comparison-divider">
              <span>VS</span>
            </div>

            <div className="comparison-section">
              <h3>Actual Answer</h3>
              <div className="explanation-box actual-answer">
                {currentCard.answer}
              </div>
            </div>

            {/* Self-Assessment */}
            <div className="feynman-assessment">
              <p>Did you explain it correctly?</p>
              <div className="assessment-buttons">
                <button
                  className="assessment-btn btn-no"
                  onClick={() => handleNext(false)}
                >
                  😅 Need to Study More
                </button>
                <button
                  className="assessment-btn btn-yes"
                  onClick={() => handleNext(true)}
                >
                  ✅ Explained It Well!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeynmanSession;
