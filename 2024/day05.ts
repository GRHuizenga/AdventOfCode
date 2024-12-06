import { Observable } from 'rxjs';
import { Solver } from '../core/solver';

type RuleMap = { [key: string]: string[] };

export class Day05 extends Solver {
  private rules!: RuleMap;
  private updates!: string[][];

  constructor() {
    super(5);

    this.parseInput();
  }

  solveForPartOne(): Observable<string | number> | string | number {
    return this.updates
      .filter((update) => this.isCorrectlyOrderedUpdate(update))
      .map((update) => +update[Math.floor(update.length / 2)])
      .sum(0);
  }

  solveForPartTwo(): Observable<string | number> | string | number {
    return this.updates
      .filter((update) => !this.isCorrectlyOrderedUpdate(update))
      .map((update) =>
        update.sort((a, b) => {
          if (!this.rules[a]) return 0;
          if (this.rules[a].includes(b)) return -1;
          return 1;
        })
      )
      .map((update) => +update[Math.floor(update.length / 2)])
      .sum(0);
  }

  // for each page x:
  //    for each following page n
  //    there is no rule that says n|x
  private isCorrectlyOrderedUpdate(update: string[]): boolean {
    return !update.some((page, index, self) =>
      self
        .slice(index + 1)
        .some((p: string) => (this.rules[p] ?? []).includes(page))
    );
  }

  private parseInput(): void {
    const rulesAndUpdates = this.lines();
    const ind = rulesAndUpdates.findIndex((line) => line === '');
    this.rules = rulesAndUpdates
      .slice(0, ind)
      .reduce((rules: RuleMap, rule: string) => {
        const [left, right] = rule.split('|');
        return {
          ...rules,
          [left]: [...(rules[left] || []), right],
        };
      }, {} as RuleMap);
    this.updates = rulesAndUpdates
      .slice(ind + 1)
      .map((update) => update.split(','));
  }
}
