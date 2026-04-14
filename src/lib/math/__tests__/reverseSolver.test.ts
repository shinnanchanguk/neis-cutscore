import { describe, it, expect } from 'vitest';
import { solveReverse } from '../reverseSolver';
import type { Difficulty, Grade } from '../../types';

const DIFFICULTIES: Difficulty[] = ['쉬움', '보통', '어려움'];
const GRADES: Grade[] = ['A', 'B', 'C', 'D', 'E'];

describe('solveReverse', () => {
  it('produces cuts close to desired (28/42/30, cuts 75/58/41/27/11)', () => {
    const result = solveReverse({
      categoryPoints: { '쉬움': 28, '보통': 42, '어려움': 30 },
      desiredCutScores: { A: 75, B: 58, C: 41, D: 27, E: 11 },
    });

    expect(result.cells).toHaveLength(15);
    for (const grade of GRADES) {
      expect(Math.abs(result.deltas[grade])).toBeLessThanOrEqual(5);
    }
  });

  it('all values are multiples of 5 in [0, 100]', () => {
    const result = solveReverse({
      categoryPoints: { '쉬움': 28, '보통': 42, '어려움': 30 },
      desiredCutScores: { A: 75, B: 58, C: 41, D: 27, E: 11 },
    });

    for (const cell of result.cells) {
      expect(cell.value % 5).toBe(0);
      expect(cell.value).toBeGreaterThanOrEqual(0);
      expect(cell.value).toBeLessThanOrEqual(100);
    }
  });

  it('enforces row monotonicity (A >= B >= C >= D >= E per difficulty)', () => {
    const result = solveReverse({
      categoryPoints: { '쉬움': 30, '보통': 40, '어려움': 30 },
      desiredCutScores: { A: 80, B: 60, C: 40, D: 20, E: 10 },
    });

    for (const diff of DIFFICULTIES) {
      const values = GRADES.map(
        (g) => result.cells.find((c) => c.difficulty === diff && c.grade === g)!.value
      );
      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeLessThanOrEqual(values[i - 1]);
      }
    }
  });

  it('enforces column monotonicity (쉬움 >= 보통 >= 어려움 per grade)', () => {
    const result = solveReverse({
      categoryPoints: { '쉬움': 30, '보통': 40, '어려움': 30 },
      desiredCutScores: { A: 80, B: 60, C: 40, D: 20, E: 10 },
    });

    for (const grade of GRADES) {
      const values = DIFFICULTIES.map(
        (d) => result.cells.find((c) => c.difficulty === d && c.grade === grade)!.value
      );
      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeLessThanOrEqual(values[i - 1]);
      }
    }
  });

  it('handles zero total points gracefully', () => {
    const result = solveReverse({
      categoryPoints: { '쉬움': 0, '보통': 0, '어려움': 0 },
      desiredCutScores: { A: 75, B: 58, C: 41, D: 27, E: 11 },
    });

    expect(result.cells).toHaveLength(0);
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0].code).toBe('ZERO_TOTAL');
  });

  it('handles extreme cut scores near 0 and 100', () => {
    const result = solveReverse({
      categoryPoints: { '쉬움': 30, '보통': 40, '어려움': 30 },
      desiredCutScores: { A: 95, B: 80, C: 50, D: 10, E: 3 },
    });

    expect(result.cells).toHaveLength(15);
    for (const cell of result.cells) {
      expect(cell.value).toBeGreaterThanOrEqual(0);
      expect(cell.value).toBeLessThanOrEqual(100);
    }
  });

  it('custom spread parameter changes output', () => {
    const base = solveReverse({
      categoryPoints: { '쉬움': 28, '보통': 42, '어려움': 30 },
      desiredCutScores: { A: 75, B: 58, C: 41, D: 27, E: 11 },
      spread: 15,
    });

    const wide = solveReverse({
      categoryPoints: { '쉬움': 28, '보통': 42, '어려움': 30 },
      desiredCutScores: { A: 75, B: 58, C: 41, D: 27, E: 11 },
      spread: 25,
    });

    // With wider spread, 쉬움 A should be higher (or equal) and 어려움 A should be lower (or equal)
    const baseEasyA = base.cells.find((c) => c.difficulty === '쉬움' && c.grade === 'A')!.value;
    const wideEasyA = wide.cells.find((c) => c.difficulty === '쉬움' && c.grade === 'A')!.value;
    const baseHardA = base.cells.find((c) => c.difficulty === '어려움' && c.grade === 'A')!.value;
    const wideHardA = wide.cells.find((c) => c.difficulty === '어려움' && c.grade === 'A')!.value;

    expect(wideEasyA).toBeGreaterThanOrEqual(baseEasyA);
    expect(wideHardA).toBeLessThanOrEqual(baseHardA);
  });

  it('handles one category with 0 points', () => {
    const result = solveReverse({
      categoryPoints: { '쉬움': 50, '보통': 50, '어려움': 0 },
      desiredCutScores: { A: 75, B: 58, C: 41, D: 27, E: 11 },
    });

    expect(result.cells).toHaveLength(15);
    // 어려움 cells exist but don't contribute to cut scores
    for (const grade of GRADES) {
      const hardCell = result.cells.find(
        (c) => c.difficulty === '어려움' && c.grade === grade
      );
      expect(hardCell).toBeDefined();
    }
  });
});
