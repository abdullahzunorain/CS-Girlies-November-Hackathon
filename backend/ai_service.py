"""
AI Service Module
Handles all AI/ML integrations (OpenAI, Google Gemini, etc.)
Includes RAG System with Vector Database for document processing
"""

import os
import json
import hashlib
from typing import Dict, List
from dotenv import load_dotenv
from datetime import datetime
import re

# Groq client (using Groq instead of OpenAI per user request)
try:
    from groq import Groq
    GROQ_API_KEY = os.getenv('GROQ_API_KEY')
    if GROQ_API_KEY:
        groq_client = Groq(api_key=GROQ_API_KEY)
        GROQ_AVAILABLE = True
    else:
        groq_client = None
        GROQ_AVAILABLE = False
except ImportError:
    groq_client = None
    GROQ_AVAILABLE = False
    print("⚠️  Groq library not installed. Run: pip install groq")

# NumPy import with error handling
try:
    import numpy as np
    NUMPY_AVAILABLE = True
except ImportError:
    np = None  # type: ignore
    NUMPY_AVAILABLE = False
    print("⚠️  NumPy not installed. Run: pip install numpy")

load_dotenv()

# Previous OpenAI configuration removed; using Groq exclusively now.
OPENAI_AVAILABLE = False  # Explicitly disable OpenAI usage

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

def get_embedding(text: str, model: str = "deterministic-hash-embedding") -> List[float]:
    """Deterministic embedding fallback (hash-based) since Groq model used for chat only."""
    # Use SHA256 digest expanded to fixed-length vector
    digest = hashlib.sha256(text.encode('utf-8')).digest()
    # Repeat digest to reach desired length (256 dims)
    raw = digest * (256 // len(digest) + 1)
    vec_bytes = raw[:256]
    # Convert bytes to floats between 0 and 1
    embedding = [b / 255.0 for b in vec_bytes]
    return embedding

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Calculate cosine similarity between two vectors"""
    if NUMPY_AVAILABLE and np is not None:
        vec1_arr = np.array(vec1)
        vec2_arr = np.array(vec2)
        
        dot_product = np.dot(vec1_arr, vec2_arr)
        norm1 = np.linalg.norm(vec1_arr)
        norm2 = np.linalg.norm(vec2_arr)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return float(dot_product / (norm1 * norm2))
    else:
        # Fallback implementation without numpy
        import math
        
        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        norm1 = math.sqrt(sum(a * a for a in vec1))
        norm2 = math.sqrt(sum(b * b for b in vec2))
        
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
    """AI Service for processing educational content with RAG support (Groq)"""
    
    def __init__(self):
        # Use Groq OSS model as requested
        self.model = "openai/gpt-oss-20b"
        # Embeddings: Groq does not expose this model for embeddings; using deterministic hash fallback
        self.embedding_model = "deterministic-hash-embedding"
        
    def process_with_ai(self, text: str, task: str = "general") -> Dict:
        """
        Main AI processing function
        
        Args:
            text: Input text to process
            task: Type of task (summarize, quiz, flashcard, etc.)
            
        Returns:
            Dict with processed results
        """
        if not GROQ_AVAILABLE or groq_client is None:
            return {
                'error': 'Groq service not configured',
                'suggestion': 'Install groq: pip install groq and set GROQ_API_KEY in .env'
            }
        
        try:
            prompts = {
                'summarize': f"Summarize this educational content concisely:\n\n{text}",
                'quiz': f"Generate 5 quiz questions from this content:\n\n{text}",
                'flashcard': f"Create flashcards from this content:\n\n{text}",
                'general': f"Process this educational content:\n\n{text}"
            }
            
            prompt = prompts.get(task, prompts['general'])
            
            response = groq_client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a helpful educational AI assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_completion_tokens=800,
                top_p=1,
                reasoning_effort="medium",
                stream=False
            )
            content = response.choices[0].message.content
            return {
                'result': content,
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
            
            if not GROQ_AVAILABLE or groq_client is None:
                return {'status': 'failed', 'error': 'Groq client unavailable'}
            response = groq_client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert quiz generator. Always respond with valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_completion_tokens=1200,
                top_p=1,
                reasoning_effort="medium",
                stream=False
            )
            
            quiz_text = response.choices[0].message.content
            if quiz_text is None:
                quiz_text = ""
            quiz_text = quiz_text.strip()
            
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
            
            if not GROQ_AVAILABLE or groq_client is None:
                return {'status': 'failed', 'error': 'Groq client unavailable'}
            response = groq_client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert flashcard creator. Always respond with valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_completion_tokens=900,
                top_p=1,
                reasoning_effort="medium",
                stream=False
            )
            
            flashcards_text = response.choices[0].message.content
            if flashcards_text is None:
                flashcards_text = ""
            flashcards_text = flashcards_text.strip()
            
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
            
            if not GROQ_AVAILABLE or groq_client is None:
                return {'status': 'failed', 'error': 'Groq client unavailable'}
            response = groq_client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an educational content analyst. Always respond with valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
                max_completion_tokens=600,
                top_p=1,
                reasoning_effort="medium",
                stream=False
            )
            
            analysis_text = response.choices[0].message.content
            if analysis_text is None:
                analysis_text = ""
            analysis_text = analysis_text.strip()
            
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
            
            if not GROQ_AVAILABLE or groq_client is None:
                return {'status': 'failed', 'error': 'Groq client unavailable'}
            response = groq_client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a helpful AI assistant that answers questions based on provided context. Always cite your sources."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_completion_tokens=700,
                top_p=1,
                reasoning_effort="medium",
                stream=False
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
