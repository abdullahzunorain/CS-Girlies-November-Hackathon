import React, { useState, useEffect } from "react";
import "./Flashcard.css";

const Flashcard = ({
  question,
  answer,
  onCorrect,
  onIncorrect,
  cardNumber,
  totalCards,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setIsFlipped(false);
    setIsAnswered(false);
  }, [question, answer]);

  const handleFlip = () => {
    if (!isAnswered) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleAnswer = (correct, event) => {
    // Prevent event bubbling to avoid re-flipping the card
    if (event) {
      event.stopPropagation();
    }
    setIsAnswered(true);
    if (correct) {
      onCorrect();
    } else {
      onIncorrect();
    }
  };

  return (
    <div className="flashcard-container">
      {/* Card number indicator */}
      <div className="card-number">
        Card {cardNumber} of {totalCards}
      </div>

      {/* The actual flashcard */}
      <div
        className={`flashcard ${isFlipped ? "flipped" : ""}`}
        onClick={handleFlip}
      >
        <div className="flashcard-front">
          <div className="flashcard-content">
            <h2>Question</h2>
            <p>{question}</p>
          </div>
          <div className="flip-hint">Click to reveal answer ✨</div>
        </div>

        <div className="flashcard-back">
          <div className="flashcard-content">
            <h2>Answer</h2>
            <p>{answer}</p>
          </div>
        </div>
      </div>

      {/* Answer buttons (only show when flipped) */}
      {isFlipped && !isAnswered && (
        <div className="answer-buttons" onClick={(e) => e.stopPropagation()}>
          <button
            className="btn-incorrect"
            onClick={(e) => handleAnswer(false, e)}
          >
            Need to Review 😅
          </button>
          <button
            className="btn-correct"
            onClick={(e) => handleAnswer(true, e)}
          >
            Got It! ⭐
          </button>
        </div>
      )}
    </div>
  );
};

export default Flashcard;
