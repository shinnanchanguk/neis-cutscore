import { useMemo } from 'react';
import { useSimpleStore } from '@/store/simpleStore';
import { solveReverse, type ReverseSolverOutput } from '@/lib/math/reverseSolver';

export function useSimpleOutput(): ReverseSolverOutput {
  const categoryPoints = useSimpleStore((s) => s.categoryPoints);
  const desiredCutScores = useSimpleStore((s) => s.desiredCutScores);
  const spread = useSimpleStore((s) => s.spread);

  return useMemo(
    () => solveReverse({ categoryPoints, desiredCutScores, spread }),
    [categoryPoints, desiredCutScores, spread]
  );
}
