import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Flashcard from "../flashcards/Flashcard";
import "./StudySession.css";
import XPNotification from "../study/XPNotification";
import { awardXP } from "../../services/api";

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
  const navigate = useNavigate();
  const [showXP, setShowXP] = useState(false);
  const [lastXP, setLastXP] = useState(0);

  // Timer - updates every second
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  // Guard: if flashcards is empty or undefined, show fallback UI
  if (!flashcards || flashcards.length === 0) {
    return (
      <div
        className="study-session empty-session"
        style={{
          height: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          color: "#fff",
        }}
      >
        <div style={{ fontSize: "48px" }}>🤔</div>
        <div>No flashcards found for this topic.</div>
        <div style={{ opacity: 0.9 }}>
          Try generating flashcards from the topic input page.
        </div>
        <div>
          <button
            className="start-button"
            onClick={() => navigate("/topic-input")}
          >
            Back to Topic
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCorrect = () => {
    const xpGained = 15; // First try correct
    setSessionXP((prev) => prev + xpGained);
    setCorrectCount((prev) => prev + 1);

    // Award XP to backend
    awardXP("correct_answer", 15);

    // Show XP notification
    setLastXP(xpGained);
    setShowXP(true);
    setTimeout(() => setShowXP(false), 2000);

    setTimeout(() => moveToNextCard(), 1000);
  };

  const handleIncorrect = () => {
    const xpGained = 5; // Still get some XP for trying
    setSessionXP((prev) => prev + xpGained);
    setReviewCount((prev) => prev + 1);

    // Award XP to backend
    awardXP("correct_answer", 5);

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
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      // Session complete!
      completeSession();
    }
  };

  const completeSession = () => {
    const sessionData = {
      xp: sessionXP + 50, // Bonus for completing
      completed: correctCount,
      total: flashcards.length,
      timeSpent: elapsedTime,
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
      <XPNotification xp={lastXP} show={showXP} />
    </div>
  );
};

export default StudySession;
