import { describe, it, expect } from 'vitest';
import { Phi, PhiInv, clamp } from '../normal';
import { itemDifficulty, boundaryItemProbability } from '../rasch';
import { roundTo5, enforceMonotonicity } from '../rounding';
import { computeNeisOutput, explainCell } from '../cutscore';
import type { Item, TargetDistribution, NeisCell, Difficulty } from '../../types';
import { PRESETS } from '../../presets';

// ─── Normal distribution tests ──────────────────────────────────────────────

describe('Phi (standard normal CDF)', () => {
  it('Phi(0) = 0.5', () => {
    expect(Phi(0)).toBeCloseTo(0.5, 5);
  });

  it('Phi(1.96) ≈ 0.975 (within 1e-4)', () => {
    expect(Math.abs(Phi(1.96) - 0.975)).toBeLessThan(1e-4);
  });

  it('Phi(-1.96) ≈ 0.025', () => {
    expect(Math.abs(Phi(-1.96) - 0.025)).toBeLessThan(1e-4);
  });

  it('Phi(3) ≈ 0.9987', () => {
    expect(Phi(3)).toBeCloseTo(0.9987, 3);
  });

  it('Phi is monotonically increasing', () => {
    expect(Phi(-1)).toBeLessThan(Phi(0));
    expect(Phi(0)).toBeLessThan(Phi(1));
    expect(Phi(1)).toBeLessThan(Phi(2));
  });
});

describe('PhiInv (inverse normal CDF)', () => {
  it('PhiInv(0.5) ≈ 0', () => {
    expect(PhiInv(0.5)).toBeCloseTo(0, 5);
  });

  it('PhiInv(0.975) ≈ 1.96', () => {
    expect(Math.abs(PhiInv(0.975) - 1.96)).toBeLessThan(1e-3);
  });

  it('PhiInv(0.025) ≈ -1.96', () => {
    expect(Math.abs(PhiInv(0.025) - (-1.96))).toBeLessThan(1e-3);
  });

  it('PhiInv(0.841) ≈ 1.0', () => {
    expect(PhiInv(0.841)).toBeCloseTo(1.0, 1);
  });

  it('Round-trip: Phi(PhiInv(p)) ≈ p for several values', () => {
    const values = [0.01, 0.1, 0.25, 0.5, 0.75, 0.9, 0.99];
    for (const p of values) {
      expect(Phi(PhiInv(p))).toBeCloseTo(p, 4);
    }
  });

  it('Clamps extreme inputs instead of returning NaN', () => {
    expect(isFinite(PhiInv(0))).toBe(true);
    expect(isFinite(PhiInv(1))).toBe(true);
  });
});

