import React, { useState } from 'react';
import { DesignSection, DesignNeisTable } from '@/components/design';
import { designStyles } from '@/components/design/styles';
import { useExamStore } from '@/store/examStore';
import { useNeisOutput, useSectionedNeisOutput } from '@/hooks/useNeisOutput';
import { CellPopover } from '@/components/shared/CellPopover';
import { explainCell } from '@/lib/math/cutscore';
import { DEFAULT_EXPECTED_UNMET_RATE } from '@/lib/presets';
import type { Difficulty, Grade, CellExplanation, Item, ItemType, NeisOutput } from '@/lib/types';

const DIFFICULTY_ORDER: Difficulty[] = ['쉬움', '보통', '어려움'];
const GRADES = ['A', 'B', 'C', 'D', 'E'];

type DifficultyData = Map<Difficulty, { numbers: number[]; totalPoints: number }>;

function buildGroups(sectionItems: Item[], output: NeisOutput | null) {
  const difficultyData: DifficultyData = new Map();
  for (const item of sectionItems) {
    if (!difficultyData.has(item.difficulty)) {
      difficultyData.set(item.difficulty, { numbers: [], totalPoints: 0 });
    }
    const group = difficultyData.get(item.difficulty)!;
    group.numbers.push(item.number);
    group.totalPoints += item.points;
  }

  const groups = DIFFICULTY_ORDER.map((difficulty) => {
    const data = difficultyData.get(difficulty);
    const rates: Record<string, number> = {};
    if (output) {
      for (const grade of GRADES as Grade[]) {
        const cell = output.cells.find((c) => c.difficulty === difficulty && c.grade === grade);
        if (cell !== undefined) rates[grade] = cell.value;
      }
    }
    return {
      difficulty,
      itemNumbers: data ? data.numbers.sort((a, b) => a - b).join(', ') : '',
      itemCount: data?.numbers.length ?? 0,
      totalPoints: data?.totalPoints ?? 0,
      rates,
    };
  });

  return { groups, difficultyData };
}

function TableBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        border: '1px solid rgba(10, 122, 74, 0.45)',
        backgroundColor: 'rgba(10, 122, 74, 0.05)',
        padding: '16px',
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export function NeisTableSection() {
  const items = useExamStore((s) => s.items);
  const targetDistribution = useExamStore((s) => s.targetDistribution);
  const includeE미도달 = useExamStore((s) => s.settings.includeE미도달);
  const expectedUnmetRate = useExamStore((s) => s.settings.expectedUnmetRate ?? DEFAULT_EXPECTED_UNMET_RATE);
  const splitByType = useExamStore((s) => s.settings.splitByType);
  const setSetting = useExamStore((s) => s.setSetting);
  const output = useNeisOutput();
  const sectioned = useSectionedNeisOutput();
  const mode = includeE미도달 ? '5수준(A-E) + 미도달' : '5수준(A-E)';
  const handleModeChange = (newMode: string) => {
    setSetting('includeE미도달', newMode === '5수준(A-E) + 미도달');
  };
  const [cellExplanation, setCellExplanation] = useState<CellExplanation | null>(null);

  const makeClickHandler =
    (sectionItems: Item[], difficultyData: DifficultyData) =>
    (groupIndex: number, grade: string) => {
      const validGrades: Grade[] = ['A', 'B', 'C', 'D', 'E'];
      if (!validGrades.includes(grade as Grade)) return;
      const difficulty = DIFFICULTY_ORDER[groupIndex];
      if (!difficulty || !difficultyData.has(difficulty)) return;
      const explanation = explainCell(
        difficulty,
        grade as Grade,
        sectionItems,
        targetDistribution,
        { includeE미도달, expectedUnmetRate },
      );
      setCellExplanation(explanation);
    };

  const popover = (
    <CellPopover
      explanation={cellExplanation}
      open={cellExplanation !== null}
      onOpenChange={(open) => { if (!open) setCellExplanation(null); }}
    >
      <span aria-hidden="true" style={{ display: 'inline-block', width: 0, height: 0 }} />
    </CellPopover>
  );

  if (splitByType) {
    const sectionDefs: { type: ItemType; output: NeisOutput | null }[] = [
      { type: '선택형', output: sectioned?.선택형 ?? null },
      { type: '서답형', output: sectioned?.서답형 ?? null },
    ];
    return (
      <DesignSection id="neis-output-section" title="NEIS 입력 표 (선택형·서답형)" isLast>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' } as React.CSSProperties}>
          {sectionDefs.map(({ type, output: secOut }) => {
            const sectionItems = items.filter(
              (i) => (i.type === '서답형' ? '서답형' : '선택형') === type,
            );
            const { groups, difficultyData } = buildGroups(sectionItems, secOut);
            return (
              <div key={type}>
                <div style={{ ...designStyles.sectionTitle, marginBottom: '8px' } as React.CSSProperties}>
                  {type} {sectionItems.length === 0 && '(문항 없음)'}
                </div>
                <TableBox>
                  <DesignNeisTable
                    totalGroups={groups.length}
                    mode={mode}
                    unit="5% 단위"
                    onModeChange={handleModeChange}
                    groups={groups}
                    grades={GRADES}
                    onCellClick={makeClickHandler(sectionItems, difficultyData)}
                  />
                </TableBox>
              </div>
            );
          })}
        </div>
        <p style={{ ...designStyles.textSmall, ...designStyles.textMuted, marginTop: '12px' } as React.CSSProperties}>
          NEIS의 선택형·서답형 탭에 각각 위 표의 A~E 예상정답률(%)을 입력하세요.
        </p>
        {popover}
      </DesignSection>
    );
  }

  const { groups, difficultyData } = buildGroups(items, output);

  return (
    <DesignSection id="neis-output-section" title="NEIS 입력 표" isLast>
      <TableBox>
        <DesignNeisTable
          totalGroups={groups.length}
          mode={mode}
          unit="5% 단위"
          onModeChange={handleModeChange}
          groups={groups}
          grades={GRADES}
          onCellClick={makeClickHandler(items, difficultyData)}
        />
      </TableBox>
      {popover}
    </DesignSection>
  );
}
