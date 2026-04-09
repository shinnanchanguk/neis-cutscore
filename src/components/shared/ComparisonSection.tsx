import { DesignSection, DesignComparisonTable } from '@/components/design';
import { designStyles } from '@/components/design/styles';
import { useExamStore } from '@/store/examStore';
import { useNeisOutput } from '@/hooks/useNeisOutput';

const GRADES = ['A', 'B', 'C', 'D', 'E'];

export function ComparisonSection() {
  const targetDistribution = useExamStore((s) => s.targetDistribution);
  const sigma = useExamStore((s) => s.settings.sigma);
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
    <DesignSection title="등급 분포 비교" hint="참고용 근사치">
      <p style={{ ...designStyles.textSmall, ...designStyles.textMuted, margin: '0 0 12px 0' }}>
        문항 평균 정답률로 계산한 평균 원점수와 설정한 표준편차 σ={sigma}를 이용한 사후 근사치입니다.
        목표 비율을 직접 맞추는 값이 아니라서 차이가 크게 날 수 있습니다.
      </p>
      <DesignComparisonTable
        grades={GRADES}
        target={target}
        expected={expected}
      />
    </DesignSection>
  );
}
