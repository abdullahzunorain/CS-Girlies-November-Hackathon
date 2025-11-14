# 🚀 Quick Start Guide
## Get Building in 5 Minutes!

This is your express setup guide to start building your CS Girlies Hackathon project RIGHT NOW.

---

## ⚡ Step 1: Set Up Backend (2 minutes)

Open PowerShell in the `backend` folder:

```powershell
cd backend

# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

---

## 🔑 Step 2: Add API Keys (1 minute)

1. Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```

2. Edit `.env` and add your OpenAI key:
```
OPENAI_API_KEY=sk-your-actual-key-here
```

**Get your key:** https://platform.openai.com/api-keys

---

## ▶️ Step 3: Run Backend (30 seconds)

```powershell
python app.py
```

You should see:
```
🚀 Starting server on port 5000
```

---

## 🌐 Step 4: Open Frontend (30 seconds)

Open a NEW PowerShell window:

```powershell
cd frontend
python -m http.server 8000
```

Open browser to: **http://localhost:8000**

---

## ✅ Step 5: Test It!

1. Type something in the text box
2. Click "Process with AI"
3. See the results!

---

## 🎯 What's Next?

Now that it's working, customize your project:

### 1. Change the Project Name
- Edit `frontend/index.html` - Update the `<h1>` tag
- Edit `README.md` - Replace `[Your Project Name]`

### 2. Customize the AI Prompts
- Open `backend/ai_service.py`
- Modify the prompts to match your use case
- Test different approaches!

### 3. Style Your Interface
- Edit `frontend/styles.css`
- Change colors, fonts, layouts
- Make it yours!

### 4. Add More Features
- Look at `backend/app.py` for API endpoints
- Add quiz generation, flashcards, etc.
- Update `frontend/app.js` to use new features

---

## 📚 Full Documentation

For detailed guides, check:
- `docs/getting-started.md` - Complete setup
- `docs/features.md` - What you can build
- `docs/architecture.md` - How it works
- `docs/api-reference.md` - API details

---

## 🆘 Quick Troubleshooting

**Port already in use?**
```powershell
# Use different ports
python app.py  # Backend on 5000
python -m http.server 8001  # Frontend on 8001
```

**API not working?**
- Check your `.env` file has the correct key
- Make sure backend is running
- Check browser console for errors

**Virtual environment issues?**
```powershell
# Deactivate and try again
deactivate
.\venv\Scripts\activate
```

---

## 🎉 You're Ready!

Start building your winning hackathon project! 🏆

**Timer started:** November 14, 12:00 PM EST  
**Deadline:** November 16, 12:00 PM EST (48 hours!)

**Good luck!** 🍀
