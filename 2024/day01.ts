import { Observable } from 'rxjs';
import { Solver } from '../core/solver';

export class Day01 extends Solver {
  private readonly left: number[] = [];
  private readonly right: number[] = [];

  constructor() {
    super(1);
  }

  solveForPartOne(): Observable<string | number> | string | number {
    this.lines().forEach((line) => {
      const pair = line.split(/\s+/);
      this.left.push(+pair[0]);
      this.right.push(+pair[1]);
    });
    this.left.sort();
    this.right.sort();

    return this.left.reduce(
      (sum, value, index) => sum + Math.abs(value - this.right[index]),
      0
    );
  }
  solveForPartTwo(): Observable<string | number> | string | number {
    const frequencyMap = this.right.frequencyMap();
    return this.left.reduce(
      (similarityScore, value) =>
        similarityScore + value * (frequencyMap[value] || 0),
      0
    );
  }
}
