import { useEffect, useState } from "react";

interface RestartControlsProps {
  boardSize: number;
  onRestart: (size: number) => void;
}

export default function RestartControls({
  boardSize,
  onRestart,
}: RestartControlsProps) {
  const [pendingSize, setPendingSize] = useState(boardSize.toString());
  const parsedSize = Number(pendingSize);

  useEffect(() => {
    setPendingSize(boardSize.toString());
  }, [boardSize]);

  const isInvalid =
    pendingSize.trim() === "" ||
    !Number.isInteger(parsedSize) ||
    parsedSize < 3 ||
    parsedSize > 10;

  const handleRestartClick = () => {
    if (isInvalid) return;
    onRestart(parsedSize);
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
          <calcite-input-number
            alignment="center"
            id="board-size-input"
            integer
            label="Board size"
            labelText="Board size"
            max={10}
            min={3}
            numberButtonType="vertical"
            placeholder={pendingSize.toString()}
            scale="m"
            status={isInvalid ? "invalid" : "idle"}
            value={boardSize.toString()}
            oncalciteInputNumberInput={(e) => {
              const target = e.target as HTMLCalciteInputNumberElement;
              setPendingSize(target.value);
            }}
          />
        </calcite-label>
        <calcite-button
          appearance="outline"
          disabled={isInvalid}
          iconStart="reset"
          kind="danger"
          label="Restart game"
          round
          width="full"
          onClick={handleRestartClick}
        >
          Restart
        </calcite-button>
      </calcite-block>
    </>
  );
}
