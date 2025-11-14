"""
Main Flask application for CS Girlies Hackathon project
Backend API with AI integration, RAG, Flashcards, and XP System
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import json
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# Import AI service
from ai_service import (
    process_with_ai,
    generate_flashcards,
    generate_quiz,
    analyze_difficulty,
    process_document_for_rag,
    query_rag_system,
    get_rag_stats
)

# In-memory storage for user progress (use database in production)
user_data = {}

# XP System Configuration
XP_CONFIG = {
    'flashcard_review': 10,
    'correct_answer': 15,
    'streak_bonus': 5,
    'quiz_completion': 50,
    'document_upload': 25,
    'daily_login': 20
}

LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000, 17000]

def calculate_level(xp):
    """Calculate user level based on XP"""
    for level, threshold in enumerate(LEVEL_THRESHOLDS):
        if xp < threshold:
            return level - 1 if level > 0 else 0
    return len(LEVEL_THRESHOLDS) - 1

def get_user_progress(user_id):
    """Get or create user progress data"""
    if user_id not in user_data:
        user_data[user_id] = {
            'xp': 0,
            'level': 0,
            'flashcards_reviewed': 0,
            'quizzes_completed': 0,
            'documents_processed': 0,
            'streak': 0,
            'last_activity': None,
            'achievements': [],
            'unlocked_features': ['basic_flashcards']
        }
    return user_data[user_id]

def award_xp(user_id, activity_type, bonus=0):
    """Award XP to user and check for level ups"""
    user = get_user_progress(user_id)
    xp_earned = XP_CONFIG.get(activity_type, 0) + bonus
    
    user['xp'] += xp_earned
    old_level = user['level']
    new_level = calculate_level(user['xp'])
    
    level_up = new_level > old_level
    if level_up:
        user['level'] = new_level
        # Unlock features based on level
        if new_level >= 2 and 'quiz_mode' not in user['unlocked_features']:
            user['unlocked_features'].append('quiz_mode')
        if new_level >= 3 and 'rag_upload' not in user['unlocked_features']:
            user['unlocked_features'].append('rag_upload')
        if new_level >= 5 and 'advanced_analytics' not in user['unlocked_features']:
            user['unlocked_features'].append('advanced_analytics')
    
    user['last_activity'] = datetime.now().isoformat()
    
    return {
        'xp_earned': xp_earned,
        'total_xp': user['xp'],
        'level': user['level'],
        'level_up': level_up,
        'next_level_xp': LEVEL_THRESHOLDS[min(new_level + 1, len(LEVEL_THRESHOLDS) - 1)],
        'unlocked_features': user['unlocked_features']
    }

@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({
        'status': 'running',
        'message': 'CS Girlies Hackathon API - Flashcard Quest',
        'project': 'AI-Powered Learning Platform with Gamification',
        'features': ['flashcards', 'quiz', 'rag', 'xp_system', 'progression'],
        'endpoints': ['/api/process', '/api/flashcards/generate', '/api/quiz/generate', 
                     '/api/rag/upload', '/api/rag/query', '/api/xp/award', '/api/user/progress']
    })

@app.route('/api/process', methods=['POST'])
def process_text():
    """
    Main endpoint to process user input with AI
    Expects: { "text": "user input here", "task": "general|summarize|explain" }
    Returns: { "result": "processed output" }
    """
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({
                'error': 'Missing text field in request'
            }), 400
        
        user_text = data['text']
        task = data.get('task', 'general')
        user_id = data.get('user_id', 'default_user')
        
        # Process with AI
        result = process_with_ai(user_text, task)
        
        if result.get('status') == 'success':
            # Award XP for using the AI
            xp_data = award_xp(user_id, 'flashcard_review')
            result['xp_data'] = xp_data
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'failed'
        }), 500

@app.route('/api/flashcards/generate', methods=['POST'])
def generate_flashcards_endpoint():
    """
    Generate flashcards from user input
    Expects: { "content": "text to generate cards from", "num_cards": 5, "user_id": "user123" }
    Returns: { "flashcards": [...], "xp_data": {...} }
    """
    try:
        data = request.get_json()
        
        if not data or 'content' not in data:
            return jsonify({
                'error': 'Missing content field in request'
            }), 400
        
        content = data['content']
        num_cards = data.get('num_cards', 5)
        user_id = data.get('user_id', 'default_user')
        
        # Validate num_cards
        if num_cards < 1 or num_cards > 20:
            return jsonify({
                'error': 'num_cards must be between 1 and 20'
            }), 400
        
        # Generate flashcards
        result = generate_flashcards(content, num_cards)
        
        if result.get('status') == 'success':
            # Award XP for generating flashcards
            xp_data = award_xp(user_id, 'flashcard_review', bonus=num_cards * 2)
            result['xp_data'] = xp_data
            
            # Update user stats
            user = get_user_progress(user_id)
            user['flashcards_reviewed'] += num_cards
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'failed'
        }), 500


@app.route('/api/quiz/generate', methods=['POST'])
def generate_quiz_endpoint():
    """
    Generate quiz questions from content
    Expects: { "content": "text", "num_questions": 5, "user_id": "user123" }
    Returns: { "quiz": {...}, "xp_data": {...} }
    """
    try:
        data = request.get_json()
        
        if not data or 'content' not in data:
            return jsonify({
                'error': 'Missing content field in request'
            }), 400
        
        content = data['content']
        num_questions = data.get('num_questions', 5)
        user_id = data.get('user_id', 'default_user')
        
        # Validate num_questions
        if num_questions < 1 or num_questions > 20:
            return jsonify({
                'error': 'num_questions must be between 1 and 20'
            }), 400
        
        # Generate quiz
        result = generate_quiz(content, num_questions)
        
        if result.get('status') == 'success':
            # Award XP
            xp_data = award_xp(user_id, 'quiz_completion')
            result['xp_data'] = xp_data
            
            user = get_user_progress(user_id)
            user['quizzes_completed'] += 1
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'failed'
        }), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_content():
    """
    Endpoint for content analysis
    Expects: { "content": "text to analyze" }
    Returns: { "analysis": {...} }
    """
    try:
        data = request.get_json()
        
        if not data or 'content' not in data:
            return jsonify({
                'error': 'Missing content field in request'
            }), 400
        
        content = data['content']
        
        # Analyze content
        result = analyze_difficulty(content)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'failed'
        }), 500


@app.route('/api/rag/upload', methods=['POST'])
def upload_document():
    """
    Upload document for RAG processing
    Expects: { "content": "text or file content", "filename": "doc.pdf", "user_id": "user123" }
    Returns: { "doc_id": "...", "chunks_processed": 10, "xp_data": {...} }
    """
    try:
        data = request.get_json()
        
        if not data or 'content' not in data:
            return jsonify({
                'error': 'Missing content field in request'
            }), 400
        
        content = data['content']
        filename = data.get('filename', 'untitled.txt')
        user_id = data.get('user_id', 'default_user')
        
        # Check if user has unlocked RAG feature
        user = get_user_progress(user_id)
        if user['level'] < 3 and 'rag_upload' not in user['unlocked_features']:
            return jsonify({
                'error': 'RAG upload feature locked. Reach level 3 to unlock.',
                'required_level': 3,
                'current_level': user['level']
            }), 403
        
        # Process document for RAG
        result = process_document_for_rag(content, filename, user_id)
        
        if result.get('status') == 'success':
            # Award XP for document upload
            xp_data = award_xp(user_id, 'document_upload', bonus=result.get('chunks_processed', 0) * 2)
            result['xp_data'] = xp_data
            
            user['documents_processed'] += 1
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'failed'
        }), 500


@app.route('/api/rag/query', methods=['POST'])
def query_rag():
    """
    Query the RAG system
    Expects: { "query": "question", "user_id": "user123", "top_k": 3 }
    Returns: { "answer": "...", "sources": [...], "xp_data": {...} }
    """
    try:
        data = request.get_json()
        
        if not data or 'query' not in data:
            return jsonify({
                'error': 'Missing query field in request'
            }), 400
        
        query = data['query']
        user_id = data.get('user_id', 'default_user')
        top_k = data.get('top_k', 3)
        
        # Query RAG system
        result = query_rag_system(query, user_id, top_k)
        
        if result.get('status') == 'success':
            # Award XP for using RAG
            xp_data = award_xp(user_id, 'flashcard_review')
            result['xp_data'] = xp_data
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'failed'
        }), 500


@app.route('/api/rag/stats', methods=['GET'])
def rag_stats():
    """
    Get RAG system statistics
    Query params: ?user_id=user123
    Returns: { "total_documents": 5, "total_chunks": 150, ... }
    """
    try:
        user_id = request.args.get('user_id', 'default_user')
        
        result = get_rag_stats(user_id)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'failed'
        }), 500


@app.route('/api/xp/award', methods=['POST'])
def award_xp_endpoint():
    """
    Manually award XP to user
    Expects: { "user_id": "user123", "activity_type": "correct_answer", "bonus": 5 }
    Returns: { "xp_earned": 20, "total_xp": 150, "level": 2, ... }
    """
    try:
        data = request.get_json()
        
        if not data or 'user_id' not in data or 'activity_type' not in data:
            return jsonify({
                'error': 'Missing required fields: user_id, activity_type'
            }), 400
        
        user_id = data['user_id']
        activity_type = data['activity_type']
        bonus = data.get('bonus', 0)
        
        if activity_type not in XP_CONFIG:
            return jsonify({
                'error': f'Invalid activity_type. Valid options: {list(XP_CONFIG.keys())}'
            }), 400
        
        result = award_xp(user_id, activity_type, bonus)
        
        return jsonify({
            'status': 'success',
            **result
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'failed'
        }), 500


@app.route('/api/user/progress', methods=['GET'])
def get_progress():
    """
    Get user progress and stats
    Query params: ?user_id=user123
    Returns: { "xp": 150, "level": 2, "flashcards_reviewed": 25, ... }
    """
    try:
        user_id = request.args.get('user_id', 'default_user')
        
        if not user_id:
            return jsonify({
                'error': 'Missing user_id parameter'
            }), 400
        
        user = get_user_progress(user_id)
        current_level = user['level']
        next_level_xp = LEVEL_THRESHOLDS[min(current_level + 1, len(LEVEL_THRESHOLDS) - 1)]
        
        return jsonify({
            'status': 'success',
            'user_id': user_id,
            'xp': user['xp'],
            'level': user['level'],
            'next_level_xp': next_level_xp,
            'progress_to_next_level': (user['xp'] - LEVEL_THRESHOLDS[current_level]) / (next_level_xp - LEVEL_THRESHOLDS[current_level]) * 100 if next_level_xp > LEVEL_THRESHOLDS[current_level] else 100,
            'flashcards_reviewed': user['flashcards_reviewed'],
            'quizzes_completed': user['quizzes_completed'],
            'documents_processed': user['documents_processed'],
            'streak': user['streak'],
            'last_activity': user['last_activity'],
            'achievements': user['achievements'],
            'unlocked_features': user['unlocked_features']
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'failed'
        }), 500


@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    """
    Get top users by XP
    Query params: ?limit=10
    Returns: { "leaderboard": [{"user_id": "...", "xp": 500, "level": 3}, ...] }
    """
    try:
        limit = int(request.args.get('limit', 10))
        
        # Sort users by XP
        sorted_users = sorted(
            [(user_id, data) for user_id, data in user_data.items()],
            key=lambda x: x[1]['xp'],
            reverse=True
        )[:limit]
        
        leaderboard = [
            {
                'rank': idx + 1,
                'user_id': user_id,
                'xp': data['xp'],
                'level': data['level'],
                'flashcards_reviewed': data['flashcards_reviewed'],
                'quizzes_completed': data['quizzes_completed']
            }
            for idx, (user_id, data) in enumerate(sorted_users)
        ]
        
        return jsonify({
            'status': 'success',
            'leaderboard': leaderboard
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'failed'
        }), 500


# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    print("="*60)
    print("🚀 Flashcard Quest - AI Learning Platform")
    print("="*60)
    print(f"📡 Server starting on port {port}")
    print(f"📝 Debug mode: {debug}")
    print(f"🔑 OpenAI API Key configured: {bool(OPENAI_API_KEY)}")
    print(f"\n✨ Features Enabled:")
    print(f"   - AI Flashcard Generation")
    print(f"   - Quiz Generation")
    print(f"   - RAG System with Vector DB")
    print(f"   - XP & Progression System")
    print(f"   - Leaderboard")
    print(f"\n📚 API Endpoints:")
    print(f"   - POST /api/flashcards/generate")
    print(f"   - POST /api/quiz/generate")
    print(f"   - POST /api/rag/upload")
    print(f"   - POST /api/rag/query")
    print(f"   - POST /api/xp/award")
    print(f"   - GET  /api/user/progress")
    print(f"   - GET  /api/leaderboard")
    print("="*60)
    
    app.run(debug=debug, port=port, host='0.0.0.0')
