import React, { useState, useEffect } from "react";
import StudySession from "./StudySession";
import "./PomodoroSession.css";

const PomodoroSession = ({ flashcards, onSessionComplete }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      if (!isBreak) {
        // Study session done, start break
        setIsBreak(true);
        setTimeLeft(5 * 60); // 5 minute break
        setIsActive(false);
      } else {
        // Break done
        setIsBreak(false);
        setTimeLeft(25 * 60);
        setIsActive(false);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="pomodoro-session">
      {/* Pomodoro Timer Overlay */}
      <div className="pomodoro-timer">
        <div className="timer-display">
          {isBreak ? "☕ Break Time" : "📚 Study Time"}
        </div>
        <div className="timer-countdown">{formatTime(timeLeft)}</div>
        <button className="timer-toggle" onClick={() => setIsActive(!isActive)}>
          {isActive ? "Pause ⏸️" : "Start ▶️"}
        </button>
      </div>

      {/* Regular study session below */}
      {!isBreak && (
        <StudySession
          flashcards={flashcards}
          onSessionComplete={onSessionComplete}
        />
      )}

      {isBreak && (
        <div className="break-screen">
          <h1>Take a Break! ☕</h1>
          <p>You've earned it. Relax for {formatTime(timeLeft)}</p>
        </div>
      )}
    </div>
  );
};

export default PomodoroSession;
