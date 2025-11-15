# Y2K Study RPG - Frontend Structure

## 📁 Folder Organization

```
src/
├── components/          # All React components
│   ├── character/       # Person 3: Character system
│   ├── flashcards/      # Person 4: YOUR WORK - Flashcard components
│   ├── study/           # Person 4: YOUR WORK - Study session UI
│   ├── levelup/         # Person 4: YOUR WORK - Celebration screens
│   └── shared/          # Shared components (buttons, modals, etc)
│
├── pages/               # Main page/route components
│   ├── HomePage.jsx
│   ├── CharacterSelect.jsx
│   ├── StudySession.jsx
│   └── Dashboard.jsx
│
├── hooks/               # Custom React hooks
│   ├── useXP.js         # Connect to Person 2's XP system
│   ├── useTimer.js      # Study session timer
│   └── useFlashcards.js # Flashcard state management
│
├── services/            # API calls to backend
│   ├── api.js           # Base API setup
│   ├── flashcardService.js  # Connect to Person 1's RAG
│   └── progressService.js   # Connect to Person 2's XP system
│
├── styles/              # Global styles and themes
│   ├── y2k-theme.css    # Y2K color palette and fonts
│   ├── animations.css   # Reusable animations
│   └── global.css       # Base styles
│
├── assets/              # Static files
│   ├── images/          # Character sprites, backgrounds
│   ├── sounds/          # Sound effects (level up, correct answer)
│   └── fonts/           # Pixel fonts, Y2K typography
│
└── utils/               # Helper functions
    ├── xpCalculator.js
    └── constants.js     # XP values, level thresholds
```

## 🎯 Team Responsibilities by Folder

### Person 3 (Character/Y2K UI)

- `components/character/` - All character-related components
- `components/shared/` - Reusable UI components with Y2K styling
- `styles/` - The entire Y2K theme system
- `assets/images/` - Character sprites and backgrounds

### Person 4 (Flashcards/Study Flow) - **YOU**

- `components/flashcards/` - Flashcard component with flip animations
- `components/study/` - Study session container, progress bars, timer
- `components/levelup/` - Level up celebration screen
- `hooks/useTimer.js` - Timer logic for study sessions
- `hooks/useFlashcards.js` - Flashcard state and progression

### Person 5 (All-Rounder)

- `services/` - Connect frontend to backend APIs
- `pages/` - Wire up all components into complete pages
- Help Person 3 & 4 integrate their work

### Integration Points

- `hooks/useXP.js` - Connects to Person 2's backend XP system
- `services/flashcardService.js` - Connects to Person 1's RAG API
- `services/progressService.js` - Tracks study progress

## 🚀 Getting Started

1. **Install dependencies:**

```bash
npm install framer-motion react-confetti
```

2. **Start dev server:**

```bash
npm start
```
