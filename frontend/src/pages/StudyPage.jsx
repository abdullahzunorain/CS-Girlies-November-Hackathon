import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudySession from "../components/study/StudySession";
import MultipleChoiceSession from "../components/study/MultipleChoiceSession";
import PomodoroSession from "../components/study/PomodoroSession";
import FeynmanSession from "../components/study/FeynmanSession";
import SessionSummary from "../components/study/SessionSummary";
import LevelUp from "../components/levelup/LevelUp";
import SpacedRepetitionSession from "../components/study/SpacedRepetitionSession";
import ActiveRecallSession from "../components/study/ActiveRecallSession";
import StudyBuddySession from "../components/study/StudyBuddySession";
import MindMappingSession from "../components/study/MindMappingSession";

import {
  generateFlashcards,
  generateFlashcardsFromRAG,
  getUserProgress,
  getCharacterTechniqueBackground,
} from "../services/api";

const StudyPage = () => {
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [studyTechnique, setStudyTechnique] = useState("flashcards");
  const [sessionStats, setSessionStats] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [characterBg, setCharacterBg] = useState(null);

  const mockUnlocks = {
    2: {
      icon: "⏱️",
      name: "Pomodoro Timer",
      description: "Study in focused 25-minute sprints with breaks!",
    },
    3: {
      icon: "🔁",
      name: "Spaced Repetition",
      description: "Cards you struggle with appear more often!",
    },
    4: {
      icon: "👥",
      name: "Study Buddy Mode",
      description: "Challenge friends to study sessions!",
    },
  };

  useEffect(() => {
    const loadUserLevel = async () => {
      const progress = await getUserProgress();
      if (progress) {
        setCurrentLevel(progress.level);
      }
    };
    loadUserLevel();
  }, []);

  useEffect(() => {
    const loadFlashcards = async () => {
      const topic = localStorage.getItem("currentTopic");
      const cardCount = localStorage.getItem("cardCount") || "10";
      const studyMode = localStorage.getItem("studyMode");
      const technique = localStorage.getItem("studyTechnique") || "flashcards";
      const selectedCharacter = JSON.parse(
        localStorage.getItem("selectedCharacter") || "{}"
      );

      setStudyTechnique(technique);

      // Load character-specific background
      if (selectedCharacter.name) {
        const bg = getCharacterTechniqueBackground(
          selectedCharacter.name,
          technique
        );
        setCharacterBg(bg);
      }

      if (!topic) {
        navigate("/topic-input");
        return;
      }

      try {
        let cards;

        if (studyMode === "rag") {
          cards = await generateFlashcardsFromRAG(
            "demo_user",
            parseInt(cardCount)
          );
        } else {
          cards = await generateFlashcards(topic, parseInt(cardCount));
        }

        const normalized = Array.isArray(cards)
          ? cards
          : cards.flashcards || [];
        setFlashcards(normalized);
      } catch (err) {
        console.error("Failed to load flashcards:", err);
        const mockFlashcards = generateMockFlashcards(
          topic,
          parseInt(cardCount)
        );
        setFlashcards(mockFlashcards);
      } finally {
        setIsLoading(false);
      }
    };

    loadFlashcards();
  }, [navigate]);

  const generateMockFlashcards = (topic, count) => {
    const questions = [
      {
        question: `What is the main concept of ${topic}?`,
        answer: "This is a fundamental concept.",
      },
      {
        question: `Why is ${topic} important?`,
        answer: "It forms the foundation.",
      },
      {
        question: `How does ${topic} work?`,
        answer: "Through interconnected processes.",
      },
      {
        question: `What are key components of ${topic}?`,
        answer: "Essential elements.",
      },
      {
        question: `When should you use ${topic}?`,
        answer: "When applying this knowledge.",
      },
    ];

    return Array.from(
      { length: count },
      (_, i) => questions[i % questions.length]
    );
  };

  const handleSessionComplete = (stats) => {
    setSessionStats({
      ...stats,
      technique: studyTechnique,
    });
    setSessionComplete(true);
  };

  const handleContinue = () => {
    setShowLevelUp(false);
    navigate("/topic-input");
  };

  if (isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          fontSize: "24px",
          fontFamily: "Press Start 2P",
          gap: "20px",
        }}
      >
        <div style={{ fontSize: "48px" }}>⏳</div>
        <div>Generating Study Session...</div>
      </div>
    );
  }

  const renderStudyMode = () => {
    switch (studyTechnique) {
      case "flashcards":
        return (
          <StudySession
            flashcards={flashcards}
            onSessionComplete={handleSessionComplete}
          />
        );

      case "multiple-choice":
        return (
          <MultipleChoiceSession
            flashcards={flashcards}
            onSessionComplete={handleSessionComplete}
          />
        );

      case "pomodoro":
        return (
          <PomodoroSession
            flashcards={flashcards}
            onSessionComplete={handleSessionComplete}
          />
        );

      case "feynman":
        return (
          <FeynmanSession
            flashcards={flashcards}
            onSessionComplete={handleSessionComplete}
          />
        );

      case "spaced-repetition":
        return (
          <SpacedRepetitionSession
            flashcards={flashcards}
            onSessionComplete={handleSessionComplete}
          />
        );

      case "active-recall":
        return (
          <ActiveRecallSession
            flashcards={flashcards}
            onSessionComplete={handleSessionComplete}
          />
        );

      case "study-buddy":
        return (
          <StudyBuddySession
            flashcards={flashcards}
            onSessionComplete={handleSessionComplete}
          />
        );

      case "mind-mapping":
        return (
          <MindMappingSession
            flashcards={flashcards}
            onSessionComplete={handleSessionComplete}
          />
        );

      default:
        return (
          <StudySession
            flashcards={flashcards}
            onSessionComplete={handleSessionComplete}
          />
        );
    }
  };

  return (
    <div
      className="study-page"
      style={
        characterBg ? { backgroundImage: `url(${characterBg})` } : undefined
      }
    >
      {!sessionComplete ? (
        renderStudyMode()
      ) : (
        <SessionSummary stats={sessionStats} />
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
