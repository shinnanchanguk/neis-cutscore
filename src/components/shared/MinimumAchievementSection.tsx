import { DesignSection, DesignScoreCards } from '@/components/design';
import { designStyles } from '@/components/design/styles';
import { useExamStore } from '@/store/examStore';
import { useNeisOutput } from '@/hooks/useNeisOutput';
import { DEFAULT_EXPECTED_UNMET_RATE } from '@/lib/presets';

export function MinimumAchievementSection() {
  const items = useExamStore((s) => s.items);
  const includeE미도달 = useExamStore((s) => s.settings.includeE미도달);
  const expectedUnmetRate = useExamStore((s) => s.settings.expectedUnmetRate ?? DEFAULT_EXPECTED_UNMET_RATE);
  const output = useNeisOutput();

  const totalPoints = items.reduce((sum, item) => sum + item.points, 0);
  const referenceScore = Math.round(totalPoints * 0.4 * 10) / 10;
  const estimatedThreshold = output?.cutScores.E미도달;
  const advisoryMet = estimatedThreshold != null ? estimatedThreshold >= referenceScore : undefined;

  const scores = [
    {
      label: '고정 40% 기준',
      value: items.length > 0 ? `${referenceScore}점` : '—',
      hint: '고정분할점수 기준 40점 참고선',
    },
    {
      label: '추정 E/미도달',
      value: includeE미도달 && estimatedThreshold != null ? `${estimatedThreshold}점` : '—',
      hint: includeE미도달
        ? advisoryMet == null
          ? `예상 미도달 ${expectedUnmetRate}% 반영`
          : advisoryMet
            ? `예상 미도달 ${expectedUnmetRate}% 반영 · 40점 참고선보다 높음`
            : `예상 미도달 ${expectedUnmetRate}% 반영 · 40점 참고선보다 낮음`
        : '5수준(A-E)+미도달 모드에서 표시',
      tone: includeE미도달 && advisoryMet != null
        ? (advisoryMet ? 'success' as const : 'warning' as const)
        : 'default' as const,
    },
  ];

  return (
    <DesignSection title="최소 성취수준 점검" hint="참고용 비교">
      <DesignScoreCards scores={scores} />
      <p style={{ ...designStyles.textSmall, ...designStyles.textMuted, margin: '12px 0 0 0' }}>
        이 섹션은 고정분할점수의 40점선을 기준으로 보는 참고 비교입니다.
        실제 미도달 판정은 학교가 최종 확정한 기준을 따를 수 있으니, 여기서는 우선 40점선 점검용으로 보세요.
      </p>
    </DesignSection>
  );
}
