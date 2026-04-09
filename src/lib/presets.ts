import type { TargetDistribution, PresetName } from './types';

export const PRESETS: Record<PresetName, TargetDistribution> = {
  일반고: { A: 15, B: 30, C: 30, D: 18, E: 7 },
  과고_특목고: { A: 35, B: 35, C: 20, D: 8, E: 2 },
  사용자정의: { A: 20, B: 30, C: 30, D: 15, E: 5 },
};
