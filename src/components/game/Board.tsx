import { CalciteBlock, CalciteNotice } from "@esri/calcite-components-react";
import { calculateWinner } from "lib/game/logic";
import { Squares } from "lib/game/types";
import Square from "./Square";

interface BoardProps {
  boardSize: number;
  xIsNext: boolean;
  squares: Squares;
  onPlay: (nextSquares: Squares) => void;
}

export default function Board({
  boardSize,
  xIsNext,
  squares,
  onPlay,
}: BoardProps) {
  const { winner, winningLine } = calculateWinner(squares);
  const winningSquares = new Set(winningLine);

  const isDraw = !winner && squares.every(Boolean);

  const status = winner
    ? "Winner: " + winner
    : isDraw
      ? "Draw!"
      : "Next Player: " + (xIsNext ? "X" : "O");

  const rows = [];
  for (let i = 0; i < boardSize; i++) {
    const row = [];
    for (let j = 0; j < boardSize; j++) {
      const squareIndex = i * boardSize + j;
      row.push(
        <Square
          key={squareIndex}
          value={squares[squareIndex]}
          isWinning={winningSquares.has(squareIndex)}
          disabled={Boolean(winner) || isDraw}
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

  const handleClick = (i: number) => {
    if (squares[i] || winner) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  };

  return (
    <>
      <CalciteBlock heading="Status" expanded>
        <CalciteNotice
          open
          kind={winner ? "success" : isDraw ? "warning" : "info"}
          width="full"
        >
          <div slot="message">{status}</div>
        </CalciteNotice>
      </CalciteBlock>
      <CalciteBlock heading="Board" expanded>
        {rows}
      </CalciteBlock>
    </>
  );
}
