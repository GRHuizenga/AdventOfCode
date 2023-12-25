import { Observable, first, map, of, tap } from 'rxjs';
import { Solver } from '../core/solver';

export class Day15 extends Solver {
  private boxes: Map<number, Lens[]> = new Map();

  constructor() {
    super(15);
  }

  solveForPartOne(): Observable<string | number> {
    return this.lines$().pipe(
      first(),
      map(this.initializationSequenceToSteps),
      map((steps: string[]) =>
        steps.reduce(
          (acc: number[], step: string) => [...acc, Day15.hash(step)],
          []
        )
      ),
      map((hashCodes: number[]) => hashCodes.sum(0))
    );
  }

  solveForPartTwo(): Observable<string | number> {
    return this.lines$().pipe(
      map(this.initializationSequenceToSteps),
      map((steps: string[]) => steps.map((step: string) => new Lens(step))),
      map((lenses: Lens[]) => this.processLenses(lenses)),
      map(() => this.toFocussingPower())
    );
  }

  private toFocussingPower = (): number => {
    const focussingPowers: number[] = [];
    this.boxes.forEach((lenses: Lens[], boxNr: number) =>
      focussingPowers.push(
        lenses.reduce(
          (acc: number, lens: Lens, index: number) =>
            acc + (boxNr + 1) * (index + 1) * lens.focalLength!,
          0
        )
      )
    );
    return focussingPowers.sum(0);
  };

  private processLenses(lenses: Lens[]) {
    lenses.forEach((lens: Lens) => {
      if (lens.operation === '-') this.removeLens(lens);
      else this.addOrReplaceLens(lens);
    });
  }

  private removeLens(lens: Lens): void {
    const lensesInBox = this.boxes.get(lens.box);
    if (lensesInBox)
      this.boxes.set(
        lens.box,
        lensesInBox.filter((l: Lens) => l.label !== lens.label)
      );
  }

  private addOrReplaceLens(lens: Lens): void {
    const lensesInBox = this.boxes.get(lens.box) || [];
    const index = lensesInBox.findIndex((l: Lens) => l.label === lens.label);
    if (index > -1) lensesInBox[index].focalLength = lens.focalLength;
    else lensesInBox.push(lens);
    this.boxes.set(lens.box, lensesInBox);
  }

  public static readonly hash = (step: string): number => {
    return step
      .split('')
      .reduce(
        (acc: number, character: string) =>
          ((acc + character.charCodeAt(0)) * 17) % 256,
        0
      );
  };

  private initializationSequenceToSteps = (sequence: string): string[] =>
    sequence.split(',');
}

class Lens {
  public readonly label: string;
  public readonly box: number;
  public focalLength?: number;
  public readonly operation: string;

  private regexp = new RegExp('^([a-z]+)([=-])(\\d*)$');

  constructor(step: string) {
    const [_, label, operation, focalLength] = step.match(this.regexp)!;
    this.label = label;
    this.operation = operation;
    this.box = Day15.hash(label);
    this.focalLength = focalLength ? +focalLength : undefined;
  }
}
