import { CalciteButton } from "@esri/calcite-components-react";
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
      <CalciteButton
        appearance={isWinning ? "outline-fill" : "transparent"}
        width="full"
        disabled={disabled}
        onClick={onSquareClick}
      >
        {value}
      </CalciteButton>
    </div>
  );
}
