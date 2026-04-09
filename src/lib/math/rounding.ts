import type { Difficulty, NeisCell } from '../types';

/**
 * Round a value to the nearest 5, clamped to [0, 100]
 */
export function roundTo5(value: number): number {
  const rounded = Math.round(value / 5) * 5;
  return Math.min(Math.max(rounded, 0), 100);
}

/**
 * Enforce monotonicity on NEIS cells:
 * - Row: A >= B >= C >= D >= E for each difficulty category
 * - Column: 쉬움 >= 보통 >= 어려움 for each grade
 * Runs up to 3 iterations to handle cross-effects.
 */
export function enforceMonotonicity(
  cells: NeisCell[],
  categories: Difficulty[]
): void {
  const grades: Array<'A' | 'B' | 'C' | 'D' | 'E'> = ['A', 'B', 'C', 'D', 'E'];
  const difficultyOrder: Difficulty[] = ['쉬움', '보통', '어려움'];

  function getCell(difficulty: Difficulty, grade: string): NeisCell | undefined {
    return cells.find(c => c.difficulty === difficulty && c.grade === grade);
  }

  for (let iter = 0; iter < 3; iter++) {
    // Row monotonicity: for each category, A >= B >= C >= D >= E
    for (const difficulty of categories) {
      for (let g = 1; g < grades.length; g++) {
        const prev = getCell(difficulty, grades[g - 1]);
        const curr = getCell(difficulty, grades[g]);
        if (prev && curr && curr.value > prev.value) {
          curr.value = prev.value;
        }
      }
    }

    // Column monotonicity: for each grade, 쉬움 >= 보통 >= 어려움
    for (const grade of grades) {
      for (let d = 1; d < difficultyOrder.length; d++) {
        const difficultyPrev = difficultyOrder[d - 1];
        const difficultyCurr = difficultyOrder[d];
        // Only enforce if both categories exist in our filtered list
        if (categories.includes(difficultyPrev) && categories.includes(difficultyCurr)) {
          const prev = getCell(difficultyPrev, grade);
          const curr = getCell(difficultyCurr, grade);
          if (prev && curr && curr.value > prev.value) {
            curr.value = prev.value;
          }
        }
      }
    }
  }
}
