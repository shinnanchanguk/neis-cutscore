import { useMemo } from 'react';
import { useSimpleStore } from '@/store/simpleStore';
import {
  solveReverse,
  combineReverseOutputs,
  type ReverseSolverOutput,
  type CombinedReverseOutput,
} from '@/lib/math/reverseSolver';
import type { Difficulty } from '@/lib/types';

function sumPoints(cp: Record<Difficulty, number>): number {
  return cp['쉬움'] + cp['보통'] + cp['어려움'];
}

export function useSimpleOutput(): ReverseSolverOutput {
  const categoryPoints = useSimpleStore((s) => s.categoryPoints);
  const desiredCutScores = useSimpleStore((s) => s.desiredCutScores);
  const spread = useSimpleStore((s) => s.spread);

  return useMemo(
    () => solveReverse({ categoryPoints, desiredCutScores, spread }),
    [categoryPoints, desiredCutScores, spread]
  );
}

/** 선택형·서답형 각각 역산 후 합산 (분리 ON에서 사용) */
export function useSimpleSplitOutput(): CombinedReverseOutput {
  const categoryPoints = useSimpleStore((s) => s.categoryPoints);
  const desiredCutScores = useSimpleStore((s) => s.desiredCutScores);
  const spread = useSimpleStore((s) => s.spread);
  const subjective = useSimpleStore((s) => s.subjective);

  return useMemo(() => {
    const 선택형Pts = sumPoints(categoryPoints);
    const 서답형Pts = sumPoints(subjective.categoryPoints);

    let 선택형 = solveReverse({ categoryPoints, desiredCutScores, spread });
    let 서답형 = solveReverse({
      categoryPoints: subjective.categoryPoints,
      desiredCutScores: subjective.desiredCutScores,
      spread,
    });

    // 배점이 0인 섹션의 "총 배점 0" 경고는 분리 입력 중에는 노이즈이므로 숨김
    if (선택형Pts <= 0) 선택형 = { ...선택형, warnings: [] };
    if (서답형Pts <= 0) 서답형 = { ...서답형, warnings: [] };

    return combineReverseOutputs(선택형, 서답형, 선택형Pts + 서답형Pts);
  }, [categoryPoints, desiredCutScores, spread, subjective]);
}
