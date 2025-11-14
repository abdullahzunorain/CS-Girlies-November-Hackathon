/**
 * API Service - Connect to Backend
 * 
 * Person 5 will fill in the actual API endpoints
 * For now, this returns mock data so you can test
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ==========================================
// PERSON 1's API - Flashcard Generation
// ==========================================

export const generateFlashcards = async (topic, count = 10) => {
  try {
    // TODO Person 5: Replace with real API call
    // const response = await fetch(`${API_BASE_URL}/api/flashcards/generate`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ topic, count })
    // });
    // return await response.json();

    // Mock data for now
    return [
      { question: "What is photosynthesis?", answer: "Process where plants convert light to energy" },
      { question: "What is mitochondria?", answer: "The powerhouse of the cell" },
      { question: "What is DNA?", answer: "Deoxyribonucleic acid, carrier of genetic information" }
    ];
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return [];
  }
};

// ==========================================
// PERSON 2's API - XP System
// ==========================================

export const awardXP = async (amount, reason = 'study') => {
  try {
    // TODO Person 5: Replace with real API call
    // const response = await fetch(`${API_BASE_URL}/api/xp/award`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ amount, reason })
    // });
    // return await response.json();

    console.log(`Awarded ${amount} XP for ${reason}`);
    return { success: true, newTotal: 150 };
  } catch (error) {
    console.error('Error awarding XP:', error);
    return { success: false };
  }
};

export const getCurrentProgress = async () => {
  try {
    // TODO Person 5: Replace with real API call
    // const response = await fetch(`${API_BASE_URL}/api/progress`);
    // return await response.json();

    // Mock data
    return {
      currentXP: 350,
      currentLevel: 3,
      xpToNextLevel: 150,
      totalXP: 350
    };
  } catch (error) {
    console.error('Error fetching progress:', error);
    return null;
  }
};

export const checkLevelUp = async (currentXP) => {
  try {
    // TODO Person 5: Replace with real logic
    // const response = await fetch(`${API_BASE_URL}/api/level/check?xp=${currentXP}`);
    // return await response.json();

    // Mock level up logic
    const levelThresholds = [0, 100, 250, 450, 700, 1000];
    const currentLevel = levelThresholds.findIndex(threshold => currentXP < threshold) - 1;
    
    return {
      leveledUp: false, // Will be true when user crosses threshold
      newLevel: currentLevel,
      unlocked: null
    };
  } catch (error) {
    console.error('Error checking level up:', error);
    return { leveledUp: false };
  }
};

// ==========================================
// Session Management
// ==========================================

export const startStudySession = async (topic) => {
  try {
    // This combines Person 1's flashcard generation
    const flashcards = await generateFlashcards(topic);
    
    return {
      sessionId: Date.now(), // Mock session ID
      flashcards,
      startTime: Date.now()
    };
  } catch (error) {
    console.error('Error starting session:', error);
    return null;
  }
};

export const completeStudySession = async (sessionData) => {
  try {
    // TODO Person 5: Send session data to backend
    // await fetch(`${API_BASE_URL}/api/session/complete`, {
    //   method: 'POST',
    //   body: JSON.stringify(sessionData)
    // });

    console.log('Session completed:', sessionData);
    
    // Award completion bonus
    await awardXP(50, 'session_complete');
    
    return { success: true };
  } catch (error) {
    console.error('Error completing session:', error);
    return { success: false };
  }
};

// ==========================================
// Usage Example in Your Components
// ==========================================

/*

import { generateFlashcards, awardXP, getCurrentProgress } from '../services/api';

// In StudySession component:
const [flashcards, setFlashcards] = useState([]);

useEffect(() => {
  const loadFlashcards = async () => {
    const cards = await generateFlashcards('Biology', 10);
    setFlashcards(cards);
  };
  loadFlashcards();
}, []);

// When user answers correctly:
const handleCorrect = async () => {
  await awardXP(15, 'correct_answer');
  // ... rest of your logic
};

*/
