# 🎯 Integration Examples for Study Components

Copy these examples into your study pages to award XP and show user progression.

---

## 1. StudySession Component (Flashcard Study)

```javascript
import React, { useState, useEffect } from "react";
import { getUserId, awardXP, getUserProgress } from "../services/api";
import Flashcard from "./Flashcard";

export default function StudySession({ flashcards, onSessionComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [userProgress, setUserProgress] = useState(null);
  const userId = getUserId();

  useEffect(() => {
    // Load user progress
    const loadProgress = async () => {
      const progress = await getUserProgress();
      setUserProgress(progress);
    };
    loadProgress();
  }, []);

  const handleCorrect = async () => {
    setScore(score + 1);

    // Award XP for correct answer
    const xpResult = await awardXP("correct_answer", (bonus = 5));
    setSessionXP(sessionXP + xpResult.xp_earned);

    // Check for level up
    if (xpResult.level_up) {
      alert(`🎉 LEVEL UP! You're now level ${xpResult.level}!`);
      // Refresh user data
      const updated = await getUserProgress();
      setUserProgress(updated);
    }
  };

  const handleIncorrect = async () => {
    // Still award some XP for trying
    const xpResult = await awardXP("flashcard_review", (bonus = 2));
    setSessionXP(sessionXP + xpResult.xp_earned);
  };

  const handleComplete = async () => {
    // Award bonus XP for session completion
    const xpResult = await awardXP("flashcard_review", (bonus = score * 3));
    setSessionXP(sessionXP + xpResult.xp_earned);

    if (onSessionComplete) {
      onSessionComplete({
        score,
        total: flashcards.length,
        xp: sessionXP + xpResult.xp_earned,
        character: userProgress?.character,
      });
    }
  };

  if (!userProgress) return <div>Loading your progress...</div>;
  if (!flashcards || flashcards.length === 0)
    return <div>No flashcards found</div>;

  const currentCard = flashcards[currentIndex];
  const progress = Math.round((currentIndex / flashcards.length) * 100);

  return (
    <div className="study-session">
      {/* User Stats Bar */}
      <div className="session-stats-bar">
        <div className="character-info">
          <span>👤 {userProgress.character?.name || "Player"}</span>
          <span>📊 Level {userProgress.level}</span>
        </div>
        <div className="session-progress">
          <span>
            Question {currentIndex + 1}/{flashcards.length}
          </span>
          <span>Score: {score} ✓</span>
          <span>+{sessionXP} XP this session</span>
        </div>
        <div className="xp-bar">
          <div
            className="xp-fill"
            style={{ width: `${userProgress.progress_to_next_level}%` }}
          >
            {userProgress.xp}/{userProgress.next_level_xp} XP
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      {/* Flashcard */}
      <Flashcard
        question={currentCard.question}
        answer={currentCard.answer}
        onCorrect={handleCorrect}
        onIncorrect={handleIncorrect}
        cardNumber={currentIndex + 1}
        totalCards={flashcards.length}
      />

      {/* Navigation */}
      <div className="session-controls">
        <button
          onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
        >
          ← Previous
        </button>

        {currentIndex < flashcards.length - 1 ? (
          <button onClick={() => setCurrentIndex(currentIndex + 1)}>
            Next →
          </button>
        ) : (
          <button onClick={handleComplete} className="complete-button">
            Complete Session ✓
          </button>
        )}
      </div>
    </div>
  );
}
```

---

## 2. MultipleChoiceSession Component (Quiz)

```javascript
import React, { useState, useMemo, useEffect } from "react";
import { getUserId, awardXP, getUserProgress } from "../services/api";
import "./MultipleChoiceSession.css";

