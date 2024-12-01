import { createReadStream, readFileSync } from 'fs';
import readline from 'readline';
import { Observable, from } from 'rxjs';

export abstract class Solver {
  abstract solveForPartOne(): Observable<string | number> | string | number;
  abstract solveForPartTwo(): Observable<string | number> | string | number;

  protected readonly lines$: () => Observable<string>;
  protected readonly lines: () => string[];

  public readonly id: number;

  constructor(day: number) {
    this.id = day;
    this.lines$ = () =>
      from(
        readline.createInterface(
          createReadStream(`./2023/inputs/day${day}.txt`)
        )
      );

    this.lines = () =>
      readFileSync(`./2024/inputs/day${day}.txt`).toString('utf8').split('\n');
  }
}
