import { DesignSection, DesignAlerts } from '@/components/design';
import { useNeisOutput } from '@/hooks/useNeisOutput';

export function AlertsSection() {
  const output = useNeisOutput();

  const alerts = !output
    ? [{ level: 'info' as const, message: '문항을 추가하면 결과가 표시됩니다.' }]
    : output.warnings.length > 0
      ? output.warnings.map((w) => ({ level: w.level, message: w.message }))
      : [{ level: 'info' as const, message: '현재 입력에서 확인된 문제는 없습니다.' }];

  return (
    <DesignSection title="알림">
      <DesignAlerts alerts={alerts} />
    </DesignSection>
  );
}
