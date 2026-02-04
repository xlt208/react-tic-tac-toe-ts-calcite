import { BoardHistory } from "lib/game/types";
import { useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import BoardSnapshot from "../print/BoardSnapshot";

interface GameInfoProps {
  movesHistory: BoardHistory;
  boardSize: number;
  currentMove: number;
  onSelectMove: (move: number) => void;
}

type SortOrder = "new-to-old" | "old-to-new";

type FormattedMove = {
  index: number;
  player: "X" | "O" | null;
  row: number | null;
  col: number | null;
  description: string;
};

const formatMoves = (
  movesHistory: BoardHistory,
  boardSize: number,
  currentMove: number,
): FormattedMove[] => {
  return movesHistory.map((board, index) => {
    if (index === 0) {
      return {
        index: 0,
        player: null,
        row: null,
        col: null,
        description: "Go to game start",
      };
    }

    const prevBoard = movesHistory[index - 1];
    const changedIndex = board.findIndex(
      (value, idx) => value !== prevBoard[idx] && value !== null,
    );
    if (changedIndex === -1) {
      return {
        index: index,
        player: null,
        row: null,
        col: null,
        description: "Unknown move",
      };
    }

    const row = Math.floor(changedIndex / boardSize) + 1;
    const col = (changedIndex % boardSize) + 1;
    const player = index % 2 === 1 ? "X" : "O";
    return {
      index,
      player,
      row,
      col,
      description: index === currentMove ? "You are here" : "Go to this move",
    };
  });
};

const buildPrintableMarkup = (
  moves: FormattedMove[],
  options: {
    includeFinalSnapshot: boolean;
    finalBoard: BoardHistory[number];
    boardSize: number;
  },
) => {
  const timestamp = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  const rows = moves
    .filter((move) => move.index > 0)
    .sort((a, b) => a.index - b.index)
    .map((move) => {
      return `
        <tr>
          <th scope="row">${move.index}</th>
          <td>${move.player}</td>
          <td>(${move.row}, ${move.col})</td>
        </tr>`;
    })
    .join("");

  const snapshotMarkup = options.includeFinalSnapshot
    ? renderToStaticMarkup(
        <section className="snapshot">
          <h2>Final Board Snapshot</h2>
          <BoardSnapshot
            boardSize={options.boardSize}
            squares={options.finalBoard}
          />
        </section>,
      )
    : "";

  return `
    <!doctype html>
    <html>
      <head>
          <meta charset="utf-8" />
          <title>Tic-Tac-Toe Moves</title>
          <style>
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
            }            thead { background: #f5f5f7; }
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

          </style>
      </head>
      <body>
          <header>
            <h1>Move History</h1>
            <p>Printed ${timestamp}</p>
          </header>
          <table>
            <thead>
                <tr>
                  <th scope="col">Move</th>
                  <th scope="col">Player</th>
                  <th scope="col">Position (row, col)</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          ${snapshotMarkup}
      </body>
    </html>`;
};

const openPrintDialog = (popup: Window, content: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      popup.document.open();
      popup.document.writeln(content);
      popup.document.close();

      popup.focus();
      popup.print();

      popup.addEventListener("afterprint", () => {
        popup.close();
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default function GameInfo({
  movesHistory,
  boardSize,
  currentMove,
  onSelectMove,
}: GameInfoProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("new-to-old");
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [includeFinalSnapshot, setIncludeFinalSnapshot] = useState(true);

  const moveDetails = formatMoves(movesHistory, boardSize, currentMove);
  const orderedMoves =
    sortOrder === "new-to-old" ? [...moveDetails].reverse() : moveDetails;

  const moves = orderedMoves.map(({ index, player, row, col, description }) => {
    const label =
      index === 0
        ? "Game start"
        : `Move #${index}: ${player} - row ${row}, col ${col}`;
    return (
      <calcite-list-item
        key={index}
        label={label}
        description={description}
        selected={index === currentMove}
        aria-current={index === currentMove ? "true" : undefined}
        onClick={index === currentMove ? undefined : () => onSelectMove(index)}
      />
    );
  });

  const handleSortChange = (e: Event) => {
    const target = e.target as HTMLCalciteSegmentedControlElement | null;
    const value = target?.value;
    if (value !== "new-to-old" && value !== "old-to-new") return;
    setSortOrder(value);
  };

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    const popup = window.open("", "_blank");
    if (!popup) {
      console.error("Popup blocked.");
      return;
    }

    const markup = buildPrintableMarkup(orderedMoves, {
      includeFinalSnapshot,
      finalBoard: movesHistory[movesHistory.length - 1],
      boardSize,
    });

    openPrintDialog(popup, markup).catch(console.error);
  };

  return (
    <calcite-panel heading="Game Info">
      <calcite-block
        collapsible
        expanded={false}
        heading="Sort by"
        iconStart="arrow-up-down"
        label="Sort move history"
      >
        <calcite-segmented-control
          aria-label="Sorting options"
          appearance="outline-fill"
          layout="horizontal"
          scale="m"
          width="full"
          oncalciteSegmentedControlChange={handleSortChange}
        >
          <calcite-segmented-control-item
            value="new-to-old"
            checked={sortOrder === "new-to-old"}
            iconStart="clock-down"
          >
            Newest move first
          </calcite-segmented-control-item>
          <calcite-segmented-control-item
            value="old-to-new"
            checked={sortOrder === "old-to-new"}
            iconStart="clock-up"
          >
            Oldest move first
          </calcite-segmented-control-item>
        </calcite-segmented-control>
      </calcite-block>
      <calcite-list label="Move history">{moves}</calcite-list>

      <calcite-dialog
        id="print-move-history"
        heading="Print move history"
        modal
        open={isPrintDialogOpen}
        outsideCloseDisabled
        oncalciteDialogClose={() => setIsPrintDialogOpen(false)}
      >
        <calcite-label>
          <calcite-checkbox
            checked={includeFinalSnapshot}
            label="Include final board snapshot"
            labelText="Include final board snapshot"
            oncalciteCheckboxChange={(e) => {
              const target = e.target;
              setIncludeFinalSnapshot(target.checked);
            }}
          />
        </calcite-label>
        <calcite-button onClick={handlePrint}>Print</calcite-button>
      </calcite-dialog>

      <calcite-button
        appearance="outline-fill"
        disabled={movesHistory.length <= 1}
        iconStart="print"
        onClick={() => setIsPrintDialogOpen(true)}
      >
        Print move history
      </calcite-button>
    </calcite-panel>
  );
}
