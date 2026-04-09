import { useMemo } from 'react';
import { useExamStore } from '@/store/examStore';
import { computeNeisOutput } from '@/lib/math/cutscore';
import { DEFAULT_EXPECTED_UNMET_RATE } from '@/lib/presets';
import type { NeisOutput } from '@/lib/types';

export function useNeisOutput(): NeisOutput | null {
  const items = useExamStore(s => s.items);
  const target = useExamStore(s => s.targetDistribution);
  const includeE미도달 = useExamStore(s => s.settings.includeE미도달);
  const expectedUnmetRate = useExamStore(s => s.settings.expectedUnmetRate ?? DEFAULT_EXPECTED_UNMET_RATE);

  return useMemo(() => {
    if (items.length === 0) return null;
    return computeNeisOutput(items, target, { includeE미도달, expectedUnmetRate });
  }, [items, target, includeE미도달, expectedUnmetRate]);
}
