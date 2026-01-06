# React Tic-Tac-Toe TS Calcite

A personal learning project built with **React**, **TypeScript**, and the **Calcite Design System**.

This project is based on [the React Tic-Tac-Toe tutorial](https://react.dev/learn/tutorial-tic-tac-toe) and extended with additional improvements to reinforce my understanding of React fundamentals and TypeScript usage in a real project.

## Enhancements Beyond the Tutorial

In addition to [completing the tutorial](https://react.dev/learn/tutorial-tic-tac-toe#wrapping-up), I made the following enhancements.

### Architecture & Tooling
- **TypeScript-first** – The entire project is migrated from JavaScript for stricter typing and easier refactors.

### UI & Design System
- **Calcite components** – Native HTML controls were swapped for Calcite’s accessible, themed components.

### Gameplay & UX
- **Flexible restarts** – Start a fresh board anywhere from 3×3 up to 10×10.
- **Persistent sessions** – Board size, move history, and the current turn are synced to `localStorage`, so refreshes keep the current match.
- **Move ordering toggle** – Switch the history list between ascending and descending order.
- **End-state clarity** – “Draw!” state, highlighted winning lines, and auto-disabled boards make results obvious.


## Live Demo

- https://react-tic-tac-toe-ts-calcite.vercel.app/

## Running Locally

```bash
npm install
npm run dev
```

Then open:

- http://localhost:3000
