import { Observable, map, toArray } from "rxjs";
import { Solver } from "../core/solver";

export class Day07 extends Solver {
  public static readonly cardsPartOne: Map<string, number> = new Map([
    ["2", 1],
    ["3", 2],
    ["4", 3],
    ["5", 4],
    ["6", 5],
    ["7", 6],
    ["8", 7],
    ["9", 8],
    ["T", 9],
    ["J", 10],
    ["Q", 11],
    ["K", 12],
    ["A", 13],
  ]);

  public static readonly cardsPartTwo: Map<string, number> = new Map([
    ["J", 0],
    ["2", 1],
    ["3", 2],
    ["4", 3],
    ["5", 4],
    ["6", 5],
    ["7", 6],
    ["8", 7],
    ["9", 8],
    ["T", 9],
    ["Q", 11],
    ["K", 12],
    ["A", 13],
  ]);

  constructor() {
    super(7);
  }

  solveForPartOne(): Observable<string | number> {
    return this.lines$().pipe(
      map((line: string) => new Hand(line)),
      toArray(),
      map((hands: Hand[]) =>
        hands.sort((a: Hand, b: Hand) => a.compareFnPartOne(b))
      ),
      map((hands: Hand[]) =>
        hands.reduce((acc, curr, index) => acc + (index + 1) * curr.bid, 0)
      )
    );
  }

  solveForPartTwo(): Observable<string | number> {
    return this.lines$().pipe(
      map((line: string) => new Hand(line, true)),
      toArray(),
      map((hands: Hand[]) =>
        hands.sort((a: Hand, b: Hand) => a.compareFnPartTwo(b))
      ),
      map((hands: Hand[]) =>
        hands.reduce((acc, curr, index) => acc + (index + 1) * curr.bid, 0)
      )
    );
  }

  // TODO: THIS IS DAY SEVEN!
}

class Hand {
  private hand: string[];
  public readonly type: HandType;
  public readonly bid: number;

  constructor(input: string, doUpgrade: boolean = false) {
    const [hand, bid] = input.split(" ");
    this.hand = hand.split("");
    this.type =
      doUpgrade && this.hand.includes("J")
        ? this.upgrade(this.determineHandType())
        : this.determineHandType();
    this.bid = +bid;
  }

  private upgrade(type: HandType): HandType {
    switch (type) {
      case HandType.HIGH_CARD:
        return HandType.PAIR;
      case HandType.PAIR:
        return HandType.THREE_OF_A_KIND;
      case HandType.TWO_PAIR:
        return this.hand.filter((c) => c === "J").length === 2
          ? HandType.FOUR_OF_A_KIND
          : HandType.FULL_HOUSE;
      case HandType.THREE_OF_A_KIND:
        return HandType.FOUR_OF_A_KIND;
      case HandType.FULL_HOUSE:
        return HandType.FIVE_OF_A_KIND;
      case HandType.FOUR_OF_A_KIND:
        return HandType.FIVE_OF_A_KIND;
      case HandType.FIVE_OF_A_KIND:
        return HandType.FIVE_OF_A_KIND;
    }
  }

  public compareFnPartOne(other: Hand): number {
    if (this.type < other.type) return -1;
    else if (this.type > other.type) return 1;
    else {
      let idx = 0;
      while (
        Day07.cardsPartOne.get(this.hand[idx]) ===
        Day07.cardsPartOne.get(other.hand[idx])
      )
        idx++;
      return (
        Day07.cardsPartOne.get(this.hand[idx])! -
        Day07.cardsPartOne.get(other.hand[idx])!
      );
    }
  }

  public compareFnPartTwo(other: Hand): number {
    if (this.type < other.type) return -1;
    else if (this.type > other.type) return 1;
    else {
      let idx = 0;
      while (
        Day07.cardsPartTwo.get(this.hand[idx]) ===
        Day07.cardsPartTwo.get(other.hand[idx])
      )
        idx++;
      return (
        Day07.cardsPartTwo.get(this.hand[idx])! -
        Day07.cardsPartTwo.get(other.hand[idx])!
      );
    }
  }

  private determineHandType = (): HandType => {
    if (this.isFiveOfAKind(this.hand)) return HandType.FIVE_OF_A_KIND;
    else if (this.isFourOfAKind(this.hand)) return HandType.FOUR_OF_A_KIND;
    else if (this.isFullHouse(this.hand)) return HandType.FULL_HOUSE;
    else if (this.isThreeOfAKind(this.hand)) return HandType.THREE_OF_A_KIND;
    else if (this.isTwoPair(this.hand)) return HandType.TWO_PAIR;
    else if (this.isPair(this.hand)) return HandType.PAIR;
    else return HandType.HIGH_CARD;
  };

  // 1 1 1 2
  private isPair = (hand: string[]): boolean => hand.unique().length === 4;

  // 1 2 2
  private isTwoPair = (hand: string[]): boolean =>
    hand.unique().length === 3 &&
    hand.unique().every((c) => hand.filter((x) => x === c).length <= 2);

  // 3 1 1
  private isThreeOfAKind = (hand: string[]): boolean =>
    hand.unique().length === 3 &&
    hand.unique().some((c) => hand.filter((x) => x === c).length === 3);

  // 3 2
  private isFullHouse = (hand: string[]): boolean =>
    hand.unique().length === 2 &&
    hand.unique().every((c) => {
      const l = hand.filter((x) => x === c).length;
      return l === 2 || l === 3;
    });

  // 4 1
  private isFourOfAKind = (hand: string[]): boolean =>
    hand.unique().some((c) => hand.filter((x) => x === c).length === 4);

  // 5
  private isFiveOfAKind = (hand: string[]): boolean =>
    hand.unique().length === 1;
}

enum HandType {
  "HIGH_CARD" = 0,
  "PAIR" = 1,
  "TWO_PAIR" = 3,
  "THREE_OF_A_KIND" = 4,
  "FULL_HOUSE" = 5,
  "FOUR_OF_A_KIND" = 6,
  "FIVE_OF_A_KIND" = 7,
}
