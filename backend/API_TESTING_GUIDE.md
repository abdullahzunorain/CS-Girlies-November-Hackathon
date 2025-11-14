# 🧪 Backend API Testing Guide

## Quick Setup

1. **Install Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

2. **Create .env File**
```bash
copy .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

3. **Start Server**
```bash
python app.py
```

---

## 📡 API Endpoints

### 1. Health Check
```bash
curl http://localhost:5000/
```

**Expected Response:**
```json
{
  "status": "running",
  "message": "CS Girlies Hackathon API - Flashcard Quest",
  "features": ["flashcards", "quiz", "rag", "xp_system", "progression"]
}
```

---

### 2. Generate Flashcards 🃏

```bash
curl -X POST http://localhost:5000/api/flashcards/generate \
  -H "Content-Type: application/json" \
  -d "{\"content\": \"Photosynthesis is the process by which plants convert sunlight into energy. It requires chlorophyll, water, and carbon dioxide to produce glucose and oxygen.\", \"num_cards\": 3, \"user_id\": \"test_user\"}"
```

**Expected Response:**
```json
{
  "status": "success",
  "flashcards": [
    {
      "front": "What is photosynthesis?",
      "back": "The process by which plants convert sunlight into energy",
      "difficulty": "easy",
      "category": "Biology"
    }
  ],
  "num_cards": 3,
  "xp_data": {
    "xp_earned": 16,
    "total_xp": 16,
    "level": 0
  }
}
```

---

### 3. Generate Quiz 📝

```bash
curl -X POST http://localhost:5000/api/quiz/generate \
  -H "Content-Type: application/json" \
  -d "{\"content\": \"The water cycle includes evaporation, condensation, precipitation, and collection. Water evaporates from oceans and lakes, forms clouds, and falls back to Earth as rain.\", \"num_questions\": 2, \"user_id\": \"test_user\"}"
```

**Expected Response:**
```json
{
  "status": "success",
  "quiz": [
    {
      "question": "What is the first step of the water cycle?",
      "options": {
        "A": "Evaporation",
        "B": "Condensation",
        "C": "Precipitation",
        "D": "Collection"
      },
      "correct_answer": "A",
      "explanation": "Evaporation is when water turns into vapor and rises"
    }
  ],
  "xp_data": {...}
}
```

---

### 4. Upload Document for RAG 📄

```bash
curl -X POST http://localhost:5000/api/rag/upload \
  -H "Content-Type: application/json" \
  -d "{\"content\": \"Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience. There are three main types: supervised learning, unsupervised learning, and reinforcement learning.\", \"filename\": \"ml_basics.txt\", \"user_id\": \"test_user\"}"
```

**Expected Response:**
```json
{
  "status": "success",
  "doc_id": "a3b4c5d6e7f8",
  "filename": "ml_basics.txt",
  "chunks_processed": 1,
  "total_documents": 1,
  "xp_data": {
    "xp_earned": 27,
    "level": 0
  }
}
```

---

### 5. Query RAG System 🔍

```bash
curl -X POST http://localhost:5000/api/rag/query \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"What are the types of machine learning?\", \"user_id\": \"test_user\", \"top_k\": 2}"
```

**Expected Response:**
```json
{
  "status": "success",
  "answer": "Based on your documents, there are three main types of machine learning: supervised learning, unsupervised learning, and reinforcement learning.",
  "sources": [
    {
      "filename": "ml_basics.txt",
      "chunk_index": 0,
      "similarity": 0.892,
      "preview": "Machine learning is a subset of artificial intelligence..."
    }
  ],
  "num_sources": 1,
  "xp_data": {...}
}
```

---

### 6. Get RAG Statistics 📊

```bash
curl "http://localhost:5000/api/rag/stats?user_id=test_user"
```

**Expected Response:**
```json
{
  "status": "success",
  "total_documents": 1,
  "total_chunks": 1,
  "documents": [
    {
      "filename": "ml_basics.txt",
      "chunks": 1,
      "uploaded": "2025-11-15T..."
    }
  ]
}
```

---

### 7. Award XP 🌟

```bash
curl -X POST http://localhost:5000/api/xp/award \
  -H "Content-Type: application/json" \
  -d "{\"user_id\": \"test_user\", \"activity_type\": \"correct_answer\", \"bonus\": 5}"
