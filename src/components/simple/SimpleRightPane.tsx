import React from 'react';
import { DesignSection, DesignScoreCards } from '@/components/design';
import { DesignNeisTable } from '@/components/design/DesignNeisTable';
import { designStyles } from '@/components/design/styles';
import { useSimpleOutput, useSimpleSplitOutput } from '@/hooks/useSimpleOutput';
import { useSimpleStore } from '@/store/simpleStore';
import { useExamStore } from '@/store/examStore';
import type { Difficulty, Grade, NeisCell } from '@/lib/types';

const DIFFICULTIES: Difficulty[] = ['쉬움', '보통', '어려움'];
const GRADES: Grade[] = ['A', 'B', 'C', 'D', 'E'];
const BOUNDARY_LABELS = ['A/B', 'B/C', 'C/D', 'D/E', 'E/미도달'];

function sumPoints(cp: Record<Difficulty, number>): number {
  return cp['쉬움'] + cp['보통'] + cp['어려움'];
}

function buildGroups(categoryPoints: Record<Difficulty, number>, cells: NeisCell[]) {
  return DIFFICULTIES.map((diff) => {
    const rates: Record<string, number> = {};
    for (const grade of GRADES) {
      const cell = cells.find((c) => c.difficulty === diff && c.grade === grade);
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
}

function Warnings({ warnings }: { warnings: { level: string; message: string }[] }) {
  if (warnings.length === 0) return null;
  return (
    <DesignSection title="알림" isLast>
      <div style={designStyles.alertList as React.CSSProperties}>
        {warnings.map((w, i) => (
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
  );
}

function SplitRightPane() {
  const output = useSimpleSplitOutput();
  const categoryPoints = useSimpleStore((s) => s.categoryPoints);
  const desiredCutScores = useSimpleStore((s) => s.desiredCutScores);
  const subjective = useSimpleStore((s) => s.subjective);

  const 선택형Pts = sumPoints(categoryPoints);
  const 서답형Pts = sumPoints(subjective.categoryPoints);

  if (선택형Pts + 서답형Pts <= 0) {
    return (
      <DesignSection title="결과" isLast>
        <p style={{ ...designStyles.textSmall, ...designStyles.textMuted } as React.CSSProperties}>
          선택형·서답형 배점합을 입력하세요.
        </p>
      </DesignSection>
    );
  }

  const combinedScores = GRADES.map((grade, i) => {
    const actual = output.combinedActualCutScores[grade];
    const desired = Math.round((desiredCutScores[grade] + subjective.desiredCutScores[grade]) * 10) / 10;
    const delta = output.combinedDeltas[grade];
    const deltaStr = delta === 0 ? '' : delta > 0 ? ` (+${delta})` : ` (${delta})`;
    return {
      label: BOUNDARY_LABELS[i],
      value: `${actual}점`,
      hint: `희망: ${desired}점${deltaStr}`,
      tone: Math.abs(delta) > 2 ? ('warning' as const) : undefined,
    };
  });

  const sections: { title: string; pts: number; cp: Record<Difficulty, number>; cells: NeisCell[] }[] = [
    { title: '선택형', pts: 선택형Pts, cp: categoryPoints, cells: output.선택형.cells },
    { title: '서답형', pts: 서답형Pts, cp: subjective.categoryPoints, cells: output.서답형.cells },
  ];

  return (
    <>
      <DesignSection title="산출 분할점수 (합계)" hint="총컷 = 선택형컷 + 서답형컷">
        <DesignScoreCards scores={combinedScores} />
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' } as React.CSSProperties}>
          {(['선택형', '서답형'] as const).map((sec) => {
            const o = sec === '선택형' ? output.선택형 : output.서답형;
            return (
              <div key={sec}>
                <span style={designStyles.sectionTitle as React.CSSProperties}>{sec}</span>
                <div style={{ ...designStyles.textSmall, ...designStyles.textMuted, marginTop: '4px' } as React.CSSProperties}>
                  {`A/B ${o.actualCutScores.A}점 · B/C ${o.actualCutScores.B}점 · C/D ${o.actualCutScores.C}점 · D/E ${o.actualCutScores.D}점`}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ ...designStyles.alertInfo, marginTop: '12px' } as React.CSSProperties}>
          미도달(미이수) 최소성취수준 기준: <strong>{output.미이수기준}점</strong> (전체 총점의 40%).
          희망 E컷과 별개로, 미이수 판정은 이 기준을 적용하는 것을 권장합니다.
        </div>
      </DesignSection>

      <DesignSection title="NEIS 입력값 (선택형·서답형)" hint="각 영역 탭에 입력">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' } as React.CSSProperties}>
          {sections.map((s) => (
            <div key={s.title}>
              <div style={{ ...designStyles.sectionTitle, marginBottom: '8px' } as React.CSSProperties}>
                {s.title} {s.pts <= 0 && '(배점 없음)'}
              </div>
              <DesignNeisTable
                totalGroups={3}
                mode="5수준(A-E)"
                unit="5% 단위"
                onModeChange={() => {}}
                groups={buildGroups(s.cp, s.cells)}
                grades={GRADES}
              />
            </div>
          ))}
        </div>
        <div style={{ ...designStyles.alertInfo, marginTop: '8px', lineHeight: '1.6' } as React.CSSProperties}>
          NEIS의 선택형·서답형 탭에 각각 위 표의 A~E 예상정답률(%)을 입력하고, 난이도별 배점합은 실제 값과 동일하게 맞춰주세요.
        </div>
      </DesignSection>

      <Warnings warnings={output.warnings} />
    </>
  );
}

function SingleRightPane() {
  const output = useSimpleOutput();
  const categoryPoints = useSimpleStore((s) => s.categoryPoints);
  const desiredCutScores = useSimpleStore((s) => s.desiredCutScores);

  const totalPoints = sumPoints(categoryPoints);

  if (totalPoints <= 0) {
    return (
      <DesignSection title="결과" isLast>
        <p style={{ ...designStyles.textSmall, ...designStyles.textMuted } as React.CSSProperties}>
          배점합을 입력하세요.
        </p>
      </DesignSection>
    );
  }

  const groups = buildGroups(categoryPoints, output.cells);

  const scores = GRADES.map((grade, i) => {
    const actual = output.actualCutScores[grade];
    const desired = desiredCutScores[grade];
    const delta = output.deltas[grade];
    const deltaStr = delta === 0 ? '' : delta > 0 ? ` (+${delta})` : ` (${delta})`;
    return {
      label: BOUNDARY_LABELS[i],
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
        <div style={{ ...designStyles.alertInfo, marginTop: '8px' } as React.CSSProperties}>
          미도달(미이수) 최소성취수준 기준: <strong>{output.미이수기준}점</strong> (총점의 40%).
          희망 E컷과 별개로, 미이수 판정은 이 기준을 적용하는 것을 권장합니다.
        </div>
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
        <div style={{ ...designStyles.alertInfo, marginTop: '8px', lineHeight: '1.6' } as React.CSSProperties}>
          간편 모드에서는 문항번호·문항수를 입력하지 않습니다.
          NEIS에는 위 표의 A~E 예상정답률(%)만 정확히 옮겨 입력하고,
          난이도별 배점합은 NEIS의 실제 값과 동일하게 맞춰주세요.
        </div>
      </DesignSection>

      <Warnings warnings={output.warnings} />
    </>
  );
}

export function SimpleRightPane() {
  const splitByType = useExamStore((s) => s.settings.splitByType);
  return splitByType ? <SplitRightPane /> : <SingleRightPane />;
}
