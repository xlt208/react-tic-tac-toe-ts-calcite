
import { Player, Squares } from "./types";

export function calculateWinner(squares: Squares): Player {
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