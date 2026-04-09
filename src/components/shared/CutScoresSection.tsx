import { DesignSection, DesignScoreCards } from '@/components/design';
import { designStyles } from '@/components/design/styles';
import { useNeisOutput } from '@/hooks/useNeisOutput';

export function CutScoresSection() {
  const output = useNeisOutput();

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

  return (
    <DesignSection title="분할점수" hint="NEIS 핵심 결과">
      <DesignScoreCards scores={baseScores} />
      {output && (
        <p style={{ ...designStyles.textSmall, ...designStyles.textMuted, margin: '12px 0 0 0' }}>
          위 값은 목표 분포와 문항 정답률로 계산한 NEIS 핵심 분할점수입니다.
          추정 E/미도달 참고값은 아래 알림에서 간단히 확인하세요.
        </p>
      )}
    </DesignSection>
  );
}
