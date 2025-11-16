import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudySession from '../components/study/StudySession';
import LevelUp from '../components/levelup/LevelUp';
import { generateFlashcards } from '../services/api';

const StudyPage = () => {
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(2);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const loadFlashcards = async () => {
      const topic = localStorage.getItem('currentTopic');
      const cardCount = localStorage.getItem('cardCount') || '10';

      if (!topic) {
        navigate('/topic-input');
        return;
      }

      try {
        // Use the API service (currently returns mock data). When backend is ready,
        // `generateFlashcards` will call the real endpoint at /api/flashcards/generate.
        const cards = await generateFlashcards(topic, parseInt(cardCount));

        // If service returns an object with { flashcards, ... } handle that too
        const normalized = Array.isArray(cards) ? cards : (cards.flashcards || []);

        setFlashcards(normalized);
      } catch (err) {
        console.error('Failed to load flashcards from API, falling back to local mock', err);
        const mockFlashcards = generateMockFlashcards(topic, parseInt(cardCount));
        setFlashcards(mockFlashcards);
      } finally {
        setIsLoading(false);
      }
    };

    loadFlashcards();
  }, [navigate]);

  const generateMockFlashcards = (topic, count) => {
    const questions = [
      { question: `What is the main concept of ${topic}?`, answer: "This is a fundamental concept." },
      { question: `Why is ${topic} important?`, answer: "It forms the foundation." },
      { question: `How does ${topic} work?`, answer: "Through interconnected processes." },
      { question: `What are key components of ${topic}?`, answer: "Essential elements." },
      { question: `When should you use ${topic}?`, answer: "When applying this knowledge." }
    ];

    return Array.from({ length: count }, (_, i) => 
      questions[i % questions.length]
    );
  };

  const handleSessionComplete = (sessionData) => {
    setSessionComplete(true);
    setTimeout(() => {
      setCurrentLevel(prev => prev + 1);
      setShowLevelUp(true);
    }, 500);
  };

  const handleContinue = () => {
    setShowLevelUp(false);
    navigate('/topic-input');
  };

  if (isLoading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '24px',
        fontFamily: 'Press Start 2P',
        gap: '20px'
      }}>
        <div style={{ fontSize: '48px' }}>⏳</div>
        <div>Generating Flashcards...</div>
      </div>
    );
  }

  return (
    <div className="study-page">
      {!sessionComplete ? (
        <StudySession
          flashcards={flashcards}
          onSessionComplete={handleSessionComplete}
        />
      ) : (
        <div style={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
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

export default StudyPage;