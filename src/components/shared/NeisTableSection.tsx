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

  // Build data per difficulty, then always output all 3 rows (NEIS fixed structure)
  const difficultyData = new Map<Difficulty, { types: Set<ItemType>; numbers: number[]; totalPoints: number }>();

  for (const item of items) {
    if (!difficultyData.has(item.difficulty)) {
      difficultyData.set(item.difficulty, { types: new Set(), numbers: [], totalPoints: 0 });
    }
    const group = difficultyData.get(item.difficulty)!;
    group.types.add(item.type);
    group.numbers.push(item.number);
    group.totalPoints += item.points;
  }

  // Always 3 rows: 쉬움, 보통, 어려움 (even if no items for that difficulty)
  const groups = DIFFICULTY_ORDER.map((difficulty) => {
    const data = difficultyData.get(difficulty);
    const rates: Record<string, number> = {};

    if (output) {
      for (const grade of GRADES as Grade[]) {
        const cell = output.cells.find(
          (c) => c.difficulty === difficulty && c.grade === grade
        );
        if (cell !== undefined) {
          rates[grade] = cell.value;
        }
      }
    }

    return {
      type: data ? Array.from(data.types).sort().join(', ') : '',
      difficulty,
      itemNumbers: data ? data.numbers.sort((a, b) => a - b).join(', ') : '',
      itemCount: data?.numbers.length ?? 0,
      totalPoints: data?.totalPoints ?? 0,
      rates,
    };
  });

  const handleCellClick = (groupIndex: number, grade: string) => {
    const validGrades: Grade[] = ['A', 'B', 'C', 'D', 'E'];
    if (!validGrades.includes(grade as Grade)) return;
    const difficulty = DIFFICULTY_ORDER[groupIndex];
    if (!difficulty || !difficultyData.has(difficulty)) return;
    const explanation = explainCell(
      difficulty,
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
