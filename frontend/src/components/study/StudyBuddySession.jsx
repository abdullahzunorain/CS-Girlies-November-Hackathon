import React, { useState, useEffect } from "react";
import CharacterBackground from "./CharacterBackground";
import XPNotification from "./XPNotification";
import { calculateXPWithBonus, awardXP } from "../../services/api";
import "./StudyBuddySession.css";

const StudyBuddySession = ({ flashcards, onSessionComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(1); // 1 or 2
  const [sessionXP, setSessionXP] = useState(0);
  const [showXP, setShowXP] = useState(false);
  const [lastXP, setLastXP] = useState(0);
  const [showBonusText, setShowBonusText] = useState(false);
  const [bonusMessage, setBonusMessage] = useState("");
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player2Name, setPlayer2Name] = useState("Player 2");
  const [namesSet, setNamesSet] = useState(false);

  if (!flashcards || flashcards.length === 0) {
    return (
      <CharacterBackground>
        <div className="study-buddy-session">
          <div className="loading">No flashcards available</div>
        </div>
      </CharacterBackground>
    );
  }

  const currentCard = flashcards[currentIndex];

  const handleSetNames = () => {
    if (player1Name.trim() && player2Name.trim()) {
      setNamesSet(true);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleAnswer = (correct) => {
    const technique = "study-buddy";
    const xpAmount = correct ? 15 : 5;
    const xpResult = calculateXPWithBonus(xpAmount, technique);

    setSessionXP((prev) => prev + xpResult.totalXP);

    if (correct) {
      if (currentTurn === 1) {
        setPlayer1Score((prev) => prev + 1);
      } else {
        setPlayer2Score((prev) => prev + 1);
      }
    }

    // Award XP
    awardXP("study_buddy", xpAmount);

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

    // Move to next card or complete
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setCurrentTurn(currentTurn === 1 ? 2 : 1); // Switch turns
    } else {
      // Session complete
      const sessionData = {
        xp: sessionXP + xpResult.totalXP + 100,
        completed: player1Score + player2Score,
        total: flashcards.length,
      };
      onSessionComplete(sessionData);
    }
  };

  // Name setup screen
  if (!namesSet) {
    return (
      <CharacterBackground>
        <div className="study-buddy-session">
          <div className="sb-setup">
            <h1>👥 Study Buddy Mode</h1>
            <p>Compete with a friend! Take turns answering questions.</p>

            <div className="name-inputs">
              <div className="name-input-group">
                <label>Player 1 Name:</label>
                <input
                  type="text"
                  placeholder="Enter name..."
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                  maxLength={20}
                />
              </div>

              <div className="name-input-group">
                <label>Player 2 Name:</label>
                <input
                  type="text"
                  placeholder="Enter name..."
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                  maxLength={20}
                />
              </div>
            </div>

            <button
              className="start-game-btn"
              onClick={handleSetNames}
              disabled={!player1Name.trim() || !player2Name.trim()}
            >
              Start Competition! 🚀
            </button>
          </div>
        </div>
      </CharacterBackground>
    );
  }

  return (
    <CharacterBackground>
      <div className="study-buddy-session">
        <div className="sb-container">
          {/* Scoreboard */}
          <div className="scoreboard">
            <div className={`player-card ${currentTurn === 1 ? "active" : ""}`}>
              <div className="player-icon">👤</div>
              <h3>{player1Name}</h3>
              <div className="score">{player1Score} pts</div>
              {currentTurn === 1 && (
                <div className="turn-indicator">Your Turn!</div>
              )}
            </div>

            <div className="vs-divider">VS</div>

            <div className={`player-card ${currentTurn === 2 ? "active" : ""}`}>
              <div className="player-icon">👤</div>
              <h3>{player2Name}</h3>
              <div className="score">{player2Score} pts</div>
              {currentTurn === 2 && (
                <div className="turn-indicator">Your Turn!</div>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="sb-progress">
            <div className="progress-info">
              Question {currentIndex + 1} of {flashcards.length}
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${((currentIndex + 1) / flashcards.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Current Turn */}
          <div className="current-turn-banner">
            <span className="turn-emoji">🎯</span>
            {currentTurn === 1 ? player1Name : player2Name}'s Turn
          </div>

          {/* Question Card */}
          <div className="sb-question-card">
            <h2>{currentCard.question}</h2>

            {!showAnswer ? (
              <button className="reveal-btn" onClick={handleShowAnswer}>
                Reveal Answer
              </button>
            ) : (
              <>
                <div className="answer-reveal">
                  <h3>Answer:</h3>
                  <p>{currentCard.answer}</p>
                </div>

                <div className="answer-buttons">
                  <p>
                    Did {currentTurn === 1 ? player1Name : player2Name} get it
                    right?
                  </p>
                  <div className="button-group">
                    <button
                      className="answer-btn btn-wrong"
                      onClick={() => handleAnswer(false)}
                    >
                      ❌ Wrong
                    </button>
                    <button
                      className="answer-btn btn-right"
                      onClick={() => handleAnswer(true)}
                    >
                      ✅ Correct!
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Session XP */}
          <div className="session-xp-display">
            Total Session XP: {sessionXP} ⭐
          </div>

          {/* XP notifications */}
          <XPNotification xp={lastXP} show={showXP} />
          {showBonusText && <div className="bonus-message">{bonusMessage}</div>}
        </div>
      </div>
    </CharacterBackground>
  );
};

export default StudyBuddySession;
