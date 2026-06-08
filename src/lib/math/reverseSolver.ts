import type { Difficulty, Grade, NeisCell, Warning } from '../types';
import { minStandardCut } from '../types';
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
  미이수기준: number; // 최소성취수준 고정 기준 = 총점 × 40%
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
      미이수기준: 0,
      warnings: [
        { level: 'error', code: 'ZERO_TOTAL', message: '총 배점이 0입니다.' },
      ],
    };
  }

  const 미이수기준 = minStandardCut(totalPoints);

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

  // 최소성취수준(총점 40%)이 D/E 컷보다 높으면 미이수 과다 우려
  if (미이수기준 > actualCutScores['D']) {
    warnings.push({
      level: 'info',
      code: 'MINSTD_ABOVE_DE',
      message: `최소성취수준(미이수) 기준 ${미이수기준}점(총점의 40%)이 D/E 컷 ${actualCutScores['D']}점보다 높습니다. 미이수(보장지도) 대상이 많아질 수 있습니다.`,
    });
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

  return { cells, actualCutScores, deltas, 미이수기준, warnings };
}

/** 선택형·서답형 역산 결과를 합산한 분리 모드 출력 */
export interface CombinedReverseOutput {
  선택형: ReverseSolverOutput;
  서답형: ReverseSolverOutput;
  combinedActualCutScores: Record<Grade, number>;
  combinedDeltas: Record<Grade, number>;
  미이수기준: number; // 전체 총점 × 40%
  warnings: Warning[];
}

/**
 * 두 영역의 solveReverse 결과를 합산한다.
 * 총 실제컷 = 선택형컷 + 서답형컷, 총 delta = 선택형delta + 서답형delta.
 * 미이수기준은 전체 총점 × 40% 단일 기준.
 */
export function combineReverseOutputs(
  선택형: ReverseSolverOutput,
  서답형: ReverseSolverOutput,
  totalPoints: number
): CombinedReverseOutput {
  const combinedActualCutScores = {} as Record<Grade, number>;
  const combinedDeltas = {} as Record<Grade, number>;

  for (const grade of GRADES) {
    combinedActualCutScores[grade] = Math.round(
      (선택형.actualCutScores[grade] + 서답형.actualCutScores[grade]) * 10
    ) / 10;
    combinedDeltas[grade] = Math.round(
      (선택형.deltas[grade] + 서답형.deltas[grade]) * 10
    ) / 10;
  }

  const warnings: Warning[] = [
    ...선택형.warnings.map((w) => ({ ...w, message: `[선택형] ${w.message}` })),
    ...서답형.warnings.map((w) => ({ ...w, message: `[서답형] ${w.message}` })),
  ];

  return {
    선택형,
    서답형,
    combinedActualCutScores,
    combinedDeltas,
    미이수기준: minStandardCut(totalPoints),
    warnings,
  };
}
