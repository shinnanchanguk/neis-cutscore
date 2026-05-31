import { DesignSection, DesignScoreCards } from '@/components/design';
import { designStyles } from '@/components/design/styles';
import { useNeisOutput } from '@/hooks/useNeisOutput';
import { useExamStore } from '@/store/examStore';

export function CutScoresSection() {
  const output = useNeisOutput();
  const includeE미도달 = useExamStore((s) => s.settings.includeE미도달);

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
