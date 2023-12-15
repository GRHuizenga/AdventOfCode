import { Observable, map, tap, toArray } from "rxjs";
import { Solver } from "../core/solver";

export class Day04 extends Solver {
  constructor() {
    super(4);
  }

  solveForPartOne(): Observable<string | number> {
    return this.lines$().pipe(
      map((line: string) => new ScratchCard(line)),
      map((scratchCard: ScratchCard) => scratchCard.worth),
      toArray(),
      map(Array.prototype.sum)
    );
  }

  private scratchCards!: ScratchCard[];

  solveForPartTwo(): Observable<string | number> {
    return this.lines$().pipe(
      map((line: string) => new ScratchCard(line)),
      toArray(),
      tap((scratchCards: ScratchCard[]) => (this.scratchCards = scratchCards)),
      map(() =>
        this.computePileOfCardsRecursive(
          1,
          new Map<number, number>(
            this.scratchCards.map((card) => [card.game, 1])
          )
        )
      ),
      map((pileOfCards: Map<number, number>) =>
        Array.from(pileOfCards.values()).sum(0)
      )
    );
  }

  private computePileOfCardsRecursive(
    game: number,
    pileOfCards: Map<number, number>
  ): Map<number, number> {
    const currentCard: ScratchCard = this.scratchCards[game - 1];
    if (currentCard.worthPart2 > 0) {
      for (
        let i: number = game + 1;
        i <= Math.min(game + currentCard.worthPart2, this.scratchCards.length);
        i++
      ) {
        pileOfCards.set(i, pileOfCards.get(i)! + pileOfCards.get(game)!);
      }
    }
    return game === this.scratchCards.length
      ? pileOfCards
      : this.computePileOfCardsRecursive(game + 1, pileOfCards);
  }
}

class ScratchCard {
  public readonly game: number;
  public readonly winningNummers: number[];
  public readonly myNumbers: number[];

  public get worth(): number {
    const n = this.myNumbers.filter((num: number) =>
      this.winningNummers.includes(num)
    );
    return n.length > 0 ? Math.pow(2, n.length - 1) : 0;
  }

  public get worthPart2(): number {
    return this.myNumbers.filter((num: number) =>
      this.winningNummers.includes(num)
    ).length;
  }

  constructor(input: string) {
    const digits: RegExp = new RegExp("(\\d+)", "g");
    const allDigits = Array.from(input.match(digits)!);
    this.game = +allDigits.slice(0, 1);
    this.winningNummers = allDigits.slice(1, 11).map(Number);
    this.myNumbers = allDigits.slice(11).map(Number);
  }
}
