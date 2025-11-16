import React, { useState, useEffect } from "react";
import CharacterBackground from "./CharacterBackground";
import XPNotification from "./XPNotification";
import { calculateXPWithBonus, awardXP } from "../../services/api";
import "./SpacedRepetitionSession.css";

const SpacedRepetitionSession = ({ flashcards, onSessionComplete }) => {
  const [cardQueue, setCardQueue] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionXP, setSessionXP] = useState(0);
  const [cardsReviewed, setCardsReviewed] = useState(0);
  const [showXP, setShowXP] = useState(false);
  const [lastXP, setLastXP] = useState(0);
  const [showBonusText, setShowBonusText] = useState(false);
  const [bonusMessage, setBonusMessage] = useState("");

  useEffect(() => {
    // Initialize card queue with difficulty levels
    const initialQueue = flashcards.map((card, index) => ({
      ...card,
      id: index,
      difficulty: 0, // 0 = new, 1 = hard, 2 = medium, 3 = easy
      nextReview: 0,
      reviews: 0,
    }));
    setCardQueue(initialQueue);
    setCurrentCard(initialQueue[0]);
  }, [flashcards]);

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleDifficulty = (difficulty) => {
    const technique = "spaced-repetition";
    let xpAmount = 0;
    let nextReviewIn = 0;

    // Calculate XP and next review based on difficulty
    switch (difficulty) {
      case 1: // Again (Hard)
        xpAmount = 5;
        nextReviewIn = 1; // Review again in 1 card
        break;
      case 2: // Good (Medium)
        xpAmount = 15;
        nextReviewIn = 3; // Review again in 3 cards
        break;
      case 3: // Easy
        xpAmount = 25;
        nextReviewIn = 10; // Review again in 10 cards
        break;
      default:
        xpAmount = 10;
        nextReviewIn = 2;
    }

    const xpResult = calculateXPWithBonus(xpAmount, technique);
    setSessionXP((prev) => prev + xpResult.totalXP);
    setCardsReviewed((prev) => prev + 1);

    // Award XP
    awardXP("spaced_repetition", xpAmount);

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

    // Update card queue with spaced repetition algorithm
    const updatedQueue = [...cardQueue];
    const currentIndex = updatedQueue.findIndex((c) => c.id === currentCard.id);

    if (currentIndex !== -1) {
      const card = updatedQueue[currentIndex];
      card.difficulty = difficulty;
      card.reviews += 1;

      // Remove from current position
      updatedQueue.splice(currentIndex, 1);

      // Reinsert based on difficulty
      const insertIndex = Math.min(
        currentIndex + nextReviewIn,
        updatedQueue.length
      );
      updatedQueue.splice(insertIndex, 0, card);

      setCardQueue(updatedQueue);

      // Move to next card
      if (updatedQueue.length > 1) {
        setCurrentCard(updatedQueue[0]);
        setShowAnswer(false);
      } else {
        // Session complete
        completeSession();
      }
    }
  };

  const completeSession = () => {
    const sessionData = {
      xp: sessionXP + 75, // Bonus for completing spaced repetition
      completed: cardsReviewed,
      total: flashcards.length,
    };
    onSessionComplete(sessionData);
  };

  if (!currentCard) {
    return (
      <CharacterBackground>
        <div className="spaced-repetition-session">
          <div className="loading">Loading cards...</div>
        </div>
      </CharacterBackground>
    );
  }

  return (
    <CharacterBackground>
      <div className="spaced-repetition-session">
        <div className="sr-container">
          {/* Header */}
          <div className="sr-header">
            <div className="stat">
              <span className="stat-label">📚 Cards Reviewed</span>
              <span className="stat-value">{cardsReviewed}</span>
            </div>
            <div className="stat">
              <span className="stat-label">📋 Remaining</span>
              <span className="stat-value">{cardQueue.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">⭐ Session XP</span>
              <span className="stat-value">{sessionXP}</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="sr-instructions">
            <h3>🔁 Spaced Repetition</h3>
            <p>Cards you struggle with appear more frequently</p>
          </div>

          {/* Card */}
          <div className="sr-card">
            <div className="question-section">
              <h2>{currentCard.question}</h2>
            </div>

            {!showAnswer ? (
              <button className="show-answer-btn" onClick={handleShowAnswer}>
                Show Answer
              </button>
            ) : (
              <>
                <div className="answer-section">
                  <h3>Answer:</h3>
                  <p>{currentCard.answer}</p>
                </div>

                {/* Difficulty buttons */}
                <div className="difficulty-buttons">
                  <p className="difficulty-prompt">
                    How well did you know this?
                  </p>
                  <div className="difficulty-options">
                    <button
                      className="difficulty-btn btn-again"
                      onClick={() => handleDifficulty(1)}
                    >
                      😅 Again
                      <span className="btn-subtitle">Review soon</span>
                    </button>
                    <button
                      className="difficulty-btn btn-good"
                      onClick={() => handleDifficulty(2)}
                    >
                      👍 Good
                      <span className="btn-subtitle">+15 XP</span>
                    </button>
                    <button
                      className="difficulty-btn btn-easy"
                      onClick={() => handleDifficulty(3)}
                    >
                      ✨ Easy!
                      <span className="btn-subtitle">+25 XP</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* XP notifications */}
          <XPNotification xp={lastXP} show={showXP} />
          {showBonusText && <div className="bonus-message">{bonusMessage}</div>}
        </div>
      </div>
    </CharacterBackground>
  );
};

export default SpacedRepetitionSession;
