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
      <calcite-block
        heading="Restart Game"
        collapsible
        expanded={false}
        iconStart="reset"
      >
        <calcite-label>
          Board Size
          <calcite-input-number
            ref={pendingSizeRef}
            alignment="center"
            integer
            max={10}
            min={3}
            numberButtonType="vertical"
            scale="m"
            value={boardSize.toString()}
          />
          <calcite-button
            appearance="outline"
            iconStart="reset"
            kind="danger"
            round
            width="full"
            onClick={handleRestartClick}
          >
            Restart
          </calcite-button>
        </calcite-label>
      </calcite-block>
    </>
  );
}
