interface Array<T> {
  unique(): T[];
  sum(seed: T): T;
  product(seed: T): T;
  diff(): T[];
  slidingWindow(windowSize: number): T[][];
  transpose(): T[];
  combinations(): T[][];
}

Array.prototype.unique = function <T>(): T[] {
  return this.filter(
    (value: T, index: number, self: T[]) => self.indexOf(value) === index
  );
};

Array.prototype.sum = function (seed: number = 0): number {
  return this.reduce((acc: number, value: number) => acc + value, seed);
};

Array.prototype.sum = function (seed: string = ""): string {
  return this.reduce((acc: string, value: string) => acc + value, seed);
};

Array.prototype.product = function (seed: number = 1): number {
  return this.reduce((acc: number, value: number) => acc * value, seed);
};

Array.prototype.diff = function (): number[] {
  return this.reduce(
    (acc: number[], curr: number, index: number, self: number[]) => {
      if (index === self.length - 1) return acc;
      return [...acc, self[index + 1] - curr];
    },
    []
  );
};

Array.prototype.slidingWindow = function <T>(windowSize: number = 2): T[][] {
  return Array.from(Array(this.length - windowSize + 1).keys()).reduce(
    (acc: T[][], _, index: number) => [
      ...acc,
      this.slice(index, index + windowSize),
    ],
    [] as T[][]
  );
};

Array.prototype.transpose = function <T>(): T[][] {
  return this[0].map((_: T[], colIndex: number) =>
    this.map((row: T[]) => row[colIndex])
  );
};

Array.prototype.combinations = function <T>(): T[][] {
  return this.flatMap((v1: T, index: number) =>
    this.slice(index + 1).map((v2: T) => [v1, v2])
  );
};
