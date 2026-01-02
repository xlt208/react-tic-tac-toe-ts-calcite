import { CalciteList, CalciteListItem } from "@esri/calcite-components-react";
import { BoardHistory } from "lib/game/types";
interface GameInfoProps {
  movesHistory: BoardHistory;
  currentMove: number;
  onSelectMove: (move: number) => void;
}

export default function GameInfo({
  movesHistory,
  currentMove,
  onSelectMove,
}: GameInfoProps) {
  const moves = movesHistory.map((_, move) => {
    const label = move ? `Move ${move}` : "Game start";
    const description = move
      ? move === currentMove
        ? "You are here"
        : `Go to move # ${move}`
      : "Go to game start";
    return (
      <CalciteListItem
        key={move}
        label={label}
        description={description}
        selected={move === currentMove}
        onClick={move === currentMove ? undefined : () => onSelectMove(move)}
      />
    );
  });
  return <CalciteList>{moves}</CalciteList>;
}
