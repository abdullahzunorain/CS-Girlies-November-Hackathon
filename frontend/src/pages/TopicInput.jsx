import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopicInput.css';

const TopicInput = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [cardCount, setCardCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [studyMode, setStudyMode] = useState('topic'); // 'topic' or 'file'

  const selectedCharacter = JSON.parse(localStorage.getItem('selectedCharacter') || '{}');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Only accept PDFs for now
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setUploadedFile(file);
  };

  const handleGenerate = async () => {
    if (studyMode === 'topic' && !topic.trim()) {
      alert('Please enter a topic to study!');
      return;
    }

    if (studyMode === 'file' && !uploadedFile) {
      alert('Please upload a file!');
      return;
    }

    setIsGenerating(true);

    try {
      if (studyMode === 'file') {
        // Call backend RAG upload endpoint
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('user_id', 'demo_user');

        const response = await fetch('http://localhost:5000/api/rag/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.status === 'success') {
          // File processed successfully
          // Now generate flashcards from the uploaded content
          localStorage.setItem('currentTopic', uploadedFile.name);
          localStorage.setItem('cardCount', cardCount);
          localStorage.setItem('studyMode', 'rag');
          localStorage.setItem('docId', result.doc_id);
          
          navigate('/study');
        } else {
          alert('Failed to process file: ' + result.error);
          setIsGenerating(false);
        }
      } else {
        // Original topic-based flow
        localStorage.setItem('currentTopic', topic);
        localStorage.setItem('cardCount', cardCount);
        localStorage.setItem('studyMode', 'topic');
        navigate('/study');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate flashcards');
      setIsGenerating(false);
    }
  };

  return (
    <div className="topic-input">
      <div className="topic-input-container">
        {/* Character greeting */}
        {selectedCharacter.name && (
          <div className="character-greeting">
            <div 
              className="character-mini-avatar"
              style={{ background: `linear-gradient(135deg, ${selectedCharacter.color} 0%, #764ba2 100%)` }}
            >
              <img src={selectedCharacter.image} alt={selectedCharacter.name} style={{width: '100%', borderRadius: '50%'}} />
            </div>
            <p>
              Hey! I'm <strong>{selectedCharacter.name}</strong>. 
              What do you want to study today?
            </p>
          </div>
        )}

        <h1 className="page-title">Ready to Level Up? 📚</h1>
        <p className="page-subtitle">Tell me what you're studying!</p>

        {/* Study Mode Selector */}
        <div className="study-mode-selector">
          <button
            className={`mode-button ${studyMode === 'topic' ? 'active' : ''}`}
            onClick={() => setStudyMode('topic')}
          >
            📝 Enter Topic
          </button>
          <button
            className={`mode-button ${studyMode === 'file' ? 'active' : ''}`}
            onClick={() => setStudyMode('file')}
          >
            📄 Upload PDF
          </button>
        </div>

        <div className="input-section">
          {studyMode === 'topic' ? (
            <>
              {/* Topic input */}
              <div className="input-group">
                <label htmlFor="topic">What are you studying?</label>
                <input
                  id="topic"
                  type="text"
                  placeholder="e.g., Spanish verbs, Photosynthesis, World War 2..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="topic-input-field"
                  disabled={isGenerating}
                />
              </div>

              {/* Popular topics suggestions */}
              <div className="suggestions">
                <p className="suggestions-label">Popular topics:</p>
                <div className="suggestion-chips">
                  {[
                    'Biology 101',
                    'Spanish Vocabulary',
                    'US History',
                    'JavaScript Basics',
                    'SAT Math'
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      className="suggestion-chip"
                      onClick={() => setTopic(suggestion)}
                      disabled={isGenerating}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* File upload */}
              <div className="input-group">
                <label htmlFor="file-upload">Upload your study material</label>
                <div className="file-upload-area">
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    disabled={isGenerating}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="file-upload" className="file-upload-button">
                    {uploadedFile ? (
                      <>
                        ✅ {uploadedFile.name}
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            setUploadedFile(null);
                          }}
                          className="remove-file"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <>📤 Click to Upload PDF</>
                    )}
                  </label>
                </div>
                <p className="file-hint">Upload a PDF and we'll generate flashcards from it!</p>
              </div>
            </>
          )}

          {/* Card count selector */}
          <div className="input-group">
            <label htmlFor="cardCount">Number of flashcards</label>
            <div className="card-count-selector">
              {[5, 10, 15, 20].map((count) => (
                <button
                  key={count}
                  className={`count-option ${cardCount === count ? 'selected' : ''}`}
                  onClick={() => setCardCount(count)}
                  disabled={isGenerating}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate button */}
        <button
          className="generate-button"
          onClick={handleGenerate}
          disabled={isGenerating || (studyMode === 'topic' && !topic.trim()) || (studyMode === 'file' && !uploadedFile)}
        >
          {isGenerating ? (
            <>
              <span className="spinner">⏳</span> Generating Flashcards...
            </>
          ) : (
            <>Generate Flashcards! ✨</>
          )}
        </button>

        <button 
          className="back-button" 
          onClick={() => navigate('/character-select')}
          disabled={isGenerating}
        >
          ← Change Character
        </button>
      </div>
    </div>
  );
};

export default TopicInput;