import { Observable } from 'rxjs';
import { Solver } from '../core/solver';

export class Day02 extends Solver {
  private reports: number[][] = [];
  private inc = new Set([1, 2, 3]);
  private dec = new Set([-1, -2, -3]);

  constructor() {
    super(2);

    this.reports = this.lines().map((line) => line.split(/\s+/).map(Number));
  }

  solveForPartOne(): Observable<string | number> | string | number {
    return this.reports.filter((report) => this.isSafe(report)).length;
  }

  solveForPartTwo(): Observable<string | number> | string | number {
    return this.reports.filter((report) =>
      Array.prototype
        .createRange(1, report.length, 1)
        .map((_, index) => [
          ...report.slice(0, index),
          ...report.slice(index + 1),
        ])
        .some((report) => this.isSafe(report))
    ).length;
  }

  private isSafe(report: number[]): boolean {
    const diffs = Array.from(new Set(report.diff()));
    return (
      diffs.every((d) => this.inc.has(d)) || diffs.every((d) => this.dec.has(d))
    );
  }
}
