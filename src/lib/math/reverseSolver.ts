import type { Difficulty, Grade, NeisCell, Warning } from '../types';
import { roundTo5, enforceMonotonicity } from './rounding';

const DIFFICULTIES: Difficulty[] = ['쉬움', '보통', '어려움'];
const GRADES: Grade[] = ['A', 'B', 'C', 'D', 'E'];

export interface ReverseSolverInput {
  categoryPoints: Record<Difficulty, number>;
  desiredCutScores: Record<Grade, number>;
  spread?: number; // default 15
}

export interface ReverseSolverOutput {
  cells: NeisCell[];
  actualCutScores: Record<Grade, number>;
  deltas: Record<Grade, number>; // actual - desired
  warnings: Warning[];
}

/**
 * Reverse-solve NEIS table values from desired cut scores.
 *
 * Algorithm (Anchored Spread):
 * For each grade k:
 *   1. Compute overall target % = desiredCut / totalPoints * 100
 *   2. Set 쉬움 = target + spread, 어려움 = target - spread (rounded to 5)
 *   3. Solve 보통 to satisfy the weighted sum, then round to 5
 *   4. Enforce monotonicity
 *   5. Recompute actual cut scores from final values
 */
export function solveReverse(input: ReverseSolverInput): ReverseSolverOutput {
  const { categoryPoints, desiredCutScores, spread = 15 } = input;
  const warnings: Warning[] = [];

  const totalPoints =
    categoryPoints['쉬움'] + categoryPoints['보통'] + categoryPoints['어려움'];

  if (totalPoints <= 0) {
    return {
      cells: [],
      actualCutScores: { A: 0, B: 0, C: 0, D: 0, E: 0 },
      deltas: { A: 0, B: 0, C: 0, D: 0, E: 0 },
      warnings: [
        { level: 'error', code: 'ZERO_TOTAL', message: '총 배점이 0입니다.' },
      ],
    };
  }

  const pEasy = categoryPoints['쉬움'];
  const pMid = categoryPoints['보통'];
  const pHard = categoryPoints['어려움'];

  const cells: NeisCell[] = [];

  for (const grade of GRADES) {
    const desired = desiredCutScores[grade];
    const targetPct = (desired / totalPoints) * 100;

    // 쉬움: target + spread, 어려움: target - spread
    const rawEasy = roundTo5(targetPct + spread);
    const rawHard = roundTo5(targetPct - spread);

    // 보통을 역산: pEasy * easy/100 + pMid * mid/100 + pHard * hard/100 = desired
    // mid = (desired - pEasy * rawEasy/100 - pHard * rawHard/100) * 100 / pMid
    let rawMid: number;
    if (pMid > 0) {
      rawMid = roundTo5(
        ((desired - pEasy * (rawEasy / 100) - pHard * (rawHard / 100)) * 100) /
          pMid
      );
    } else {
      rawMid = roundTo5(targetPct);
    }

    cells.push(
      { difficulty: '쉬움', grade, value: rawEasy },
      { difficulty: '보통', grade, value: rawMid },
      { difficulty: '어려움', grade, value: rawHard },
    );
  }

  // Enforce monotonicity
  enforceMonotonicity(cells, DIFFICULTIES);

  // Recompute actual cut scores
  const actualCutScores = {} as Record<Grade, number>;
  const deltas = {} as Record<Grade, number>;

  for (const grade of GRADES) {
    let score = 0;
    for (const diff of DIFFICULTIES) {
      const cell = cells.find(
        (c) => c.difficulty === diff && c.grade === grade
      );
      if (cell) {
        score += categoryPoints[diff] * (cell.value / 100);
      }
    }
    actualCutScores[grade] = Math.round(score * 10) / 10;
    deltas[grade] =
      Math.round((actualCutScores[grade] - desiredCutScores[grade]) * 10) / 10;
  }

  // Warnings
  for (const grade of GRADES) {
    if (Math.abs(deltas[grade]) > 2) {
      warnings.push({
        level: 'warning',
        code: 'LARGE_DELTA',
        message: `${grade}등급 분할점수가 희망값과 ${Math.abs(deltas[grade])}점 차이납니다. (희망: ${desiredCutScores[grade]}, 실제: ${actualCutScores[grade]})`,
      });
    }
  }

  // Check for any cell at 0 or 100 boundary
  for (const cell of cells) {
    if (cell.value === 0 && cell.grade !== 'E') {
      warnings.push({
        level: 'info',
        code: 'MIN_VALUE',
        message: `${cell.difficulty} ${cell.grade}등급 값이 0%입니다.`,
      });
    }
    if (cell.value === 100) {
      warnings.push({
        level: 'info',
        code: 'MAX_VALUE',
        message: `${cell.difficulty} ${cell.grade}등급 값이 100%입니다.`,
      });
    }
  }

  return { cells, actualCutScores, deltas, warnings };
}