export default function MultipleChoiceSession({
  flashcards,
  onSessionComplete,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [userProgress, setUserProgress] = useState(null);
  const userId = getUserId();

  // Load user progress
  useEffect(() => {
    const loadProgress = async () => {
      const progress = await getUserProgress();
      setUserProgress(progress);
    };
    loadProgress();
  }, []);

  if (!flashcards || flashcards.length === 0) {
    return <div>No questions available</div>;
  }

  const currentCard = flashcards[currentIndex];

  const { options, correctAnswerIndex } = useMemo(() => {
    const correctAnswer = currentCard.answer;
    const distractors = [
      "This is another possible answer",
      "An alternative explanation",
      "A different concept",
    ];

    const allOptions = [correctAnswer, ...distractors.slice(0, 3)];
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
    const correctIndex = shuffledOptions.indexOf(correctAnswer);

    return { options: shuffledOptions, correctAnswerIndex: correctIndex };
  }, [currentIndex, currentCard.answer]);

  const handleAnswerClick = async (index) => {
    if (isAnswered) return;

    setSelectedAnswer(index);
    setIsAnswered(true);

    const isCorrect = index === correctAnswerIndex;

    if (isCorrect) {
      setScore(score + 1);

      // Award XP for correct answer
      const xpResult = await awardXP("correct_answer", (bonus = 10));
      const newTotal = sessionXP + xpResult.xp_earned;
      setSessionXP(newTotal);

      // Check for level up
      if (xpResult.level_up) {
        alert(`🎉 LEVEL UP! You're now level ${xpResult.level}!`);
        const updated = await getUserProgress();
        setUserProgress(updated);
      }
    } else {
      // Partial credit for trying
      const xpResult = await awardXP("flashcard_review", (bonus = 3));
      setSessionXP(sessionXP + xpResult.xp_earned);
    }
  };

  const handleNext = async () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Session complete
      const xpResult = await awardXP("quiz_completion", (bonus = score * 5));
      const finalXP = sessionXP + xpResult.xp_earned;

      onSessionComplete({
        score,
        total: flashcards.length,
        xp: finalXP,
        character: userProgress?.character,
      });
    }
  };

  if (!userProgress) return <div>Loading...</div>;

  return (
    <div className="multiple-choice-session">
      {/* User Stats */}
      <div className="mc-header">
        <div className="user-info">
          👤 {userProgress.character?.name || "Player"} • Level{" "}
          {userProgress.level}
        </div>
        <div className="mc-progress">
          Question {currentIndex + 1} of {flashcards.length}
        </div>
        <div className="mc-score">
          Correct: {score}/{flashcards.length} • +{sessionXP} XP
        </div>
      </div>

      {/* XP Bar */}
      <div className="xp-bar-container">
        <div className="xp-bar">
          <div
            className="xp-fill"
            style={{ width: `${userProgress.progress_to_next_level}%` }}
          >
            {userProgress.xp}/{userProgress.next_level_xp} XP
          </div>
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

      {/* Next Button */}
      {isAnswered && (
        <button className="mc-next-button" onClick={handleNext}>
          {currentIndex < flashcards.length - 1
            ? "Next Question →"
            : "Finish Session ✓"}
        </button>
      )}
    </div>
  );
}
```

---

## 3. HomePage Component (Show User Stats)

```javascript
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserId, getUserProgress, getCharacter } from "../services/api";

export default function HomePage() {
  const navigate = useNavigate();
  const userId = getUserId();
  const [progress, setProgress] = useState(null);
  const [character, setCharacter] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const [userProgress, userCharacter] = await Promise.all([
        getUserProgress(),
        getCharacter(),
      ]);
      setProgress(userProgress);
      setCharacter(userCharacter);
    };
    loadData();
  }, []);

  if (!progress) return <div>Loading your profile...</div>;

  return (
    <div className="home-page">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>Welcome, {character?.name || "Scholar"}! ✨</h1>
        <p>Ready to level up your learning?</p>
      </div>

      {/* User Stats Card */}
      <div className="user-stats-card">
        <div className="stat">
          <span className="label">Level</span>
          <span className="value">{progress.level}</span>
        </div>
        <div className="stat">
          <span className="label">XP</span>
          <span className="value">{progress.xp}</span>
        </div>
        <div className="stat">
          <span className="label">To Next Level</span>
          <span className="value">{progress.next_level_xp - progress.xp}</span>
        </div>
        <div className="stat">
          <span className="label">Flashcards</span>
          <span className="value">{progress.flashcards_reviewed}</span>
        </div>
        <div className="stat">
          <span className="label">Quizzes</span>
          <span className="value">{progress.quizzes_completed}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <h3>Progress to Level {progress.level + 1}</h3>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress.progress_to_next_level}%` }}
          >
            {Math.round(progress.progress_to_next_level)}%
          </div>
        </div>
      </div>

      {/* Unlocked Features */}
      {progress.unlocked_features && progress.unlocked_features.length > 0 && (
        <div className="features-section">
          <h3>🔓 Unlocked Features</h3>
          <div className="features-list">
            {progress.unlocked_features.map((feature, i) => (
              <span key={i} className="feature-badge">
                ✓ {feature.replace("_", " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="primary-button"
          onClick={() => navigate("/topic-input")}
        >
          Start Studying 📚
        </button>
        <button
          className="secondary-button"
          onClick={() => navigate("/leaderboard")}
        >
          View Leaderboard 🏆
        </button>
        <button
          className="secondary-button"
          onClick={() => navigate("/character-select")}
        >
          Change Character 👤
        </button>
      </div>
    </div>
  );
}
```

