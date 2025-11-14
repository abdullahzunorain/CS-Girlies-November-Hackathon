# 🧠 Backend - Flashcard Quest AI Learning Platform

## Overview

Comprehensive backend system for the CS Girlies Hackathon featuring:
- ✨ **AI-Powered Flashcard Generation** using OpenAI GPT
- 📝 **Quiz Generation System** with multiple-choice questions
- 🔍 **RAG (Retrieval Augmented Generation)** with vector database
- 🌟 **XP & Progression System** with level-based unlocks
- 🏆 **Leaderboard & Achievements**
- 📊 **Content Analysis & Difficulty Rating**

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Setup Environment
```bash
# Copy example env file
copy .env.example .env

# Edit .env and add your API key
# OPENAI_API_KEY=sk-your-key-here
```

### 3. Run Server
```bash
python app.py
```

Server starts on `http://localhost:5000`

---

## 📁 File Structure

```
backend/
├── app.py                  # Main Flask application with all endpoints
├── ai_service.py           # AI integration + RAG system
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── API_TESTING_GUIDE.md   # Complete API testing guide
└── README.md              # This file
```

---

## 🎯 Features

### 1. Flashcard Generation System
- Generates flashcards from any educational content
- Configurable number of cards (1-20)
- Returns structured JSON with front/back/difficulty
- Awards XP for generation

**Endpoint:** `POST /api/flashcards/generate`

### 2. Quiz Generation
- Creates multiple-choice questions
- 4 options per question with explanations
- Configurable difficulty
- Auto-grading support

**Endpoint:** `POST /api/quiz/generate`

### 3. RAG System with Vector Database
- **Document Processing:**
  - Splits documents into chunks (500 chars with 50 char overlap)
  - Generates embeddings using OpenAI's `text-embedding-3-small`
  - Stores in in-memory vector database
  
- **Query System:**
  - Semantic search over user documents
  - Cosine similarity for relevance ranking
  - Returns top-k most relevant chunks
  - Generates context-aware answers

**Endpoints:** 
- `POST /api/rag/upload` - Upload documents
- `POST /api/rag/query` - Query documents
- `GET /api/rag/stats` - Get statistics

### 4. XP & Progression System
- **XP Activities:**
  - Flashcard review: 10 XP
  - Correct answer: 15 XP
  - Quiz completion: 50 XP
  - Document upload: 25 XP + 2 XP per chunk
  - Daily login: 20 XP
  - Streak bonus: 5 XP

- **Level System:**
  - 10 levels (0-10)
  - Progressive XP requirements
  - Feature unlocks at milestones

**Endpoints:**
- `POST /api/xp/award` - Award XP
- `GET /api/user/progress` - Get user stats

### 5. Leaderboard
- Ranks users by XP
- Shows level and activities
- Configurable limit

**Endpoint:** `GET /api/leaderboard`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/api/process` | General AI processing |
| POST | `/api/flashcards/generate` | Generate flashcards |
| POST | `/api/quiz/generate` | Generate quiz |
| POST | `/api/analyze` | Analyze content difficulty |
| POST | `/api/rag/upload` | Upload document for RAG |
| POST | `/api/rag/query` | Query RAG system |
| GET | `/api/rag/stats` | Get RAG statistics |
| POST | `/api/xp/award` | Award XP to user |
| GET | `/api/user/progress` | Get user progress |
| GET | `/api/leaderboard` | Get leaderboard |

See [`API_TESTING_GUIDE.md`](API_TESTING_GUIDE.md) for detailed examples.

---

## 🧩 Architecture

### Data Flow
```
User Request → Flask Endpoint → AI Service → OpenAI API → Response
                                    ↓
                              Vector Database
                                    ↓
                              User Progress DB
```

### RAG System Architecture
```
Document Input
    ↓
Text Chunking (500 chars, 50 overlap)
    ↓
Generate Embeddings (OpenAI)
    ↓
Store in Vector DB (in-memory)
    ↓
Query → Retrieve Top-K → Generate Answer
```

### XP System Logic
```
User Action → Award XP → Calculate Level → Check Unlocks → Update User
```

---

## 🔧 Configuration

### Environment Variables (`.env`)
```env
OPENAI_API_KEY=sk-your-key          # Required
SECRET_KEY=random-string            # Required
PORT=5000                           # Optional
FLASK_ENV=development               # Optional
```

### XP Configuration (in `app.py`)
```python
XP_CONFIG = {
    'flashcard_review': 10,
    'correct_answer': 15,
    'streak_bonus': 5,
    'quiz_completion': 50,
    'document_upload': 25,
    'daily_login': 20
}
```

### Level Thresholds
```python
LEVEL_THRESHOLDS = [
    0,      # Level 0
    100,    # Level 1
    250,    # Level 2 (unlocks quiz_mode)
    500,    # Level 3 (unlocks rag_upload)
    1000,   # Level 4
    2000,   # Level 5 (unlocks advanced_analytics)
    3500,   # Level 6
    5500,   # Level 7
    8000,   # Level 8
    12000,  # Level 9
    17000   # Level 10
]
```

---

## 🎮 Gamification Features

### Unlockable Features
| Level | Feature | Description |
|-------|---------|-------------|
| 0 | `basic_flashcards` | Basic flashcard generation |
| 2 | `quiz_mode` | Quiz generation unlocked |
| 3 | `rag_upload` | Document upload unlocked |
| 5 | `advanced_analytics` | Advanced stats unlocked |

### Achievements System
Achievements can be added to user profile:
- First flashcard created
- 100 flashcards reviewed
- Perfect quiz score
- 7-day streak
- Level 5 reached

---

## 🔐 Security Notes

### Current Implementation (MVP)
- ⚠️ CORS open to all origins
- ⚠️ No authentication system
- ⚠️ In-memory storage (data lost on restart)
- ⚠️ No rate limiting

### Production Recommendations
```python
# Add CORS restrictions
CORS(app, origins=["https://your-domain.com"])

