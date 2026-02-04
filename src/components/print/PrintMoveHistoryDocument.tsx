import { Squares } from "lib/game/types";
import { FormattedMove } from "../game/types";
import BoardSnapshot from "./BoardSnapshot";

type PrintMoveHistoryDocumentProps = {
  moves: FormattedMove[];
  timestamp: string;
  includeFinalSnapshot: boolean;
  finalBoard: Squares;
  boardSize: number;
};

const printStyles = `
    body {
    font-family: "Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    margin: 24px;
    color: #1d1d1f;
    background: #fdfdfd;
    }
    header { margin-bottom: 24px; }
    header h1 { font-size: 1.8rem; margin: 0 0 4px; }
    header p { margin: 0; font-size: 0.9rem; color: #6e6e73; }
    table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #e5e5ea;
    }            
    thead { background: #f5f5f7; }
    th, td { padding: 0.75rem 1rem; border-bottom: 1px solid #e5e5ea; text-align: left; font-size: 0.95rem; }
    th[scope="row"] { font-weight: 600; }
    tr:last-child th, tr:last-child td { border-bottom: none; }
    .snapshot {
        margin-top: 24px;
        break-inside: avoid;
    }
    .snapshot h2 {
        margin: 0 0 12px;
        font-size: 1.1rem;
    }
    .print-board {
        display: inline-block;
        border: 2px solid #c7c7c7;
        border-right: 0;
        border-bottom: 0;
        background: #fff;
    }
    .print-board-row {
        display: flex;
    }
    .print-board-cell {
        width: 40px;
        height: 40px;
        border-right: 2px solid #c7c7c7;
        border-bottom: 2px solid #c7c7c7;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 1rem;
        line-height: 1;
    }
    @media print { .snapshot { page-break-inside: avoid; } .print-board { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
`;

export default function PrintMoveHistoryDocument({
  moves,
  timestamp,
  includeFinalSnapshot,
  finalBoard,
  boardSize,
}: PrintMoveHistoryDocumentProps) {
  const rows = moves
    .filter((move) => move.index > 0)
    .sort((a, b) => a.index - b.index);

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>Tic-Tac-Toe Moves</title>
        <style>{printStyles}</style>
      </head>
      <body>
        <header>
          <h1>Move History</h1>
          <p>Printed {timestamp}</p>
        </header>
        <table>
          <thead>
            <tr>
              <th scope="col">Move</th>
              <th scope="col">Player</th>
              <th scope="col">Position (row, col)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((move) => (
              <tr key={move.index}>
                <th scope="row">{move.index}</th>
                <td>{move.player}</td>
                <td>
                  ({move.row}, {move.col})
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {includeFinalSnapshot ? (
          <section className="snapshot">
            <h2>Final Board Snapshot</h2>
            <BoardSnapshot boardSize={boardSize} squares={finalBoard} />
          </section>
        ) : null}
      </body>
    </html>
  );
}
