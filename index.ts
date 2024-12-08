import { forkJoin, Observable, of } from 'rxjs';
import { Solver } from './core/solver';
import './core/array-functions';
import { Day01 } from './2024/day01';
import { Day02 } from './2024/day02';
import { Day03 } from './2024/day03';
import { Day04 } from './2024/day04';
import { Day05 } from './2024/day05';
import { Day06 } from './2024/day06';
import { Day07 } from './2024/day07';

const days: Solver[] = [
  new Day01(),
  new Day02(),
  new Day03(),
  new Day04(),
  new Day05(),
  new Day06(),
  new Day07(),
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

  const part1Solution = day.solveForPartOne();
  const part2Solution = day.solveForPartTwo();

  forkJoin([
    part1Solution instanceof Observable ? part1Solution : of(part1Solution),
    part2Solution instanceof Observable ? part2Solution : of(part2Solution),
  ]).subscribe(([part1, part2]) => {
    print(1)(part1);
    print(2)(part2);
  });
}

console.log('\n\n\n   ADVENT OF CODE \n\n');
const params = process.argv.splice(2);
if (params.length) {
  runDay(parseInt(params[0], 10));
} else {
  console.log(`Usage: npm run start [day]`);
  console.log(`Available days: [ ${days.map((x) => x.id).join(', ')} ]`);
}
