import { Observable, map, toArray } from "rxjs";
import { Solver } from "../core/solver";

export class Day01 extends Solver {
  private stringRepresentationsOfNumbers: string[] = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];

  constructor() {
    super(1);
  }

  solveForPartOne(): Observable<string | number> {
    return this.lines$().pipe(
      map(this.removeNonDigits),
      map(this.firstAndLastCharacter),
      map(Number),
      toArray(),
      map((x) => x.sum(0))
    );
  }

  solveForPartTwo(): Observable<string | number> {
    return this.lines$().pipe(
      map(this.replaceStringRepresentationsWithNumbers.bind(this)),
      map(this.removeNonDigits),
      map(this.firstAndLastCharacter),
      map(Number),
      toArray(),
      map((x) => x.sum(0))
    );
  }

  private removeNonDigits = (input: string): string => input.replace(/\D/g, "");

  private firstAndLastCharacter = (input: string): string =>
    input[0] + input.slice(-1);

  // oneight => one1oneight
  private replaceStringRepresentationsWithNumbers = (input: string): string =>
    this.stringRepresentationsOfNumbers.reduce(
      (acc: string, value: string, index: number) =>
        acc.replace(new RegExp(value, "g"), value + (index + 1) + value),
      input
    );
}
