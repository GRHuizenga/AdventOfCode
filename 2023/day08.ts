import { Observable, first, map, skip, tap, toArray } from "rxjs";
import { Mathematics } from "../core/math";
import { Solver } from "../core/solver";

export class Day08 extends Solver {
  private nodes: Map<string, [string, string]> = new Map();
  private instructions: string[] = [];

  constructor() {
    super(8);
    this.lines$()
      .pipe(
        first(),
        map((line: string) => line.split(""))
      )
      .subscribe((instr: string[]) => (this.instructions = instr));
  }

  solveForPartOne(): Observable<string | number> {
    const regexp = new RegExp("([A-Z]{3})", "g");
    return this.lines$().pipe(
      skip(2),
      toArray(),
      tap((nodes: string[]) =>
        nodes.forEach((node: string) => {
          const n = node.match(regexp)!;
          this.nodes.set(n[0], [n[1], n[2]]);
        })
      ),
      map(() => {
        let n = "AAA";
        let moves = 0;
        const getInstruction = this.getInstruction(this.instructions);
        while (n != "ZZZ") {
          const instruction = getInstruction();
          n = this.nodes.get(n)![instruction === "L" ? 0 : 1];
          moves++;
        }
        return moves;
      })
    );
  }

  solveForPartTwo(): Observable<string | number> {
    const regexp = new RegExp("([A-Z]{3})", "g");
    return this.lines$().pipe(
      skip(2),
      toArray(),
      tap((nodes: string[]) =>
        nodes.forEach((node: string) => {
          const n = node.match(regexp)!;
          this.nodes.set(n[0], [n[1], n[2]]);
        })
      ),
      map(() => {
        let startingNodes = Array.from(this.nodes.keys()).filter(
          (node: string) => node[2] === "A"
        );
        let l = 1;
        const getInstruction = this.getInstruction(this.instructions);
        startingNodes.forEach((n: string) => {
          let moves = 0;
          while (n[2] != "Z") {
            const instruction = getInstruction();
            n = this.nodes.get(n)![instruction === "L" ? 0 : 1];
            moves++;
          }
          l = Mathematics.lcm(l, moves);
        });

        return l;
      })
    );
  }

  private getInstruction = (instructions: string[]) => {
    let idx = 0;
    return (): string => this.instructions[idx++ % instructions.length];
  };
}
