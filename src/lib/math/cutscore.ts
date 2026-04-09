import type {
  Item,
  TargetDistribution,
  Difficulty,
  Grade,
  NeisCell,
  NeisOutput,
  CellExplanation,
} from '../types';
import { PhiInv, clamp } from './normal';
import { boundaryItemProbability } from './rasch';
import { roundTo5, enforceMonotonicity } from './rounding';
import { validateOutput } from './validate';

const DIFFICULTY_ORDER: Difficulty[] = ['쉬움', '보통', '어려움'];
const ACHIEVEMENT_RATE_BY_GRADE: Record<Grade, number> = {
  A: 0.9,
  B: 0.8,
  C: 0.7,
  D: 0.6,
  E: 0.4,
};

interface ComputeOptions {
  includeE미도달?: boolean;
}

/**
 * Compute boundary z-values from target distribution.
 * z_AB = PhiInv(1 - A/100), z_BC = PhiInv(1 - (A+B)/100), etc.
 * Clamped to [-3, 3].
 */
function computeBoundaryZ(target: TargetDistribution): Record<'AB' | 'BC' | 'CD' | 'DE' | 'E', number> {
  const cumA = target.A / 100;
  const cumAB = (target.A + target.B) / 100;
  const cumABC = (target.A + target.B + target.C) / 100;
  const cumABCD = (target.A + target.B + target.C + target.D) / 100;
  const cumABCDE = (target.A + target.B + target.C + target.D + target.E) / 100;

  return {
    AB: clamp(PhiInv(1 - cumA), -3, 3),
    BC: clamp(PhiInv(1 - cumAB), -3, 3),
    CD: clamp(PhiInv(1 - cumABC), -3, 3),
    DE: clamp(PhiInv(1 - cumABCD), -3, 3),
    E: clamp(PhiInv(1 - cumABCDE), -3, 3),
  };
}

function expectedScoreAtAbility(items: Item[], z: number): number {
  return items.reduce((sum, item) => (
    sum + item.points * boundaryItemProbability(z, item.expectedRate)
  ), 0);
}

/**
 * Compute the ability level of the student who barely reaches a target
 * achievement rate (e.g. 90%, 80%, ..., 40% of total score).
 */
