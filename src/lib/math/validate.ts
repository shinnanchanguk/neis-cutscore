import type { NeisCell, TargetDistribution, Item, Warning } from '../types';

export function validateOutput(
  _cells: NeisCell[],
  cutScores: { AB: number; BC: number; CD: number; DE: number; E미도달?: number },
  target: TargetDistribution,
  items: Item[]
): Warning[] {
  const warnings: Warning[] = [];

  // SUM_NOT_100: target percentages don't sum to 100
  const sum = target.A + target.B + target.C + target.D + target.E;
  if (Math.abs(sum - 100) > 0.01) {
    warnings.push({
      level: 'error',
      code: 'SUM_NOT_100',
      message: `목표 분포의 합이 100이 아닙니다 (현재: ${sum.toFixed(2)}%). A+B+C+D+E = 100이 되어야 합니다.`,
    });
  }

  // NEGATIVE_INPUT: any target value < 0
  for (const [grade, value] of Object.entries(target)) {
    if ((value as number) < 0) {
      warnings.push({
        level: 'error',
        code: 'NEGATIVE_INPUT',
        message: `${grade} 등급의 목표 비율이 음수입니다 (${value}%). 0 이상의 값을 입력하세요.`,
      });
    }
  }

  // A_OVER_40: target.A > 40
  if (target.A > 40) {
    warnings.push({
      level: 'warning',
      code: 'A_OVER_40',
      message: `A 등급 목표 비율이 40%를 초과합니다 (현재: ${target.A}%). 결과의 신뢰성이 낮아질 수 있습니다.`,
    });
  }

  // E_OVER_40: target.E > 40
  if (target.E > 40) {
    warnings.push({
      level: 'warning',
      code: 'E_OVER_40',
      message: `E 등급 목표 비율이 40%를 초과합니다 (현재: ${target.E}%). 결과의 신뢰성이 낮아질 수 있습니다.`,
    });
  }

  // MIN_LEVEL_WARN: cutScores.DE < 40
  if (cutScores.DE < 40) {
    const percentileNote = target.E > 0
      ? ` 현재 목표 비율에서는 D/E가 하위 ${target.E}% 경계입니다.`
      : ' 현재 목표 비율에서는 D/E가 E 진입선입니다.';
    warnings.push({
      level: 'warning',
      code: 'MIN_LEVEL_WARN',
      message: `D-E 경계 점수가 40점 미만입니다 (현재: ${cutScores.DE}점).${percentileNote} 최저 학력 기준을 확인하세요.`,
    });
  }

  if (items.length > 0) {
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
  }

  return warnings;
}
