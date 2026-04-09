import { DesignSection, DesignScoreCards } from '@/components/design';
import { useNeisOutput } from '@/hooks/useNeisOutput';

export function CutScoresSection() {
  const output = useNeisOutput();

  const scores = output
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

  return (
    <DesignSection title="분할점수">
      <DesignScoreCards scores={scores} />
    </DesignSection>
  );
}
