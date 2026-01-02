import { CalciteButton } from "@esri/calcite-components-react";
import { Player } from "lib/game/types";

interface SquareProps {
  value: Player;
  onSquareClick: () => void;
}

export default function Square({ value, onSquareClick }: SquareProps) {
  return (
    <div className="square-wrapper">
      <CalciteButton
        appearance="transparent"
        width="full"
        onClick={onSquareClick}
      >
        {value}
      </CalciteButton>
    </div>
  );
}
