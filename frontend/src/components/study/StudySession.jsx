import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Flashcard from "../flashcards/Flashcard";
import "./StudySession.css";
import XPNotification from "../study/XPNotification";
import { awardXP, calculateXPWithBonus } from "../../services/api";

/**
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
  const [showBonusText, setShowBonusText] = useState(false);
  const [bonusMessage, setBonusMessage] = useState("");

  // Timer - updates every second
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
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
    const technique = localStorage.getItem("studyTechnique") || "flashcards";
    const xpResult = calculateXPWithBonus(15, technique);

    setSessionXP((prev) => prev + xpResult.totalXP);
    setCorrectCount((prev) => prev + 1);

    // Award XP to backend
    awardXP("correct_answer", 15);

    // Show XP notification
    setLastXP(xpResult.totalXP);
    setShowXP(true);
    // Show bonus message if applicable
    if (xpResult.hasBonus) {
      setBonusMessage(
        `${xpResult.characterName}'s Specialty! +${xpResult.bonus} bonus XP! 🌟`
      );
      setShowBonusText(true);
      setTimeout(() => setShowBonusText(false), 3000);
    }

    setTimeout(() => setShowXP(false), 2000);

    setTimeout(() => moveToNextCard(xpResult.totalXP, true), 1000);
  };

  const handleIncorrect = () => {
    const xpGained = 5; // Still get some XP for trying
    const technique = localStorage.getItem("studyTechnique") || "flashcards";
    const xpResult = calculateXPWithBonus(5, technique);
    setSessionXP((prev) => prev + xpResult.totalXP);
    setReviewCount((prev) => prev + 1);

    // Award XP to backend
    awardXP("correct_answer", 5);

    showXPNotification(xpResult.totalXP);
    setShowXP(true);
    setTimeout(() => setShowXP(false), 2000);

    setTimeout(() => {
      moveToNextCard(xpResult.totalXP, false);
    }, 1000);
  };

  const showXPNotification = (xp) => {
    // TODO Saturday: Make this float up and fade out
    console.log(`+${xp} XP!`);
  };

  const moveToNextCard = (xpEarned, wasCorrect) => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      // Session complete!
      completeSession(xpEarned, wasCorrect);
    }
  };

  const completeSession = (xpEarned, wasCorrect) => {
    // Calculate final stats including the current (last) card
    const finalCorrectCount = correctCount + (wasCorrect ? 1 : 0);
    const finalSessionXP = sessionXP + xpEarned;

    const sessionData = {
      xp: finalSessionXP + 50, // Bonus for completing
      completed: finalCorrectCount,
      total: flashcards.length,
      timeSpent: elapsedTime,
    };
    onSessionComplete(sessionData);
  };

  const currentCard = flashcards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / flashcards.length) * 100;

  return (
    <div className="study-session">
      {" "}
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
      {/* Bonus message */}
      {showBonusText && <div className="bonus-message">{bonusMessage}</div>}
    </div>
  );
};

export default StudySession;
