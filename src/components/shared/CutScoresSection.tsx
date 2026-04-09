import { DesignSection, DesignScoreCards } from '@/components/design';
import { designStyles } from '@/components/design/styles';
import { useExamStore } from '@/store/examStore';
import { useNeisOutput } from '@/hooks/useNeisOutput';

export function CutScoresSection() {
  const output = useNeisOutput();
  const includeE미도달 = useExamStore((s) => s.settings.includeE미도달);
  const eLevelAdvisoryMet = output?.cutScores.E미도달 != null
    ? output.cutScores.E미도달 >= 40
    : undefined;

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
      ]
    : [
        { label: 'A/B', value: '—', hint: '성취도 A 최소능력 경계' },
        { label: 'B/C', value: '—', hint: '성취도 B 최소능력 경계' },
        { label: 'C/D', value: '—', hint: '성취도 C 최소능력 경계' },
        { label: 'D/E', value: '—', hint: '성취도 D 최소능력 경계' },
      ];

  const scores = includeE미도달 && output?.cutScores.E미도달 != null
    ? [...baseScores, {
        label: 'E/미도달',
        value: `${output.cutScores.E미도달}점`,
        hint: eLevelAdvisoryMet
          ? '참고선: 고정분할점수 40점과 비교 · 권고 충족'
          : '참고선: 고정분할점수 40점과 비교 · 권고 미충족',
        tone: eLevelAdvisoryMet ? 'success' as const : 'warning' as const,
      }]
    : includeE미도달 && !output
      ? [...baseScores, { label: 'E/미도달', value: '—', hint: '참고선: 고정분할점수 40점과 비교' }]
      : baseScores;

  return (
    <DesignSection title="분할점수" hint="D/E와 E/미도달을 구분해서 보세요">
      <DesignScoreCards scores={scores} />
      {output && (
        <p style={{ ...designStyles.textSmall, ...designStyles.textMuted, margin: '12px 0 0 0' }}>
          경기도교육청 자료는 고정분할점수를 90/80/70/60/40으로 설명합니다.
          이 앱은 각 경계를 90/80/70/60/40 성취기준보다 낮아지지 않게 잡고,
          목표 분포는 그보다 더 엄격할 때만 반영합니다. 다만 NEIS 추정분할점수에서 원점수 40점을 강제하는 규정은 아니므로,
          40점 비교는 참고용 권고로만 보세요.
        </p>
      )}
    </DesignSection>
  );
}
