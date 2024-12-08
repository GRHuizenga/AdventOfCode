import { Observable } from 'rxjs';
import { Solver } from '../core/solver';

export class Day07 extends Solver {
  private equations: number[][];

  constructor() {
    super(7);

    this.equations = this.lines().map((line) =>
      Array.from(line.match(/\d+/g) ?? []).map(Number)
    );
  }

  solveForPartOne(): Observable<string | number> | string | number {
    return this.solve(['+', '*']);
  }

  solveForPartTwo(): Observable<string | number> | string | number {
    return this.solve(['+', '*', '|']);
  }

  private solve(operators: string[]): number {
    return this.equations
      .filter((equation: number[]) => {
        const candidates = this.getPermutationsRecursive(
          operators,
          '',
          equation.length - 2
        );

        return candidates.some(
          (candidate) =>
            equation
              .slice(2)
              .reduce(
                (subTotal, num, index) =>
                  this.calculate(subTotal, num, candidate[index]),
                equation[1]
              ) === equation[0]
        );
      })
      .map(([result, _]) => result)
      .sum(0);
  }

  private calculate(left: number, right: number, operator: string): number {
    return operator === '+'
      ? left + right
      : operator === '*'
      ? left * right
      : +`${left}${right}`;
  }

  private getPermutationsRecursive(
    operators: string[],
    permutation: string,
    length: number
  ): string[] {
    if (length === 0) return [permutation];

    return operators.flatMap((operator) =>
      this.getPermutationsRecursive(
        operators,
        permutation + operator,
        length - 1
      )
    );
  }
}
