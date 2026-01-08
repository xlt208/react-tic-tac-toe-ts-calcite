import {
  CalciteBlock,
  CalciteButton,
  CalciteList,
  CalciteListItem,
  CalcitePanel,
  CalciteSegmentedControl,
  CalciteSegmentedControlItem,
} from "@esri/calcite-components-react";
import { BoardHistory } from "lib/game/types";
import { useCallback, useState } from "react";

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

const buildPrintableMarkup = (moves: FormattedMove[]) => {
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
            table { width: 100%; border-collapse: collapse; border: 1px solid #e5e5ea; border-radius: 12px; overflow: hidden; }
            thead { background: #f5f5f7; }
            th, td { padding: 0.75rem 1rem; border-bottom: 1px solid #e5e5ea; text-align: left; font-size: 0.95rem; }
            th[scope="row"] { font-weight: 600; }
            tr:last-child td { border-bottom: none; }
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

  const moveDetails = formatMoves(movesHistory, boardSize, currentMove);
  const orderedMoves =
    sortOrder === "new-to-old" ? [...moveDetails].reverse() : moveDetails;

  const moves = orderedMoves.map(({ index, player, row, col, description }) => {
    const label =
      index === 0
        ? "Game start"
        : `Move #${index}: ${player} - row ${row}, col ${col}`;
    return (
      <CalciteListItem
        key={index}
        label={label}
        description={description}
        selected={index === currentMove}
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

  const handlePrint = useCallback(() => {
    if (typeof window === "undefined") return;
    const popup = window.open("", "_blank");
    if (!popup) {
      console.error("Popup blocked.");
      return;
    }
    const markup = buildPrintableMarkup(orderedMoves);
    openPrintDialog(popup, markup).catch(console.error);
  }, [orderedMoves]);

  return (
    <CalcitePanel heading="Game Info">
      <CalciteBlock heading="Sort by" collapsible expanded={false} scale="s">
        <CalciteSegmentedControl
          appearance="outline-fill"
          layout="horizontal"
          scale="m"
          width="full"
          onCalciteSegmentedControlChange={handleSortChange}
        >
          <CalciteSegmentedControlItem
            value="new-to-old"
            checked={sortOrder === "new-to-old"}
            iconStart="clock-down"
          >
            Newest move first
          </CalciteSegmentedControlItem>
          <CalciteSegmentedControlItem
            value="old-to-new"
            checked={sortOrder === "old-to-new"}
            iconStart="clock-up"
          >
            Oldest move first
          </CalciteSegmentedControlItem>
        </CalciteSegmentedControl>
      </CalciteBlock>
      <CalciteList>{moves}</CalciteList>
      <CalciteButton
        appearance="outline-fill"
        disabled={currentMove === 0}
        iconStart="print"
        onClick={handlePrint}
      >
        Print move history
      </CalciteButton>
    </CalcitePanel>
  );
}
