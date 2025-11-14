"""
AI Service Module
Handles all AI/ML integrations (OpenAI, Google Gemini, etc.)
Includes RAG System with Vector Database for document processing
"""

import os
import json
import hashlib
import numpy as np
from typing import Dict, List, Optional, Tuple
from dotenv import load_dotenv
from datetime import datetime
import re

load_dotenv()

# AI Service Configuration
try:
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("⚠️  OpenAI not installed. Run: pip install openai")

# Vector Database Storage (in-memory for MVP - use Pinecone/Weaviate/Chroma in production)
vector_store = {}  # Format: {user_id: {"documents": [], "embeddings": [], "metadata": []}}

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    """
    Split text into overlapping chunks for RAG processing
    
    Args:
        text: Input text to chunk
        chunk_size: Maximum characters per chunk
        overlap: Number of characters to overlap between chunks
        
    Returns:
        List of text chunks
    """
    # Clean the text
    text = re.sub(r'\s+', ' ', text).strip()
    
    if len(text) <= chunk_size:
        return [text]
    
    chunks = []
    start = 0
    
    while start < len(text):
        end = start + chunk_size
        
        # Try to break at sentence boundary
        if end < len(text):
            # Look for sentence endings
            last_period = text.rfind('.', start, end)
            last_newline = text.rfind('\n', start, end)
            last_break = max(last_period, last_newline)
            
            if last_break > start:
                end = last_break + 1
        
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        
        # Move start position with overlap
        start = end - overlap if end < len(text) else end
    
    return chunks

