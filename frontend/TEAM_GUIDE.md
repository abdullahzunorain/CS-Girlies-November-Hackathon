# 🎮 Y2K Study RPG - Team Coordination Guide

## 📦 Project Setup Complete! ✅

The React app structure is ready. Everyone should:

```bash
git clone <your-repo>
cd frontend
npm install
npm start
```

## 👥 Team Member Assignments & Files

### Person 1 (RAG Expert) - Flashcard Generation

**Your Files:**

- Backend: Create API endpoint for flashcard generation
- Endpoint: `POST /api/flashcards/generate`
- Input: `{ topic: string, count: number }`
- Output: `[{ question: string, answer: string }]`

**Integration Point:**
Person 4 will call your API from `src/services/api.js` (already templated)

---

### Person 2 (RAG Expert) - XP System & Progression

**Your Files:**

- Backend: Create XP tracking system
- Endpoints needed:
  - `POST /api/xp/award` - Award XP
  - `GET /api/progress` - Get current level & XP
  - `GET /api/level/check` - Check if leveled up

**Data Structure:**

```javascript
{
  currentXP: 350,
  currentLevel: 3,
  xpToNextLevel: 150,
  totalXP: 350,
  leveledUp: boolean,
  unlockedFeature: { icon, name, description }
}
```

**Integration Point:**
Person 4 will call your APIs from `src/services/api.js`

---

### Person 3 (Frontend) - Character System & Y2K UI

**Your Folders:**

- `src/components/character/` - Character selector, avatar display
- `src/components/shared/` - Reusable UI components
- `src/styles/` - Global Y2K theme

**Your Tasks:**

1. Create character selection screen
2. Build avatar component that shows during study
3. Design cosmetic unlock system (outfits, accessories)
4. Apply Y2K theme everywhere (already started in Person 4's CSS)

**Components Needed:**

```javascript
// CharacterSelect.jsx
<CharacterSelect onSelect={(character) => {...}} />

// CharacterAvatar.jsx
<CharacterAvatar character={...} level={3} />

// SharedButton.jsx (Y2K styled button)
<Button variant="primary" onClick={...}>Click Me!</Button>
```

**Integration Point:**
Person 4's components already use Y2K colors. Coordinate on:

- Final color palette
- Font choices
- Animation styles

---

### Person 4 (Frontend) - Flashcard & Study Flow ⭐ YOU

**Your Folders:** (ALREADY BUILT!)

- `src/components/flashcards/` ✅
- `src/components/study/` ✅
- `src/components/levelup/` ✅
- `src/pages/TestStudyPage.jsx` ✅

**Your Status:**
✅ Flashcard component with flip animation
✅ StudySession with timer, progress, XP
✅ LevelUp celebration screen
✅ Test page with mock data

**Your Next Steps:**

1. Test everything works (run `npm start`)
2. Enhance animations (Saturday morning)
3. Integrate with Person 1 & 2's APIs (Saturday afternoon)

---

### Person 5 (All-Rounder) - Integration & Documentation

**Your Tasks:**

**Day 1-2 (Friday-Saturday):**

1. Wire up `src/services/api.js` to real backend endpoints
2. Create `src/pages/` for main app flow:
   - HomePage.jsx (landing page)
   - CharacterSelect.jsx (uses Person 3's component)
   - StudySession.jsx (uses Person 4's components)
   - Dashboard.jsx (show progress, stats)
3. Help debug integration issues

**Day 2-3 (Saturday-Sunday):** 4. Write GitBook documentation ($500 prize!) 5. Script and record demo video 6. Write DevPost submission 7. Final testing & bug fixes

**Key Files to Create:**

```
src/pages/
├── HomePage.jsx        ← Landing page with "Start Studying" button
├── Dashboard.jsx       ← User stats, level, XP progress
└── App.jsx updates     ← Wire all pages together with routing
```

---

## 🔄 How Components Connect

```
User Flow:
1. HomePage → Click "Start Studying"
2. CharacterSelect (Person 3) → Pick character
3. TopicInput → Enter study topic
4. StudySession (Person 4) → Study with flashcards
   ↓ Uses Person 1's API for flashcards
   ↓ Uses Person 2's API for XP tracking
5. LevelUp (Person 4) → Celebration if leveled up
6. Dashboard → See progress, stats
```

## 🎯 Friday Night Milestones (TONIGHT)

**Person 1:** ✅ Can generate flashcards via API call
**Person 2:** ✅ XP award endpoint works
**Person 3:** ✅ Character selection screen exists
**Person 4:** ✅ Can flip through flashcards (DONE!)
**Person 5:** ✅ GitHub repo setup, basic page routing

## 🎯 Saturday Night Milestones

**Complete Integration:**

- User picks character → enters topic → gets flashcards → earns XP → levels up
- Everything connected end-to-end
- Y2K styling applied throughout
- At least 3-5 levels with unlocks working

## 📞 Communication

**Discord/Slack Channels:**

- `#frontend` - Person 3, 4, 5
- `#backend` - Person 1, 2, 5
- `#general` - Everyone

**Status Updates (Every 3-4 hours):**
Post in your channel:

- "✅ Just finished: [X]"
- "🚧 Working on: [Y]"
- "🆘 Blocked on: [Z]"

## 🐛 Common Integration Issues

### Issue: Frontend can't reach backend

**Solution:** Check CORS settings, ensure backend running on expected port

### Issue: Data format mismatch

**Solution:** Check `src/services/api.js` - Person 5 adjusts to match backend

### Issue: Components not getting props

**Solution:** Console.log props in each component to debug data flow

## 📚 File Structure Summary

```
frontend/
├── src/
│   ├── components/
│   │   ├── character/     ← Person 3
│   │   ├── flashcards/    ← Person 4
│   │   ├── study/         ← Person 4
│   │   ├── levelup/       ← Person 4
│   │   └── shared/        ← Person 3
│   ├── pages/             ← Person 5
│   ├── services/
│   │   └── api.js         ← Person 5 fills in endpoints
│   ├── hooks/             ← Custom hooks as needed
│   └── styles/            ← Person 3's Y2K theme
├── public/
└── [Backend code]         ← Person 1 & 2
└── [Docs]         ← Person 5
```

## 🎬 Demo Video Shots (Plan Sunday Morning)

1. Landing page with Y2K aesthetic (3 sec)
2. Character selection (5 sec)
3. Enter study topic "Biology" (3 sec)
4. Flip through flashcards with smooth animation (15 sec)
5. See XP accumulate and progress bar fill (10 sec)
6. LEVEL UP celebration screen! (8 sec) ⭐
7. Show unlocked feature (5 sec)
8. Quick dashboard view showing progress (5 sec)

Total: 54 seconds (perfect for 1-min video)

## ✨ Polish Ideas (If Time)

- Sound effects on card flip, level up
- Confetti on level up (library already installed!)
- Animated character reactions
- Study streak counter
- Leaderboard (if multi-user)

---

## 🚨 Remember

- **Commit often** to git
- **Test on the target device** (desktop vs mobile)
- **Keep it simple** - MVP first, polish later
- **Help each other** - we're a team!

Good luck team! Let's win this! 🏆✨

---

Last updated: Friday night
Next team sync: Saturday 12pm