---

## 4. Leaderboard Component (NEW - Create This)

```javascript
import React, { useState, useEffect } from "react";
import { getLeaderboard, getUserProgress, getUserId } from "../services/api";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const userId = getUserId();

  useEffect(() => {
    const loadData = async () => {
      const board = await getLeaderboard(50);
      setLeaderboard(board);

      // Find current user's rank
      const userEntry = board.find((entry) => entry.user_id === userId);
      if (userEntry) {
        setUserRank(userEntry);
      }
    };
    loadData();
  }, [userId]);

  return (
    <div className="leaderboard">
      <h1>🏆 Leaderboard</h1>

      {/* Current User Highlight */}
      {userRank && (
        <div className="current-user-card">
          <p>Your Rank: #{userRank.rank}</p>
          <p>
            {userRank.xp} XP • Level {userRank.level}
          </p>
          <p>Character: {userRank.character || "None"}</p>
        </div>
      )}

      {/* Leaderboard Table */}
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Character</th>
            <th>Level</th>
            <th>XP</th>
            <th>Flashcards</th>
            <th>Quizzes</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, idx) => (
            <tr
              key={idx}
              className={entry.user_id === userId ? "current-user" : ""}
            >
              <td>{entry.rank}</td>
              <td>{entry.user_id.slice(0, 8)}...</td>
              <td>{entry.character || "—"}</td>
              <td>
                <span className="level-badge">{entry.level}</span>
              </td>
              <td>
                <strong>{entry.xp}</strong>
              </td>
              <td>{entry.flashcards_reviewed}</td>
              <td>{entry.quizzes_completed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## Key Integration Points

### 1. Always get userId at component start

```javascript
import { getUserId } from "../services/api";

const userId = getUserId(); // Unique ID for this user
```

### 2. Award XP after activities

```javascript
import { awardXP } from "../services/api";

// Correct answer
await awardXP("correct_answer", (bonus = 5));

// Quiz completion
await awardXP("quiz_completion", (bonus = 0));

// Flashcard review
await awardXP("flashcard_review", (bonus = 10));
```

### 3. Load and display progress

```javascript
import { getUserProgress } from "../services/api";

const progress = await getUserProgress();
console.log(
  `Level ${progress.level}: ${progress.xp}/${progress.next_level_xp} XP`
);
```

### 4. Handle level ups

```javascript
const result = await awardXP("correct_answer");
if (result.level_up) {
  alert(`🎉 Level Up! You're now level ${result.level}!`);
}
```

---

## CSS Styling (Optional)

```css
.user-stats-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.stat {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.stat .label {
  display: block;
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.stat .value {
  display: block;
  font-size: 2rem;
  font-weight: bold;
}

.progress-bar {
  height: 30px;
  background: #e0e0e0;
  border-radius: 15px;
  overflow: hidden;
  margin: 1rem 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.session-stats-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.xp-bar-container {
  margin: 1rem 0;
}
```

---

## Testing Checklist

- [ ] User ID created and persists across page reloads
- [ ] XP awarded when answering questions
- [ ] Level up message appears and level increases
- [ ] Character saved to backend
- [ ] Progress shows correct XP/level
- [ ] Leaderboard displays all users ranked by XP
- [ ] Data persists after browser close
- [ ] Data persists after backend restart
