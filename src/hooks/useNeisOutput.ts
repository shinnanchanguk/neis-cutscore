import { useMemo } from 'react';
import { useExamStore } from '@/store/examStore';
import { computeNeisOutput } from '@/lib/math/cutscore';
import type { NeisOutput } from '@/lib/types';

export function useNeisOutput(): NeisOutput | null {
  const items = useExamStore(s => s.items);
  const target = useExamStore(s => s.targetDistribution);
  const sigma = useExamStore(s => s.settings.sigma);
  const includeE미도달 = useExamStore(s => s.settings.includeE미도달);

  return useMemo(() => {
    if (items.length === 0) return null;
    return computeNeisOutput(items, target, { sigma, includeE미도달 });
  }, [items, target, sigma, includeE미도달]);
}
