# Ghostly Wordle Party - Frontend

Overview
- React 18, Create React App template
- Ocean Professional theme (blue & amber accents)
- Authentication: login, register, logout, forgot/reset password
- Gameplay: 5-letter word, 6 attempts grid, keyboard, results rendering
- Effects: disco lights & confetti on win, ghost overlay on loss
- Profile with stats and history, Leaderboard with multiple categories
- Robust REST integration with cookie-based auth (credentials: 'include')

Environment
- Configure API base via REACT_APP_API_BASE (default '/api').
- See .env.example for details.

Structure
- src/theme.js: Theme variables and CSS var injector
- src/services/api.js: Backend API wrapper
- src/context/AuthContext.js: Session state and auth helpers
- src/components/common/UI.js (+ ui.css): Shared layout and components
- src/components/game/*: Grid and Keyboard
- src/components/effects/*: Visual celebration and ghost overlay
- src/components/overlays/*: Onboarding and result overlay
- src/pages/*: Game, Profile, Leaderboard, Auth pages
- src/AppRouter.js: Routing and layout
- src/App.js: Root with AuthProvider

Notes
- Effects can be triggered by backend responses (is_won/ended_at) and also via /effects/trigger/ to remain consistent with backend state.
- Error handling shows friendly messages; for detailed errors, check error.payload in the console.
- Styling and animations aim to be light and performant without external heavy UI libs.
