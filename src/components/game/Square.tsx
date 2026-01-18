import { Player } from "lib/game/types";

interface SquareProps {
  value: Player;
  isWinning: boolean;
  disabled: boolean;
  onSquareClick: () => void;
  row: number;
  col: number;
}

export default function Square({
  value,
  isWinning,
  disabled,
  onSquareClick,
  row,
  col,
}: SquareProps) {
  const label = `Row ${row}, Column ${col}, ${value ?? "empty"}`;

  return (
    <div className="square-wrapper">
      <calcite-button
        role="gridcell"
        appearance={isWinning ? "outline-fill" : "transparent"}
        disabled={disabled}
        label={label}
        width="full"
        onClick={onSquareClick}
      >
        {value}
      </calcite-button>
    </div>
  );
}
