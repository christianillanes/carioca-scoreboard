# Carioca Scoreboard

A Progressive Web App (PWA) for tracking scores in the Chilean card game Carioca. Built with React, TypeScript, and Vite.

![Carioca Scoreboard](public/pwa-512x512.png)

## About Carioca

Carioca is a popular rummy-style card game played in Chile and other South American countries. This app helps you keep track of scores across 8 rounds with automatic validation and ranking.

### Game Rules

**Setup:**
- 2 decks + 4 jokers (108 cards total)
- 2-6 players
- Each player receives 12 cards per round

**8 Rounds:**
1. 2 trios
2. 1 trio + 1 escala (run)
3. 2 escalas
4. 3 trios
5. 2 trios + 1 escala
6. 1 trio + 2 escalas
7. 4 trios
8. 3 escalas

**Scoring (Penalty Points):**
- Jokers: 30 points
- Aces: 15 points
- 8-K: 10 points each
- 2-7: 5 points each

**Winner:** Lowest total score after 8 rounds wins!

## Features

- ✅ **Player Management** - Add/remove up to 6 players
- ✅ **Winner Selection** - Star icon toggle for each round
- ✅ **Score Validation** - Ensures multiples of 5 and exactly one winner per round
- ✅ **Round Navigation** - Navigate between rounds with validation
- ✅ **Live Rankings** - See current standings with shared ranks for ties
- ✅ **Auto-save** - All data persists in browser localStorage
- ✅ **Mobile Responsive** - Works great on phones and tablets
- ✅ **PWA Support** - Install as an app on your device
- ✅ **Mid-game Join** - Players can join mid-game with fair penalty scores

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn)
- A modern web browser

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd carioca-scoreboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## Development

### Project Structure

```
src/
├── App.tsx                    # Root component
├── CariocaScoreboard.tsx      # Main scoreboard component
├── CariocaScoreboard.css      # Scoreboard styles
├── main.tsx                   # Entry point
└── PWABadge.tsx              # PWA install prompt

.amazonq/
└── prompts/
    └── carioca-scoreboard-context.md  # AI assistant context
```

### Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production (TypeScript + Vite)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run clean` - Remove build artifacts

### Tech Stack

- **React 19.2.0** - UI framework
- **TypeScript 5.9.3** - Type safety
- **Vite 7.1.9** - Build tool and dev server
- **vite-plugin-pwa** - Progressive Web App support
- **ESLint** - Code linting

## Working with Amazon Q Developer

This project includes a context file for Amazon Q Developer to help you continue development seamlessly.

### Using the Context Prompt

When chatting with Amazon Q Developer in your IDE:

1. Type `@carioca-scoreboard-context` in the chat
2. Amazon Q will load the full project context including:
   - Game rules and scoring
   - Current implementation details
   - Data structures and behaviors
   - Tech stack information

### Example Usage

```
@carioca-scoreboard-context Can you add a dark mode feature?
```

```
@carioca-scoreboard-context How can I export game data to JSON?
```

This ensures Amazon Q has all the necessary context about the project without you having to re-explain everything each time!

## How to Use the App

1. **Add Players** - Enter player names (2-6 players)
2. **Select Winner** - Click the ⭐ star icon for the round winner
3. **Enter Scores** - Input penalty points for non-winners (multiples of 5)
4. **Navigate Rounds** - Use ← → buttons to move between rounds
5. **Track Rankings** - See live rankings in the "Rank" column
6. **Complete Game** - Play all 8 rounds, lowest score wins!

### Key Behaviors

- Only the current round is editable
- Past rounds are locked to prevent accidental changes
- You must select a winner and enter all scores before advancing
- Players joining mid-game automatically receive the highest score from completed rounds
- Scores are automatically saved to your browser

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Future Enhancements

- Export/import game data
- Game history tracking
- Multiple simultaneous games
- Dark mode
- Sound effects
- Undo/redo functionality
- Player statistics across games

---

Made with ❤️ for Carioca players everywhere!
