import { Squares } from "lib/game/types";

interface BoardSnapshotProps {
  boardSize: number;
  squares: Squares;
}

export default function BoardSnapshot({
  boardSize,
  squares,
}: BoardSnapshotProps) {
  return (
    <div
      className="print-board"
      role="grid"
      aria-rowcount={boardSize}
      aria-colcount={boardSize}
    >
      {Array.from({ length: boardSize }, (_, row) => (
        <div key={row} className="print-board-row" role="row">
          {Array.from({ length: boardSize }, (_, col) => {
            const index = row * boardSize + col;
            return (
              <div key={index} className="print-board-cell" role="gridcell">
                {squares[index] ?? ""}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
