import React from 'react';
import { DesignSection, DesignScoreCards } from '@/components/design';
import { DesignNeisTable } from '@/components/design/DesignNeisTable';
import { designStyles } from '@/components/design/styles';
import { useSimpleOutput } from '@/hooks/useSimpleOutput';
import { useSimpleStore } from '@/store/simpleStore';
import type { Difficulty, Grade } from '@/lib/types';

const DIFFICULTIES: Difficulty[] = ['쉬움', '보통', '어려움'];
const GRADES: Grade[] = ['A', 'B', 'C', 'D', 'E'];

export function SimpleRightPane() {
  const output = useSimpleOutput();
  const categoryPoints = useSimpleStore((s) => s.categoryPoints);
  const desiredCutScores = useSimpleStore((s) => s.desiredCutScores);

  const totalPoints =
    categoryPoints['쉬움'] + categoryPoints['보통'] + categoryPoints['어려움'];

  if (totalPoints <= 0) {
    return (
      <DesignSection title="결과" isLast>
        <p style={{ ...designStyles.textSmall, ...designStyles.textMuted } as React.CSSProperties}>
          배점합을 입력하세요.
        </p>
      </DesignSection>
    );
  }

  // Build groups for DesignNeisTable
  const groups = DIFFICULTIES.map((diff) => {
    const rates: Record<string, number> = {};
    for (const grade of GRADES) {
      const cell = output.cells.find(
        (c) => c.difficulty === diff && c.grade === grade
      );
      if (cell) rates[grade] = cell.value;
    }
    return {
      difficulty: diff,
      itemNumbers: '—',
      itemCount: 0,
      totalPoints: categoryPoints[diff],
      rates,
    };
  });

  const scores = GRADES.map((grade, i) => {
    const labels = ['A/B', 'B/C', 'C/D', 'D/E', 'E/미도달'];
    const actual = output.actualCutScores[grade];
    const desired = desiredCutScores[grade];
    const delta = output.deltas[grade];
    const deltaStr =
      delta === 0 ? '' : delta > 0 ? ` (+${delta})` : ` (${delta})`;

    return {
      label: labels[i],
      value: `${actual}점`,
      hint: `희망: ${desired}점${deltaStr}`,
      tone: Math.abs(delta) > 2 ? ('warning' as const) : undefined,
    };
  });

  return (
    <>
      <DesignSection title="산출 분할점수" hint="NEIS 입력값 기반 실제 컷">
        <DesignScoreCards scores={scores} />
        <p style={{ ...designStyles.textSmall, ...designStyles.textMuted, marginTop: '12px' } as React.CSSProperties}>
          5% 단위 반올림으로 인해 희망값과 소폭 차이가 날 수 있습니다.
        </p>
      </DesignSection>

      <DesignSection title="NEIS 입력값" hint="이 값을 NEIS에 입력하세요">
        <DesignNeisTable
          totalGroups={3}
          mode="5수준(A-E)"
          unit="5% 단위"
          onModeChange={() => {}}
          groups={groups}
          grades={GRADES}
        />
      </DesignSection>

      {output.warnings.length > 0 && (
        <DesignSection title="알림" isLast>
          <div style={designStyles.alertList as React.CSSProperties}>
            {output.warnings.map((w, i) => (
              <div
                key={i}
                style={
                  (w.level === 'error'
                    ? designStyles.alertError
                    : w.level === 'warning'
                      ? designStyles.alertWarning
                      : designStyles.alertInfo) as React.CSSProperties
                }
              >
                {w.message}
              </div>
            ))}
          </div>
        </DesignSection>
      )}
    </>
  );
}