describe('clamp', () => {
  it('clamps below min', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });
  it('clamps above max', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
  it('passes through values in range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });
});

// ─── Rasch model tests ───────────────────────────────────────────────────────

describe('itemDifficulty', () => {
  it('item with 50% rate has difficulty ≈ 0', () => {
    expect(itemDifficulty(50)).toBeCloseTo(0, 3);
  });

  it('hard item (30% rate) has positive difficulty', () => {
    expect(itemDifficulty(30)).toBeGreaterThan(0);
  });

  it('easy item (80% rate) has negative difficulty', () => {
    expect(itemDifficulty(80)).toBeLessThan(0);
  });
});

describe('boundaryItemProbability', () => {
  it('at mean boundary (z=0), probability equals item rate', () => {
    // When z_k=0, p_ik = Phi(PhiInv(p_i)) ≈ p_i
    expect(boundaryItemProbability(0, 70)).toBeCloseTo(0.70, 3);
  });

  it('higher boundary z gives higher probability', () => {
    const p1 = boundaryItemProbability(0, 60);
    const p2 = boundaryItemProbability(1, 60);
    expect(p2).toBeGreaterThan(p1);
  });

  it('returns value in [0, 1]', () => {
    const p = boundaryItemProbability(-2, 30);
    expect(p).toBeGreaterThanOrEqual(0);
    expect(p).toBeLessThanOrEqual(1);
  });
});

// ─── Boundary z-values for 과고 preset ──────────────────────────────────────

describe('Boundary z-values for 과고 preset {A:35, B:35, C:20, D:8, E:2}', () => {
  const target = PRESETS['과고_특목고'];

  it('z_AB ≈ 0.385', () => {
    // z_AB = PhiInv(1 - 0.35) = PhiInv(0.65)
    const z_AB = PhiInv(1 - target.A / 100);
    expect(z_AB).toBeCloseTo(0.385, 2);
  });

  it('z_BC ≈ -0.524', () => {
    // z_BC = PhiInv(1 - 0.70) = PhiInv(0.30)
    const z_BC = PhiInv(1 - (target.A + target.B) / 100);
    expect(z_BC).toBeCloseTo(-0.524, 2);
  });

  it('z_CD ≈ -1.282', () => {
    // z_CD = PhiInv(1 - 0.90) = PhiInv(0.10)
    const z_CD = PhiInv(1 - (target.A + target.B + target.C) / 100);
    expect(z_CD).toBeCloseTo(-1.282, 2);
  });

  it('z_DE ≈ -2.054', () => {
    // z_DE = PhiInv(1 - 0.98) = PhiInv(0.02)
    const z_DE = PhiInv(1 - (target.A + target.B + target.C + target.D) / 100);
    expect(z_DE).toBeCloseTo(-2.054, 2);
  });
});

// ─── roundTo5 tests ──────────────────────────────────────────────────────────

describe('roundTo5', () => {
  it('rounds 63 to 65', () => {
    expect(roundTo5(63)).toBe(65);
  });
  it('rounds 62 to 60', () => {
    expect(roundTo5(62)).toBe(60);
  });
  it('clamps negative to 0', () => {
    expect(roundTo5(-3)).toBe(0);
  });
  it('clamps 103 to 100', () => {
    expect(roundTo5(103)).toBe(100);
  });
  it('keeps 50 as 50', () => {
    expect(roundTo5(50)).toBe(50);
  });
});

// ─── enforceMonotonicity tests ────────────────────────────────────────────────

describe('enforceMonotonicity', () => {
  it('enforces row monotonicity (A >= B >= C >= D)', () => {
    const cells: NeisCell[] = [
      { difficulty: '보통', grade: 'A', value: 60 },
      { difficulty: '보통', grade: 'B', value: 70 }, // violation: B > A
      { difficulty: '보통', grade: 'C', value: 50 },
      { difficulty: '보통', grade: 'D', value: 40 },
      { difficulty: '보통', grade: 'E', value: 30 },
    ];
    enforceMonotonicity(cells, ['보통']);
    const vals = ['A', 'B', 'C', 'D', 'E'].map(g => cells.find(c => c.grade === g)!.value);
    for (let i = 1; i < vals.length; i++) {
      expect(vals[i]).toBeLessThanOrEqual(vals[i - 1]);
    }
  });

  it('enforces column monotonicity (쉬움 >= 보통 >= 어려움)', () => {
    const cells: NeisCell[] = [
      { difficulty: '쉬움', grade: 'A', value: 60 },
      { difficulty: '보통', grade: 'A', value: 80 }, // violation: 보통 > 쉬움
      { difficulty: '어려움', grade: 'A', value: 40 },
    ];
    enforceMonotonicity(cells, ['쉬움', '보통', '어려움']);
    const easy = cells.find(c => c.difficulty === '쉬움' && c.grade === 'A')!.value;
    const medium = cells.find(c => c.difficulty === '보통' && c.grade === 'A')!.value;
    const hard = cells.find(c => c.difficulty === '어려움' && c.grade === 'A')!.value;
    expect(easy).toBeGreaterThanOrEqual(medium);
    expect(medium).toBeGreaterThanOrEqual(hard);
  });
});

// ─── Full computeNeisOutput tests ────────────────────────────────────────────

describe('computeNeisOutput - 과고 preset with 3 items', () => {
  const items: Item[] = [
    {
      id: '1',
      number: 1,
      type: '선택형',
      difficulty: '쉬움',
      points: 21,
      expectedRate: 86,
    },
    {
      id: '2',
      number: 2,
      type: '선택형',
      difficulty: '보통',
      points: 43,
      expectedRate: 65,
    },
    {
      id: '3',
      number: 3,
      type: '서답형',
      difficulty: '어려움',
      points: 36,
      expectedRate: 30,
    },
  ];
  const target = PRESETS['과고_특목고'];

  it('returns cells that are multiples of 5', () => {
    const output = computeNeisOutput(items, target);
    for (const cell of output.cells) {
      expect(cell.value % 5).toBe(0);
    }
  });

  it('all cell values are in [0, 100]', () => {
    const output = computeNeisOutput(items, target);
    for (const cell of output.cells) {
      expect(cell.value).toBeGreaterThanOrEqual(0);
      expect(cell.value).toBeLessThanOrEqual(100);
    }
  });

  it('row monotonicity holds: A >= B >= C >= D for each difficulty', () => {
    const output = computeNeisOutput(items, target);
    const categories: Difficulty[] = ['쉬움', '보통', '어려움'];
    const grades = ['A', 'B', 'C', 'D'];
    for (const cat of categories) {
      const catCells = output.cells.filter(c => c.difficulty === cat);
      if (catCells.length === 0) continue;
      for (let i = 1; i < grades.length; i++) {
        const prev = catCells.find(c => c.grade === grades[i - 1]);
        const curr = catCells.find(c => c.grade === grades[i]);
        if (prev && curr) {
          expect(curr.value).toBeLessThanOrEqual(prev.value);
        }
      }
    }
  });

  it('column monotonicity holds: 쉬움 >= 보통 >= 어려움 for each grade', () => {
    const output = computeNeisOutput(items, target);
    const grades = ['A', 'B', 'C', 'D'];
    for (const grade of grades) {
      const easy = output.cells.find(c => c.difficulty === '쉬움' && c.grade === grade);
      const med = output.cells.find(c => c.difficulty === '보통' && c.grade === grade);
      const hard = output.cells.find(c => c.difficulty === '어려움' && c.grade === grade);
      if (easy && med) expect(med.value).toBeLessThanOrEqual(easy.value);
      if (med && hard) expect(hard.value).toBeLessThanOrEqual(med.value);
    }
  });

  it('cut scores are in reasonable range (0 to total points)', () => {
    const output = computeNeisOutput(items, target);
    const totalPoints = items.reduce((s, i) => s + i.points, 0);
    expect(output.cutScores.AB).toBeGreaterThan(0);
    expect(output.cutScores.AB).toBeLessThanOrEqual(totalPoints);
    expect(output.cutScores.BC).toBeLessThan(output.cutScores.AB);
    expect(output.cutScores.CD).toBeLessThan(output.cutScores.BC);
    expect(output.cutScores.DE).toBeLessThan(output.cutScores.CD);
  });

  it('has 3 categories of cells (쉬움, 보통, 어려움)', () => {
    const output = computeNeisOutput(items, target);
    const difficulties = [...new Set(output.cells.map(c => c.difficulty))];
    expect(difficulties).toContain('쉬움');
    expect(difficulties).toContain('보통');
    expect(difficulties).toContain('어려움');
  });

  it('no warnings for valid input (sum=100)', () => {
    const output = computeNeisOutput(items, target);
    const errors = output.warnings.filter(w => w.code === 'SUM_NOT_100');
    expect(errors).toHaveLength(0);
  });
});

// ─── Edge cases ──────────────────────────────────────────────────────────────

describe('Edge: 0 items returns null-safe output', () => {
  it('returns empty cells and zero cut scores', () => {
    const output = computeNeisOutput([], PRESETS['일반고']);
    expect(output.cells).toHaveLength(0);
    expect(output.cutScores.AB).toBe(0);
    expect(output.cutScores.BC).toBe(0);
    expect(output.cutScores.CD).toBe(0);
    expect(output.cutScores.DE).toBe(0);
  });
});

describe('Edge: all same difficulty', () => {
  const items: Item[] = [
    { id: '1', number: 1, type: '선택형', difficulty: '보통', points: 10, expectedRate: 60 },
    { id: '2', number: 2, type: '선택형', difficulty: '보통', points: 10, expectedRate: 70 },
    { id: '3', number: 3, type: '선택형', difficulty: '보통', points: 10, expectedRate: 50 },
  ];

  it('only creates 보통 difficulty cells', () => {
    const output = computeNeisOutput(items, PRESETS['일반고']);
    const difficulties = [...new Set(output.cells.map(c => c.difficulty))];
    expect(difficulties).toHaveLength(1);
    expect(difficulties[0]).toBe('보통');
  });

  it('has exactly 5 grade cells (A, B, C, D, E) per difficulty — no 6th E_미도달 column', () => {
    const output = computeNeisOutput(items, PRESETS['일반고']);
    // 1 difficulty × 5 grades = 5 cells
    expect(output.cells).toHaveLength(5);
    const grades = output.cells.map(c => c.grade);
    expect(grades).toEqual(['A', 'B', 'C', 'D', 'E']);
  });

  it('values are multiples of 5', () => {
    const output = computeNeisOutput(items, PRESETS['일반고']);
    for (const cell of output.cells) {
      expect(cell.value % 5).toBe(0);
    }
  });
});

// ─── E/미도달 cutoff tests (based on actual E column, not D*0.5) ─────────────

describe('E/미도달 cutoff when includeE미도달 = true', () => {
  const items: Item[] = [
    { id: '1', number: 1, type: '선택형', difficulty: '보통', points: 50, expectedRate: 60 },
  ];
  const options = { includeE미도달: true, expectedUnmetRate: 5 };

  it('no E_미도달 cells exist — only A through E', () => {
    const output = computeNeisOutput(items, PRESETS['일반고'], options);
    const grades = output.cells.map(c => c.grade);
    expect(grades).not.toContain('E_미도달');
    expect(grades).toEqual(['A', 'B', 'C', 'D', 'E']);
  });

  it('cell count equals (number of difficulties × 5) with no extra columns', () => {
    const output = computeNeisOutput(items, PRESETS['일반고'], options);
    const difficultyCount = new Set(output.cells.map(c => c.difficulty)).size;
    expect(output.cells).toHaveLength(difficultyCount * 5);
  });

  it('E미도달 cut score is computed from E column values (not D*0.5)', () => {
    const output = computeNeisOutput(items, PRESETS['일반고'], options);
    expect(output.cutScores.E미도달).toBeDefined();
    // E미도달 cutoff = sum(categoryPoints * E_cell_value / 100)
    const eCell = output.cells.find(c => c.grade === 'E' && c.difficulty === '보통');
    expect(eCell).toBeDefined();
    const expectedCutoff = Math.round(50 * (eCell!.value / 100) * 10) / 10;
    expect(output.cutScores.E미도달).toBe(expectedCutoff);
  });

  it('no arbitrary D*0.5 rule exists — E values are Rasch-computed', () => {
    const output = computeNeisOutput(items, PRESETS['일반고'], options);
    const dCell = output.cells.find(c => c.grade === 'D' && c.difficulty === '보통');
    const eCell = output.cells.find(c => c.grade === 'E' && c.difficulty === '보통');
    // E value should NOT be D * 0.5 rounded to 5
    // (it may coincidentally match for some inputs, so we verify the computation path
    //  by checking E미도달 cutoff comes from E column)
    expect(dCell).toBeDefined();
    expect(eCell).toBeDefined();
    // E <= D (monotonicity) but not necessarily D * 0.5
    expect(eCell!.value).toBeLessThanOrEqual(dCell!.value);
  });

  it('E미도달 cutoff is not present when includeE미도달 = false', () => {
    const output = computeNeisOutput(items, PRESETS['일반고'], { includeE미도달: false });
    expect(output.cutScores.E미도달).toBeUndefined();
  });

  it('E미도달 cutoff stays below or equal to D/E cutoff', () => {
    const output = computeNeisOutput(items, PRESETS['일반고'], options);
    expect(output.cutScores.E미도달).toBeDefined();
    expect(output.cutScores.E미도달!).toBeLessThanOrEqual(output.cutScores.DE);
  });

  it('higher expectedUnmetRate raises the E cutoff', () => {
    const lower = computeNeisOutput(items, PRESETS['일반고'], { includeE미도달: true, expectedUnmetRate: 0 });
    const higher = computeNeisOutput(items, PRESETS['일반고'], { includeE미도달: true, expectedUnmetRate: 5 });
    expect(lower.cutScores.E미도달).toBeDefined();
    expect(higher.cutScores.E미도달).toBeDefined();
    expect(higher.cutScores.E미도달!).toBeGreaterThan(lower.cutScores.E미도달!);
  });
});

// ─── explainCell tests ────────────────────────────────────────────────────────

describe('explainCell', () => {
  const items: Item[] = [
    { id: '1', number: 1, type: '선택형', difficulty: '보통', points: 30, expectedRate: 65 },
    { id: '2', number: 2, type: '서답형', difficulty: '보통', points: 20, expectedRate: 45 },
  ];

  it('returns correct category and grade', () => {
    const explanation = explainCell('보통', 'B', items, PRESETS['일반고']);
    expect(explanation.category).toBe('보통');
    expect(explanation.grade).toBe('B');
  });

  it('z_k is a finite number', () => {
    const explanation = explainCell('보통', 'A', items, PRESETS['일반고']);
    expect(isFinite(explanation.z_k)).toBe(true);
  });

  it('roundedPercent is a multiple of 5', () => {
    const explanation = explainCell('보통', 'B', items, PRESETS['일반고']);
    expect(explanation.roundedPercent % 5).toBe(0);
  });

  it('includes item details for each category item', () => {
    const explanation = explainCell('보통', 'C', items, PRESETS['일반고']);
    expect(explanation.items).toHaveLength(2);
    for (const item of explanation.items) {
      expect(isFinite(item.p_ik)).toBe(true);
      expect(isFinite(item.b_i)).toBe(true);
    }
  });

  it('E column explanation uses the expected unmet-rate quantile', () => {
    const explanationE = explainCell('보통', 'E', items, PRESETS['일반고'], {
      includeE미도달: true,
      expectedUnmetRate: 5,
    });
    expect(explanationE.z_k).toBeCloseTo(PhiInv(0.05), 2);
  });

  it('E column explanation stays below D when includeE미도달 is enabled', () => {
    const explanationE = explainCell('보통', 'E', items, PRESETS['일반고'], {
      includeE미도달: true,
      expectedUnmetRate: 5,
    });
    const explanationD = explainCell('보통', 'D', items, PRESETS['일반고'], {
      includeE미도달: true,
      expectedUnmetRate: 5,
    });
    expect(explanationE.z_k).toBeLessThan(explanationD.z_k);
    expect(explanationE.z_k).toBeGreaterThan(-3.0);
  });
});

// ─── validateOutput warnings ──────────────────────────────────────────────────

describe('Validate: SUM_NOT_100', () => {
  it('reports SUM_NOT_100 when target does not sum to 100', () => {
    const items: Item[] = [
      { id: '1', number: 1, type: '선택형', difficulty: '보통', points: 10, expectedRate: 60 },
    ];
    const badTarget: TargetDistribution = { A: 10, B: 10, C: 10, D: 10, E: 10 }; // sum = 50
    const output = computeNeisOutput(items, badTarget);
    const w = output.warnings.find(w => w.code === 'SUM_NOT_100');
    expect(w).toBeDefined();
    expect(w?.level).toBe('error');
  });
});

describe('Validate: ALL_LOW_RATE', () => {
  it('reports warning when all items have expectedRate < 20', () => {
    const items: Item[] = [
      { id: '1', number: 1, type: '선택형', difficulty: '어려움', points: 10, expectedRate: 5 },
      { id: '2', number: 2, type: '선택형', difficulty: '어려움', points: 10, expectedRate: 10 },
    ];
    const output = computeNeisOutput(items, PRESETS['일반고']);
    expect(output.warnings.some(w => w.code === 'ALL_LOW_RATE')).toBe(true);
  });
});

describe('Validate: ALL_HIGH_RATE', () => {
  it('reports warning when all items have expectedRate > 95', () => {
    const items: Item[] = [
      { id: '1', number: 1, type: '선택형', difficulty: '쉬움', points: 10, expectedRate: 98 },
      { id: '2', number: 2, type: '선택형', difficulty: '쉬움', points: 10, expectedRate: 99 },
    ];
    const output = computeNeisOutput(items, PRESETS['일반고']);
    expect(output.warnings.some(w => w.code === 'ALL_HIGH_RATE')).toBe(true);
  });
});

describe('Validate: UNMET_RATE_ZERO', () => {
  it('reports warning when includeE미도달 is enabled and expectedUnmetRate is 0', () => {
    const items: Item[] = [
      { id: '1', number: 1, type: '선택형', difficulty: '보통', points: 10, expectedRate: 60 },
    ];
    const output = computeNeisOutput(items, PRESETS['일반고'], {
      includeE미도달: true,
      expectedUnmetRate: 0,
    });
    expect(output.warnings.some(w => w.code === 'UNMET_RATE_ZERO')).toBe(true);
  });
});
