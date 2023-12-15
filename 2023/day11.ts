import { Observable, map, of, toArray } from 'rxjs';
import { Mathematics } from '../core/math';
import { Solver } from '../core/solver';

export class Day11 extends Solver {
  constructor() {
    super(11);
  }

  solveForPartOne(): Observable<string | number> {
    return this.lines$().pipe(
      map((line: string) => line.split('')),
      toArray(),
      map(this.expandUniverse.bind(this)),
      map(this.findAllGalaxyLocations),
      map(this.calculateSumOfShortestDistancesBetweenAllGalaxies)
    );
  }

  solveForPartTwo(): Observable<string | number> {
    return this.lines$().pipe(
      map((line: string) => line.split('')),
      toArray(),
      map(this.findAllGalaxyLocationsPart2.bind(this)),
      map(this.calculateSumOfShortestDistancesBetweenAllGalaxies)
    );
  }

  private findAllGalaxyLocationsPart2 = (universe: string[][]): Location[] => {
    const [xs, ys]: [number[], number[]] = this.findExpansionPoints(universe);
    return this.findAllGalaxyLocations(universe).map(
      (location: Location) =>
        new Location(
          location.x + xs.filter((x: number) => x < location.x).length * 999999, // million - 1 since it is a replacement, not addition
          location.y + ys.filter((y: number) => y < location.y).length * 999999
        )
    );
  };

  private findExpansionPoints = (
    universe: string[][]
  ): [number[], number[]] => [
    universe.transpose().reduce(this.rowToExpansionPointsIndices, []),
    universe.reduce(this.rowToExpansionPointsIndices, []),
  ];

  private rowToExpansionPointsIndices = (
    acc: number[],
    row: string[],
    index: number
  ) => (row.unique().length === 1 ? [...acc, index] : acc);

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
            point === '#' ? new Location(colIndex, rowIndex) : null
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
