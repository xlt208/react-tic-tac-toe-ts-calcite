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
