import { Observable, filter, map, toArray } from "rxjs";
import { Solver } from "../core/solver";

type BagConfiguration = {
  red: number;
  green: number;
  blue: number;
};

export class Day02 extends Solver {
  private readonly bagConfiguration: BagConfiguration = {
    red: 12,
    green: 13,
    blue: 14,
  };

  constructor() {
    super(2);
  }

  solveForPartOne(): Observable<string | number> {
    return this.lines$().pipe(
      map((line: string) => new Game(line, this.bagConfiguration)),
      filter((game: Game) => game.isPossible()),
      map((game: Game) => game.id),
      toArray(),
      map(Array.prototype.sum)
    );
  }

  solveForPartTwo(): Observable<string | number> {
    return this.lines$().pipe(
      map((line: string) => new Game(line, this.bagConfiguration)),
      map((game: Game) => game.getMinimumConfiguration()),
      map(
        (minConfig: BagConfiguration) =>
          minConfig.red * minConfig.green * minConfig.blue
      ),
      toArray(),
      map(Array.prototype.sum)
    );
  }
}

class Game {
  private _id: number = 0;
  public get id() {
    return this._id;
  }
  public readonly turns: Turn[] = [];

  constructor(input: string, private config: BagConfiguration) {
    this.parseGame(input);
  }

  public isPossible = () =>
    this.turns.every((turn: Turn) => turn.isPossible(this.config));

  public getMinimumConfiguration = (): BagConfiguration =>
    this.turns.reduce(
      (acc: BagConfiguration, turn: Turn) => {
        acc.red = Math.max(acc.red, turn.red);
        acc.green = Math.max(acc.green, turn.green);
        acc.blue = Math.max(acc.blue, turn.blue);
        return acc;
      },
      { red: 0, green: 0, blue: 0 }
    );

  private parseGame(input: string): void {
    const gameAndTurns = input.split(": ");
    this._id = +gameAndTurns[0].replace(/\D/g, "").trim();
    gameAndTurns[1]
      .split("; ")
      .forEach((turn: string) => this.turns.push(new Turn(turn)));
  }
}

class Turn {
  private readonly regexp: RegExp = new RegExp(/\d* (red|green|blue)/, "g");

  private _red = 0;
  public get red() {
    return this._red;
  }
  private _green = 0;
  public get green() {
    return this._green;
  }
  private _blue = 0;
  public get blue() {
    return this._blue;
  }

  constructor(input: string) {
    this.parseTurn(input);
  }

  public readonly isPossible = (config: BagConfiguration) =>
    this._red <= config.red &&
    this._green <= config.green &&
    this._blue <= config.blue;

  private parseTurn(input: string): void {
    input.match(this.regexp)?.forEach((match: string) => {
      const matchSplit: string[] = match.split(" ");
      if (matchSplit[1] === "red") this._red = +matchSplit[0];
      else if (matchSplit[1] === "green") this._green = +matchSplit[0];
      else if (matchSplit[1] === "blue") this._blue = +matchSplit[0];
    });
  }
}
