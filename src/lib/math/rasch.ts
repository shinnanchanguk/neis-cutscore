import { PhiInv, Phi, clamp } from './normal';

/**
 * Compute item difficulty parameter b_i from expected correct rate p_i (0~100).
 * b_i = -PhiInv(clamp(p_i/100, 0.01, 0.99))
 */
export function itemDifficulty(expectedRate: number): number {
  const p = clamp(expectedRate / 100, 0.01, 0.99);
  return -PhiInv(p);
}

/**
 * Probability of a student at grade boundary z_k getting item correct.
 * p_ik = Phi(z_k - b_i) = Phi(z_k + PhiInv(clamp(p_i/100, 0.01, 0.99)))
 */
export function boundaryItemProbability(z_k: number, expectedRate: number): number {
  const p = clamp(expectedRate / 100, 0.01, 0.99);
  return Phi(z_k + PhiInv(p));
}
