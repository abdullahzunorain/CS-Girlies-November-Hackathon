import React, { useState, useMemo, useEffect } from "react";
import "./MultipleChoiceSession.css";
import { awardXP, generateWrongAnswers } from "../../services/api";

const MultipleChoiceSession = ({ flashcards, onSessionComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [options, setOptions] = useState([]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(-1);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  // Call hooks first (before any early returns)
  const currentCard = flashcards?.[currentIndex];

  // Load and generate wrong answers for the current question
  useEffect(() => {
    const loadOptions = async () => {
      if (!currentCard) {
        setOptions([]);
        setCorrectAnswerIndex(-1);
        return;
      }

      setIsLoadingOptions(true);

      try {
        // Generate AI-powered wrong answers
        const wrongAnswers = await generateWrongAnswers(
          currentCard.question,
          currentCard.answer,
          "", // context can be added if needed
          3 // 3 distractors
        );

        // Mix correct answer with AI-generated wrong answers
        const allOptions = [currentCard.answer, ...wrongAnswers.slice(0, 3)];

        // Shuffle
        const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
        const correctIndex = shuffledOptions.indexOf(currentCard.answer);

        setOptions(shuffledOptions);
        setCorrectAnswerIndex(correctIndex);
      } catch (error) {
        console.error("Error loading options:", error);
        // Fallback to generic options
        const allOptions = [
          currentCard.answer,
          "Another possible answer",
          "An alternative explanation",
          "A different concept",
        ];
        const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
        const correctIndex = shuffledOptions.indexOf(currentCard.answer);

        setOptions(shuffledOptions);
        setCorrectAnswerIndex(correctIndex);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    loadOptions();
  }, [currentCard]);

  // Now check guard conditions after all hooks
  if (!flashcards || flashcards.length === 0) {
    return <div>No questions available</div>;
  }

  if (!currentCard) {
    return <div>Loading question...</div>;
  }

  const handleAnswerClick = (index) => {
    if (isAnswered) return;

    setSelectedAnswer(index);
    setIsAnswered(true);

    const isCorrect = index === correctAnswerIndex;

    if (isCorrect) {
      setScore(score + 1);
      setSessionXP(sessionXP + 20);
      // Award XP to backend for correct answer
      awardXP("correct_answer", 20);
    } else {
      setSessionXP(sessionXP + 5);
      // Award XP to backend for attempt
      awardXP("correct_answer", 5);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      onSessionComplete({
        completed: score,
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
          {isLoadingOptions ? (
            <div className="mc-loading">
              <div style={{ fontSize: "24px" }}>⏳</div>
              <div>Generating question options...</div>
            </div>
          ) : (
            options.map((option, index) => {
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
            })
          )}
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
