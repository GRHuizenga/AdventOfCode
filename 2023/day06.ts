import { Observable, from, map, of, toArray } from "rxjs";
import { Solver } from "../core/solver";

export class Day06 extends Solver {
  private readonly _records: [number, number][] = [
    [35, 213],
    [69, 1168],
    [68, 1086],
    [87, 1248],
  ];

  constructor() {
    super(6);
  }

  /**
   * ABC-formula:
   * (time - pressDuration) * pressDuration >= distance   ===>   -pressDuration^2 + time*pressDuration - distance = 0
   * solve for pressDuration ===> a = -1, b = time, c = -distance
   * lower bound: (-time - sqrt(time^2 - (4*-1*distance))) / (2 * -1)
   * upper bound: (-time + sqrt(time^2 - (4*-1*distance))) / (2 * -1)
   *
   * answer: time - 2 * ceil(lower bound) + 1
   *
   * @returns
   */
  solveForPartOne(): Observable<string | number> {
    return from(this._records).pipe(
      map(this.calculateNumberOfWaysToWin),
      toArray(),
      map((ranges: number[]) => ranges.product(1))
    );
  }

  solveForPartTwo(): Observable<string | number> {
    return of<[number, number]>([35696887, 213116810861248]).pipe(
      map(this.calculateNumberOfWaysToWin)
    );
  }

  private calculateNumberOfWaysToWin = ([time, distance]: [number, number]) => {
    let lowerBound = Math.ceil(
      (-1 * time + Math.sqrt(time * time - 4 * distance)) / -2
    );

    // check for exact match, we have to win
    if ((time - lowerBound) * lowerBound === distance) lowerBound++;

    return time - 2 * lowerBound + 1;
  };
}
