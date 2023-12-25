import { Day01 } from './2023/day01';
import { Day02 } from './2023/day02';
import { Day03 } from './2023/day03';
import { Day04 } from './2023/day04';
import { Day05 } from './2023/day05';
import { Day06 } from './2023/day06';
import { Day07 } from './2023/day07';
import { Day08 } from './2023/day08';
import { Day09 } from './2023/day09';
import { Day10 } from './2023/day10';
import { Day11 } from './2023/day11';
import { Day14 } from './2023/day14';
import { Day15 } from './2023/day15';
import { Day18 } from './2023/day18';
import './core/array-functions';
import { Solver } from './core/solver';

const days: Solver[] = [
  new Day01(),
  new Day02(),
  new Day03(),
  new Day04(),
  new Day05(),
  new Day06(),
  new Day07(),
  new Day08(),
  new Day09(),
  new Day10(),
  new Day11(),
  new Day18(),
  new Day18(),
  new Day14(),
  new Day15(),
  new Day18(),
  new Day18(),
  new Day18(),
  // MORE DAYS HERE
];

const print =
  (part: number) =>
  (value: string | number): void => {
    console.log(`Part ${part} result:\n`);
    console.log(`${value}\n\n`);
  };

function runDay(dayId: number) {
  const day = days[dayId - 1];

  day.solveForPartOne().subscribe(print(1));
  day.solveForPartTwo().subscribe(print(2));
}

console.log('\n\n\n   ADVENT OF CODE \n\n');
const params = process.argv.splice(2);
if (params.length) {
  runDay(parseInt(params[0], 10));
} else {
  console.log(`Usage: npm run start [day]`);
  console.log(`Available days: [ ${days.map((x) => x.id).join(', ')} ]`);
}
