import { BoardHistory, Squares } from "lib/game/types";
import { useEffect, useState } from "react";
import { Board, GameInfo, RestartControls } from "./components/game";

const STORAGE_KEY = "ttt-game";

const emptyBoard = (size: number) => Array(size * size).fill(null);

const loadGame = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      boardSize: number;
      history: Squares[];
      currentMove: number;
    };
    const sizeIsValid =
      Number.isInteger(parsed.boardSize) && parsed.boardSize >= 3;
    const historyIsValid =
      Array.isArray(parsed.history) &&
      parsed.history.every(
        (squares) =>
          Array.isArray(squares) && squares.length === parsed.boardSize ** 2,
      );
    const moveIsValid =
      Number.isInteger(parsed.currentMove) &&
      parsed.currentMove >= 0 &&
      parsed.currentMove < parsed.history.length;
    return sizeIsValid && historyIsValid && moveIsValid ? parsed : null;
  } catch {
    return null;
  }
};

export default function Game() {
  const hydrated = loadGame();

  const [boardSize, setBoardSize] = useState(() => hydrated?.boardSize ?? 4);
  const [history, setHistory] = useState<BoardHistory>(
    () => hydrated?.history ?? [emptyBoard(hydrated?.boardSize ?? 4)],
  );
  const [currentMove, setCurrentMove] = useState(
    () => hydrated?.currentMove ?? 0,
  );

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  useEffect(() => {
    const payload = { boardSize, history, currentMove };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [boardSize, history, currentMove]);

  const handlePlay = (nextSquares: Squares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  const onRestart = (newBoardSize: number) => {
    setBoardSize(newBoardSize);
    const resetBoard = emptyBoard(newBoardSize);
    setHistory([resetBoard]);
    setCurrentMove(0);
  };

  return (
    <calcite-shell>
      <calcite-navigation slot="header">
        <calcite-navigation-logo
          heading="Tic-Tac-Toe Game"
          heading-level="1"
          slot="logo"
        />
      </calcite-navigation>

      <calcite-shell-panel
        width="l"
        slot="panel-start"
        position="start"
        displayMode="float-all"
        resizable
      >
        <calcite-panel heading="Game Board">
          <Board
            boardSize={boardSize}
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
          />
          <RestartControls boardSize={boardSize} onRestart={onRestart} />
        </calcite-panel>
      </calcite-shell-panel>

      <calcite-shell-panel width="l" displayMode="float-all">
        <GameInfo
          movesHistory={history}
          boardSize={boardSize}
          currentMove={currentMove}
          onSelectMove={setCurrentMove}
        />
      </calcite-shell-panel>
    </calcite-shell>
  );
}