```

**Valid activity_types:**
- `flashcard_review` - 10 XP
- `correct_answer` - 15 XP
- `streak_bonus` - 5 XP
- `quiz_completion` - 50 XP
- `document_upload` - 25 XP
- `daily_login` - 20 XP

**Expected Response:**
```json
{
  "status": "success",
  "xp_earned": 20,
  "total_xp": 150,
  "level": 1,
  "level_up": true,
  "unlocked_features": ["basic_flashcards", "quiz_mode"]
}
```

---

### 8. Get User Progress 📈

```bash
curl "http://localhost:5000/api/user/progress?user_id=test_user"
```

**Expected Response:**
```json
{
  "status": "success",
  "user_id": "test_user",
  "xp": 150,
  "level": 1,
  "next_level_xp": 250,
  "progress_to_next_level": 50.0,
  "flashcards_reviewed": 10,
  "quizzes_completed": 2,
  "documents_processed": 1,
  "streak": 0,
  "unlocked_features": ["basic_flashcards", "quiz_mode"]
}
```

---

### 9. Get Leaderboard 🏆

```bash
curl "http://localhost:5000/api/leaderboard?limit=5"
```

**Expected Response:**
```json
{
  "status": "success",
  "leaderboard": [
    {
      "rank": 1,
      "user_id": "top_player",
      "xp": 5000,
      "level": 5,
      "flashcards_reviewed": 200,
      "quizzes_completed": 50
    }
  ]
}
```

---

### 10. Analyze Content 🔬

```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d "{\"content\": \"Quantum mechanics is the branch of physics that studies the behavior of matter and energy at atomic and subatomic scales.\"}"
```

**Expected Response:**
```json
{
  "status": "success",
  "analysis": {
    "difficulty": "advanced",
    "reading_level": "College",
    "key_concepts": ["quantum mechanics", "atomic scale", "physics"],
    "estimated_study_time": "15 minutes",
    "reasoning": "Complex scientific terminology requiring advanced background"
  }
}
```

---

## 🎮 XP System & Progression

### Level Thresholds
- Level 0: 0 XP
- Level 1: 100 XP
- Level 2: 250 XP (unlocks Quiz Mode)
- Level 3: 500 XP (unlocks RAG Upload)
- Level 4: 1000 XP
- Level 5: 2000 XP (unlocks Advanced Analytics)
- Level 6: 3500 XP
- Level 7: 5500 XP
- Level 8: 8000 XP
- Level 9: 12000 XP
- Level 10: 17000 XP

### Unlockable Features
- Level 0: `basic_flashcards`
- Level 2: `quiz_mode`
- Level 3: `rag_upload` (document upload feature)
- Level 5: `advanced_analytics`

---

## 🧪 Testing Workflow

### Complete Test Sequence
```bash
# 1. Check server
curl http://localhost:5000/

# 2. Generate flashcards
curl -X POST http://localhost:5000/api/flashcards/generate \
  -H "Content-Type: application/json" \
  -d '{"content": "Test content", "num_cards": 2, "user_id": "test1"}'

# 3. Check progress
curl "http://localhost:5000/api/user/progress?user_id=test1"

# 4. Upload document (need level 3, so award XP first)
curl -X POST http://localhost:5000/api/xp/award \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test1", "activity_type": "quiz_completion"}'

# Repeat XP award until level 3...

# 5. Upload document
curl -X POST http://localhost:5000/api/rag/upload \
  -H "Content-Type: application/json" \
  -d '{"content": "RAG test content", "filename": "test.txt", "user_id": "test1"}'

# 6. Query RAG
curl -X POST http://localhost:5000/api/rag/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is this about?", "user_id": "test1"}'
```

---

## 🐛 Troubleshooting

### Error: "AI service not configured"
- Make sure OpenAI is installed: `pip install openai`
- Check your `.env` file has `OPENAI_API_KEY`

### Error: "RAG upload feature locked"
- User needs to be level 3+
- Award XP using `/api/xp/award` endpoint

### Error: "No documents found"
- Upload a document first using `/api/rag/upload`
- Check user_id matches between upload and query

### CORS Errors
- Server should have CORS enabled by default
- Check frontend is calling correct URL

---

## 📝 Notes

- **In-Memory Storage**: User data and vector store are in-memory (lost on restart)
- **Production**: Use PostgreSQL/MongoDB for users, Pinecone/Weaviate for vectors
- **API Keys**: Never commit `.env` file to Git
- **Rate Limiting**: No rate limiting in MVP, add in production

---

## 🚀 Next Steps

1. Test all endpoints
2. Integrate with frontend
3. Add user authentication
4. Deploy to production
5. Add real database
6. Implement rate limiting

Happy Testing! 🎉
