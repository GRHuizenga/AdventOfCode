import { Observable, map, tap, toArray } from "rxjs";
import { Mathematics } from "../core/math";
import { Solver } from "../core/solver";

export class Day10 extends Solver {
  private S = new Location(25, 83);
  private grid: string[][] = [];

  constructor() {
    super(10);
  }

  // input:    S = (25, 83) step 1 => (24, 83) (25, 84)
  solveForPartOne(): Observable<string | number> {
    return this.lines$().pipe(
      map((line: string) => line.split("")),
      toArray(),
      tap((grid: string[][]) => (this.grid = [...grid])),
      map(() =>
        this.findLoop(
          [this.S, new Location(24, 83)],
          [this.S, new Location(25, 84)]
        )
      ),
      map(([_, right]) => right.length)
    );
  }

  /**
   * Use shoelace alogirthm to calculate area of polygon:
   *    travel along all pairs of points clockwise
   *    2A = Sum(i..n) Pix*P(i+1)y - Piy*P(i+1)x
   * Use picks theorem to find interior points:
   *    A = i + b/2 - 1
   * Where
   *    A = area (shoelace)
   *    i = number of interior points
   *    b = number of points on boundary
   * @returns number of interior points
   */
  solveForPartTwo(): Observable<string | number> {
    return this.lines$().pipe(
      map((line: string) => line.split("")),
      toArray(),
      tap((grid: string[][]) => (this.grid = [...grid])),
      map(() =>
        this.findLoop(
          [this.S, new Location(24, 83)],
          [this.S, new Location(25, 84)]
        )
      ),
      map(([left, right]) => [...right, ...left.slice(1).reverse()]), // concat left and right part of loop (but don't use S twice)
      map((boundaryPoints: Location[]) =>
        Mathematics.prick(
          boundaryPoints.length,
          Mathematics.shoelace(boundaryPoints)
        )
      )
    );
  }

  private findLoop(
    left: Location[],
    right: Location[]
  ): [Location[], Location[]] {
    const nextLeft = this.next(left.slice(-2) as [Location, Location]);
    const nextRight = this.next(right.slice(-2) as [Location, Location]);
    if (nextLeft.x === nextRight.x && nextLeft.y === nextRight.y)
      return [[...left, nextLeft], [...right]];
    else return this.findLoop([...left, nextLeft], [...right, nextRight]);
  }

  private next([previous, current]: [Location, Location]): Location {
    const shape = this.grid[current.y][current.x];
    if (shape === "|")
      return previous.y > current.y
        ? new Location(current.x, current.y - 1)
        : new Location(current.x, current.y + 1);
    else if (shape === "-")
      return previous.x > current.x
        ? new Location(current.x - 1, current.y)
        : new Location(current.x + 1, current.y);
    else if (shape === "L")
      return previous.x > current.x
        ? new Location(current.x, current.y - 1)
        : new Location(current.x + 1, current.y);
    else if (shape === "J")
      return previous.x < current.x
        ? new Location(current.x, current.y - 1)
        : new Location(current.x - 1, current.y);
    else if (shape === "7")
      return previous.x < current.x
        ? new Location(current.x, current.y + 1)
        : new Location(current.x - 1, current.y);
    else if (shape === "F")
      return previous.x > current.x
        ? new Location(current.x, current.y + 1)
        : new Location(current.x + 1, current.y);
    else throw new Error("This shouldnt happen");
  }
}

class Location {
  constructor(public readonly x: number, public readonly y: number) {}
}
