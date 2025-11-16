import React, { useState, useEffect } from "react";
import "./PomodoroSession.css";

const PomodoroSession = ({ flashcards, onSessionComplete }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

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
        setCompletedPomodoros(prev => prev + 1);
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

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
    setIsBreak(false);
  };

  const handleFinishSession = () => {
    if (onSessionComplete) {
      onSessionComplete({ completedPomodoros });
    }
  };

  return (
    <div className="pomodoro-session">
      {!isBreak ? (
        <div className="pomodoro-main-screen">
          {/* Large Timer Display */}
          <div className="pomodoro-timer-large">
            <div className="timer-header">
              <h1>⏱️ Pomodoro Study Session</h1>
              <p className="pomodoros-completed">
                Completed: {completedPomodoros} 🍅
              </p>
            </div>

            <div className="timer-countdown-large">{formatTime(timeLeft)}</div>

            <div className="timer-controls">
              <button className="timer-toggle" onClick={() => setIsActive(!isActive)}>
                {isActive ? "⏸️ Pause" : "▶️ Start"}
              </button>
              <button className="timer-reset" onClick={handleReset}>
                🔄 Reset
              </button>
            </div>

            <button className="finish-session-btn" onClick={handleFinishSession}>
              ✓ Finish Session & Earn XP
            </button>
          </div>
        </div>
      ) : (
        <div className="break-screen">
          <h1>Take a Break! ☕</h1>
          <p>You've earned it. Relax for {formatTime(timeLeft)}</p>
          {!isActive && timeLeft > 0 && (
            <button className="timer-toggle" onClick={() => setIsActive(true)}>
              ▶️ Start Break Timer
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PomodoroSession;
