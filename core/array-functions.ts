interface Array<T> {
  unique(): T[];
  sum(seed: T): T;
  product(seed: T): T;
  diff(): T[];
  frequencyMap(): { [key: string | number]: number };
  slidingWindow(windowSize: number): T[][];
  pairs(): T[][];
  transpose(): T[];
  combinations(): T[][];
  createRange(start: number, stop: number, step: number): number[];
}

Array.prototype.unique = function <T>(): T[] {
  return this.filter(
    (value: T, index: number, self: T[]) => self.indexOf(value) === index
  );
};

Array.prototype.sum = function (seed: number = 0): number {
  return this.reduce((acc: number, value: number) => acc + value, seed);
};

Array.prototype.sum = function (seed: string = ''): string {
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

Array.prototype.frequencyMap = function (): { [key: string | number]: number } {
  return this.reduce(
    (
      frequencyMap: { [key: string | number]: number },
      value: string | number
    ) => ({
      ...frequencyMap,
      [value]: (frequencyMap[value] || 0) + 1,
    }),
    {}
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

Array.prototype.pairs = function <T>(): T[][] {
  return Array.prototype
    .createRange(0, this.length - 2, 2)
    .reduce(
      (acc: T[][], index: number) => [...acc, this.slice(index, index + 2)],
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

Array.prototype.createRange = function (
  start: number,
  stop: number,
  step: number
): number[] {
  return Array.from(
    {
      length: (stop - start) / step + 1,
    },
    (_, index) => start + index * step
  );
};
