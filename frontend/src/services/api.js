/**
 * API Service - Connect to Backend
 *
 * Person 5 will fill in the actual API endpoints
 * For now, this returns mock data so you can test
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ==========================================
// UNIFIED Flashcard Generation
// ==========================================

/**
 * Generate flashcards - works for both topics and uploaded PDFs
 */
export const generateFlashcards = async (
  topic,
  count = 10,
  userId = "demo_user"
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/flashcards/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: topic,
        num_cards: count,
        user_id: userId,
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
      try {
        cards = JSON.parse(data.flashcards);
      } catch (e) {
        console.error("Failed to parse flashcards JSON string:", e);
        const cleaned = data.flashcards.replace(/,\s*$/, "") + "}]";
        try {
          cards = JSON.parse(cleaned);
        } catch (e2) {
          console.error("Failed to parse even after cleanup:", e2);
          cards = [];
        }
      }
    }

    // Normalize to { question, answer }
    const normalized = cards.map((c) => ({
      question: c.front || c.question || "",
      answer: c.back || c.answer || "",
    }));

    console.log(`✅ Generated ${normalized.length} flashcards for "${topic}"`);
    return normalized;
  } catch (error) {
    console.error("Error generating flashcards from backend:", error);
    // Fallback mock
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

/**
 * Generate flashcards from uploaded PDF using RAG
 */
export const generateFlashcardsFromRAG = async (
  userId = "demo_user",
  numCards = 10
) => {
  try {
    console.log("📄 Generating flashcards from uploaded PDF...");

    // Step 1: Query RAG to get document content
    const queryResponse = await fetch(`${API_BASE_URL}/api/rag/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query:
          "Summarize the main concepts, topics, and key information in this document",
        user_id: userId,
        top_k: 5, // Get top 5 relevant chunks
      }),
    });

    if (!queryResponse.ok) {
      throw new Error("Failed to query RAG system");
    }

    const queryData = await queryResponse.json();

    if (queryData.status !== "success" || !queryData.context) {
      throw new Error("No document content found in RAG system");
    }

    console.log("✅ Retrieved document content from RAG");

    // Step 2: Generate flashcards from the retrieved content
    const flashcardsResponse = await fetch(
      `${API_BASE_URL}/api/flashcards/generate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: queryData.context,
          num_cards: numCards,
          user_id: userId,
        }),
      }
    );

    if (!flashcardsResponse.ok) {
      throw new Error("Failed to generate flashcards");
    }

    const flashcardsData = await flashcardsResponse.json();

    if (flashcardsData.status !== "success") {
      throw new Error("Flashcard generation failed");
    }

    // Parse flashcards
    let cards = [];
    if (Array.isArray(flashcardsData.flashcards)) {
      cards = flashcardsData.flashcards;
    } else if (typeof flashcardsData.flashcards === "string") {
      try {
        cards = JSON.parse(flashcardsData.flashcards);
      } catch (e) {
        console.error("Failed to parse flashcards:", e);
        cards = [];
      }
    }

    // Normalize
    const normalized = cards.map((c) => ({
      question: c.front || c.question || "",
      answer: c.back || c.answer || "",
    }));

    console.log(`✅ Generated ${normalized.length} flashcards from PDF`);
    return normalized;
  } catch (error) {
    console.error("Error generating flashcards from RAG:", error);

    // Fallback
    return [
      {
        question: "What are the main topics covered in this document?",
        answer: "Please review the uploaded document for key concepts.",
      },
      {
        question: "What is the primary focus of this material?",
        answer: "The document contains important information for study.",
      },
      {
        question: "What should I remember from this document?",
        answer: "Review the key points and concepts presented.",
      },
    ];
  }
};

// ==========================================
// User Management
// ==========================================

/**
 * Get current user ID from localStorage
 * Creates one if it doesn't exist
 */
export const getUserId = () => {
  let userId = localStorage.getItem("user_id");
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("user_id", userId);
  }
  return userId;
};

/**
 * Save character selection
 */
export const saveCharacter = async (character) => {
  try {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/api/user/character`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        character: character,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save character");
    }

    const data = await response.json();

    // Save to localStorage too
    localStorage.setItem("selectedCharacter", JSON.stringify(character));

    console.log(`✅ Character ${character.name} selected!`);
    return data;
  } catch (error) {
    console.error("Error saving character:", error);
    return { success: false };
  }
};

/**
 * Get user's selected character
 */
export const getCharacter = async () => {
  try {
    const userId = getUserId();
    const response = await fetch(
      `${API_BASE_URL}/api/user/character?user_id=${userId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch character");
    }

    const data = await response.json();
    return data.character || null;
  } catch (error) {
    console.error("Error fetching character:", error);
    // Fall back to localStorage
    const stored = localStorage.getItem("selectedCharacter");
    return stored ? JSON.parse(stored) : null;
  }
};

// ==========================================
// XP System - REAL API CALLS
// ==========================================

/**
 * Award XP for an activity
 * Valid activity types: flashcard_review, correct_answer, quiz_completion, etc.
 */
export const awardXP = async (activityType = "flashcard_review", bonus = 0) => {
  try {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/api/xp/award`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        activity_type: activityType,
        bonus: bonus,
      }),
    });

    if (!response.ok) {
      console.warn("Failed to award XP:", response.status);
      throw new Error("XP award failed");
    }

    const data = await response.json();
    console.log(`✅ Awarded ${data.xp_earned} XP! Total: ${data.total_xp}`);

    if (data.level_up) {
      console.log(`🎉 LEVEL UP! You're now level ${data.level}!`);
    }

    return data;
  } catch (error) {
    console.error("Error awarding XP:", error);
    return { success: false };
  }
};

/**
 * Get current user progress
 */
export const getUserProgress = async () => {
  try {
    const userId = getUserId();
    const response = await fetch(
      `${API_BASE_URL}/api/user/progress?user_id=${userId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch progress");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching progress:", error);
    return null;
  }
};

/**
 * Get leaderboard
 */
export const getLeaderboard = async (limit = 10) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/leaderboard?limit=${limit}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard");
    }

    const data = await response.json();
    return data.leaderboard || [];
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
};

// Legacy functions for backwards compatibility
export const getCurrentProgress = async () => {
  const data = await getUserProgress();
  if (data) {
    return {
      currentXP: data.xp,
      currentLevel: data.level,
      xpToNextLevel: data.next_level_xp,
      totalXP: data.xp,
      progressPercentage: data.progress_to_next_level,
    };
  }
  return null;
};

export const checkLevelUp = async (currentXP) => {
  try {
    const data = await getUserProgress();
    if (data) {
      return {
        leveledUp: false, // Backend handles this
        newLevel: data.level,
        unlocked: data.unlocked_features,
      };
    }
  } catch (error) {
    console.error("Error checking level up:", error);
  }
  return { leveledUp: false };
};

// ==========================================
// Session Management
// ==========================================

export const startStudySession = async (topic) => {
  try {
    const flashcards = await generateFlashcards(topic);

    return {
      sessionId: Date.now(),
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
    console.log("Session completed:", sessionData);
    await awardXP(50, "session_complete");
    return { success: true };
  } catch (error) {
    console.error("Error completing session:", error);
    return { success: false };
  }
};
