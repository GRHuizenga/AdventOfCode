import { Observable, map, of, tap, toArray } from 'rxjs';
import { Solver } from '../core/solver';

export class Day05 extends Solver {
  private allDigits = new RegExp('(\\d+)', 'g');

  constructor() {
    super(5);
  }

  solveForPartOne(): Observable<string | number> {
    return this.lines$().pipe(
      toArray(),
      map(this.toSeedsAndMaps.bind(this)),
      map(([seeds, maps]: [number[], Map[]]) => this.processSeeds(seeds, maps)),
      map((locations: number[]) => Math.min(...locations))
    );
  }

  solveForPartTwo(): Observable<string | number> {
    return this.lines$().pipe(
      toArray(),
      map(this.toSeedsAndMaps.bind(this)),
      map(
        ([seeds, maps]: [number[], Map[]]) =>
          [seeds, this.determineRanges(maps)] as [number[], Range[][]]
      ),
      map(
        ([seeds, ranges]: [number[], Range[][]]) =>
          [seeds, this.compose(ranges)] as [number[], Range[]]
      ),
      map(([seeds, ranges]: [number[], Range[]]) =>
        this.applySeeds(seeds, ranges)
      )
    );
  }

  private applySeeds(seeds: number[], ranges: Range[]): number {
    return seeds.pairs().reduce((acc: number, curr: number[]) => {
      const seed_start = curr[0];
      const seed_end = seed_start + curr[1] - 1;

      const lowestLocations: number[] = [];
      ranges.forEach((range: Range) => {
        // check for overlap with partial function range
        if (!(range.start >= seed_end || range.end <= seed_start)) {
          // if overlap, find the lowest overlapping value which is the max of seed_start and range.start
          const lowest = Math.max(range.start, seed_start);
          // just apply the function, i.e. add the delta
          lowestLocations.push(lowest + range.delta);
        }
      });

      // still looking for the lowest
      return Math.min(...lowestLocations, acc);
    }, Number.MAX_VALUE);
  }

  private compose(ranges: Range[][]): Range[] {
    return ranges
      .map((ranges: Range[]) => this.fillMissing(ranges))
      .slice(1)
      .reduce((acc: Range[], curr: Range[]) => {
        return this.fillMissing(this.mergeRanges(acc, curr));
      }, ranges[0]);
  }

  /**
   * destination source range
   * seed-to-soil map:
     50 98 2  
     52 50 48

     the idea: 
     for the seed range x >= 98 && x < 99 => x + (destination - source) = x-48
     for the seed range x >= 50 && x < 98 => x + (destination - source) = x+2

     fill in the missing pieces:
     for the seed range x < 50 => x
     for the seed range x >= 100 => x
   */
  private determineRanges(maps: Map[]): Range[][] {
    return maps.map((map: Map) =>
      this.fillMissing(
        map.ranges.map(
          ([destination, source, range]) =>
            new Range(source, source + range, destination - source)
        )
      )
    );
  }

  private fillMissing(ranges: Range[]): Range[] {
    // make sure they are sorted
    const sorted = ranges.sort((a: Range, b: Range) => a.start - b.start);
    const filled: Range[] = [];

    // start with the lower end if not already there
    if (sorted[0].start !== -Number.MAX_VALUE) {
      filled.push(new Range(-Number.MAX_VALUE, sorted[0].start, 0));
    }
    filled.push(sorted[0]);

    // compare consecutive ranges to see if the connect and fill the gap if not
    for (let i = 0; i < sorted.length - 1; i++) {
      const previous = sorted[i];
      const next = sorted[i + 1];
      if (previous.end !== next.start) {
        filled.push(new Range(previous.end, next.start, 0));
      }
      filled.push(next);
    }

    // finish to infinity
    if (filled[filled.length - 1].end !== Number.MAX_VALUE) {
      filled.push(
        new Range(filled[filled.length - 1].end, Number.MAX_VALUE, 0)
      );
    }

    return filled;
  }

  private mergeRanges(left: Range[], right: Range[]): Range[] {
    let ranges: Range[] = [];
    left.forEach((a: Range) => {
      right.forEach((b: Range) => {
        const merged = a.merge(b);
        if (merged) ranges.push(merged);
      });
    });
    return ranges;
  }

  private processSeeds(seeds: number[], maps: Map[]): number[] {
    return seeds.map((seed: number) => {
      let from = 'seed';
      let v = seed;
      while (from !== 'location') {
        const map = maps.find((m: Map) => m.from === from)!;
        v = map.determineNextValue(v);
        from = map.to;
      }
      return v;
    });
  }

  private toSeedsAndMaps = (input: string[]): [number[], Map[]] => [
    Array.from(input[0].match(this.allDigits)!).map(Number),
    this.parseMaps(input.slice(1)),
  ];

  private parseMaps = (input: string[]) => {
    const mapBoundaries = [...input, '']
      .map((line: string, index: number) => (line === '' ? index : -1))
      .filter((index: number) => index > -1)
      .slidingWindow(2);

    const fromTo = new RegExp('^([a-z]+)-to-([a-z]+) map:$');
    const maps = mapBoundaries.map(([start, finish]) => {
      const m = Array.from(input[start + 1].match(fromTo)!);
      const [from, to]: [string, string] = [m[1], m[2]];
      const ms: Map = new Map(from, to);
      const maps = input.slice(start + 2, finish);
      maps.forEach((map: string) => {
        const [destination, source, range] = map.match(this.allDigits)!;
        ms.addRange(+destination, +source, +range);
      });
      return ms;
    });
    return maps;
  };
}

class Map {
  public readonly ranges: [number, number, number][] = [];

  constructor(public readonly from: string, public readonly to: string) {}

  public addRange(destination: number, source: number, range: number): void {
    this.ranges.push([destination, source, range]);
  }

  public determineNextValue(value: number): number {
    const range = this.ranges.find(
      ([_, source, range]) => value >= source && value <= source + range
    );
    return range ? range[0] + (value - range[1]) : value;
  }
}

/**
 * All ranges interpreted as [start, end)
 * i.e. end is NOT included
 */
class Range {
  constructor(public start: number, public end: number, public delta: number) {}

  public merge(other: Range): Range | undefined {
    // this:  [50, 98)   delta: 2
    // other: [52, 54)   delta: -15
    // apply other to this to determine input ranges for function other
    // i.e.
    // other_start = other.start - this.delta     50
    // other_end = other.end - this.delta         52
    // new range is then [50, 52) with delta 2 + -15

    const other_start = other.start - this.delta;
    const other_end = other.end - this.delta;

    // check for overlap between this and newly determined input range for other
    if (this.end <= other_start || this.start >= other_end) return undefined;

    return new Range(
      Math.max(this.start, other_start),
      Math.min(this.end, other_end),
      this.delta + other.delta
    );
  }
}
