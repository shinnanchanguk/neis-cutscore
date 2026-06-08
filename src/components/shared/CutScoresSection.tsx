import React from 'react';
import { DesignSection, DesignScoreCards } from '@/components/design';
import { designStyles } from '@/components/design/styles';
import { useNeisOutput, useSectionedNeisOutput } from '@/hooks/useNeisOutput';
import { useExamStore } from '@/store/examStore';
import type { ItemType, NeisOutput } from '@/lib/types';

const SECTIONS: ItemType[] = ['선택형', '서답형'];

function SectionBreakdown({
  outputs,
}: {
  outputs: Record<ItemType, NeisOutput | null>;
}) {
  return (
    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' } as React.CSSProperties}>
      {SECTIONS.map((sec) => {
        const o = outputs[sec];
        return (
          <div key={sec}>
            <span style={designStyles.sectionTitle as React.CSSProperties}>{sec}</span>
            <div style={{ ...designStyles.textSmall, ...designStyles.textMuted, marginTop: '4px' } as React.CSSProperties}>
              {o
                ? `A/B ${o.cutScores.AB}점 · B/C ${o.cutScores.BC}점 · C/D ${o.cutScores.CD}점 · D/E ${o.cutScores.DE}점`
                : '문항 없음'}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CutScoresSection() {
  const output = useNeisOutput();
  const sectioned = useSectionedNeisOutput();
  const includeE미도달 = useExamStore((s) => s.settings.includeE미도달);
  const splitByType = useExamStore((s) => s.settings.splitByType);

  if (splitByType) {
    const c = sectioned?.combinedCutScores;
    const combinedScores = [
      { label: 'A/B', value: c ? `${c.AB}점` : '—', hint: '선택형+서답형 합계' },
      { label: 'B/C', value: c ? `${c.BC}점` : '—', hint: '선택형+서답형 합계' },
      { label: 'C/D', value: c ? `${c.CD}점` : '—', hint: '선택형+서답형 합계' },
      { label: 'D/E', value: c ? `${c.DE}점` : '—', hint: '선택형+서답형 합계' },
      ...(includeE미도달
        ? [{
            label: '미도달(미이수)',
            value: c?.미이수기준 != null ? `${c.미이수기준}점` : '—',
            hint: '최소성취수준 · 총점의 40%',
          }]
        : []),
    ];

    return (
      <DesignSection title="분할점수 (합계)" hint="총컷 = 선택형컷 + 서답형컷">
        <DesignScoreCards scores={combinedScores} />
        <SectionBreakdown outputs={{ 선택형: sectioned?.선택형 ?? null, 서답형: sectioned?.서답형 ?? null }} />
        <p style={{ ...designStyles.textSmall, ...designStyles.textMuted, margin: '12px 0 0 0' } as React.CSSProperties}>
          선택형·서답형 영역을 각각 산출해 합산한 분할점수입니다. 미도달(미이수)은 전체 총점의 40% 고정 기준으로 1개만 적용합니다.
        </p>
      </DesignSection>
    );
  }

  const baseScores = output
    ? [
        { label: 'A/B', value: `${output.cutScores.AB}점`, hint: '성취도 A 최소능력 경계' },
        { label: 'B/C', value: `${output.cutScores.BC}점`, hint: '성취도 B 최소능력 경계' },
        { label: 'C/D', value: `${output.cutScores.CD}점`, hint: '성취도 C 최소능력 경계' },
        {
          label: 'D/E',
          value: `${output.cutScores.DE}점`,
          hint: '성취도 D 최소능력 경계',
        },
        ...(includeE미도달 && output.cutScores.미이수기준 != null
          ? [{
              label: '미도달(미이수)',
              value: `${output.cutScores.미이수기준}점`,
              hint: '최소성취수준 · 총점의 40%',
            }]
          : []),
      ]
    : [
        { label: 'A/B', value: '—', hint: '성취도 A 최소능력 경계' },
        { label: 'B/C', value: '—', hint: '성취도 B 최소능력 경계' },
        { label: 'C/D', value: '—', hint: '성취도 C 최소능력 경계' },
        { label: 'D/E', value: '—', hint: '성취도 D 최소능력 경계' },
        ...(includeE미도달 ? [{ label: '미도달(미이수)', value: '—', hint: '최소성취수준 · 총점의 40%' }] : []),
      ];

  return (
    <DesignSection title="분할점수" hint="NEIS 핵심 결과">
      <DesignScoreCards scores={baseScores} />
      {output && (
        <p style={{ ...designStyles.textSmall, ...designStyles.textMuted, margin: '12px 0 0 0' }}>
          A/B~D/E는 목표 분포와 문항 정답률로 계산한 NEIS 핵심 분할점수입니다.
          {includeE미도달 && output.cutScores.미이수기준 != null && (
            ` 미도달(미이수)은 최소성취수준인 총점의 40%(${output.cutScores.미이수기준}점) 고정 기준으로 표시합니다`
          )}
          {includeE미도달 && output.cutScores.E미도달 != null && (
            ` — 모델 추정 E/미도달 경계(${output.cutScores.E미도달}점)는 참고용입니다.`
          )}
        </p>
      )}
    </DesignSection>
  );
}
