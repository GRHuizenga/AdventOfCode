import { Observable } from 'rxjs';
import { Solver } from '../core/solver';

type Movement = [[number, number], () => Movement];

export class Day06 extends Solver {
  private up: Movement = [[-1, 0], () => this.right];
  private right: Movement = [[0, 1], () => this.down];
  private down: Movement = [[1, 0], () => this.left];
  private left: Movement = [[0, -1], () => this.up];

  private grid: string[];
  private encounteredObstacles!: Map<Movement, number[]>;

  constructor() {
    super(6);
    this.grid = this.lines();
  }

  solveForPartOne(): Observable<string | number> | string | number {
    return new Set(
      this.walk(this.up, [85, 61]).map(
        ([row, col]) => row * this.grid.length + col
      )
    ).size;
  }

  solveForPartTwo(): Observable<string | number> | string | number {
    return Array.prototype
      .createRange(0, this.grid.length - 1, 1)
      .flatMap((v1, _, self) => self.map<[number, number]>((v2) => [v1, v2]))
      .filter(([row, col]) => this.grid[row][col] === '.')
      .filter(([row, col]) => {
        this.initObstacleMap();
        const originalRow = this.grid[row];
        this.grid[row] =
          originalRow.slice(0, col) + '#' + originalRow.slice(col + 1);
        const loop = this.getsStuckInLoop(this.up, [85, 61]);
        this.grid[row] = originalRow;
        return loop;
      }).length;
  }

  private walk(
    [[dRow, dCol], next]: Movement,
    [pRow, pCol]: [number, number]
  ): [number, number][] {
    const positionsToCheck = this.getPositionsToCheck(
      [dRow, dCol],
      [pRow, pCol]
    );
    const obstacle = positionsToCheck.findIndex(
      ([row, col]) => this.grid[row][col] === '#'
    );

    return obstacle === -1
      ? positionsToCheck
      : [
          ...positionsToCheck.slice(0, obstacle),
          ...this.walk(next(), positionsToCheck[obstacle - 1]),
        ];
  }

  // loops can consist of more than 4 obstacles
  // its only a loop if you encounter an obstacle more than once from the same direction
  private getsStuckInLoop(
    movement: Movement,
    [pRow, pCol]: [number, number]
  ): boolean {
    const [[dRow, dCol], next] = movement;
    const positionsToCheck = this.getPositionsToCheck(
      [dRow, dCol],
      [pRow, pCol]
    );
    const obstacleIndex = positionsToCheck.findIndex(
      ([row, col]) => this.grid[row][col] === '#'
    );

    if (obstacleIndex === -1) return false;

    const obstacleIndex1d =
      positionsToCheck[obstacleIndex][0] * this.grid.length +
      positionsToCheck[obstacleIndex][1];

    const loop = this.encounteredObstacles
      .get(movement)
      ?.includes(obstacleIndex1d);
    if (loop) return true;

    this.encounteredObstacles.get(movement)?.push(obstacleIndex1d);
    return this.getsStuckInLoop(next(), positionsToCheck[obstacleIndex - 1]);
  }

  private getPositionsToCheck(
    [dRow, dCol]: [number, number],
    [pRow, pCol]: [number, number]
  ): [number, number][] {
    return Array.prototype
      .createRange(0, this.grid.length, 1)
      .map<[number, number]>((value) => [
        pRow + dRow * value,
        pCol + dCol * value,
      ])
      .filter(
        ([row, col]) =>
          row >= 0 &&
          col >= 0 &&
          row < this.grid.length &&
          col < this.grid.length
      );
  }

  private initObstacleMap(): void {
    this.encounteredObstacles = new Map([
      [this.up, []],
      [this.right, []],
      [this.down, []],
      [this.left, []],
    ]);
  }
}
