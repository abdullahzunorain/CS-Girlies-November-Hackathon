# 🧠 Bratz Study - CS Girlies Hackathon 2025

> **Making Learning Cool Again!** 🚀

[![Hackathon](https://img.shields.io/badge/Hackathon-CS%20Girlies%202025-ff69b4)](https://csgirlies-nov-hackathon.devpost.com/)
[![Status](https://img.shields.io/badge/Status-In%20Development-yellow)](#)

## 📌 Quick Links

- **Demo Video**: [Add YouTube/Vimeo Link]
- **DevPost Submission**: [[DevPost Bratz Study](https://devpost.com/software/study-bratz)]
- **Discord**: [CS Girlies Discord](https://discord.gg/csgirlies)
- **GitBook**:[GitBook link] (to add later)

---

## 🎯 Project Overview

Turn studying into a fun, Y2K-inspired game where AI-generated flashcards, XP, and customizable avatars make learning addictive and effective.

### The Problem
Students often struggle with staying motivated and engaged while studying:  
- Traditional study methods feel boring and repetitive  
- It’s hard to track progress and measure improvement  
- Current learning apps lack gamification and personalization  


### Our Solution 
StudyBratz gamifies learning with a Bratz-inspired avatar system:  
- AI generates flashcards from user-selected topics or uploaded notes  
- Students earn XP and level up by completing study sessions  
- Unlock study powers (Pomodoro, Feynman, Active Recall, Spaced Repetition) and customize your avatar and virtual room  

### Why This Matters 
By combining gamification with proven learning strategies, StudyBratz keeps students engaged, helps them retain knowledge more effectively, and makes learning enjoyable for any subject, from Biology to Languages. 

---

## 🏆 Hackathon Track

**Primary Track:** 
- [ ] 🎮 **Make Learning Fun** - Gamify the learning journey

**Bonus Tracks:** 
- [ ] 📚 **Build with GitBook** 


---

## ✨ Key Features

- **AI-Generated Flashcards:** Automatically create Q/A flashcards from user-selected topics or uploaded notes.  
- **Gamified Study Sessions:** Earn XP and level up by completing study sessions, making learning fun and motivating.  
- **Study Powers & Techniques:** Unlock proven study methods like Pomodoro, Feynman, Active Recall, and Spaced Repetition.  


---

## 🛠️ Tech Stack

### Frontend
- HTML/CSS, Tailwind, JavaScript

### Backend
- Node.js/Express
- ChromaDB 

### AI/ML
- [e.g., OpenAI GPT-4, Google Gemini]
- [LangChain, Hugging Face, etc.]

### Tools & Services
- Version Control: Git/GitHub
- Documentation: GitBook

---

## 🚀 Getting Started

### Prerequisites
```bash
# Node.js (for frontend)
node --version  # v16 or higher

# Python (for backend)
python --version  # 3.8 or higher

# Git
git --version
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/studybratz.git
cd studybratz
```

2. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

3. **Frontend Setup**
```bash
cd frontend
npm install

Edit .env file:
GROQ_API_KEY=your_groq_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
FLASK_ENV=development
PORT=5000
```

4. **Start Development Servers**  

Terminal 1 - Backend:
```bash
cd backend
python app.py
# Server runs on http://localhost:5000
```
Terminal 2 - Frontend:
```bash
cd frontend
npm start
# App runs on http://localhost:3000
```

---

## 📖 How It Works

### User Flow
1. Choose Character  
   ↓
2. Input Topic or Upload PDF  
   ↓
3. AI Generates Flashcards (10-20 cards)  
   ↓
4. Select Study Technique  
   ↓
5. Study & Earn XP  
   ↓
6. Level Up & Unlock Features  
   ↓
7. View Progress & Compete  

---

### Architecture
```
┌────────────────────────────────────────────────────────────┐
│                     Frontend (React)                       │
│                                                            │
│  Components: StudySession, MultipleChoice, HomePage, etc.  │
│  API Calls: generateFlashcards, awardXP, getUserProgress   │
│  Storage: localStorage (user_id, selectedCharacter)        │
└─────────────────────────┬──────────────────────────────────┘
                          │ HTTP/REST
                          ▼
┌────────────────────────────────────────────────────────────┐
│                   Backend (Flask)                          │
│                                                            │
│  Endpoints: /api/xp/award, /api/user/progress, etc.        │
│  Services: user_service, ai_service, rag_service           │
│  Business Logic: XP calculation, level ups, feature unlocks│
└─────────────────────────┬──────────────────────────────────┘
                          │ Persist
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  ChromaDB (Persistent)                      │
│                                                             │
│  Collection: users (user_id → user_data)                    │
│  Format: JSON metadata with user stats and character info   │
│  Location: ./chroma_db/users/                               │
└─────────────────────────────────────────────────────────────┘
```

---

**RAG System Flow**  
PDF Upload Flow:
1. User uploads PDF → PyPDF2 extracts text
2. Text split into 1000-char chunks (200 overlap)
3. Each chunk → Google Gemini embedding (768 dimensions)
4. Embeddings stored in ChromaDB with metadata
5. User ID isolation (each user has own collection)

Query Flow:
1. User asks question
2. Question → Google Gemini embedding
3. Cosine similarity search in ChromaDB
4. Top-K most relevant chunks retrieved
5. Chunks + question → Groq LLM
6. Generated answer with source citations

---
## 🎮 XP & Progression System

### XP Values
| Activity | Base XP | Description |
|----------|---------|-------------|
| Flashcard Review | 10 XP | Complete one flashcard |
| Correct Answer | 15 XP | Answer correctly first try |
| Streak Bonus | 5 XP | Maintain daily streak |
| Quiz Completion | 50 XP | Finish a full quiz |
| Document Upload | 25 XP + (2 XP × chunks) | Upload and process PDF |
| Daily Login | 20 XP | First login of the day |

### Level Progression
| Level | XP Required | Unlocked Features |
|-------|-------------|-------------------|
| 1 | 0 | Basic Flashcards |
| 2 | 100 | Quiz Mode, Multiple Choice |
| 3 | 250 | RAG Upload, PDF Processing |
| 4 | 500 | Pomodoro Timer |
| 5 | 1,000 | Advanced Analytics, Feynman Technique |
| 6 | 2,000 | Custom Themes |
| 7 | 3,500 | Spaced Repetition |
| 8 | 5,500 | Achievement Badges |
| 9 | 8,000 | Multiplayer Challenges |
| 10 | 12,000 | Max Level - All Features |

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000
```

### Endpoints

#### 1. Generate Flashcards
```http
POST /api/flashcards/generate
Content-Type: application/json

{
  "content": "Photosynthesis is the process...",
  "num_cards": 5,
  "user_id": "user123"
}

Response:
{
  "status": "success",
  "flashcards": [
    {
      "front": "What is photosynthesis?",
      "back": "The process by which plants...",
      "difficulty": "medium",
      "category": "Biology"
    }
  ],
  "xp_data": {
    "xp_earned": 16,
    "total_xp": 116,
    "level": 2
  }
}
```

#### 2. Upload PDF for RAG
```http
POST /api/rag/upload
Content-Type: multipart/form-data

file: <PDF file>
user_id: user123

Response:
{
  "status": "success",
  "chunks_processed": 12,
  "filename": "biology_notes.pdf",
  "xp_data": {
    "xp_earned": 49,
    "level": 3
  }
}
```

#### 3. Query RAG System
```http
POST /api/rag/query
Content-Type: application/json

{
  "query": "What are the main topics?",
  "user_id": "user123",
  "top_k": 3
}

Response:
{
  "status": "success",
  "answer": "Based on your documents...",
  "context": "Relevant text from documents...",
  "sources": [
    {
      "filename": "biology_notes.pdf",
      "page": 3,
      "similarity": 0.89
    }
  ]
}
```

#### 4. Award XP
```http
POST /api/xp/award
Content-Type: application/json

{
  "user_id": "user123",
  "activity_type": "correct_answer",
  "bonus": 5
}

Response:
{
  "status": "success",
  "xp_earned": 20,
  "total_xp": 250,
  "level": 3,
  "level_up": true,
  "unlocked_features": ["quiz_mode", "rag_upload"]
}
```

#### 5. Get User Progress
```http
GET /api/user/progress?user_id=user123

Response:
{
  "status": "success",
  "xp": 250,
  "level": 3,
  "next_level_xp": 500,
  "progress_to_next_level": 50.0,
  "flashcards_reviewed": 45,
  "quizzes_completed": 5,
  "unlocked_features": ["basic_flashcards", "quiz_mode", "rag_upload"]
}
```

---

## 👥 Team

- **[Your Name]** - [Role] - [GitHub/LinkedIn]
- **[Teammate 2]** - [Role] - [GitHub/LinkedIn]
- **[Teammate 3]** - [Role] - [GitHub/LinkedIn]

---

## 🙏 Acknowledgments

- CS Girlies community for organizing this amazing hackathon
- [Mentors who helped]
- [APIs/tools used]

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🔗 Important Links

- **Hackathon Page**: [CS Girlies November Hackathon](https://csgirlies-nov-hackathon.devpost.com/)
- **Discord**: [Join the community](https://discord.gg/csgirlies)
- **Documentation**: [GitBook Link]


**Built with ❤️ for CS Girlies November Hackathon 2025**

*Making Learning Cool Again!* 🧠✨
