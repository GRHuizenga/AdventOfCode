import { createReadStream } from "fs";
import readline from "readline";
import { Observable, from } from "rxjs";

export abstract class Solver {
  abstract solveForPartOne(): Observable<string | number>;
  abstract solveForPartTwo(): Observable<string | number>;

  protected readonly lines$: () => Observable<string>;

  public readonly id: number;

  constructor(day: number) {
    this.id = day;
    this.lines$ = () =>
      from(
        readline.createInterface(
          createReadStream(`./2023/inputs/day${day}.txt`)
        )
      );
  }
}
