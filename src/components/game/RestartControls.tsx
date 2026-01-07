import {
  CalciteBlock,
  CalciteButton,
  CalciteInputNumber,
  CalciteLabel,
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
      <CalciteBlock heading="Restart Game" collapsible expanded={false}>
        <CalciteLabel>
          Board Size
          <CalciteInputNumber
            ref={pendingSizeRef}
            alignment="center"
            integer
            max={10}
            min={3}
            numberButtonType="vertical"
            scale="m"
            value={boardSize.toString()}
          />
          <CalciteButton
            appearance="outline"
            iconStart="reset"
            kind="danger"
            round
            width="full"
            onClick={handleRestartClick}
          >
            Restart
          </CalciteButton>
        </CalciteLabel>
      </CalciteBlock>
    </>
  );
}
