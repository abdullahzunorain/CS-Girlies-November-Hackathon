import React, { useState } from 'react';
import StudySession from '../components/study/StudySession';
import LevelUp from '../components/levelup/LevelUp';

/**
 * TEST PAGE for Person 4's work
 * 
 * Use this to test your flashcard + study session components
 * without needing backend API yet
 */

const TestStudyPage = () => {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(2);
  const [sessionComplete, setSessionComplete] = useState(false);

  // Mock flashcard data (Person 1 will provide real data from API later)
  const mockFlashcards = [
    {
      question: "What is the powerhouse of the cell?",
      answer: "Mitochondria"
    },
    {
      question: "What year was the Declaration of Independence signed?",
      answer: "1776"
    },
    {
      question: "What is the chemical symbol for gold?",
      answer: "Au"
    },
    {
      question: "Who painted the Mona Lisa?",
      answer: "Leonardo da Vinci"
    },
    {
      question: "What is the capital of Japan?",
      answer: "Tokyo"
    }
  ];

  // Mock unlock data (Person 2 will provide real data later)
  const mockUnlocks = {
    2: {
      icon: "⏱️",
      name: "Pomodoro Timer",
      description: "Study in focused 25-minute sprints with breaks!"
    },
    3: {
      icon: "🔁",
      name: "Spaced Repetition",
      description: "Cards you struggle with appear more often!"
    },
    4: {
      icon: "👥",
      name: "Study Buddy Mode",
      description: "Challenge friends to study sessions!"
    }
  };

  const handleSessionComplete = (sessionData) => {
    console.log('Session complete!', sessionData);
    setSessionComplete(true);
    
    // Simulate leveling up (Person 2's backend will handle this)
    // For now, just trigger level up after completing a session
    setTimeout(() => {
      setCurrentLevel(prev => prev + 1);
      setShowLevelUp(true);
    }, 500);
  };

  const handleContinue = () => {
    setShowLevelUp(false);
    setSessionComplete(false);
    // In real app, this would load next study session
  };

  return (
    <div className="test-page">
      {!sessionComplete ? (
        <StudySession
          flashcards={mockFlashcards}
          onSessionComplete={handleSessionComplete}
        />
      ) : (
        <div style={{ 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: '24px',
          fontFamily: 'Press Start 2P'
        }}>
          Session Complete! 🎉
        </div>
      )}

      {showLevelUp && (
        <LevelUp
          newLevel={currentLevel}
          unlockedFeature={mockUnlocks[currentLevel]}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
};

export default TestStudyPage;
