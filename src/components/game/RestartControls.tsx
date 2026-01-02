import {
  CalciteBlock,
  CalciteButton,
  CalciteInputNumber,
} from "@esri/calcite-components-react";
import { useRef } from "react";

interface RestartControlsProps {
  boardSize: number;
  onRestart: (size: number) => void;
}

export default function RestartControls({
  boardSize,
  onRestart,
}: RestartControlsProps) {
  const pendingSizeRef = useRef<HTMLCalciteInputNumberElement>(null);

  const handleRestartClick = () => {
    const nextValue = Number(pendingSizeRef.current?.value);
    if (Number.isNaN(nextValue)) {
      return;
    }
    const clampedValue = Math.min(10, Math.max(3, nextValue));
    onRestart(clampedValue);
  };

  return (
    <>
      <CalciteBlock
        className="restart-block"
        heading="Restart Game"
        collapsible
        expanded={false}
      >
        <CalciteInputNumber
          ref={pendingSizeRef}
          alignment="center"
          integer
          labelText="Board Size"
          max={10}
          min={3}
          numberButtonType="vertical"
          scale="m"
          value={boardSize.toString()}
        />

        <CalciteButton
          appearance="outline"
          kind="danger"
          round
          width="full"
          onClick={handleRestartClick}
        >
          Restart
        </CalciteButton>
      </CalciteBlock>
    </>
  );
}
