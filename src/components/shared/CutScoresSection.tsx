import { DesignSection, DesignScoreCards } from '@/components/design';
import { designStyles } from '@/components/design/styles';
import { useExamStore } from '@/store/examStore';
import { useNeisOutput } from '@/hooks/useNeisOutput';

export function CutScoresSection() {
  const output = useNeisOutput();
  const includeE미도달 = useExamStore((s) => s.settings.includeE미도달);
  const targetDistribution = useExamStore((s) => s.targetDistribution);
  const deRecommended = output ? output.cutScores.DE >= 40 : undefined;

  const baseScores = output
    ? [
        { label: 'A/B', value: `${output.cutScores.AB}점` },
        { label: 'B/C', value: `${output.cutScores.BC}점` },
        { label: 'C/D', value: `${output.cutScores.CD}점` },
        {
          label: 'D/E',
          value: `${output.cutScores.DE}점`,
          hint: deRecommended ? '권고: 40점 이상 · 충족' : '권고: 40점 이상 · 미충족',
          tone: deRecommended ? 'success' as const : 'warning' as const,
        },
      ]
    : [
        { label: 'A/B', value: '—' },
        { label: 'B/C', value: '—' },
        { label: 'C/D', value: '—' },
        { label: 'D/E', value: '—', hint: '권고: 40점 이상' },
      ];

  const scores = includeE미도달 && output?.cutScores.E미도달 != null
    ? [...baseScores, { label: 'E/미도달', value: `${output.cutScores.E미도달}점` }]
    : includeE미도달 && !output
      ? [...baseScores, { label: 'E/미도달', value: '—' }]
      : baseScores;

  return (
    <DesignSection title="분할점수" hint="D/E는 E 진입선">
      <DesignScoreCards scores={scores} />
      {output && (
        <p style={{ ...designStyles.textSmall, ...designStyles.textMuted, margin: '12px 0 0 0' }}>
          D/E는 D를 간신히 받는 학생의 경계, 즉 E 진입선이라서 목표 E={targetDistribution.E}%이면
          하위 {targetDistribution.E}% 경계가 됩니다. 시험 평균이 낮거나 어려움 배점 비중이 크면
          40점 미만으로 내려갈 수 있습니다.
        </p>
      )}
    </DesignSection>
  );
}