def get_embedding(text: str, model: str = "text-embedding-3-small") -> List[float]:
    """
    Generate embedding for text using OpenAI
    
    Args:
        text: Input text
        model: Embedding model to use
        
    Returns:
        List of floats representing the embedding
    """
    if not OPENAI_AVAILABLE:
        # Return random embedding for testing without API
        return np.random.rand(1536).tolist()
    
    try:
        response = client.embeddings.create(
            input=text,
            model=model
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return np.random.rand(1536).tolist()

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Calculate cosine similarity between two vectors"""
    vec1 = np.array(vec1)
    vec2 = np.array(vec2)
    
    dot_product = np.dot(vec1, vec2)
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    
    if norm1 == 0 or norm2 == 0:
        return 0.0
    
    return float(dot_product / (norm1 * norm2))

def retrieve_relevant_chunks(query: str, user_id: str, top_k: int = 3) -> List[Dict]:
    """
    Retrieve most relevant chunks for a query using vector similarity
    
    Args:
        query: User query
        user_id: User identifier
        top_k: Number of top results to return
        
    Returns:
        List of relevant chunks with metadata
    """
    if user_id not in vector_store or not vector_store[user_id]['embeddings']:
        return []
    
    # Get query embedding
    query_embedding = get_embedding(query)
    
    # Calculate similarities
    user_data = vector_store[user_id]
    similarities = []
    
    for idx, doc_embedding in enumerate(user_data['embeddings']):
        similarity = cosine_similarity(query_embedding, doc_embedding)
        similarities.append({
            'index': idx,
            'similarity': similarity,
            'chunk': user_data['documents'][idx],
            'metadata': user_data['metadata'][idx]
        })
    
    # Sort by similarity and return top_k
    similarities.sort(key=lambda x: x['similarity'], reverse=True)
    return similarities[:top_k]

class AIService:
    """AI Service for processing educational content with RAG support"""
    
    def __init__(self):
        self.model = "gpt-3.5-turbo"  # or "gpt-4" for better results
        self.embedding_model = "text-embedding-3-small"
        
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
    
    def generate_quiz(self, content: str, num_questions: int = 5) -> Dict:
        """Generate quiz questions from content"""
        try:
            prompt = f"""Generate exactly {num_questions} multiple-choice quiz questions from this content.

            Return ONLY a valid JSON array with this exact format:
            [
              {{
                "question": "Question text here?",
                "options": {{
                  "A": "First option",
                  "B": "Second option",
                  "C": "Third option",
                  "D": "Fourth option"
                }},
                "correct_answer": "A",
                "explanation": "Why this answer is correct"
              }}
            ]
            
            Content: {content}
            
            IMPORTANT: Return ONLY the JSON array, no other text."""
            
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert quiz generator. Always respond with valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1500
            )
            
            quiz_text = response.choices[0].message.content.strip()
            
            # Try to parse JSON
            try:
                quiz_data = json.loads(quiz_text)
                return {
                    'status': 'success',
                    'quiz': quiz_data,
                    'num_questions': len(quiz_data)
                }
            except json.JSONDecodeError:
                # If JSON parsing fails, return as text
                return {
                    'status': 'success',
                    'quiz': quiz_text,
                    'num_questions': num_questions,
                    'note': 'Quiz returned as text, not parsed JSON'
                }
            
        except Exception as e:
            return {
                'status': 'failed',
                'error': str(e)
            }
    
    def create_flashcards(self, content: str, num_cards: int = 5) -> Dict:
        """Generate flashcards from content"""
        try:
            prompt = f"""Generate exactly {num_cards} flashcards from this educational content.

            Return ONLY a valid JSON array with this exact format:
            [
              {{
                "front": "Question or term",
                "back": "Answer or definition",
                "difficulty": "easy|medium|hard",
                "category": "Topic category"
              }}
            ]
            
            Content: {content}
            
            IMPORTANT: Return ONLY the JSON array, no other text."""
            
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert flashcard creator. Always respond with valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            flashcards_text = response.choices[0].message.content.strip()
            
            # Try to parse JSON
            try:
                flashcards_data = json.loads(flashcards_text)
                return {
                    'status': 'success',
                    'flashcards': flashcards_data,
                    'num_cards': len(flashcards_data)
                }
            except json.JSONDecodeError:
                # If JSON parsing fails, return as text
                return {
                    'status': 'success',
                    'flashcards': flashcards_text,
                    'num_cards': num_cards,
                    'note': 'Flashcards returned as text, not parsed JSON'
                }
            
        except Exception as e:
            return {
                'status': 'failed',
                'error': str(e)
            }
    
    def analyze_difficulty(self, content: str) -> Dict:
        """Analyze content difficulty level"""
        try:
            prompt = f"""Analyze this educational content and return ONLY a JSON object with this format:
            {{
              "difficulty": "beginner|intermediate|advanced",
              "reading_level": "Grade level (e.g., '9-10')",
              "key_concepts": ["concept1", "concept2", "concept3"],
              "estimated_study_time": "Time in minutes",
              "reasoning": "Brief explanation of difficulty rating"
            }}
            
            Content: {content}
            
            IMPORTANT: Return ONLY valid JSON, no other text."""
            
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an educational content analyst. Always respond with valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
                max_tokens=500
            )
            
            analysis_text = response.choices[0].message.content.strip()
            
            try:
                analysis_data = json.loads(analysis_text)
                return {
                    'status': 'success',
                    'analysis': analysis_data
                }
            except json.JSONDecodeError:
                return {
                    'status': 'success',
                    'analysis': analysis_text,
                    'note': 'Analysis returned as text, not parsed JSON'
                }
            
        except Exception as e:
            return {
                'status': 'failed',
                'error': str(e)
            }
    
    def process_document_for_rag(self, content: str, filename: str, user_id: str) -> Dict:
        """
        Process document for RAG: chunk, embed, and store in vector DB
        
        Args:
            content: Document text content
            filename: Name of the document
            user_id: User identifier
            
        Returns:
            Dict with processing results
        """
        try:
            # Initialize user's vector store if not exists
            if user_id not in vector_store:
                vector_store[user_id] = {
                    'documents': [],
                    'embeddings': [],
                    'metadata': []
                }
            
            # Chunk the document
            chunks = chunk_text(content, chunk_size=500, overlap=50)
            
            print(f"📄 Processing document: {filename}")
            print(f"📦 Created {len(chunks)} chunks")
            
            # Generate embeddings for each chunk
            doc_id = hashlib.md5(f"{user_id}_{filename}_{datetime.now()}".encode()).hexdigest()[:12]
            
            for idx, chunk in enumerate(chunks):
                # Get embedding
                embedding = get_embedding(chunk)
                
                # Store in vector database
                vector_store[user_id]['documents'].append(chunk)
                vector_store[user_id]['embeddings'].append(embedding)
                vector_store[user_id]['metadata'].append({
                    'doc_id': doc_id,
                    'filename': filename,
                    'chunk_index': idx,
                    'total_chunks': len(chunks),
                    'timestamp': datetime.now().isoformat()
                })
            
            return {
                'status': 'success',
                'doc_id': doc_id,
                'filename': filename,
                'chunks_processed': len(chunks),
                'total_documents': len(set(m['doc_id'] for m in vector_store[user_id]['metadata'])),
                'message': f'Successfully processed {filename} into {len(chunks)} chunks'
            }
            
        except Exception as e:
            return {
                'status': 'failed',
                'error': str(e)
            }
    
    def query_rag_system(self, query: str, user_id: str, top_k: int = 3) -> Dict:
        """
        Query the RAG system to get context-aware answers
        
        Args:
            query: User question
            user_id: User identifier
            top_k: Number of relevant chunks to retrieve
            
        Returns:
            Dict with answer and sources
        """
        try:
            # Check if user has any documents
            if user_id not in vector_store or not vector_store[user_id]['documents']:
                return {
                    'status': 'failed',
                    'error': 'No documents found. Please upload documents first using /api/rag/upload'
                }
            
            # Retrieve relevant chunks
            relevant_chunks = retrieve_relevant_chunks(query, user_id, top_k)
            
            if not relevant_chunks:
                return {
                    'status': 'failed',
                    'error': 'No relevant information found in your documents'
                }
            
            # Build context from retrieved chunks
            context = "\n\n".join([
                f"[Source {idx + 1} from {chunk['metadata']['filename']}]:\n{chunk['chunk']}"
                for idx, chunk in enumerate(relevant_chunks)
            ])
            
            # Generate answer using retrieved context
            prompt = f"""Answer the following question based ONLY on the provided context from the user's documents.
            If the answer cannot be found in the context, say "I cannot find this information in your uploaded documents."
            
            Context:
            {context}
            
            Question: {query}
            
            Provide a clear, concise answer and cite which sources you used."""
            
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a helpful AI assistant that answers questions based on provided context. Always cite your sources."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            answer = response.choices[0].message.content
            
            # Prepare sources information
            sources = [
                {
                    'filename': chunk['metadata']['filename'],
                    'chunk_index': chunk['metadata']['chunk_index'],
                    'similarity': round(chunk['similarity'], 3),
                    'preview': chunk['chunk'][:150] + "..." if len(chunk['chunk']) > 150 else chunk['chunk']
                }
                for chunk in relevant_chunks
            ]
            
            return {
                'status': 'success',
                'answer': answer,
                'sources': sources,
                'num_sources': len(sources),
                'query': query
            }
            
        except Exception as e:
            return {
                'status': 'failed',
                'error': str(e)
            }

# Create singleton instance
ai_service = AIService()

# Convenience functions
def process_with_ai(text: str, task: str = "general") -> Dict:
    """Wrapper function for easy imports"""
    return ai_service.process_with_ai(text, task)

def generate_quiz(content: str, num_questions: int = 5) -> Dict:
    """Generate quiz wrapper"""
    return ai_service.generate_quiz(content, num_questions)

def generate_flashcards(content: str, num_cards: int = 5) -> Dict:
    """Generate flashcards wrapper"""
    return ai_service.create_flashcards(content, num_cards)

def analyze_difficulty(content: str) -> Dict:
    """Analyze content difficulty wrapper"""
    return ai_service.analyze_difficulty(content)

def process_document_for_rag(content: str, filename: str, user_id: str) -> Dict:
    """Process document for RAG wrapper"""
    return ai_service.process_document_for_rag(content, filename, user_id)

def query_rag_system(query: str, user_id: str, top_k: int = 3) -> Dict:
    """Query RAG system wrapper"""
    return ai_service.query_rag_system(query, user_id, top_k)

def get_rag_stats(user_id: str) -> Dict:
    """Get RAG system statistics for a user"""
    if user_id not in vector_store:
        return {
            'status': 'success',
            'total_documents': 0,
            'total_chunks': 0,
            'documents': []
        }
    
    user_data = vector_store[user_id]
    
    # Get unique documents
    doc_ids = set()
    documents = {}
    
    for metadata in user_data['metadata']:
        doc_id = metadata['doc_id']
        if doc_id not in doc_ids:
            doc_ids.add(doc_id)
            documents[doc_id] = {
                'filename': metadata['filename'],
                'chunks': 0,
                'uploaded': metadata['timestamp']
            }
        documents[doc_id]['chunks'] += 1
    
    return {
        'status': 'success',
        'total_documents': len(doc_ids),
        'total_chunks': len(user_data['documents']),
        'documents': list(documents.values())
    }
