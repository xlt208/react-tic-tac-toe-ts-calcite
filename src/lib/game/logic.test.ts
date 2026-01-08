import { calculateWinner } from "./logic";
import { Squares } from "./types";

describe("calculateWinner", () => {
  it("returns a row winner", () => {
    const squares: Squares = ["X", "X", "X", null, "O", null, "O", null, null];
    const result = calculateWinner(squares);

    expect(result.winner).toBe("X");
    expect(result.winningLine).toEqual([0, 1, 2]);
  });

  it("returns a column winner", () => {
    const squares: Squares = ["O", "X", null, "O", "X", null, "O", null, "X"];
    const result = calculateWinner(squares);

    expect(result.winner).toBe("O");
    expect(result.winningLine).toEqual([0, 3, 6]);
  });

  it("returns a diagonal winner", () => {
    const squares: Squares = ["X", "O", null, null, "X", "O", null, null, "X"];
    const result = calculateWinner(squares);

    expect(result.winner).toBe("X");
    expect(result.winningLine).toEqual([0, 4, 8]);
  });

  it("returns no winner when none exist", () => {
    const squares: Squares = ["X", "O", "X", "X", "O", "O", "O", "X", "X"];
    const result = calculateWinner(squares);

    expect(result.winner).toBeNull();
    expect(result.winningLine).toEqual([]);
  });
});
