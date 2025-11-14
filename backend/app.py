"""
Main Flask application for CS Girlies Hackathon project
Backend API with AI integration
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# Import AI service (uncomment when implemented)
# from ai_service import process_with_ai

@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({
        'status': 'running',
        'message': 'CS Girlies Hackathon API',
        'project': 'Your Project Name'
    })

@app.route('/api/process', methods=['POST'])
def process_text():
    """
    Main endpoint to process user input with AI
    Expects: { "text": "user input here" }
    Returns: { "result": "processed output" }
    """
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({
                'error': 'Missing text field in request'
            }), 400
        
        user_text = data['text']
        
        # TODO: Implement your AI processing logic here
        # Example:
        # result = process_with_ai(user_text)
        
        # Placeholder response
        result = {
            'original': user_text,
            'processed': f'AI processed: {user_text[:50]}...',
            'status': 'success',
            'message': 'Connect your AI service here!'
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'failed'
        }), 500

@app.route('/api/generate', methods=['POST'])
def generate_content():
    """
    Endpoint for AI content generation
    Customize based on your project needs
    """
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')
        
        # TODO: Implement generation logic
        # Example: quiz generation, flashcards, summaries, etc.
        
        return jsonify({
            'generated_content': 'Your AI-generated content here',
            'prompt': prompt
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_content():
    """
    Endpoint for content analysis
    E.g., difficulty level, key concepts, etc.
    """
    try:
        data = request.get_json()
        content = data.get('content', '')
        
        # TODO: Implement analysis logic
        
        return jsonify({
            'analysis': {
                'difficulty': 'medium',
                'key_concepts': [],
                'summary': 'Analysis results here'
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
    
    print(f"🚀 Starting server on port {port}")
    print(f"📝 Debug mode: {debug}")
    print(f"🔑 OpenAI API Key configured: {bool(OPENAI_API_KEY)}")
    
    app.run(debug=debug, port=port, host='0.0.0.0')
