"""
rag_service.py
Improved RAG system using Google Gemini embeddings and ChromaDB
"""

import os
from typing import Dict, List
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from dotenv import load_dotenv

load_dotenv()

# ChromaDB storage path
CHROMA_DB_PATH = "./chroma_db"

class RAGService:
    """Improved RAG service with Google Gemini embeddings"""
    
    def __init__(self):
        # Initialize embeddings
        try:
            self.embeddings = GoogleGenerativeAIEmbeddings(
                model="models/text-embedding-004",
                google_api_key=os.getenv('GOOGLE_API_KEY')
            )
            self.embedding_available = True
        except Exception as e:
            print(f"⚠️  Google embeddings unavailable: {e}")
            self.embedding_available = False
    
    def process_pdf(self, file_path: str, user_id: str) -> Dict:
        """
        Process PDF and store in ChromaDB
        
        Args:
            file_path: Path to PDF file
            user_id: User identifier
            
        Returns:
            Dict with processing results
        """
        try:
            # Load PDF
            loader = PyPDFLoader(file_path)
            documents = loader.load()
            
            # Split into chunks
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200
            )
            chunks = text_splitter.split_documents(documents)
            
            # Add user_id to metadata for isolation
            for chunk in chunks:
                chunk.metadata['user_id'] = user_id
                chunk.metadata['source_file'] = os.path.basename(file_path)
            
            # Create/update ChromaDB collection for this user
            collection_name = f"user_{user_id}"
            vector_db = Chroma.from_documents(
                documents=chunks,
                embedding=self.embeddings,
                persist_directory=CHROMA_DB_PATH,
                collection_name=collection_name
            )
            
            print(f"✅ Processed {len(chunks)} chunks for user {user_id}")
            
            return {
                'status': 'success',
                'chunks_processed': len(chunks),
                'filename': os.path.basename(file_path),
                'collection': collection_name
            }
            
        except Exception as e:
            return {
                'status': 'failed',
                'error': str(e)
            }
    
    def query(self, user_id: str, query: str, top_k: int = 3) -> Dict:
        """
        Query user's documents
        
        Args:
            user_id: User identifier
            query: Search query
            top_k: Number of results
            
        Returns:
            Dict with results
        """
        try:
            collection_name = f"user_{user_id}"
            
            # Load existing ChromaDB collection
            vector_db = Chroma(
                persist_directory=CHROMA_DB_PATH,
                embedding_function=self.embeddings,
                collection_name=collection_name
            )
            
            # Search for similar documents
            results = vector_db.similarity_search_with_score(query, k=top_k)
            
            # Format results
            sources = []
            context_parts = []
            
            for doc, score in results:
                sources.append({
                    'content': doc.page_content[:200] + "...",
                    'filename': doc.metadata.get('source_file', 'unknown'),
                    'page': doc.metadata.get('page', 'N/A'),
                    'similarity': round(1 - score, 3)  # Convert distance to similarity
                })
                context_parts.append(doc.page_content)
            
            # Combine context for answer generation
            context = "\n\n".join(context_parts)
            
            return {
                'status': 'success',
                'context': context,
                'sources': sources,
                'num_results': len(sources)
            }
            
        except Exception as e:
            return {
                'status': 'failed',
                'error': str(e)
            }
    
    def get_stats(self, user_id: str) -> Dict:
        """Get user's RAG statistics"""
        try:
            collection_name = f"user_{user_id}"
            
            vector_db = Chroma(
                persist_directory=CHROMA_DB_PATH,
                embedding_function=self.embeddings,
                collection_name=collection_name
            )
            
            # Get collection stats
            collection = vector_db._collection
            count = collection.count()
            
            return {
                'status': 'success',
                'total_chunks': count,
                'collection': collection_name
            }
            
        except Exception as e:
            return {
                'status': 'success',
                'total_chunks': 0,
                'note': 'No documents uploaded yet'
            }

# Create singleton
rag_service = RAGService()