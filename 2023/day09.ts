import { Observable, map, toArray } from "rxjs";
import { Solver } from "../core/solver";

export class Day09 extends Solver {
  constructor() {
    super(9);
  }

  solveForPartOne(): Observable<string | number> {
    return this.lines$().pipe(
      map((line: string) => line.split(" ").map((num: string) => +num)),
      map((sequence: number[]) => this.interpolateRecursive(sequence)),
      toArray(),
      map((sequence: number[]) => sequence.sum(0))
    );
  }

  solveForPartTwo(): Observable<string | number> {
    return this.lines$().pipe(
      map((line: string) => line.split(" ").map((num: string) => +num)),
      map((sequence: number[]) => this.interpolateRecursive(sequence, true)),
      toArray(),
      map((sequence: number[]) => sequence.sum(0))
    );
  }

  private interpolateRecursive(
    sequence: number[],
    backwards: boolean = false
  ): number {
    if (sequence.unique().length === 1) return sequence[0];
    return backwards
      ? sequence[0] - this.interpolateRecursive(sequence.diff(), backwards)
      : sequence.slice(-1)[0] +
          this.interpolateRecursive(sequence.diff(), backwards);
  }
}
