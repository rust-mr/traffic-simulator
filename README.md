# traffic-simulator

Browser game: manage traffic lights at a crossroad with cars and pedestrians.

## Stack

- TypeScript, React, Vite
- PixiJS for rendering the crossroad
- Zustand for state shared between the React UI and the game loop
- Vitest + Testing Library for tests
- ESLint + Prettier for code style

## Scripts

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start the dev server             |
| `npm run build`        | Type-check and build to `dist/`  |
| `npm run preview`      | Serve the production build       |
| `npm test`             | Run tests once                   |
| `npm run test:watch`   | Run tests in watch mode          |
| `npm run lint`         | Lint with ESLint                 |
| `npm run lint:fix`     | Lint and auto-fix                |
| `npm run format`       | Format all files with Prettier   |
| `npm run format:check` | Check formatting without writing |

## Project structure

```
src/
  simulation/  Pure TypeScript game logic (no React, no Pixi) - traffic lights, later cars and pedestrians
  render/      PixiJS drawing and layout geometry
  store/       Zustand store: settings from the UI, status from the simulation
  ui/          React components (control panel, Pixi canvas host)
  test/        Test setup
```

The game loop lives in `ui/GameCanvas.tsx`. It reads settings with `useGameStore.getState()` on every
frame, so React only re-renders when settings or reported status actually change.