function computeAchievementBoundaryZ(items: Item[], achievementRate: number): number {
  const totalPoints = items.reduce((sum, item) => sum + item.points, 0);
  if (totalPoints <= 0) return -3;

  const targetScore = totalPoints * achievementRate;
  let low = -8;
  let high = 8;

  for (let i = 0; i < 60; i++) {
    const mid = (low + high) / 2;
    const score = expectedScoreAtAbility(items, mid);
    if (score < targetScore) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return (low + high) / 2;
}

function computeEffectiveBoundaryZ(
  items: Item[],
  target: TargetDistribution
): Record<Grade, number> {
  const targetBoundaryZ = computeBoundaryZ(target);
  const criterionBoundaryZ: Record<Grade, number> = {
    A: computeAchievementBoundaryZ(items, ACHIEVEMENT_RATE_BY_GRADE.A),
    B: computeAchievementBoundaryZ(items, ACHIEVEMENT_RATE_BY_GRADE.B),
    C: computeAchievementBoundaryZ(items, ACHIEVEMENT_RATE_BY_GRADE.C),
    D: computeAchievementBoundaryZ(items, ACHIEVEMENT_RATE_BY_GRADE.D),
    E: computeAchievementBoundaryZ(items, ACHIEVEMENT_RATE_BY_GRADE.E),
  };

  return {
    A: Math.max(targetBoundaryZ.AB, criterionBoundaryZ.A),
    B: Math.max(targetBoundaryZ.BC, criterionBoundaryZ.B),
    C: Math.max(targetBoundaryZ.CD, criterionBoundaryZ.C),
    D: Math.max(targetBoundaryZ.DE, criterionBoundaryZ.D),
    // E has no separate target-below-E input, so anchor it to the
    // minimum achievement criterion directly.
    E: criterionBoundaryZ.E,
  };
}

/**
 * Main function to compute NEIS output from items, target distribution, and options.
 */
export function computeNeisOutput(
  items: Item[],
  target: TargetDistribution,
  options: ComputeOptions = {}
): NeisOutput {
  const includeE미도달 = options.includeE미도달 ?? true;

  // Handle empty items case
  if (items.length === 0) {
    const emptyCutScores = { AB: 0, BC: 0, CD: 0, DE: 0 };
    const warnings = validateOutput([], emptyCutScores, target, []);
    return {
      cells: [],
      cutScores: emptyCutScores,
      warnings,
    };
  }

  // 1. Compute boundary z-values
  const effectiveBoundaryZ = computeEffectiveBoundaryZ(items, target);
  const boundaryEntries: Array<{ grade: Grade; z: number }> = [
    { grade: 'A', z: effectiveBoundaryZ.A },
    { grade: 'B', z: effectiveBoundaryZ.B },
    { grade: 'C', z: effectiveBoundaryZ.C },
    { grade: 'D', z: effectiveBoundaryZ.D },
    { grade: 'E', z: effectiveBoundaryZ.E },
  ];

  // 2. Group items by difficulty
  const grouped: Record<Difficulty, Item[]> = {
    '쉬움': [],
    '보통': [],
    '어려움': [],
  };
  for (const item of items) {
    grouped[item.difficulty].push(item);
  }
  const presentCategories = DIFFICULTY_ORDER.filter(d => grouped[d].length > 0);

  // 3. Compute cells: for each (category, grade), weighted average of boundaryItemProbability
  const cells: NeisCell[] = [];

  for (const category of presentCategories) {
    const categoryItems = grouped[category];
    const totalPoints = categoryItems.reduce((sum, item) => sum + item.points, 0);

    for (const { grade, z } of boundaryEntries) {
      let weightedSum = 0;
      for (const item of categoryItems) {
        const prob = boundaryItemProbability(z, item.expectedRate);
        weightedSum += prob * item.points;
      }
      const weightedAvg = totalPoints > 0 ? weightedSum / totalPoints : 0;
      const rawPercent = weightedAvg * 100;
      const value = roundTo5(rawPercent);

      cells.push({
        difficulty: category,
        grade,
        value,
      });
    }
  }

  // 4. Enforce monotonicity
  enforceMonotonicity(cells, presentCategories);

  // 5. Compute cut scores: sum(catPoints * cellValue / 100) for each grade boundary
  function computeCutScore(grade: Grade): number {
    let score = 0;
    for (const category of presentCategories) {
      const cell = cells.find(c => c.difficulty === category && c.grade === grade);
      const catItems = grouped[category];
      const catPoints = catItems.reduce((sum, item) => sum + item.points, 0);
      if (cell) {
        score += catPoints * (cell.value / 100);
      }
    }
    return Math.round(score * 10) / 10;
  }

  const cutScores: NeisOutput['cutScores'] = {
    AB: computeCutScore('A'),
    BC: computeCutScore('B'),
    CD: computeCutScore('C'),
    DE: computeCutScore('D'),
  };

  if (includeE미도달) {
    cutScores.E미도달 = computeCutScore('E');
  }

  // 8. Validate and generate warnings
  const warnings = validateOutput(cells, cutScores, target, items);

  return {
    cells,
    cutScores,
    warnings,
  };
}

/**
 * Get detailed explanation for a single cell (category, grade combination).
 */
export function explainCell(
  category: Difficulty,
  grade: Grade,
  items: Item[],
  target: TargetDistribution
): CellExplanation {
  const boundaryZ = computeEffectiveBoundaryZ(items, target);
  const z_k = boundaryZ[grade] ?? 0;

  const categoryItems = items.filter(item => item.difficulty === category);
  const totalPoints = categoryItems.reduce((sum, item) => sum + item.points, 0);

  const itemDetails = categoryItems.map(item => {
    const p_i = item.expectedRate;
    const p_clamped = clamp(p_i / 100, 0.01, 0.99);
    const b_i = -PhiInv(p_clamped);
    const p_ik = boundaryItemProbability(z_k, p_i);
    return {
      number: item.number,
      p_i,
      b_i,
      p_ik,
      points: item.points,
    };
  });

  let weightedSum = 0;
  for (const detail of itemDetails) {
    weightedSum += detail.p_ik * detail.points;
  }
  const weightedAvg = totalPoints > 0 ? weightedSum / totalPoints : 0;
  const rawPercent = weightedAvg * 100;
  const roundedPercent = roundTo5(rawPercent);

  return {
    category,
    grade,
    z_k,
    items: itemDetails,
    weightedAvg,
    rawPercent,
    roundedPercent,
  };
}
