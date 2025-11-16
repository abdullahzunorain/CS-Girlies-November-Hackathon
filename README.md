# 🧠 Bratz Study - CS Girlies Hackathon 2025

> **Making Learning Cool Again!** 🚀

[![Hackathon](https://img.shields.io/badge/Hackathon-CS%20Girlies%202025-ff69b4)](https://csgirlies-nov-hackathon.devpost.com/)
[![Track](https://img.shields.io/badge/Track-Choose%20One-blue)](#)
[![Status](https://img.shields.io/badge/Status-In%20Development-yellow)](#)

## 📌 Quick Links

- **Demo Video**: [Add YouTube/Vimeo Link]
- **Live Demo**: [Add Deployed Link]
- **DevPost Submission**: [Add Link]
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
git clone https://github.com/yourusername/your-project.git
cd your-project
```

2. **Frontend Setup**
```bash
cd frontend
npm install
npm start
```

3. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt
python app.py
```

4. **Environment Variables**
Create a `.env` file in the root:
```env
OPENAI_API_KEY=your_api_key_here
DATABASE_URL=your_database_url
```

---

## 📖 How It Works

### User Flow
1. [Step 1: e.g., User uploads study notes]
2. [Step 2: AI processes and extracts key concepts]
3. [Step 3: System generates personalized quiz]
4. [Step 4: User completes quiz and gets feedback]

### Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                        │
│                                                              │
│  Components: StudySession, MultipleChoice, HomePage, etc.   │
│  API Calls: generateFlashcards, awardXP, getUserProgress   │
│  Storage: localStorage (user_id, selectedCharacter)         │
└─────────────────────────┬──────────────────────────────────┘
                          │ HTTP/REST
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Flask)                           │
│                                                              │
│  Endpoints: /api/xp/award, /api/user/progress, etc.        │
│  Services: user_service, ai_service, rag_service           │
│  Business Logic: XP calculation, level ups, feature unlocks │
└─────────────────────────┬──────────────────────────────────┘
                          │ Persist
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  ChromaDB (Persistent)                      │
│                                                              │
│  Collection: users (user_id → user_data)                   │
│  Format: JSON metadata with user stats and character info  │
│  Location: ./chroma_db/users/                               │
└─────────────────────────────────────────────────────────────┘
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
