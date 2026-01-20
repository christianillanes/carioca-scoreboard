# Carioca Scoreboard Project Context

## Project Overview
This is a Progressive Web App (PWA) for tracking scores in the Chilean card game Carioca. Built with React + TypeScript + Vite.

## Game Rules - Carioca (Chilean Version)

### Setup
- 2 decks + 4 jokers (108 cards total)
- 2-6 players
- Each player receives 12 cards per round

### 8 Rounds (Contracts)
1. **Round 1:** 2 trios
2. **Round 2:** 1 trio + 1 escala (run/sequence)
3. **Round 3:** 2 escalas
4. **Round 4:** 3 trios
5. **Round 5:** 2 trios + 1 escala
6. **Round 6:** 1 trio + 2 escalas
7. **Round 7:** 4 trios
8. **Round 8:** 3 escalas

### Scoring (Penalty Points)
- Jokers: 30 points
- Aces: 15 points
- 8, 9, 10, J, Q, K: 10 points each
- 2, 3, 4, 5, 6, 7: 5 points each

### Key Rules
- All scores must be multiples of 5
- Exactly one winner (0 points) per round
- Non-winners must have scores > 0
- Lowest total score after 8 rounds wins
- Players can join mid-game and receive the highest score from each completed round

## Current Implementation

### Features
- ✅ Player management (add/remove, 2-6 players)
- ✅ 8 rounds with correct contracts
- ✅ Star icon toggle for winner selection (radio button behavior per round)
- ✅ Score validation (multiples of 5, exactly one winner per round)
- ✅ Round navigation with validation (can't advance without complete scores)
- ✅ Current round is editable, past rounds are locked
- ✅ Automatic total calculation
- ✅ Ranking system (shared ranks for tied scores)
- ✅ LocalStorage persistence
- ✅ Mobile responsive design
- ✅ PWA support

### Data Structure
```typescript
interface Player {
  name: string
  scores: (number | null)[]  // null = not yet assigned, 0 = winner, >0 = penalty points
  winners: boolean[]          // true for round winner
}
```

### Key Components
- **CariocaScoreboard.tsx**: Main component with all game logic
- **CariocaScoreboard.css**: Responsive styling
- **App.tsx**: Root component

### Important Behaviors
1. **Winner Selection**: Click star icon to mark winner (auto-sets score to 0, unselects other stars)
2. **Score Entry**: Only editable in current round, disabled for winners and past rounds
3. **Round Advancement**: Validates winner exists and all non-winners have valid scores (>0)
4. **New Players**: Automatically assigned max score from each completed round
5. **Ranking**: Players with same total share the same rank

### Tech Stack
- React 19.2.0
- TypeScript 5.9.3
- Vite 7.1.9
- PWA with vite-plugin-pwa

### Development Commands
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Future Enhancement Ideas
- Export/import game data
- Game history tracking
- Multiple simultaneous games
- Dark mode
- Sound effects
- Undo/redo functionality
- Player statistics across games
