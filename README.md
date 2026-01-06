# React Tic-Tac-Toe TS Calcite

A personal learning project built with **React**, **TypeScript**, and the **Calcite Design System**.

This project is based on [the React Tic-Tac-Toe tutorial](https://react.dev/learn/tutorial-tic-tac-toe) and extended with additional improvements to reinforce my understanding of React fundamentals and TypeScript usage in a real project.

## Enhancements Beyond the Tutorial

In addition to [completing the tutorial](https://react.dev/learn/tutorial-tic-tac-toe#wrapping-up), I made the following enhancements:

- Migrated the project from JavaScript to TypeScript and made the codebase fully TypeScript-compliant for improved type safety and maintainability.
- Replaced native HTML elements with [Calcite Design System](https://developers.arcgis.com/calcite-design-system/) components for improved consistency and accessibility.
- Added a restart flow that lets players spin up a new game with any board size from 3 to 10, not just the original 3×3.
- Added a segmented toggle so players can switch the move list between ascending and descending order.
- Added a “Draw!” status and highlighted winning squares so the result of each game is immediately clear. Disabled the board once a game ends so finished matches can’t be altered.



## Live Demo

- https://react-tic-tac-toe-ts-calcite.vercel.app/ *(update the deployment alias after renaming the repo)*

## Running Locally

```bash
npm install
npm run dev
```

Then open:

- http://localhost:3000
