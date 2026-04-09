import type { NeisCell, Difficulty, Grade } from './types';

const DIFFICULTY_ORDER: Difficulty[] = ['쉬움', '보통', '어려움'];
const GRADE_ORDER: Grade[] = ['A', 'B', 'C', 'D', 'E'];

export async function copyToNeisFormat(cells: NeisCell[]): Promise<void> {
  // Only include rows for difficulties that have cells
  const presentDifficulties = DIFFICULTY_ORDER.filter(d =>
    cells.some(c => c.difficulty === d)
  );

  const rows = presentDifficulties.map((difficulty) => {
    const cols = GRADE_ORDER.map((grade) => {
      const cell = cells.find((c) => c.difficulty === difficulty && c.grade === grade);
      return cell !== undefined ? String(cell.value) : '';
    });
    return cols.join('\t');
  });

  const text = rows.join('\n');
  await navigator.clipboard.writeText(text);
}
