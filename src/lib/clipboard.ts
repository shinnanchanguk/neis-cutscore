import type { NeisCell, Difficulty, Grade } from './types';

const DIFFICULTY_ORDER: Difficulty[] = ['쉬움', '보통', '어려움'];
const GRADE_ORDER: Grade[] = ['A', 'B', 'C', 'D', 'E'];

export async function copyToNeisFormat(cells: NeisCell[]): Promise<void> {
  // Always 3 rows (쉬움/보통/어려움) to match NEIS fixed structure
  const rows = DIFFICULTY_ORDER.map((difficulty) => {
    const cols = GRADE_ORDER.map((grade) => {
      const cell = cells.find((c) => c.difficulty === difficulty && c.grade === grade);
      return cell !== undefined ? String(cell.value) : '';
    });
    return cols.join('\t');
  });

  const text = rows.join('\n');
  await navigator.clipboard.writeText(text);
}
