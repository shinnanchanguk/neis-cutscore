import type { NeisCell, Difficulty, Grade } from './types';

const DIFFICULTY_ORDER: Difficulty[] = ['쉬움', '보통', '어려움'];
const GRADE_ORDER: (Grade | 'E_미도달')[] = ['A', 'B', 'C', 'D', 'E', 'E_미도달'];

export async function copyToNeisFormat(cells: NeisCell[]): Promise<void> {
  const rows = DIFFICULTY_ORDER.map((difficulty) => {
    const cols = GRADE_ORDER.map((grade) => {
      const cell = cells.find((c) => c.difficulty === difficulty && c.grade === grade);
      return cell !== undefined ? String(cell.value) : '';
    });
    // Trim trailing empty columns
    while (cols.length > 0 && cols[cols.length - 1] === '') {
      cols.pop();
    }
    return cols.join('\t');
  });

  const text = rows.join('\n');
  await navigator.clipboard.writeText(text);
}
