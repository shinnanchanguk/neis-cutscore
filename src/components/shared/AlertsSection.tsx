import { DesignSection, DesignAlerts } from '@/components/design';
import { useNeisOutput } from '@/hooks/useNeisOutput';
import { useExamStore } from '@/store/examStore';
import { DEFAULT_EXPECTED_UNMET_RATE } from '@/lib/presets';

export function AlertsSection() {
  const output = useNeisOutput();
  const includeE미도달 = useExamStore((s) => s.settings.includeE미도달);
  const expectedUnmetRate = useExamStore((s) => s.settings.expectedUnmetRate ?? DEFAULT_EXPECTED_UNMET_RATE);

  const alerts = !output
    ? [{ level: 'info' as const, message: '문항을 추가하면 결과가 표시됩니다.' }]
    : (() => {
        const items = output.warnings.map((w) => ({ level: w.level, message: w.message }));
        if (includeE미도달 && output.cutScores.E미도달 != null) {
          const estimated = output.cutScores.E미도달;
          const comparison = estimated >= 40 ? '40점 참고선보다 높음' : '40점 참고선보다 낮음';
          items.push({
            level: estimated >= 40 ? 'info' as const : 'warning' as const,
            message: `참고: 추정 E/미도달 ${estimated}점 · 예상 미도달 ${expectedUnmetRate}% 반영 · ${comparison}. 학교별 최종 기준은 다를 수 있으니 참고용으로만 보세요.`,
          });
        }
        if (items.length === 0) {
          items.push({ level: 'info' as const, message: '현재 입력에서 확인된 문제는 없습니다.' });
        }
        return items;
      })();

  return (
    <DesignSection title="알림">
      <DesignAlerts alerts={alerts} />
    </DesignSection>
  );
}
