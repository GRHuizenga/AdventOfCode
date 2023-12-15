import { Observable, last, map, scan } from "rxjs";
import { Solver } from "../core/solver";

export class Day03 extends Solver {
  constructor() {
    super(3);
  }

  solveForPartOne(): Observable<string | number> {
    return this.lines$().pipe(
      map((line: string, lineNumber: number) => ({
        parts: this.toMachineParts(line, lineNumber),
        symbols: this.toSymbols(line, lineNumber),
      })),
      scan((acc, curr) => ({
        parts: acc.parts.concat(curr.parts),
        symbols: acc.symbols.concat(curr.symbols),
      })),
      last<{ parts: MachinePart[]; symbols: number[] }>(),
      map(({ parts, symbols }) =>
        parts
          .filter((part) =>
            part.neighbours.some((idx: number) => symbols.includes(idx))
          )
          .map((part) => part.partNumber)
      ),
      map(Array.prototype.sum)
    );
  }

  solveForPartTwo(): Observable<string | number> {
    return this.lines$().pipe(
      map((line: string, lineNumber: number) => ({
        parts: this.toMachineParts(line, lineNumber),
        symbols: this.toGearSymbols(line, lineNumber),
      })),
      scan((acc, curr) => ({
        parts: acc.parts.concat(curr.parts),
        symbols: acc.symbols.concat(curr.symbols),
      })),
      last<{ parts: MachinePart[]; symbols: number[] }>(),
      map(({ parts, symbols }) =>
        symbols
          .map((idx: number) =>
            parts.filter((part: MachinePart) => part.neighbours.includes(idx))
          )
          .filter((parts: MachinePart[]) => parts.length === 2)
          .map(
            (parts: MachinePart[]) => parts[0].partNumber * parts[1].partNumber
          )
      ),
      map(Array.prototype.sum)
    );
  }

  private readonly lineLength = 140;
  private readonly maxIndex = this.lineLength * this.lineLength;

  private toMachineParts = (
    line: string,
    lineNumber: number
  ): MachinePart[] => {
    const regexp = new RegExp("(\\d+)", "g");
    const partCandidates = line.match(regexp);
    return (partCandidates || []).map((part) => {
      const idx = line.indexOf(part);
      line = line.replace(part, ".".repeat(part.length));

      const allNeightbours = part
        .split("")
        .map((_, index: number) => this.getNeighbours(idx + index, lineNumber))
        .flat();
      return new MachinePart(part, allNeightbours);
    });
  };

  private toSymbols = (line: string, lineNumber: number): number[] =>
    line
      .split("")
      .map((char: string, idx: number) =>
        (char >= "0" && char <= "9") || char === "."
          ? -1
          : idx + lineNumber * this.lineLength
      )
      .filter((idx: number) => idx > -1);

  private toGearSymbols = (line: string, lineNumber: number): number[] =>
    line
      .split("")
      .map((char: string, idx: number) =>
        char !== "*" ? -1 : idx + lineNumber * this.lineLength
      )
      .filter((idx: number) => idx > -1);

  private getNeighbours = (idx: number, lineNr: number): number[] => {
    let indices: number[] = [
      idx + (lineNr - 1) * this.lineLength, // top
      idx + (lineNr + 1) * this.lineLength, // bottom
    ];

    if (idx - 1 >= 0) {
      indices = indices.concat([
        idx - 1 + lineNr * this.lineLength, // left
        idx - 1 + (lineNr - 1) * this.lineLength, // top left
        idx - 1 + (lineNr + 1) * this.lineLength, // bottom left
      ]);
    }

    if (idx + 1 < this.lineLength) {
      indices = indices.concat([
        idx + 1 + lineNr * this.lineLength, // right
        idx + 1 + (lineNr - 1) * this.lineLength, // top right
        idx + 1 + (lineNr + 1) * this.lineLength, // bottom right
      ]);
    }

    return indices.filter(
      (index: number) => index >= 0 && index < this.maxIndex
    );
  };
}

class MachinePart {
  public readonly partNumber: number;

  constructor(partNumber: string, public readonly neighbours: number[]) {
    this.partNumber = +partNumber;
  }
}
