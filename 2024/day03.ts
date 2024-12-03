import { Observable } from 'rxjs';
import { Solver } from '../core/solver';

export class Day03 extends Solver {
  private readonly mul: RegExp = new RegExp(/mul\((\d+),(\d+)\)/, 'g');
  private readonly digits: RegExp = new RegExp(/(\d+)/, 'g');

  constructor() {
    super(3);
  }

  solveForPartOne(): Observable<string | number> | string | number {
    return this.processMuls(this.lines().join(' '));
  }

  solveForPartTwo(): Observable<string | number> | string | number {
    return this.processMulsRecursive(this.lines().join(' '));
  }

  private processMuls(memory: string): number {
    return Array.from(memory.match(this.mul) ?? [])
      .map((mul) => {
        const [left, right] = mul.match(this.digits)!;
        return +left * +right;
      })
      .sum(0);
  }

  private processMulsRecursive(subString: string): number {
    const dontIndex = subString.indexOf("don't()");
    const subTotal = this.processMuls(subString.slice(0, dontIndex));
    const doIndex = subString.indexOf('do()', dontIndex);
    return doIndex === -1
      ? subTotal
      : subTotal + this.processMulsRecursive(subString.slice(doIndex));
  }
}
