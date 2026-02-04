export type FormattedMove = {
  index: number;
  player: "X" | "O" | null;
  row: number | null;
  col: number | null;
  description: string;
};