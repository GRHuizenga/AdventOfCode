import { Observable, map, of, tap, toArray } from 'rxjs';
import { Solver } from '../core/solver';

export class Day16 extends Solver {
  private grid!: string[][];
  private energizedTiles: Map<number, Direction[]> = new Map();

  constructor() {
    super(16);
  }

  solveForPartOne(): Observable<string | number> {
    return this.createGrid$.pipe(
      tap(() => this.moveBeamRecursive([0, 0], 'east')),
      map(() => this.energizedTiles.size)
    );
  }

  solveForPartTwo(): Observable<string | number> {
    return this.createGrid$.pipe(
      map(() => this.getStartingPointsAndDirections()),
      map((startingPoints: [Location, Direction][]) => {
        return startingPoints.reduce(
          (acc: number, [location, direction]: [Location, Direction]) => {
            this.energizedTiles.clear();
            this.moveBeamRecursive(location, direction);
            return Math.max(this.energizedTiles.size, acc);
          },
          0
        );
      })
    );
  }

  private getStartingPointsAndDirections(): [Location, Direction][] {
    const left = Array.prototype
      .createRange(0, this.grid.length - 1, 1)
      .map((y: number) => [[0, y], 'east'] as [Location, Direction]);
    const right = Array.prototype
      .createRange(0, this.grid.length - 1, 1)
      .map(
        (y: number) =>
          [[this.grid[0].length - 1, y], 'west'] as [Location, Direction]
      );
    const top = Array.prototype
      .createRange(0, this.grid[0].length - 1, 1)
      .map((x: number) => [[x, 0], 'south'] as [Location, Direction]);
    const bottom = Array.prototype
      .createRange(0, this.grid[0].length - 1, 1)
      .map(
        (x: number) =>
          [[x, this.grid.length - 1], 'north'] as [Location, Direction]
      );
    return [...left, ...right, ...top, ...bottom];
  }

  private moveBeamRecursive(location: Location, direction: Direction): void {
    if (
      this.isWithinBounds(location) &&
      this.addLocationToMap(location, direction)
    ) {
      const tile: string = this.grid[location[1]][location[0]];
      if (this.shouldMoveStraight(tile, direction)) {
        const nextLocation = this.move(location, direction);
        this.moveBeamRecursive(nextLocation, direction);
      } else if (this.shouldReflect(tile)) {
        const nextDirection = this.reflect(tile, direction);
        const nextLocation = this.move(location, nextDirection);
        this.moveBeamRecursive(nextLocation, nextDirection);
      } else if (this.shouldSplit(tile, direction)) {
        const next = this.split(location, direction);
        this.moveBeamRecursive(next[0][0], next[0][1]);
        this.moveBeamRecursive(next[1][0], next[1][1]);
      }
    }
  }

  private addLocationToMap(location: Location, direction: Direction): boolean {
    const coordinate1D = location[1] * this.grid.length + location[0];
    const directions = this.energizedTiles.get(coordinate1D) || [];
    if (!directions.includes(direction)) {
      this.energizedTiles.set(coordinate1D, [...directions, direction]);
      return true;
    }
    return false;
  }

  private shouldMoveStraight(tile: string, direction: Direction): boolean {
    return (
      this.isEmptySpace(tile) ||
      (this.isHorizontalSplitter(tile) && this.isXMovement(direction)) ||
      (this.isVerticalSplitter(tile) && this.isYMovement(direction))
    );
  }

  private shouldSplit = (tile: string, direction: Direction): boolean =>
    (this.isHorizontalSplitter(tile) && this.isYMovement(direction)) ||
    (this.isVerticalSplitter(tile) && this.isXMovement(direction));

  private split = (
    location: Location,
    direction: Direction
  ): [Location, Direction][] => {
    if (this.isXMovement(direction)) {
      return [
        [this.move(location, 'north'), 'north'],
        [this.move(location, 'south'), 'south'],
      ];
    } else {
      return [
        [this.move(location, 'east'), 'east'],
        [this.move(location, 'west'), 'west'],
      ];
    }
  };

  private shouldReflect = (tile: string): boolean => this.isReflector(tile);

  private reflect = (tile: string, direction: Direction): Direction => {
    // / + north => east
    // / + east => north
    // / + south => west
    // / + west => south
    if (tile === '/') {
      return direction === 'north'
        ? 'east'
        : direction === 'east'
        ? 'north'
        : direction === 'south'
        ? 'west'
        : 'south';
    }
    // \ + north => west
    // \ + west => north
    // \ + south => east
    // \ + east => south
    else {
      return direction === 'north'
        ? 'west'
        : direction === 'west'
        ? 'north'
        : direction === 'south'
        ? 'east'
        : 'south';
    }
  };

  private move(location: Location, direction: Direction): Location {
    switch (direction) {
      case 'north':
        return [location[0], location[1] - 1];
      case 'east':
        return [location[0] + 1, location[1]];
      case 'south':
        return [location[0], location[1] + 1];
      case 'west':
        return [location[0] - 1, location[1]];
    }
  }

  private isWithinBounds = (location: Location): boolean =>
    location[1] >= 0 &&
    location[1] < this.grid.length &&
    location[0] >= 0 &&
    location[0] < this.grid[0].length;

  private isEmptySpace = (tile: string): boolean => tile === '.';
  private isReflector = (tile: string): boolean =>
    tile === '\\' || tile === '/';
  private isHorizontalSplitter = (tile: string): boolean => tile === '-';
  private isVerticalSplitter = (tile: string): boolean => tile === '|';

  private isYMovement = (direction: Direction): boolean =>
    direction === 'north' || direction === 'south';
  private isXMovement = (direction: Direction): boolean =>
    direction === 'east' || direction === 'west';

  private createGrid$: Observable<string[][]> = this.lines$().pipe(
    map((line: string) => line.split('')),
    toArray(),
    tap((grid: string[][]) => (this.grid = grid))
  );
}

type Direction = 'north' | 'east' | 'south' | 'west';

type Location = [x: number, y: number];
