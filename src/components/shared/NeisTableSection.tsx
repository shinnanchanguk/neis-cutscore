import { useState } from 'react';
import { DesignSection, DesignNeisTable } from '@/components/design';
import { useExamStore } from '@/store/examStore';
import { useNeisOutput } from '@/hooks/useNeisOutput';
import { CellPopover } from '@/components/shared/CellPopover';
import { explainCell } from '@/lib/math/cutscore';
import type { Difficulty, ItemType, Grade, CellExplanation } from '@/lib/types';

const DIFFICULTY_ORDER: Difficulty[] = ['쉬움', '보통', '어려움'];
const GRADES = ['A', 'B', 'C', 'D', 'E'];

export function NeisTableSection() {
  const items = useExamStore((s) => s.items);
  const targetDistribution = useExamStore((s) => s.targetDistribution);
  const includeE미도달 = useExamStore((s) => s.settings.includeE미도달);
  const setSetting = useExamStore((s) => s.setSetting);
  const output = useNeisOutput();
  const mode = includeE미도달 ? '5수준(A-E) + 미도달' : '5수준(A-E)';
  const handleModeChange = (newMode: string) => {
    setSetting('includeE미도달', newMode === '5수준(A-E) + 미도달');
  };
  const [cellExplanation, setCellExplanation] = useState<CellExplanation | null>(null);

  // Group items by difficulty only (matching NEIS 3-category structure)
  const groupMap = new Map<Difficulty, { types: Set<ItemType>; difficulty: Difficulty; numbers: number[]; totalPoints: number }>();

  for (const item of items) {
    if (!groupMap.has(item.difficulty)) {
      groupMap.set(item.difficulty, { types: new Set(), difficulty: item.difficulty, numbers: [], totalPoints: 0 });
    }
    const group = groupMap.get(item.difficulty)!;
    group.types.add(item.type);
    group.numbers.push(item.number);
    group.totalPoints += item.points;
  }

  // Sort groups by difficulty order
  const sortedGroups = Array.from(groupMap.values()).sort((a, b) => {
    return DIFFICULTY_ORDER.indexOf(a.difficulty) - DIFFICULTY_ORDER.indexOf(b.difficulty);
  });

  const groups = sortedGroups.map((g) => {
    const rates: Record<string, number> = {};

    if (output) {
      for (const grade of GRADES as Grade[]) {
        const cell = output.cells.find(
          (c) => c.difficulty === g.difficulty && c.grade === grade
        );
        if (cell !== undefined) {
          rates[grade] = cell.value;
        }
      }
    }

    return {
      type: Array.from(g.types).sort().join(', '),
      difficulty: g.difficulty,
      itemNumbers: g.numbers.sort((a, b) => a - b).join(', '),
      itemCount: g.numbers.length,
      totalPoints: g.totalPoints,
      rates,
    };
  });

  const handleCellClick = (groupIndex: number, grade: string) => {
    const validGrades: Grade[] = ['A', 'B', 'C', 'D', 'E'];
    if (!validGrades.includes(grade as Grade)) return;
    const group = sortedGroups[groupIndex];
    if (!group) return;
    const explanation = explainCell(
      group.difficulty,
      grade as Grade,
      items,
      targetDistribution,
    );
    setCellExplanation(explanation);
  };

  return (
    <DesignSection title="NEIS 입력 표">
      <DesignNeisTable
        totalGroups={groups.length}
        mode={mode}
        unit="5% 단위"
        onModeChange={handleModeChange}
        groups={groups}
        grades={GRADES}
        onCellClick={handleCellClick}
      />
      {/* CellPopover is rendered as a controlled popover. The trigger is a hidden span;
          open state is driven by cellExplanation state set via onCellClick. */}
      <CellPopover
        explanation={cellExplanation}
        open={cellExplanation !== null}
        onOpenChange={(open) => { if (!open) setCellExplanation(null); }}
      >
        <span aria-hidden="true" style={{ display: 'inline-block', width: 0, height: 0 }} />
      </CellPopover>
    </DesignSection>
  );
}
