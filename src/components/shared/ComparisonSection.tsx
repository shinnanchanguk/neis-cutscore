import { DesignSection, DesignComparisonTable } from '@/components/design';
import { useExamStore } from '@/store/examStore';
import { useNeisOutput } from '@/hooks/useNeisOutput';

const GRADES = ['A', 'B', 'C', 'D', 'E'];

export function ComparisonSection() {
  const targetDistribution = useExamStore((s) => s.targetDistribution);
  const output = useNeisOutput();

  const target: Record<string, number> = {};
  const expected: Record<string, number> = {};

  for (const g of GRADES) {
    target[g] = targetDistribution[g as keyof typeof targetDistribution] ?? 0;
    expected[g] = output
      ? (output.predictedDistribution[g as keyof typeof output.predictedDistribution] ?? 0)
      : 0;
  }

  return (
    <DesignSection title="등급 분포 비교">
      <DesignComparisonTable
        grades={GRADES}
        target={target}
        expected={expected}
      />
    </DesignSection>
  );
}