# Add authentication
from flask_jwt_extended import JWTManager

# Add rate limiting
from flask_limiter import Limiter

# Use real database
import psycopg2  # PostgreSQL
```

---

## 📊 RAG System Details

### Vector Database
- **Current:** In-memory Python dict
- **Production Options:**
  - Pinecone (managed, scalable)
  - Weaviate (open-source)
  - Chroma (embedded)
  - Qdrant (high-performance)

### Embedding Model
- **Model:** `text-embedding-3-small`
- **Dimensions:** 1536
- **Cost:** ~$0.02 per 1M tokens
- **Alternative:** `text-embedding-ada-002`

### Chunking Strategy
- **Size:** 500 characters
- **Overlap:** 50 characters
- **Why:** Balance between context and granularity

### Similarity Search
- **Method:** Cosine similarity
- **Returns:** Top-K most relevant chunks
- **Typical K:** 3-5 chunks

---

## 💰 Cost Estimation

### OpenAI API Costs
| Model | Cost | Usage |
|-------|------|-------|
| GPT-3.5-turbo | $0.002/1K tokens | Generation |
| text-embedding-3-small | $0.020/1M tokens | Embeddings |

### Estimated Costs (1000 users)
- Flashcard generation: ~$2-5
- Quiz generation: ~$2-5
- RAG embeddings: ~$0.50
- RAG queries: ~$3-6
- **Total:** ~$8-17/month for 1000 active users

---

## 🧪 Testing

### Manual Testing
```bash
# Test flashcard generation
curl -X POST http://localhost:5000/api/flashcards/generate \
  -H "Content-Type: application/json" \
  -d '{"content": "Test", "num_cards": 2, "user_id": "test"}'

# Test RAG upload
curl -X POST http://localhost:5000/api/rag/upload \
  -H "Content-Type: application/json" \
  -d '{"content": "Document text", "filename": "doc.txt", "user_id": "test"}'

# Test RAG query
curl -X POST http://localhost:5000/api/rag/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is this about?", "user_id": "test"}'
```

See [`API_TESTING_GUIDE.md`](API_TESTING_GUIDE.md) for complete testing guide.

---

## 🚀 Deployment

### Option 1: Render
```bash
# Procfile
web: gunicorn app:app
```

### Option 2: Railway
```bash
# railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "gunicorn app:app"
  }
}
```

### Option 3: Heroku
```bash
heroku create your-app-name
git push heroku main
```

---

## 🐛 Troubleshooting

### ImportError: No module named 'openai'
```bash
pip install openai
```

### Error: "AI service not configured"
- Check `.env` file exists
- Verify `OPENAI_API_KEY` is set
- Restart server after adding key

### Error: "RAG upload feature locked"
- User needs level 3+
- Award XP using `/api/xp/award`

### CORS errors from frontend
- Check server is running
- Verify frontend URL in CORS config
- Check request headers

---

## 📈 Performance Optimization

### Current Limitations
- In-memory storage (not persistent)
- Single-threaded Flask
- No caching
- Sequential embedding generation

### Improvements for Production
1. **Database:** Use PostgreSQL for users, Pinecone for vectors
2. **Caching:** Redis for frequent queries
3. **Async:** Use FastAPI instead of Flask
4. **Batch Processing:** Generate embeddings in batches
5. **CDN:** Cache static responses

---

## 🔄 Future Enhancements

### Planned Features
- [ ] User authentication (JWT)
- [ ] Real-time collaboration
- [ ] Spaced repetition algorithm
- [ ] Mobile app support
- [ ] PDF/DOCX file upload
- [ ] Voice-to-text flashcards
- [ ] Multi-language support
- [ ] Export to Anki format

### Database Migration
```python
# Current: In-memory
user_data = {}
vector_store = {}

# Future: PostgreSQL + Pinecone
from sqlalchemy import create_engine
import pinecone
```

---

## 📚 Resources

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Vector Database Comparison](https://github.com/erikbern/ann-benchmarks)
- [RAG Best Practices](https://www.pinecone.io/learn/retrieval-augmented-generation/)

---

## 🤝 Contributing

This is a hackathon project. For improvements:
1. Fork the repository
2. Create feature branch
3. Submit pull request
4. Add tests for new features

---

## 📄 License

MIT License - See main project LICENSE file

---

## 🏆 Hackathon Info

**Event:** CS Girlies November Hackathon 2025  
**Track:** Automate Learning + Build with GitBook  
**Theme:** Make Learning Cool Again  

---

Built with ❤️ for CS Girlies Hackathon 2025 🚀
