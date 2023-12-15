import { Observable, map, of, toArray } from "rxjs";
import { Mathematics } from "../core/math";
import { Solver } from "../core/solver";

export class Day11 extends Solver {
  constructor() {
    super(11);
  }

  solveForPartOne(): Observable<string | number> {
    return this.lines$().pipe(
      map((line: string) => line.split("")),
      toArray(),
      map(this.expandUniverse.bind(this)),
      map(this.findAllGalaxyLocations),
      map(this.calculateSumOfShortestDistancesBetweenAllGalaxies)
    );
  }

  solveForPartTwo(): Observable<string | number> {
    return of(2);
  }

  private calculateSumOfShortestDistancesBetweenAllGalaxies = (
    galaxyCoordinates: Location[]
  ) =>
    galaxyCoordinates
      .combinations()
      .map(([galaxy1, galaxy2]) =>
        Mathematics.euclideanDistance(galaxy1, galaxy2)
      )
      .sum(0);

  private findAllGalaxyLocations = (universe: string[][]): Location[] =>
    universe.flatMap(
      (row: string[], rowIndex: number) =>
        row
          .map((point: string, colIndex: number) =>
            point === "#" ? new Location(colIndex, rowIndex) : null
          )
          .filter((location: Location | null) => !!location) as Location[]
    );

  private expandUniverse = (universe: string[][]): string[][] =>
    this.expand(this.expand(universe).transpose()).transpose();

  private expand = (universe: string[][]): string[][] =>
    universe.reduce(
      (acc: string[][], row: string[]) =>
        row.unique().length === 1
          ? [...acc, [...row], [...row]]
          : [...acc, [...row]],
      [] as string[][]
    );
}

class Location {
  constructor(public readonly x: number, public readonly y: number) {}
}
