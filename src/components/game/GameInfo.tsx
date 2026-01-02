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
  currentMove: number;
  onSelectMove: (move: number) => void;
}

type SortOrder = "new-to-old" | "old-to-new";

export default function GameInfo({
  movesHistory,
  currentMove,
  onSelectMove,
}: GameInfoProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("new-to-old");
  const movesWithNumbers = movesHistory.map((_, index) => index);

  const orderedMoves =
    sortOrder === "new-to-old"
      ? [...movesWithNumbers].reverse()
      : movesWithNumbers;

  const moves = orderedMoves.map((moveNumber) => {
    const label = moveNumber ? `Move ${moveNumber}` : "Game start";

    const description = moveNumber
      ? moveNumber === currentMove
        ? "You are here"
        : `Go to move # ${moveNumber}`
      : "Go to game start";

    return (
      <CalciteListItem
        key={moveNumber}
        label={label}
        description={description}
        selected={moveNumber === currentMove}
        onClick={
          moveNumber === currentMove
            ? undefined
            : () => onSelectMove(moveNumber)
        }
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
