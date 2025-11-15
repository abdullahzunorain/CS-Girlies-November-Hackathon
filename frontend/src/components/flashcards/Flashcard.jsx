import React, { useState, useEffect } from 'react';
import './Flashcard.css';

/**
 * PERSON 4: Basic Flashcard Component
 * 
 * Features to build:
 * 1. ✅ Friday: Basic flip on click
 * 2. 🔲 Saturday: Smooth animations with framer-motion
 * 3. 🔲 Saturday: Swipe gestures (optional)
 */

const Flashcard = ({ question, answer, onCorrect, onIncorrect, cardNumber, totalCards }) => {
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

  const handleAnswer = (correct) => {
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
        className={`flashcard ${isFlipped ? 'flipped' : ''}`}
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
        <div className="answer-buttons">
          <button 
            className="btn-incorrect"
            onClick={() => handleAnswer(false)}
          >
            Need to Review 😅
          </button>
          <button 
            className="btn-correct"
            onClick={() => handleAnswer(true)}
          >
            Got It! ⭐
          </button>
        </div>
      )}
    </div>
  );
};

export default Flashcard;
