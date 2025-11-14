import React, { useState, useEffect } from 'react';
import Flashcard from '../flashcards/Flashcard';
import './StudySession.css';

/**
 * PERSON 4: Study Session Container
 * 
 * This wraps the flashcard and shows:
 * - Timer
 * - Progress bar
 * - XP earned this session
 * - Current card / total cards
 */

const StudySession = ({ flashcards, onSessionComplete }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer - updates every second
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCorrect = () => {
    const xpGained = 15; // First try correct
    setSessionXP(prev => prev + xpGained);
    setCorrectCount(prev => prev + 1);
    
    // Show XP notification (you'll enhance this later)
    showXPNotification(xpGained);
    
    // Move to next card after brief delay
    setTimeout(() => {
      moveToNextCard();
    }, 1000);
  };

  const handleIncorrect = () => {
    const xpGained = 5; // Still get some XP for trying
    setSessionXP(prev => prev + xpGained);
    setReviewCount(prev => prev + 1);
    
    showXPNotification(xpGained);
    
    setTimeout(() => {
      moveToNextCard();
    }, 1000);
  };

  const showXPNotification = (xp) => {
    // TODO Saturday: Make this float up and fade out
    console.log(`+${xp} XP!`);
  };

  const moveToNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      // Session complete!
      completeSession();
    }
  };

  const completeSession = () => {
    const sessionData = {
      xpEarned: sessionXP + 50, // Bonus for completing
      correctCount,
      reviewCount,
      timeSpent: elapsedTime,
      totalCards: flashcards.length
    };
    onSessionComplete(sessionData);
  };

  const currentCard = flashcards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / flashcards.length) * 100;

  return (
    <div className="study-session">
      {/* Header with stats */}
      <div className="session-header">
        <div className="stat">
          <span className="stat-label">⏱️ Time</span>
          <span className="stat-value">{formatTime(elapsedTime)}</span>
        </div>

        <div className="stat">
          <span className="stat-label">⭐ Session XP</span>
          <span className="stat-value">{sessionXP}</span>
        </div>

        <div className="stat">
          <span className="stat-label">✅ Correct</span>
          <span className="stat-value">{correctCount}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        <div className="progress-text">
          {currentCardIndex + 1} / {flashcards.length}
        </div>
      </div>

      {/* The flashcard */}
      <Flashcard
        question={currentCard.question}
        answer={currentCard.answer}
        onCorrect={handleCorrect}
        onIncorrect={handleIncorrect}
        cardNumber={currentCardIndex + 1}
        totalCards={flashcards.length}
      />

      {/* XP notifications will appear here */}
      <div id="xp-notification-container"></div>
    </div>
  );
};

export default StudySession;
