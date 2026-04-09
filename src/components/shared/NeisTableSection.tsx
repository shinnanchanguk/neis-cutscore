import { useState } from 'react';
import { DesignSection, DesignNeisTable } from '@/components/design';
import { useExamStore } from '@/store/examStore';
import { useNeisOutput } from '@/hooks/useNeisOutput';
import type { Difficulty, ItemType } from '@/lib/types';

type GroupKey = `${ItemType}|${Difficulty}`;

const DIFFICULTY_ORDER: Difficulty[] = ['쉬움', '보통', '어려움'];
const GRADES = ['A', 'B', 'C', 'D', 'E'];

export function NeisTableSection() {
  const items = useExamStore((s) => s.items);
  const output = useNeisOutput();
  const [mode, setMode] = useState('5수준(A-E) + 미도달');

  // Group items by (type + difficulty)
  const groupMap = new Map<GroupKey, { type: ItemType; difficulty: Difficulty; numbers: number[]; totalPoints: number }>();

  for (const item of items) {
    const key: GroupKey = `${item.type}|${item.difficulty}`;
    if (!groupMap.has(key)) {
      groupMap.set(key, { type: item.type, difficulty: item.difficulty, numbers: [], totalPoints: 0 });
    }
    const group = groupMap.get(key)!;
    group.numbers.push(item.number);
    group.totalPoints += item.points;
  }

  // Sort groups: by difficulty order, then by type
  const sortedGroups = Array.from(groupMap.values()).sort((a, b) => {
    const dA = DIFFICULTY_ORDER.indexOf(a.difficulty);
    const dB = DIFFICULTY_ORDER.indexOf(b.difficulty);
    if (dA !== dB) return dA - dB;
    return a.type.localeCompare(b.type);
  });

  const groups = sortedGroups.map((g) => {
    const rates: Record<string, number> = {};

    if (output) {
      for (const grade of GRADES as Array<'A' | 'B' | 'C' | 'D' | 'E'>) {
        const cell = output.cells.find(
          (c) => c.difficulty === g.difficulty && c.grade === grade
        );
        if (cell !== undefined) {
          rates[grade] = cell.value;
        }
      }
      // E_미도달
      const midoalCell = output.cells.find(
        (c) => c.difficulty === g.difficulty && c.grade === 'E_미도달'
      );
      if (midoalCell !== undefined) {
        rates['E_미도달'] = midoalCell.value;
      }
    }

    return {
      type: g.type,
      difficulty: g.difficulty,
      itemNumbers: g.numbers.join(', '),
      itemCount: g.numbers.length,
      totalPoints: g.totalPoints,
      rates,
    };
  });

  return (
    <DesignSection title="NEIS 입력 표">
      <DesignNeisTable
        totalGroups={groups.length}
        mode={mode}
        unit="5% 단위"
        onModeChange={setMode}
        groups={groups}
        grades={GRADES}
      />
    </DesignSection>
  );
}
