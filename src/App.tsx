import { useState } from "react";

type Player = "X" | "O" | null;

interface SquareProps {
  value: Player;
  onSquareClick: () => void;
}

function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares: Player[]): Player {
  const sideLength = Math.sqrt(squares.length);

  const lines: number[][] = [];

  for (let row = 0; row < sideLength; row++) {
    lines.push(
      Array.from({ length: sideLength }, (_, c) => row * sideLength + c)
    );
  }
  for (let col = 0; col < sideLength; col++) {
    lines.push(
      Array.from({ length: sideLength }, (_, r) => r * sideLength + col)
    );
  }
  lines.push(Array.from({ length: sideLength }, (_, i) => i * sideLength + i));
  lines.push(
    Array.from({ length: sideLength }, (_, i) => (i + 1) * sideLength - (i + 1))
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
  sideLength?: number;
  xIsNext: boolean;
  squares: Player[];
  onPlay: (nextSquares: Player[]) => void;
}

function Board({ sideLength = 3, xIsNext, squares, onPlay }: BoardProps) {
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
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const rows = [];
  for (let i = 0; i < sideLength; i++) {
    const row = [];
    for (let j = 0; j < sideLength; j++) {
      row.push(
        <Square
          key={i * sideLength + j}
          value={squares[i * sideLength + j]}
          onSquareClick={() => handleClick(i * sideLength + j)}
        />
      );
    }
    rows.push(
      <div key={i} className="board-row">
        {row}
      </div>
    );
  }
  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game({ sideLength = 4 }) {
  const [history, setHistory] = useState<Player[][]>([
    Array(sideLength * sideLength).fill(null),
  ]);
  const [currentMove, setCurrentMove] = useState(0);
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
    const description = move ? "Go to move #" + move : "Go to game start";
    if (move === currentMove) {
      return <li key={move}>You are at move #{move}</li>;
    } else {
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    }
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          sideLength={sideLength}
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
