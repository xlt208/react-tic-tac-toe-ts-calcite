import {
  CalciteBlock,
  CalciteList,
  CalciteListItem,
  CalcitePanel,
  CalciteSegmentedControl,
  CalciteSegmentedControlItem,
} from "@esri/calcite-components-react";
import { BoardHistory } from "lib/game/types";
import { useState } from "react";

interface GameInfoProps {
  movesHistory: BoardHistory;
  boardSize: number;
  currentMove: number;
  onSelectMove: (move: number) => void;
}

type SortOrder = "new-to-old" | "old-to-new";

export default function GameInfo({
  movesHistory,
  boardSize,
  currentMove,
  onSelectMove,
}: GameInfoProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("new-to-old");
  const movesWithIndex = movesHistory.map((board, index) => ({
    board,
    index,
  }));

  const orderedMoves =
    sortOrder === "new-to-old" ? [...movesWithIndex].reverse() : movesWithIndex;

  const moves = orderedMoves.map(({ board, index }) => {
    let label = "Game start";

    if (index > 0) {
      const prevBoard = movesHistory[index - 1];
      const changedIndex = board.findIndex(
        (value, idx) => value !== prevBoard[idx] && value !== null,
      );

      if (changedIndex !== -1) {
        const row = Math.floor(changedIndex / boardSize) + 1;
        const col = (changedIndex % boardSize) + 1;
        label = `Move #${index} - row: ${row}, col: ${col}`;
      }
    }

    const description = index
      ? index === currentMove
        ? "You are here"
        : "Go to this move"
      : "Go to game start";

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

  const handleSortChange = (event: Event) => {
    const target = event.target as HTMLCalciteSegmentedControlElement | null;
    const value = target?.value;
    if (value !== "new-to-old" && value !== "old-to-new") return;
    setSortOrder(value);
  };

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
          >
            Newest move first
          </CalciteSegmentedControlItem>
          <CalciteSegmentedControlItem
            value="old-to-new"
            checked={sortOrder === "old-to-new"}
          >
            Oldest move first
          </CalciteSegmentedControlItem>
        </CalciteSegmentedControl>
      </CalciteBlock>
      <CalciteList>{moves}</CalciteList>
    </CalcitePanel>
  );
}
