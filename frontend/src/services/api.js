/**
 * API Service - Connect to Backend
 *
 * Person 5 will fill in the actual API endpoints
 * For now, this returns mock data so you can test
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ==========================================
// PERSON 1's API - Flashcard Generation
// ==========================================

export const generateFlashcards = async (topic, count = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/flashcards/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: topic,
        num_cards: count,
        user_id: "demo_user",
      }),
    });

    if (!response.ok) {
      console.warn("Flashcard API returned", response.status);
      throw new Error("Flashcard API error");
    }

    const data = await response.json();

    if (data && data.status && data.status !== "success") {
      console.warn(
        "Backend flashcard API responded with failure:",
        data.error || data
      );
      throw new Error(data.error || "Flashcard API failed");
    }

    // Handle the flashcards (which might be a JSON string)
    let cards = [];
    if (Array.isArray(data)) {
      cards = data;
    } else if (Array.isArray(data.flashcards)) {
      cards = data.flashcards;
    } else if (data.flashcards && typeof data.flashcards === "string") {
      // The AI is returning a JSON string - parse it
      try {
        cards = JSON.parse(data.flashcards);
      } catch (e) {
        console.error("Failed to parse flashcards JSON string:", e);
        // Try to clean up incomplete JSON (the backend response is cut off)
        const cleaned = data.flashcards.replace(/,\s*$/, "") + "}]";
        try {
          cards = JSON.parse(cleaned);
        } catch (e2) {
          console.error("Failed to parse even after cleanup:", e2);
          cards = [];
        }
      }
    }

    // Normalize to { question, answer } expected by StudySession/Flashcard
    const normalized = cards.map((c) => ({
      question: c.front || c.question || "",
      answer: c.back || c.answer || "",
    }));

    console.log(`✅ Generated ${normalized.length} flashcards for "${topic}"`);
    return normalized;
  } catch (error) {
    console.error("Error generating flashcards from backend:", error);
    // fallback mock
    return [
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
    ];
  }
};

// ==========================================
// PERSON 2's API - XP System
// ==========================================

export const awardXP = async (amount, reason = "study") => {
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
    console.error("Error awarding XP:", error);
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
      totalXP: 350,
    };
  } catch (error) {
    console.error("Error fetching progress:", error);
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
    const currentLevel =
      levelThresholds.findIndex((threshold) => currentXP < threshold) - 1;

    return {
      leveledUp: false, // Will be true when user crosses threshold
      newLevel: currentLevel,
      unlocked: null,
    };
  } catch (error) {
    console.error("Error checking level up:", error);
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
      startTime: Date.now(),
    };
  } catch (error) {
    console.error("Error starting session:", error);
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

    console.log("Session completed:", sessionData);

    // Award completion bonus
    await awardXP(50, "session_complete");

    return { success: true };
  } catch (error) {
    console.error("Error completing session:", error);
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
