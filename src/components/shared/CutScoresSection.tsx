import { DesignSection, DesignScoreCards } from '@/components/design';
import { designStyles } from '@/components/design/styles';
import { useNeisOutput } from '@/hooks/useNeisOutput';
import { useExamStore } from '@/store/examStore';
import { DEFAULT_EXPECTED_UNMET_RATE } from '@/lib/presets';

export function CutScoresSection() {
  const output = useNeisOutput();
  const includeE미도달 = useExamStore((s) => s.settings.includeE미도달);
  const expectedUnmetRate = useExamStore((s) => s.settings.expectedUnmetRate ?? DEFAULT_EXPECTED_UNMET_RATE);

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
        ...(includeE미도달 && output.cutScores.E미도달 != null
          ? [{
              label: 'E/미도달',
              value: `${output.cutScores.E미도달}점`,
              hint: `예상 미도달 ${expectedUnmetRate}%를 반영한 참고값`,
            }]
          : []),
      ]
    : [
        { label: 'A/B', value: '—', hint: '성취도 A 최소능력 경계' },
        { label: 'B/C', value: '—', hint: '성취도 B 최소능력 경계' },
        { label: 'C/D', value: '—', hint: '성취도 C 최소능력 경계' },
        { label: 'D/E', value: '—', hint: '성취도 D 최소능력 경계' },
        ...(includeE미도달 ? [{ label: 'E/미도달', value: '—', hint: '예상 미도달 비율을 반영한 참고값' }] : []),
      ];

  return (
    <DesignSection title="분할점수" hint="NEIS 핵심 결과">
      <DesignScoreCards scores={baseScores} />
      {output && (
        <p style={{ ...designStyles.textSmall, ...designStyles.textMuted, margin: '12px 0 0 0' }}>
          위 값은 목표 분포와 문항 정답률로 계산한 NEIS 핵심 분할점수입니다.
          E/미도달은 예상 미도달 비율을 반영한 참고값으로, 학교의 실제 최종 판정 기준 그 자체는 아닙니다.
        </p>
      )}
    </DesignSection>
  );
}
