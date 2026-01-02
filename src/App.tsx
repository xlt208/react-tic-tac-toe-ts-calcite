import {
  CalciteNavigation,
  CalciteNavigationLogo,
  CalcitePanel,
  CalciteShell,
  CalciteShellPanel,
} from "@esri/calcite-components-react";
import { BoardHistory, Squares } from "lib/game/types";
import { useState } from "react";
import { Board, GameInfo, RestartControls } from "./components/game";

export default function Game() {
  const [boardSize, setBoardSize] = useState(4);
  const [history, setHistory] = useState<BoardHistory>([
    Array(boardSize * boardSize).fill(null),
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: Squares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function onRestart(newBoardSize: number) {
    setBoardSize(newBoardSize);
    setHistory([Array(newBoardSize * newBoardSize).fill(null)]);
    setCurrentMove(0);
  }

  return (
    <CalciteShell>
      <CalciteNavigation slot="header">
        <CalciteNavigationLogo
          heading="Tic-Tac-Toe Game"
          heading-level="1"
          slot="logo"
        />
      </CalciteNavigation>

      <CalciteShellPanel
        width="l"
        slot="panel-start"
        position="start"
        displayMode="float-all"
        resizable
      >
        <CalcitePanel heading="Game Board">
          <Board
            boardSize={boardSize}
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
          />
          <RestartControls boardSize={boardSize} onRestart={onRestart} />
        </CalcitePanel>
      </CalciteShellPanel>

      <CalciteShellPanel width="l" displayMode="float-all">
        <GameInfo
          movesHistory={history}
          boardSize={boardSize}
          currentMove={currentMove}
          onSelectMove={setCurrentMove}
        />
      </CalciteShellPanel>
    </CalciteShell>
  );
}
