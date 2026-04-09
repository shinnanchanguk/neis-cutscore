import type {
  Item,
  TargetDistribution,
  Difficulty,
  Grade,
  NeisCell,
  NeisOutput,
  CellExplanation,
} from '../types';
import { PhiInv, Phi, clamp } from './normal';
import { boundaryItemProbability } from './rasch';
import { roundTo5, enforceMonotonicity } from './rounding';
import { validateOutput } from './validate';

const DIFFICULTY_ORDER: Difficulty[] = ['쉬움', '보통', '어려움'];

interface ComputeOptions {
  sigma?: number;
  includeE미도달?: boolean;
}

/**
 * Compute boundary z-values from target distribution.
 * z_AB = PhiInv(1 - A/100), z_BC = PhiInv(1 - (A+B)/100), etc.
 * Clamped to [-3, 3].
 */
function computeBoundaryZ(target: TargetDistribution): Record<string, number> {
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

/**
 * Main function to compute NEIS output from items, target distribution, and options.
 */
export function computeNeisOutput(
  items: Item[],
  target: TargetDistribution,
  options: ComputeOptions = {}
): NeisOutput {
  const sigma = options.sigma ?? 15;
  const includeE미도달 = options.includeE미도달 ?? true;

  // Handle empty items case
  if (items.length === 0) {
    const emptyCutScores = { AB: 0, BC: 0, CD: 0, DE: 0 };
    const emptyDist: TargetDistribution = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    const warnings = validateOutput([], emptyCutScores, target, []);
    return {
      cells: [],
      cutScores: emptyCutScores,
      predictedDistribution: emptyDist,
      warnings,
    };
  }

  // 1. Compute boundary z-values
  const boundaryZ = computeBoundaryZ(target);
  const boundaryEntries: Array<{ grade: Grade; z: number }> = [
    { grade: 'A', z: boundaryZ.AB },
    { grade: 'B', z: boundaryZ.BC },
    { grade: 'C', z: boundaryZ.CD },
    { grade: 'D', z: boundaryZ.DE },
    { grade: 'E', z: boundaryZ.E },
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

  // 5. E_미도달: use D cell value * 0.5, rounded to 5%
  if (includeE미도달) {
    for (const category of presentCategories) {
      const dCell = cells.find(c => c.difficulty === category && c.grade === 'D');
      if (dCell) {
        cells.push({
          difficulty: category,
          grade: 'E_미도달',
          value: roundTo5(dCell.value * 0.5),
        });
      }
    }
  }

  // 6. Compute cut scores: sum(catPoints * cellValue / 100) for each grade boundary
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
    // E_미도달 cut score: use E_미도달 cells
    let eMidodalScore = 0;
    for (const category of presentCategories) {
      const cell = cells.find(c => c.difficulty === category && c.grade === 'E_미도달');
      const catItems = grouped[category];
      const catPoints = catItems.reduce((sum, item) => sum + item.points, 0);
      if (cell) {
        eMidodalScore += catPoints * (cell.value / 100);
      }
    }
    cutScores.E_미도달 = Math.round(eMidodalScore * 10) / 10;
  }

  // 7. Compute predicted distribution using normal CDF with sigma parameter
  const meanScore = items.reduce((sum, item) => sum + item.points * (item.expectedRate / 100), 0);

  function pctAbove(cutScore: number): number {
    return (1 - Phi((cutScore - meanScore) / sigma)) * 100;
  }

  const abovAB = pctAbove(cutScores.AB);
  const abovBC = pctAbove(cutScores.BC);
  const abovCD = pctAbove(cutScores.CD);
  const abovDE = pctAbove(cutScores.DE);

  const predA = clamp(abovAB, 0, 100);
  const predAB = clamp(abovBC, 0, 100);
  const predABC = clamp(abovCD, 0, 100);
  const predABCD = clamp(abovDE, 0, 100);

  const predictedDistribution: TargetDistribution = {
    A: Math.round(predA * 10) / 10,
    B: Math.round((predAB - predA) * 10) / 10,
    C: Math.round((predABC - predAB) * 10) / 10,
    D: Math.round((predABCD - predABC) * 10) / 10,
    E: Math.round((100 - predABCD) * 10) / 10,
  };

  // 8. Validate and generate warnings
  const warnings = validateOutput(cells, cutScores, target, items);

  return {
    cells,
    cutScores,
    predictedDistribution,
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
  const boundaryZ = computeBoundaryZ(target);
  const gradeToKey: Record<Grade, string> = {
    A: 'AB',
    B: 'BC',
    C: 'CD',
    D: 'DE',
    E: 'DE', // E uses DE boundary as reference
  };
  const z_k = boundaryZ[gradeToKey[grade]] ?? 0;

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
