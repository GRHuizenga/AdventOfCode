import { Observable, map, toArray } from 'rxjs';
import { Solver } from '../core/solver';

export class Day14 extends Solver {
  constructor() {
    super(14);
  }

  solveForPartOne(): Observable<string | number> {
    return this.lines$().pipe(
      map((line: string) => line.split('')),
      toArray(),
      map(this.tilt),
      map(this.determineNorthSupportBeamsLoad)
    );
  }

  solveForPartTwo(): Observable<string | number> {
    return this.lines$().pipe(
      map((line: string) => line.split('')),
      toArray(),
      map((grid: string[][]) => {
        const [cycleLength, firstOccurrence] = this.findCycle(grid);
        for (
          let i = 0;
          i < ((1000000000 - firstOccurrence) % cycleLength) + firstOccurrence;
          i++
        ) {
          grid = this.cycle(grid);
        }
        return this.determineNorthSupportBeamsLoad(grid);
      })
    );
  }

  private determineNorthSupportBeamsLoad = (grid: string[][]): number =>
    grid
      .map(
        (row: string[], rowIndex: number) =>
          row.filter((col: string) => col === 'O').length *
          (grid.length - rowIndex)
      )
      .sum(0);

  private tilt = (grid: string[][]): string[][] =>
    grid.transpose().map(this.roll).transpose();

  // Floyd's Cycle Detection (toroise and hare)
  private findCycle = (grid: string[][]) => {
    let tortoise = this.cycle(grid);
    let hare = this.cycle(this.cycle(grid));

    while (JSON.stringify(tortoise) !== JSON.stringify(hare)) {
      tortoise = this.cycle(tortoise);
      hare = this.cycle(this.cycle(hare));
    }

    let mu = 0;
    tortoise = [...grid];
    while (JSON.stringify(tortoise) !== JSON.stringify(hare)) {
      tortoise = this.cycle(tortoise);
      hare = this.cycle(hare);
      mu++;
    }

    let lam = 1;
    hare = this.cycle(tortoise);
    while (JSON.stringify(tortoise) !== JSON.stringify(hare)) {
      hare = this.cycle(hare);
      lam++;
    }

    return [lam, mu];
  };

  private cycle = (grid: string[][]): string[][] => {
    grid = grid.transpose().map(this.roll).transpose(); // north
    grid = grid.map(this.roll); // west
    grid = grid
      .transpose()
      .map((row: string[]) => this.roll(row.reverse()).reverse())
      .transpose(); // south
    grid = grid.map((row: string[]) => this.roll(row.reverse()).reverse());
    return grid;
  };

  private roll = (row: string[]): string[] => {
    let nextRockIndex = 0;
    return row.reduce(
      (acc: string[], curr: string, index: number) => {
        if (curr === 'O') {
          acc[index] = '.';
          acc[nextRockIndex] = 'O';
          nextRockIndex++;
        }
        if (curr === '#') {
          nextRockIndex = index + 1;
        }
        return [...acc];
      },
      [...row]
    );
  };
}
