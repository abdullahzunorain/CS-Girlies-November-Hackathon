"""
user_service.py
User data management using ChromaDB for persistence
Handles XP, levels, progress tracking, and feature unlocks
"""

import os
import json
from datetime import datetime
from typing import Dict, Optional
from langchain_community.vectorstores import Chroma
from chromadb.config import Settings
import chromadb

# ChromaDB setup for user data
USERS_DB_PATH = "./chroma_db/users"
os.makedirs(USERS_DB_PATH, exist_ok=True)

# Simple in-memory cache for fast access (backed by ChromaDB)
user_cache = {}

class UserService:
    """Manage user data with ChromaDB persistence"""
    
    def __init__(self):
        """Initialize ChromaDB client for user storage"""
        try:
            self.client = chromadb.PersistentClient(path=USERS_DB_PATH)
            # Get or create collection for users
            self.users_collection = self.client.get_or_create_collection(
                name="users",
                metadata={"hnsw:space": "cosine"}
            )
        except Exception as e:
            print(f"⚠️  ChromaDB initialization error: {e}")
            self.users_collection = None
    
    def get_user(self, user_id: str) -> Dict:
        """Retrieve user data from cache or database"""
        # Check cache first
        if user_id in user_cache:
            return user_cache[user_id]
        
        # Try to load from ChromaDB
        if self.users_collection:
            try:
                results = self.users_collection.get(
                    ids=[user_id],
                    include=["metadatas", "documents"]
                )
                
                if results['ids']:
                    # Parse user data from metadata
                    user_data = json.loads(results['metadatas'][0]['data'])
                    user_cache[user_id] = user_data
                    return user_data
            except Exception as e:
                print(f"Error fetching user from ChromaDB: {e}")
        
        # Create new user if doesn't exist
        return self._create_new_user(user_id)
    
    def _create_new_user(self, user_id: str) -> Dict:
        """Create and store new user with default values"""
        user_data = {
            'user_id': user_id,
            'xp': 0,
            'level': 1,
            'flashcards_reviewed': 0,
            'quizzes_completed': 0,
            'documents_processed': 0,
            'streak': 0,
            'last_activity': None,
            'achievements': [],
            'unlocked_features': ['basic_flashcards'],
            'character': None,  # Will be set when user selects character
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        
        # Save to both cache and ChromaDB
        user_cache[user_id] = user_data
        self._save_to_chromadb(user_id, user_data)
        
        return user_data
    
    def _save_to_chromadb(self, user_id: str, user_data: Dict) -> None:
        """Persist user data to ChromaDB"""
        if not self.users_collection:
            return
        
        try:
            user_data['updated_at'] = datetime.now().isoformat()
            
            # Try to update existing, insert if not found
            self.users_collection.upsert(
                ids=[user_id],
                documents=[f"User {user_id}"],  # Simple document text
                metadatas=[{
                    "user_id": user_id,
                    "data": json.dumps(user_data),
                    "level": str(user_data['level']),
                    "xp": str(user_data['xp'])
                }]
            )
        except Exception as e:
            print(f"Error saving user to ChromaDB: {e}")
    
    def update_user(self, user_id: str, updates: Dict) -> Dict:
        """Update user data and save to ChromaDB"""
        user_data = self.get_user(user_id)
        user_data.update(updates)
        user_data['updated_at'] = datetime.now().isoformat()
        
        user_cache[user_id] = user_data
        self._save_to_chromadb(user_id, user_data)
        
        return user_data
    
    def set_character(self, user_id: str, character: Dict) -> Dict:
        """Save character selection"""
        return self.update_user(user_id, {'character': character})
    
    def add_xp(self, user_id: str, amount: int) -> Dict:
        """Add XP to user"""
        user_data = self.get_user(user_id)
        user_data['xp'] += amount
        user_data['updated_at'] = datetime.now().isoformat()
        
        user_cache[user_id] = user_data
        self._save_to_chromadb(user_id, user_data)
        
        return user_data
    
    def update_stats(self, user_id: str, stat_name: str, increment: int = 1) -> Dict:
        """Increment any stat (flashcards_reviewed, quizzes_completed, etc)"""
        user_data = self.get_user(user_id)
        
        if stat_name in user_data:
            user_data[stat_name] += increment
            user_data['updated_at'] = datetime.now().isoformat()
            
            user_cache[user_id] = user_data
            self._save_to_chromadb(user_id, user_data)
        
        return user_data
    
    def get_leaderboard(self, limit: int = 10) -> list:
        """Get top users by XP"""
        try:
            if not self.users_collection:
                return []
            
            # Get all users from ChromaDB
            results = self.users_collection.get(include=["metadatas"])
            
            users_list = []
            for metadata in results['metadatas']:
                try:
                    user_data = json.loads(metadata['data'])
                    users_list.append({
                        'user_id': user_data['user_id'],
                        'xp': user_data['xp'],
                        'level': user_data['level'],
                        'flashcards_reviewed': user_data['flashcards_reviewed'],
                        'quizzes_completed': user_data['quizzes_completed'],
                        'character': user_data.get('character', {}).get('name', 'Unknown')
                    })
                except:
                    pass
            
            # Sort by XP descending
            users_list.sort(key=lambda x: x['xp'], reverse=True)
            
            # Add ranks and return top N
            leaderboard = []
            for idx, user in enumerate(users_list[:limit]):
                user['rank'] = idx + 1
                leaderboard.append(user)
            
            return leaderboard
        except Exception as e:
            print(f"Error getting leaderboard: {e}")
            return []


# Global instance
user_service = UserService()
