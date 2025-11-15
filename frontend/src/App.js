import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CharacterSelect from "./pages/CharacterSelect";
import TopicInput from "./pages/TopicInput";
import StudyPage from "./pages/StudyPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/character-select" element={<CharacterSelect />} />
          <Route path="/topic-input" element={<TopicInput />} />
          <Route path="/study" element={<StudyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
