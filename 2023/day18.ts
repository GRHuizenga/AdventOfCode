import { Observable, last, map, of, scan, tap } from 'rxjs';
import { Solver } from '../core/solver';
import { Mathematics } from '../core/math';

export class Day18 extends Solver {
  constructor() {
    super(18);
  }

  solveForPartOne(): Observable<string | number> {
    return this.lines$().pipe(
      scan(
        (acc, curr: string) => {
          const [direction, steps, _] = curr.split(' ');
          const lastVisited = acc.points.slice(-1)[0];
          return {
            totalSteps: acc.totalSteps + +steps,
            points: [
              ...acc.points,
              new Location(
                lastVisited.x + this.deltaX(+steps, direction),
                lastVisited.y + this.deltaY(+steps, direction)
              ),
            ],
          };
        },
        {
          totalSteps: 0,
          points: [new Location(0, 0)],
        }
      ),
      last(),
      map(
        ({ totalSteps, points }) =>
          totalSteps +
          Mathematics.prick(totalSteps, Mathematics.shoelace(points.slice(1)))
      )
    );
  }

  solveForPartTwo(): Observable<string | number> {
    return of(2);
  }

  private deltaX = (steps: number, direction: string): number =>
    direction === 'U' || direction === 'D'
      ? 0
      : direction === 'L'
      ? -steps
      : steps;
  private deltaY = (steps: number, direction: string): number =>
    direction === 'L' || direction === 'R'
      ? 0
      : direction === 'U'
      ? -steps
      : steps;
}

class Location {
  constructor(public readonly x: number, public readonly y: number) {}
}
