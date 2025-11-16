import React, { useState } from "react";
import "./MultipleChoiceSession.css";

const MultipleChoiceSession = ({ flashcards, onSessionComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);

  if (!flashcards || flashcards.length === 0) {
    return <div>No questions available</div>;
  }

  const currentCard = flashcards[currentIndex];

  // Generate multiple choice options from the answer
  const generateOptions = () => {
    const correctAnswer = currentCard.answer;
    const distractors = [
      "This is another possible answer",
      "An alternative explanation",
      "A different concept",
    ];

    // Mix correct answer with distractors
    const allOptions = [correctAnswer, ...distractors.slice(0, 3)];

    // Shuffle
    return allOptions.sort(() => Math.random() - 0.5);
  };

  const options = generateOptions();
  const correctAnswerIndex = options.indexOf(currentCard.answer);

  const handleAnswerClick = (index) => {
    if (isAnswered) return;

    setSelectedAnswer(index);
    setIsAnswered(true);

    const isCorrect = index === correctAnswerIndex;

    if (isCorrect) {
      setScore(score + 1);
      setSessionXP(sessionXP + 20);
    } else {
      setSessionXP(sessionXP + 5);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      onSessionComplete({
        score,
        total: flashcards.length,
        xp: sessionXP,
      });
    }
  };

  return (
    <div className="multiple-choice-session">
      <div className="mc-container">
        {/* Header */}
        <div className="mc-header">
          <div className="mc-progress">
            Question {currentIndex + 1} of {flashcards.length}
          </div>
          <div className="mc-score">
            Score: {score}/{flashcards.length} • {sessionXP} XP
          </div>
        </div>

        {/* Question */}
        <div className="mc-question">
          <h2>{currentCard.question}</h2>
        </div>

        {/* Options */}
        <div className="mc-options">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === correctAnswerIndex;

            let className = "mc-option";
            if (isAnswered) {
              if (isCorrect) {
                className += " correct";
              } else if (isSelected && !isCorrect) {
                className += " incorrect";
              }
            } else if (isSelected) {
              className += " selected";
            }

            return (
              <button
                key={index}
                className={className}
                onClick={() => handleAnswerClick(index)}
                disabled={isAnswered}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-text">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Next button */}
        {isAnswered && (
          <button className="mc-next-button" onClick={handleNext}>
            {currentIndex < flashcards.length - 1
              ? "Next Question →"
              : "Finish Session ✓"}
          </button>
        )}
      </div>
    </div>
  );
};

export default MultipleChoiceSession;
