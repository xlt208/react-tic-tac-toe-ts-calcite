import { Player } from "lib/game/types";

interface SquareProps {
  value: Player;
  isWinning: boolean;
  disabled: boolean;
  onSquareClick: () => void;
}

export default function Square({
  value,
  isWinning,
  disabled,
  onSquareClick,
}: SquareProps) {
  return (
    <div className="square-wrapper">
      <calcite-button
        appearance={isWinning ? "outline-fill" : "transparent"}
        disabled={disabled}
        width="full"
        onClick={onSquareClick}
      >
        {value}
      </calcite-button>
    </div>
  );
}
