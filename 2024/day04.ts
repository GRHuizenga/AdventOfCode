import { Observable } from 'rxjs';
import { Solver } from '../core/solver';

export class Day04 extends Solver {
  private grid: string[];
  private deltas = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  constructor() {
    super(4);
    this.grid = this.lines();
  }

  solveForPartOne(): Observable<string | number> | string | number {
    const width = this.grid[0].length;

    return this.grid.reduce(
      (count, row, rowIndex) =>
        count +
        Array.from(row)
          .flatMap((_, colIndex) =>
            this.deltas.map(([dRow, dCol]) =>
              [0, 1, 2, 3]
                .map((delta) => {
                  const r = rowIndex + dRow * delta;
                  const c = colIndex + dCol * delta;
                  if (r >= 0 && c >= 0 && r < width && c < width) {
                    return this.grid[r][c];
                  }
                })
                .join('') === 'XMAS'
                ? 1
                : 0
            )
          )
          .sum(0),
      0
    );
  }

  solveForPartTwo(): Observable<string | number> | string | number {
    return Array.prototype.createRange(1, this.grid[0].length - 2, 1).reduce(
      (count, rowIndex, _, self) =>
        count +
        self
          .map((colIndex) => {
            if (this.grid[rowIndex][colIndex] !== 'A') return 0;
            const lr =
              this.grid[rowIndex - 1][colIndex - 1] +
              this.grid[rowIndex + 1][colIndex + 1];
            const rl =
              this.grid[rowIndex + 1][colIndex - 1] +
              this.grid[rowIndex - 1][colIndex + 1];
            return (lr === 'MS' || lr === 'SM') && (rl === 'MS' || rl === 'SM')
              ? 1
              : 0;
          })
          .sum(0),
      0
    );
  }
}
