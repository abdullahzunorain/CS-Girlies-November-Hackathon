---
description: Get your project up and running in minutes
---

# 🚀 Getting Started

## Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js** (v16 or higher)
* **Python** (v3.8 or higher)
* **Git**
* **A code editor** (VS Code recommended)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/your-project.git
cd your-project
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
OPENAI_API_KEY=sk-your-actual-key-here
SECRET_KEY=generate-a-random-secret-key
PORT=5000
```

{% hint style="info" %}
**Getting API Keys:**
* OpenAI: [platform.openai.com](https://platform.openai.com)
* Google Gemini: [makersuite.google.com](https://makersuite.google.com)
{% endhint %}

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# If using npm packages, install them
# npm install
```

### 5. Run the Application

**Start Backend Server:**

```bash
cd backend
python app.py
```

You should see:
```
🚀 Starting server on port 5000
📝 Debug mode: True
🔑 OpenAI API Key configured: True
```

**Start Frontend:**

Simply open `frontend/index.html` in your browser, or use a local server:

```bash
cd frontend
python -m http.server 8000
```

Then visit: `http://localhost:8000`

## Verify Installation

1. Open your browser to `http://localhost:8000`
2. You should see the project interface
3. Try entering some text and clicking "Process with AI"
4. Check the backend terminal for request logs

## Troubleshooting

### Backend Won't Start

* Make sure Python 3.8+ is installed: `python --version`
* Verify virtual environment is activated
* Check if port 5000 is available

### API Errors

* Verify your API keys in `.env`
* Check your API quota/billing
* Ensure `.env` file is in the correct location

### CORS Errors

* Make sure backend has CORS enabled
* Check frontend is calling the correct API URL
* Verify backend is running before frontend

## Next Steps

Now that you're set up, check out:

* [Features](features.md) - Learn what the app can do
* [Architecture](architecture.md) - Understand how it works
* [API Reference](api-reference.md) - Explore the endpoints

---

Need help? Check our [FAQ](faq.md) or reach out to the team!
