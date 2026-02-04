import { BoardHistory } from "lib/game/types";
import { useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import PrintMoveHistoryDocument from "../print/PrintMoveHistoryDocument";
import { FormattedMove } from "./types";

interface GameInfoProps {
  movesHistory: BoardHistory;
  boardSize: number;
  currentMove: number;
  onSelectMove: (move: number) => void;
}

type SortOrder = "new-to-old" | "old-to-new";

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

    const timestamp = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());

    const html =
      "<!doctype html>" +
      renderToStaticMarkup(
        <PrintMoveHistoryDocument
          moves={orderedMoves}
          timestamp={timestamp}
          includeFinalSnapshot={includeFinalSnapshot}
          finalBoard={movesHistory[movesHistory.length - 1]}
          boardSize={boardSize}
        />,
      );

    openPrintDialog(popup, html).catch(console.error);
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
