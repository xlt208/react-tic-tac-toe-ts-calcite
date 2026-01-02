import {
  CalciteBlock,
  CalciteButton,
  CalciteInputNumber,
  CalciteList,
  CalciteListItem,
  CalciteNavigation,
  CalciteNavigationLogo,
  CalciteNotice,
  CalcitePanel,
  CalciteShell,
  CalciteShellPanel,
} from "@esri/calcite-components-react";
import { useRef, useState } from "react";

type Player = "X" | "O" | null;

interface SquareProps {
  value: Player;
  onSquareClick: () => void;
}

function Square({ value, onSquareClick }: SquareProps) {
  return (
    <div className="square-wrapper">
      <CalciteButton
        appearance="transparent"
        width="full"
        onClick={onSquareClick}
      >
        {value}
      </CalciteButton>
    </div>
  );
}

function calculateWinner(squares: Player[]): Player {
  const derivedBoardSize = Math.sqrt(squares.length);

  const lines: number[][] = [];

  for (let row = 0; row < derivedBoardSize; row++) {
    lines.push(
      Array.from(
        { length: derivedBoardSize },
        (_, c) => row * derivedBoardSize + c,
      ),
    );
  }
  for (let col = 0; col < derivedBoardSize; col++) {
    lines.push(
      Array.from(
        { length: derivedBoardSize },
        (_, r) => r * derivedBoardSize + col,
      ),
    );
  }
  lines.push(
    Array.from(
      { length: derivedBoardSize },
      (_, i) => i * derivedBoardSize + i,
    ),
  );
  lines.push(
    Array.from(
      { length: derivedBoardSize },
      (_, i) => (i + 1) * derivedBoardSize - (i + 1),
    ),
  );
  for (const line of lines) {
    const [first, ...rest] = line;
    if (
      squares[first] &&
      rest.every((idx) => squares[idx] === squares[first])
    ) {
      return squares[first];
    }
  }

  return null;
}

interface BoardProps {
  boardSize: number;
  xIsNext: boolean;
  squares: Player[];
  onPlay: (nextSquares: Player[]) => void;
}

function Board({ boardSize, xIsNext, squares, onPlay }: BoardProps) {
  function handleClick(i: number) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next Player: " + (xIsNext ? "X" : "O");
  }

  const rows = [];
  for (let i = 0; i < boardSize; i++) {
    const row = [];
    for (let j = 0; j < boardSize; j++) {
      const squareIndex = i * boardSize + j;
      row.push(
        <Square
          key={squareIndex}
          value={squares[squareIndex]}
          onSquareClick={() => handleClick(squareIndex)}
        />,
      );
    }
    rows.push(
      <div key={i} className="board-row">
        {row}
      </div>,
    );
  }
  return (
    <>
      <CalciteBlock heading="Status" expanded>
        <CalciteNotice open kind={winner ? "success" : "info"} width="full">
          <div slot="message">{status}</div>
        </CalciteNotice>
      </CalciteBlock>
      <CalciteBlock heading="Board" expanded>
        {rows}
      </CalciteBlock>
    </>
  );
}

export default function Game() {
  const [boardSize, setBoardSize] = useState(4);

  const [history, setHistory] = useState<Player[][]>([
    Array(boardSize * boardSize).fill(null),
  ]);
  const [currentMove, setCurrentMove] = useState(0);

  const pendingSizeRef = useRef<HTMLCalciteInputNumberElement>(null);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: Player[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move: number) {
    setCurrentMove(move);
  }

  const moves = history.map((_, move) => {
    const label = move ? `Move ${move}` : "Game start";
    const description = move
      ? move === currentMove
        ? "You are here"
        : `Go to move # ${move}`
      : "Go to game start";
    return (
      <CalciteListItem
        key={move}
        label={label}
        description={description}
        selected={move === currentMove}
        onClick={move === currentMove ? undefined : () => jumpTo(move)}
      />
    );
  });

  function onRestartGame(newBoardSize: number) {
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
        displayMode="float"
        resizable
      >
        <CalcitePanel heading="Game Board">
          <Board
            boardSize={boardSize}
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
          />

          <CalciteBlock
            className="restart-block"
            heading="Restart Game"
            collapsible
            expanded={false}
          >
            <CalciteInputNumber
              ref={pendingSizeRef}
              alignment="center"
              integer
              labelText="Board Size"
              max={10}
              min={3}
              numberButtonType="vertical"
              scale="m"
              value={boardSize.toString()}
            />

            <CalciteButton
              appearance="outline"
              kind="danger"
              round
              width="full"
              onClick={() =>
                onRestartGame(Number(pendingSizeRef.current?.value))
              }
            >
              Restart
            </CalciteButton>
          </CalciteBlock>
        </CalcitePanel>
      </CalciteShellPanel>
      <CalciteShellPanel
        slot="panel-start"
        position="start"
        display-mode="float"
        width="l"
      >
        <CalcitePanel heading="Game Info">
          <CalciteList>{moves}</CalciteList>
        </CalcitePanel>
      </CalciteShellPanel>
    </CalciteShell>
  );
}
