import { DesignSection, DesignScoreCards } from '@/components/design';
import { useExamStore } from '@/store/examStore';
import { useNeisOutput } from '@/hooks/useNeisOutput';

export function CutScoresSection() {
  const output = useNeisOutput();
  const includeE미도달 = useExamStore((s) => s.settings.includeE미도달);

  const baseScores = output
    ? [
        { label: 'A/B', value: `${output.cutScores.AB}점` },
        { label: 'B/C', value: `${output.cutScores.BC}점` },
        { label: 'C/D', value: `${output.cutScores.CD}점` },
        { label: 'D/E', value: `${output.cutScores.DE}점` },
      ]
    : [
        { label: 'A/B', value: '—' },
        { label: 'B/C', value: '—' },
        { label: 'C/D', value: '—' },
        { label: 'D/E', value: '—' },
      ];

  const scores = includeE미도달 && output?.cutScores.E미도달 != null
    ? [...baseScores, { label: 'E/미도달', value: `${output.cutScores.E미도달}점` }]
    : includeE미도달 && !output
      ? [...baseScores, { label: 'E/미도달', value: '—' }]
      : baseScores;

  return (
    <DesignSection title="분할점수">
      <DesignScoreCards scores={scores} />
    </DesignSection>
  );
}
