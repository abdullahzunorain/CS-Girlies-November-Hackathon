"""
AI Service Module
Handles all AI/ML integrations (OpenAI, Google Gemini, etc.)
"""

import os
from typing import Dict, List, Optional
from dotenv import load_dotenv

load_dotenv()

# Uncomment and configure based on your chosen AI service:

# Option 1: OpenAI GPT
try:
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("⚠️  OpenAI not installed. Run: pip install openai")

# Option 2: Google Gemini
# try:
#     import google.generativeai as genai
#     genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
#     GEMINI_AVAILABLE = True
# except ImportError:
#     GEMINI_AVAILABLE = False

class AIService:
    """AI Service for processing educational content"""
    
    def __init__(self):
        self.model = "gpt-3.5-turbo"  # or "gpt-4" for better results
        
    def process_with_ai(self, text: str, task: str = "general") -> Dict:
        """
        Main AI processing function
        
        Args:
            text: Input text to process
            task: Type of task (summarize, quiz, flashcard, etc.)
            
        Returns:
            Dict with processed results
        """
        if not OPENAI_AVAILABLE:
            return {
                'error': 'AI service not configured',
                'suggestion': 'Install openai: pip install openai'
            }
        
        try:
            prompts = {
                'summarize': f"Summarize this educational content concisely:\n\n{text}",
                'quiz': f"Generate 5 quiz questions from this content:\n\n{text}",
                'flashcard': f"Create flashcards from this content:\n\n{text}",
                'general': f"Process this educational content:\n\n{text}"
            }
            
            prompt = prompts.get(task, prompts['general'])
            
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a helpful educational AI assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            return {
                'result': response.choices[0].message.content,
                'task': task,
                'status': 'success'
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'status': 'failed'
            }
    
    def generate_quiz(self, content: str, num_questions: int = 5) -> List[Dict]:
        """Generate quiz questions from content"""
        try:
            prompt = f"""Generate {num_questions} multiple-choice quiz questions from this content.
            Format each question as JSON with: question, options (A-D), correct_answer, explanation.
            
            Content: {content}"""
            
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert quiz generator."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8
            )
            
            # Parse and return quiz questions
            return {
                'quiz': response.choices[0].message.content,
                'num_questions': num_questions
            }
            
        except Exception as e:
            return {'error': str(e)}
    
    def create_flashcards(self, content: str) -> List[Dict]:
        """Generate flashcards from content"""
        try:
            prompt = f"""Create flashcards from this content.
            Each flashcard should have a 'front' (question/term) and 'back' (answer/definition).
            
            Content: {content}"""
            
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a flashcard creator."},
                    {"role": "user", "content": prompt}
                ]
            )
            
            return {
                'flashcards': response.choices[0].message.content
            }
            
        except Exception as e:
            return {'error': str(e)}
    
    def analyze_difficulty(self, content: str) -> Dict:
        """Analyze content difficulty level"""
        try:
            prompt = f"""Analyze the difficulty level of this educational content.
            Rate it as: beginner, intermediate, or advanced.
            Provide reasoning.
            
            Content: {content}"""
            
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an educational content analyst."},
                    {"role": "user", "content": prompt}
                ]
            )
            
            return {
                'analysis': response.choices[0].message.content
            }
            
        except Exception as e:
            return {'error': str(e)}

# Create singleton instance
ai_service = AIService()

# Convenience functions
def process_with_ai(text: str, task: str = "general") -> Dict:
    """Wrapper function for easy imports"""
    return ai_service.process_with_ai(text, task)

def generate_quiz(content: str, num_questions: int = 5) -> List[Dict]:
    """Generate quiz wrapper"""
    return ai_service.generate_quiz(content, num_questions)

def create_flashcards(content: str) -> List[Dict]:
    """Create flashcards wrapper"""
    return ai_service.create_flashcards(content)
