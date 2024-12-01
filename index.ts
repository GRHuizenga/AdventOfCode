import { forkJoin, Observable, of } from 'rxjs';
import { Day01 } from './2024/day01';
import './core/array-functions';
import { Solver } from './core/solver';

const days: Solver[] = [
  new Day01(),
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
