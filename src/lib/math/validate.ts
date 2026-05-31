import type { NeisCell, TargetDistribution, Item, Warning } from '../types';
import { minStandardCut } from '../types';

interface ValidationOptions {
  includeE미도달: boolean;
  expectedUnmetRate: number;
}

export function validateOutput(
  _cells: NeisCell[],
  _cutScores: { AB: number; BC: number; CD: number; DE: number; E미도달?: number },
  _target: TargetDistribution,
  items: Item[],
  options: ValidationOptions
): Warning[] {
  const warnings: Warning[] = [];

  // SUM_NOT_100: target percentages don't sum to 100
  const sum = _target.A + _target.B + _target.C + _target.D + _target.E;
  if (Math.abs(sum - 100) > 0.01) {
    warnings.push({
      level: 'error',
      code: 'SUM_NOT_100',
      message: `목표 분포의 합이 100이 아닙니다 (현재: ${sum.toFixed(2)}%). A+B+C+D+E = 100이 되어야 합니다.`,
    });
  }

  // NEGATIVE_INPUT: any target value < 0
  for (const [grade, value] of Object.entries(_target)) {
    if ((value as number) < 0) {
      warnings.push({
        level: 'error',
        code: 'NEGATIVE_INPUT',
        message: `${grade} 등급의 목표 비율이 음수입니다 (${value}%). 0 이상의 값을 입력하세요.`,
      });
    }
  }

  if (items.length > 0) {
    if (options.includeE미도달 && options.expectedUnmetRate <= 0) {
      warnings.push({
        level: 'warning',
        code: 'UNMET_RATE_ZERO',
        message: '5수준(A-E)+미도달인데 예상 미도달 비율이 0%입니다. E열이 지나치게 낮아질 수 있으니 실제 미도달 가능성을 다시 점검하세요.',
      });
    }

    // ALL_LOW_RATE: all items expectedRate < 20
    const allLow = items.every(item => item.expectedRate < 20);
    if (allLow) {
      warnings.push({
        level: 'warning',
        code: 'ALL_LOW_RATE',
        message: '모든 문항의 예상 정답률이 20% 미만입니다. 문항 난이도가 너무 높을 수 있습니다.',
      });
    }

    // ALL_HIGH_RATE: all items expectedRate > 95
    const allHigh = items.every(item => item.expectedRate > 95);
    if (allHigh) {
      warnings.push({
        level: 'warning',
        code: 'ALL_HIGH_RATE',
        message: '모든 문항의 예상 정답률이 95%를 초과합니다. 문항 난이도가 너무 낮을 수 있습니다.',
      });
    }

    // MINSTD_ABOVE_DE: 최소성취수준(총점 40%)이 D/E 분할점수보다 높음 → 미이수 과다 우려
    if (options.includeE미도달) {
      const totalPoints = items.reduce((sum, item) => sum + item.points, 0);
      const minCut = minStandardCut(totalPoints);
      if (totalPoints > 0 && minCut > _cutScores.DE) {
        warnings.push({
          level: 'warning',
          code: 'MINSTD_ABOVE_DE',
          message: `최소성취수준(미이수) 기준 ${minCut}점(총점의 40%)이 D/E 분할점수 ${_cutScores.DE}점보다 높습니다. 이 난이도에서는 미이수(보장지도) 대상이 많아질 수 있으니 문항 난이도·배점을 점검하세요.`,
        });
      }
    }
  }

  return warnings;
}
